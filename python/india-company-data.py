"""India Company Data API (MCA): CIN Lookup, Directors & Email - Indian companies by CIN or name from the MCA register: status, capital, registered office, company email, directors with DIN; watchlist mode for changes
Actor: https://apify.com/data_daemon/india-company-data  (id z0EYyFoqRpeqe0qMa)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'cins': ['L17110MH1973PLC019786', 'L85110KA1981PLC013115'],
    'companyNames': ['Tata Consultancy Services Limited'],
}

run = client.actor("data_daemon/india-company-data").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
