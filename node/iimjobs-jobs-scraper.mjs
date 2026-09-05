// IIMJobs Scraper - India management, finance and MBA jobs
// Actor: https://apify.com/data_daemon/iimjobs-jobs-scraper
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "queries": [
        "product manager"
    ],
    "postedWithinDays": 15,
    "maxJobsPerQuery": 50
};

const run = await client.actor('data_daemon/iimjobs-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
