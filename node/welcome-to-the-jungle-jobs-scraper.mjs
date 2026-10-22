// Welcome to the Jungle Jobs Scraper - France-focused public WTTJ board jobs with descriptions, company profiles and only-new feeds
// Actor: https://apify.com/data_daemon/welcome-to-the-jungle-jobs-scraper  (id rJLnujVhP6ucdnrof)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "queries": [
        "python"
    ],
    "countryCodes": [
        "FR"
    ],
    "contractTypes": [
        "FULL_TIME"
    ],
    "maxJobs": 20
};

const run = await client.actor('data_daemon/welcome-to-the-jungle-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
