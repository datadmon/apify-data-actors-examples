// Luma Events Scraper - lu.ma events by city, category, keyword or calendar: dates, venue, tickets, hosts
// Actor: https://apify.com/data_daemon/luma-events-scraper  (id 51GnTTp3L9zzrKcb7)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "cities": [
        "London"
    ],
    "categories": [
        "ai"
    ],
    "daysAhead": 30,
    "includeDetails": true,
    "maxEvents": 50
};

const run = await client.actor('data_daemon/luma-events-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
