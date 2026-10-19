// Oracle HCM / Recruiting Cloud Jobs Scraper - every requisition on any Oracle Recruiting Cloud career site
// Actor: https://apify.com/data_daemon/oracle-hcm-jobs-scraper  (id ADeJJ5VJCcUqYI87X)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "careerSiteUrls": [
        "https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_45001/requisitions"
    ],
    "keyword": "engineer",
    "postedWithinDays": 30,
    "includeDetails": true,
    "maxJobsPerSite": 50
};

const run = await client.actor('data_daemon/oracle-hcm-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
