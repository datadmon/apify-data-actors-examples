// ImportYeti Scraper - US import records from ImportYeti: latest bills of lading per importer or supplier, or a company profile with top suppliers
// Actor: https://apify.com/data_daemon/importyeti-scraper  (id BtLGgUkBwf8NFc4Cl)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "companies": [
        "walmart"
    ],
    "output": "shipments",
    "maxResults": 100
};

const run = await client.actor('data_daemon/importyeti-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
