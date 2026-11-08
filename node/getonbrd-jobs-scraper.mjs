// Get on Board Jobs Scraper - LATAM tech jobs with monthly USD salary, full descriptions, country eligibility and persistent only-new feeds
// Actor: https://apify.com/data_daemon/getonbrd-jobs-scraper  (id S9jm2Eykh93efOMpg)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "categories": [
        "programming"
    ],
    "remoteOnly": true,
    "minSalaryUsd": 1000,
    "maxItems": 20
};

const run = await client.actor('data_daemon/getonbrd-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
