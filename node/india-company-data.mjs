// India Company Data API (MCA): CIN Lookup, Directors & Email - Indian companies by CIN or name from the MCA register: status, capital, registered office, company email, directors with DIN; watchlist mode for changes
// Actor: https://apify.com/data_daemon/india-company-data  (id z0EYyFoqRpeqe0qMa)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "cins": [
        "L17110MH1973PLC019786",
        "L85110KA1981PLC013115"
    ],
    "companyNames": [
        "Tata Consultancy Services Limited"
    ]
};

const run = await client.actor('data_daemon/india-company-data').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
