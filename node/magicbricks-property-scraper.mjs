// Magicbricks Scraper - Magicbricks India property listings: price, price per sq ft, carpet area, BHK, furnishing, locality, project, coordinates
// Actor: https://apify.com/data_daemon/magicbricks-property-scraper  (id hR1IF1Ih1Z2XgF1Zh)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "cities": [
        "Pune"
    ],
    "transactionType": "rent",
    "minBedrooms": 2,
    "maxResults": 40
};

const run = await client.actor('data_daemon/magicbricks-property-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
