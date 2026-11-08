// Dubai Rent Contracts (Ejari) - Dubai Ejari registered rent contracts from DLD open data: annual rent AED, rent/sqm, area, project, new vs renewed, lease dates
// Actor: https://apify.com/data_daemon/dubai-rent-contracts  (id sWQ0zNlAEiVGQhnkG)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "daysBack": 7,
    "areas": [
        "Marsa Dubai"
    ],
    "usage": "residential",
    "propertySubTypes": [
        "Flat"
    ],
    "maxItems": 200
};

const run = await client.actor('data_daemon/dubai-rent-contracts').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
