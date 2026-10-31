// Zap Imoveis & VivaReal Scraper - Brazil property listings from Zap Imoveis and VivaReal: price, condo fee, IPTU, area, rooms, coordinates, agency
// Actor: https://apify.com/data_daemon/zap-imoveis-vivareal-scraper  (id RBeudBKQMko3wcD0p)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "locations": [
        "S\u00e3o Paulo, SP"
    ],
    "business": "sale",
    "portals": [
        "zap"
    ],
    "maxResults": 50
};

const run = await client.actor('data_daemon/zap-imoveis-vivareal-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
