// Tickertape India Stocks Scraper - NSE/BSE fundamentals, shareholding history, screener
// Actor: https://apify.com/data_daemon/tickertape-stocks-scraper
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "mode": "stocks",
    "stocks": [
        "RELIANCE",
        "TCS",
        "HDFCBANK"
    ]
};

const run = await client.actor('data_daemon/tickertape-stocks-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
