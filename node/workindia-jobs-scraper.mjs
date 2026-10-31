// WorkIndia Jobs Scraper - WorkIndia (workindia.in) India jobs with monthly salary range, city, locality, PIN, category and full description
// Actor: https://apify.com/data_daemon/workindia-jobs-scraper  (id xwVW54YeKxvNMEmaW)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "cities": [
        "Mumbai"
    ],
    "maxResults": 50
};

const run = await client.actor('data_daemon/workindia-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
