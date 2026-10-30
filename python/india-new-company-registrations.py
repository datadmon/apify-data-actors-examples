"""India New Company Registrations - newly incorporated Indian companies from the MCA register: CIN, type, RoC, state, NIC activity, capital, registered office
Actor: https://apify.com/data_daemon/india-new-company-registrations  (id Z4okzsYXSCsoUfUXg)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'recentDates': 3,
    'companyTypes': ['opc', 'private'],
    'states': ['Karnataka'],
    'includeDetails': True,
    'maxResults': 50,
}

run = client.actor("data_daemon/india-new-company-registrations").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
