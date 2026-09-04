// UK Gazette Insolvency Notices - winding-up petitions, administrations, liquidations
// Actor: https://apify.com/ege_daemon/uk-gazette-insolvency-notices
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "noticeTypes": [
        "2450",
        "2410"
    ],
    "startPublishDate": "2026-09-01",
    "maxItems": 100
};

const run = await client.actor('ege_daemon/uk-gazette-insolvency-notices').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
