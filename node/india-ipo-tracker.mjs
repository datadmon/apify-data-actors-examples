// India IPO Tracker - IPO GMP, live subscription, listing performance, calendar
// Actor: https://apify.com/ege_daemon/india-ipo-tracker
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "reports": [
        "gmp",
        "subscription"
    ],
    "category": "all"
};

const run = await client.actor('ege_daemon/india-ipo-tracker').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
