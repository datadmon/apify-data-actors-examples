// Call a Daemon Data actor with one HTTP request and get the records back. Node 18+ (global fetch), no dependencies.
//
//   export APIFY_TOKEN=...   # https://console.apify.com/settings/integrations
//   node run_sync.mjs data_daemon/iimjobs-jobs-scraper '{"queries":["product manager"],"postedWithinDays":7,"maxJobs":20}'
//
// Actor ids (slash in the name becomes a tilde in the URL; the hex id works too):
//   data_daemon/iimjobs-jobs-scraper fEBnL9mUQr81TGuh4 | data_daemon/hirist-jobs-scraper z2fAtS4KgvaqkK85b
//   data_daemon/oracle-hcm-jobs-scraper ADeJJ5VJCcUqYI87X | data_daemon/india-ipo-tracker Q8tYzzX5YLgPLbQu4
//   data_daemon/tickertape-stocks-scraper LjrpONBpsSkqWrHs5 | data_daemon/dubai-property-transactions fSoMCyHMdU0YHp4kk
//   data_daemon/uk-gazette-insolvency-notices 4We8IBpLtJp6OkQd8 | data_daemon/foundit-jobs-scraper UdAJvB5H72gNbfQfM
//   data_daemon/luma-events-scraper 51GnTTp3L9zzrKcb7 | data_daemon/instahyre-jobs-scraper GMe0nzJEhMj9PV8Mb
const API = 'https://api.apify.com/v2';
const headers = { Authorization: `Bearer ${process.env.APIFY_TOKEN}`, 'Content-Type': 'application/json' };

/** Waits up to 300 s and returns the dataset items. For longer runs use runAsync(). */
export async function runSync(actor, input, { format = 'json', fields } = {}) {
    const params = new URLSearchParams({ clean: '1', format });
    if (fields) params.set('fields', fields.join(','));
    const res = await fetch(`${API}/acts/${actor.replace('/', '~')}/run-sync-get-dataset-items?${params}`, {
        method: 'POST', headers, body: JSON.stringify(input),
    });
    if (res.status === 408) throw new Error('run exceeded the 300 s sync limit; use runAsync() for this input');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return format === 'json' ? res.json() : res.text();
}

/** Start the run, poll until it finishes, download every item. No time limit. */
export async function runAsync(actor, input, pollMs = 10_000) {
    let run = (await (await fetch(`${API}/acts/${actor.replace('/', '~')}/runs`, { method: 'POST', headers, body: JSON.stringify(input) })).json()).data;
    while (run.status === 'READY' || run.status === 'RUNNING') {
        await new Promise((r) => setTimeout(r, pollMs));
        run = (await (await fetch(`${API}/actor-runs/${run.id}`, { headers })).json()).data;
    }
    if (run.status !== 'SUCCEEDED') throw new Error(`run ${run.id} ended with ${run.status}: ${run.statusMessage}`);
    const items = [];
    for (let offset = 0; ; offset += 1000) {
        const page = await (await fetch(`${API}/datasets/${run.defaultDatasetId}/items?clean=1&limit=1000&offset=${offset}`, { headers })).json();
        items.push(...page);
        if (page.length < 1000) return items;
    }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) {
    const [actor, inputJson] = process.argv.slice(2);
    if (!actor || !inputJson) {
        console.error('usage: node run_sync.mjs <actor> <json-input>');
        process.exit(1);
    }
    const items = await runSync(actor, JSON.parse(inputJson));
    console.error(`${items.length} records`);
    console.log(JSON.stringify(items, null, 2));
}
