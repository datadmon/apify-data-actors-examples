// India IPO Tracker - live IPO GMP, QIB/NII/retail subscription, calendar, listing data
// Actor: https://apify.com/data_daemon/india-ipo-tracker  (id Q8tYzzX5YLgPLbQu4)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "reports": [
        "gmp",
        "subscription"
    ],
    "category": "all"
};

const run = await client.actor('data_daemon/india-ipo-tracker').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
