// India Jobs Feed - one search across nine Indian job boards (IIMJobs, Hirist, foundit, Instahyre, Shine, Cutshort, Apna, WorkIndia, Unstop) in one schema with salary in LPA and cross-board duplicates folded
// Actor: https://apify.com/data_daemon/india-jobs-feed  (id 4i5PwMsrMLQ4GCFxH)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "keywords": [
        "data analyst"
    ],
    "locations": [
        "Bangalore"
    ],
    "postedWithinDays": 3,
    "maxJobsPerBoard": 20
};

const run = await client.actor('data_daemon/india-jobs-feed').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
