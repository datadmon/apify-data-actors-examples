// Shine Jobs Scraper - Shine.com India jobs by keyword and city with full descriptions, salary range, experience, skills and industry
// Actor: https://apify.com/data_daemon/shine-jobs-scraper  (id q1hOetk2h2sebleR2)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "searchTerms": [
        "data analyst"
    ],
    "cities": [
        "Pune"
    ],
    "postedWithinDays": 7,
    "includeDescription": true,
    "maxJobsPerSearch": 50
};

const run = await client.actor('data_daemon/shine-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
