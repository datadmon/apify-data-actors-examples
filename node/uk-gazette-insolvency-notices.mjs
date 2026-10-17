// UK Gazette Insolvency Notices - winding-up petitions, administrations, liquidations from The Gazette
// Actor: https://apify.com/data_daemon/uk-gazette-insolvency-notices  (id 4We8IBpLtJp6OkQd8)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "noticeTypes": [
        "2450"
    ],
    "includeLinkedData": true,
    "maxItems": 100
};

const run = await client.actor('data_daemon/uk-gazette-insolvency-notices').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
