// Dubai Property Transactions - Dubai Land Department sales, mortgages and gifts
// Actor: https://apify.com/ege_daemon/dubai-property-transactions
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "fromDate": "2026-09-01",
    "toDate": "2026-09-07",
    "transactionGroup": "sales",
    "maxItems": 500
};

const run = await client.actor('ege_daemon/dubai-property-transactions').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
