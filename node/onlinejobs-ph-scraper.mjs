// OnlineJobs.ph Scraper - OnlineJobs.ph Philippine remote and virtual-assistant jobs with wage parsed to min/max/currency/period, hours per week, skills and full description
// Actor: https://apify.com/data_daemon/onlinejobs-ph-scraper  (id aB8dgZ90P3f9LQtO4)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "keywords": [
        "virtual assistant"
    ],
    "maxResults": 50
};

const run = await client.actor('data_daemon/onlinejobs-ph-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
