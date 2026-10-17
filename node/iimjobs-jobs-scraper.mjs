// IIMJobs Jobs Scraper - India MBA, finance, consulting and management jobs with full descriptions
// Actor: https://apify.com/data_daemon/iimjobs-jobs-scraper  (id fEBnL9mUQr81TGuh4)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "queries": [
        "product manager"
    ],
    "locations": [
        "Bangalore",
        "Mumbai"
    ],
    "postedWithinDays": 7,
    "includeDescription": true,
    "maxJobsPerQuery": 50
};

const run = await client.actor('data_daemon/iimjobs-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
