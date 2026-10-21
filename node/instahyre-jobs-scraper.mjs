// Instahyre Jobs Scraper - India tech jobs from product companies and startups by skill, city, experience and company size, full descriptions included
// Actor: https://apify.com/data_daemon/instahyre-jobs-scraper  (id GMe0nzJEhMj9PV8Mb)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "queries": [
        "python"
    ],
    "locations": [
        "Bangalore"
    ],
    "companySizes": [
        "small",
        "medium"
    ],
    "includeDescription": true,
    "maxJobsPerQuery": 50
};

const run = await client.actor('data_daemon/instahyre-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
