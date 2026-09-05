// Oracle Cloud HCM Jobs Scraper - every requisition on any Oracle Recruiting career site
// Actor: https://apify.com/data_daemon/oracle-hcm-jobs-scraper
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "careerSiteUrls": [
        "https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/requisitions"
    ],
    "keyword": "engineer",
    "postedWithinDays": 30,
    "maxJobsPerSite": 100
};

const run = await client.actor('data_daemon/oracle-hcm-jobs-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
