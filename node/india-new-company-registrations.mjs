// India New Company Registrations - newly incorporated Indian companies from the MCA register: CIN, type, RoC, state, NIC activity, capital, registered office
// Actor: https://apify.com/data_daemon/india-new-company-registrations  (id Z4okzsYXSCsoUfUXg)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "recentDates": 3,
    "companyTypes": [
        "opc",
        "private"
    ],
    "states": [
        "Karnataka"
    ],
    "includeDetails": true,
    "maxResults": 50
};

const run = await client.actor('data_daemon/india-new-company-registrations').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
