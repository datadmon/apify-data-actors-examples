// Hirist Jobs Scraper - India IT jobs with full descriptions, salary, recruiter activity
// Actor: https://apify.com/data_daemon/hirist-jobs-scraper
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "queries": [
        "python developer"
    ],
    "locations": [
        "Bangalore"
    ],
    "postedWithinDays": 7,
    "maxJobsPerQuery": 50
};

const run = await client.actor('data_daemon/hirist-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
