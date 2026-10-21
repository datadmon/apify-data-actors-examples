// Scheduled "only new jobs" loop for IIMJobs / Hirist / Foundit. Node 18+, no dependencies. Run it every morning; each run
// prints only the jobs it has not delivered before.
//
//   export APIFY_TOKEN=...
//   node only_new_jobs.mjs                                   # IIMJobs, "product manager", last 1 day
//   node only_new_jobs.mjs hirist "data engineer" "python developer"
//   node only_new_jobs.mjs foundit "sales manager"
//
// De-duplication is chosen from the actor's live input schema on every run, so this works on any build:
//   1. `onlyNewSinceLastRun` present (monitor mode; `onlyNewJobs` on old builds): the actor remembers delivered jobs per
//      search in your own Apify account and skips them before fetching details; skipped jobs are not charged.
//      `stateName` separates searches.
//   2. else `skipJobIds` present: we send the ids already seen and the actor filters them out.
//   3. always: a local .state/<site>-seen.json file filters client-side as a safety net.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.apify.com/v2';
const headers = { Authorization: `Bearer ${process.env.APIFY_TOKEN}`, 'Content-Type': 'application/json' };
const ACTORS = { iimjobs: 'data_daemon~iimjobs-jobs-scraper', hirist: 'data_daemon~hirist-jobs-scraper', foundit: 'data_daemon~foundit-jobs-scraper' }; // fEBnL9mUQr81TGuh4, z2fAtS4KgvaqkK85b, UdAJvB5H72gNbfQfM
const MONITOR_FLAGS = ['onlyNewSinceLastRun', 'onlyNewJobs'];
const STATE_KEY_FIELDS = ['stateName', 'stateKey', 'monitorKey']; // current builds use stateName
const SKIP_LIST_FIELDS = ['skipJobIds', 'excludeJobIds'];

async function inputSchemaProps(actor) {
    const { data } = await (await fetch(`${API}/acts/${actor}/builds/default`, { headers })).json();
    return JSON.parse(data.inputSchema || '{}').properties || {};
}

export async function fetchNewJobs(site, queries, { postedWithinDays = 1, withDescriptions = false, stateDir = '.state' } = {}) {
    const actor = ACTORS[site];
    const statePath = path.join(stateDir, `${site}-seen.json`);
    const seen = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {}; // id -> first seen date

    const input = { queries, postedWithinDays, includeDescription: withDescriptions, maxJobsPerQuery: 200 };
    const props = await inputSchemaProps(actor);
    const flag = MONITOR_FLAGS.find((f) => f in props);
    const skipField = SKIP_LIST_FIELDS.find((f) => f in props);
    if (flag) {
        input[flag] = true;
        const keyField = STATE_KEY_FIELDS.find((f) => f in props);
        if (keyField) input[keyField] = `${site}-${[...queries].sort().map((q) => q.replace(/ /g, '_')).join('-').slice(0, 30)}`;
    } else if (skipField && Object.keys(seen).length) {
        input[skipField] = Object.keys(seen);
    }
    console.error(`dedupe: ${flag ? `actor-side ${flag}` : skipField ? `actor-side ${skipField}` : 'client-side only'}`);

    const res = await fetch(`${API}/acts/${actor}/run-sync-get-dataset-items?clean=1`, { method: 'POST', headers, body: JSON.stringify(input) });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const items = await res.json();

    const today = new Date().toISOString().slice(0, 10);
    const fresh = items.filter((j) => !(String(j.id) in seen));
    for (const j of fresh) seen[String(j.id)] = today;
    const cutoff = new Date(Date.now() - 120 * 86_400_000).toISOString().slice(0, 10); // forget after ~4 months
    const kept = Object.fromEntries(Object.entries(seen).filter(([, d]) => d >= cutoff));
    fs.mkdirSync(stateDir, { recursive: true });
    fs.writeFileSync(statePath, JSON.stringify(kept));
    console.error(`${items.length} returned, ${fresh.length} new (seen set now ${Object.keys(kept).length})`);
    return fresh;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) {
    const args = process.argv.slice(2);
    const site = args[0] in ACTORS ? args[0] : 'iimjobs';
    const queries = args.filter((a) => !(a in ACTORS));
    for (const job of await fetchNewJobs(site, queries.length ? queries : ['product manager'])) {
        console.log(`${job.postedAt.slice(0, 10)}  ${job.title}  |  ${job.company?.name ?? '(confidential)'}  |  ${(job.locations ?? []).join(', ')}  |  ${job.url}`);
    }
}
