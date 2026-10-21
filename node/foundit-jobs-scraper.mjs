// Foundit (Monster India) Jobs Scraper - foundit.in jobs by keyword, city, experience and freshness, full descriptions included
// Actor: https://apify.com/data_daemon/foundit-jobs-scraper  (id UdAJvB5H72gNbfQfM)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "queries": [
        "data analyst"
    ],
    "locations": [
        "Bangalore"
    ],
    "postedWithinDays": 7,
    "includeDescription": true,
    "maxJobsPerQuery": 50
};

const run = await client.actor('data_daemon/foundit-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
