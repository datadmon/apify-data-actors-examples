// Naukri Jobs Scraper - Naukri.com jobs with salary in LPA, experience, skills, applicants, views, AmbitionBox rating and full description; whole-board daily export and only-new mode
// Actor: https://apify.com/data_daemon/naukri-jobs-scraper  (id DOYOSKHQvhLynNBd7)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "queries": [
        "data analyst"
    ],
    "locations": [
        "Bangalore"
    ],
    "postedWithinDays": 3,
    "maxJobsPerQuery": 50
};

const run = await client.actor('data_daemon/naukri-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
