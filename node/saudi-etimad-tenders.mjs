// Saudi Etimad Tenders (government tenders & awards) - Saudi government tenders from the Etimad portal: agency, type, activity, region, Gregorian and Hijri deadlines, document fee, status; detail pages add purpose, contract duration and award results (bidders, winning supplier, amount)
// Actor: https://apify.com/data_daemon/saudi-etimad-tenders  (id exAkYmXl5W8aoBart)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "publishedWithin": "2d",
    "activities": [
        "contracting"
    ],
    "regions": [
        "Riyadh"
    ],
    "includeDetails": false,
    "maxItems": 50
};

const run = await client.actor('data_daemon/saudi-etimad-tenders').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
