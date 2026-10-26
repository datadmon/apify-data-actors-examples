// Unstop Scraper - Unstop jobs, internships, hackathons and competitions with salary or stipend, prizes, deadlines and eligibility
// Actor: https://apify.com/data_daemon/unstop-scraper  (id g822pXuHqVz1LRaxK)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "opportunityTypes": [
        "internships"
    ],
    "workplaceTypes": [
        "wfh"
    ],
    "pay": "paid",
    "maxResultsPerSearch": 50
};

const run = await client.actor('data_daemon/unstop-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
