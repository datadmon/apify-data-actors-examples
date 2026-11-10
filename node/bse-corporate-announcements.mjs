// BSE Corporate Announcements & Filings (India) - BSE India corporate filings: announcements with category, summary and PDF link, corporate actions with ex-dates, board meetings, the results calendar and bulk and block deals
// Actor: https://apify.com/data_daemon/bse-corporate-announcements  (id 86mVYH25XQi6IcJn7)
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

const run = await client.actor('data_daemon/bse-corporate-announcements').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
