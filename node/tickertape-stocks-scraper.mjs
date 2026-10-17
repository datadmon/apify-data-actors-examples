// Tickertape India Stocks Scraper - NSE/BSE index constituents, ratio screener, full stock profiles
// Actor: https://apify.com/data_daemon/tickertape-stocks-scraper  (id LjrpONBpsSkqWrHs5)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "mode": "index",
    "indexSid": "NIFTY 50"
};

const run = await client.actor('data_daemon/tickertape-stocks-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
