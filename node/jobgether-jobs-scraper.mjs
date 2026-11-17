// Jobgether Scraper (remote jobs) - Jobgether remote jobs: company, the countries or regions a job is open to, employment type, seniority, salary when shown, skills, posting time and the employer's apply link; full description on request; only-new feed
// Actor: https://apify.com/data_daemon/jobgether-jobs-scraper  (id oQDt3G0SuaslWyJec)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "keywords": [
        "data engineer"
    ],
    "postedWithinDays": 7,
    "maxResults": 100
};

const run = await client.actor('data_daemon/jobgether-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
