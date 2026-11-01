// Cutshort Jobs Scraper - Cutshort (cutshort.io) India startup and tech jobs with salary range, experience, skills, remote policy, company profile and full description
// Actor: https://apify.com/data_daemon/cutshort-jobs-scraper  (id 3UpZjg2ohiuXiVqsk)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "categories": [
        "Python"
    ],
    "locations": [
        "Bengaluru"
    ],
    "maxResults": 50
};

const run = await client.actor('data_daemon/cutshort-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
