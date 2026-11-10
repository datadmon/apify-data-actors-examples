// NSE Corporate Announcements & Filings (India) - NSE India corporate filings: announcements with category, summary and PDF link, corporate actions with ex-dates, board meetings, bulk and block deals, credit ratings, shareholding patterns and IPO offer documents
// Actor: https://apify.com/data_daemon/nse-corporate-announcements  (id eSClXUsJuOu5RdzmW)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "reports": [
        "announcements",
        "corporateActions"
    ],
    "symbols": [
        "RELIANCE",
        "TCS",
        "INFY"
    ],
    "daysBack": 30,
    "daysAhead": 60,
    "maxItems": 100
};

const run = await client.actor('data_daemon/nse-corporate-announcements').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
