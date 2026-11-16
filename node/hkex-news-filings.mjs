// HKEX News: Announcements, Director Dealings & CCASS (Hong Kong) - Hong Kong Exchange data: HKEXnews announcements with category, title and document link; director and substantial-shareholder dealings (disclosure of interests) with shares, average price and holding afterwards; CCASS shareholding by participant
// Actor: https://apify.com/data_daemon/hkex-news-filings  (id qtn4fSQcCZUvhUjW3)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "reports": [
        "announcements",
        "directorDealings"
    ],
    "stockCodes": [
        "00700",
        "00005",
        "09988"
    ],
    "daysBack": 30,
    "maxItems": 100
};

const run = await client.actor('data_daemon/hkex-news-filings').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
