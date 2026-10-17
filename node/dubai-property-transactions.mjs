// Dubai DLD Property Transactions - Dubai Land Department sales, mortgages and gifts with AED value and price/sqm
// Actor: https://apify.com/data_daemon/dubai-property-transactions  (id fSoMCyHMdU0YHp4kk)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "transactionGroup": "sales",
    "maxItems": 500
};

const run = await client.actor('data_daemon/dubai-property-transactions').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
