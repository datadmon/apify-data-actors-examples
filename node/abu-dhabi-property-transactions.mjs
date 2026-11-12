// Abu Dhabi Property Transactions (ADREC sold prices) - Abu Dhabi property sales from ADREC market data since 2019: AED price, price per sqm, sold area, municipality, district, community, project, property type, bedrooms, off-plan or ready, primary or resale
// Actor: https://apify.com/data_daemon/abu-dhabi-property-transactions  (id kekPVFHgEf84zp1O2)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "daysBack": 90,
    "districts": [
        "Al Reem Island"
    ],
    "propertyTypes": [
        "apartment"
    ],
    "maxItems": 200
};

const run = await client.actor('data_daemon/abu-dhabi-property-transactions').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
