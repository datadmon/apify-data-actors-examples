// Gupy Jobs Scraper - Brazil jobs from the Gupy portal with full descriptions, city, state, workplace type and contract type
// Actor: https://apify.com/data_daemon/gupy-jobs-scraper  (id nUNyemqHBGy9ZfzAt)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "searchTerms": [
        "analista de dados"
    ],
    "states": [
        "S\u00e3o Paulo"
    ],
    "postedWithinDays": 7,
    "includeDescription": true,
    "maxResultsPerSearch": 50
};

const run = await client.actor('data_daemon/gupy-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
