// Startup India DPIIT Directory - India's recognised startups with sector, stage, CIN
// Actor: https://apify.com/data_daemon/startup-india-dpiit-scraper
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "states": [
        "Karnataka"
    ],
    "includeProfile": true,
    "maxItems": 100
};

const run = await client.actor('data_daemon/startup-india-dpiit-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
