// Dubai Real Estate Projects (DLD register) - every project registered with the Dubai Land Department: developer, status, declared value, escrow account, % completed, units, area, approval and completion dates; plus the registered-developers list
// Actor: https://apify.com/data_daemon/dubai-real-estate-projects  (id hWi68uNKaalGylgiP)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "status": "active",
    "daysBack": 30,
    "dateType": "adoptionDate",
    "maxItems": 0
};

const run = await client.actor('data_daemon/dubai-real-estate-projects').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
