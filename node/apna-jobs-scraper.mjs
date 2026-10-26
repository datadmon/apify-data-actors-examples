// Apna Jobs Scraper - Apna (apna.co) India jobs with salary, locality, department, work mode and full descriptions; full-board export
// Actor: https://apify.com/data_daemon/apna-jobs-scraper  (id B2p841zTWw3MlLWxy)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "cities": [
        "Pune"
    ],
    "departments": [
        "Delivery / Driver / Logistics"
    ],
    "postedWithin": "7d",
    "maxJobsPerSearch": 50
};

const run = await client.actor('data_daemon/apna-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
