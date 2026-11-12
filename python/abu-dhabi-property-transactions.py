"""Abu Dhabi Property Transactions (ADREC sold prices) - Abu Dhabi property sales from ADREC market data since 2019: AED price, price per sqm, sold area, municipality, district, community, project, property type, bedrooms, off-plan or ready, primary or resale
Actor: https://apify.com/data_daemon/abu-dhabi-property-transactions  (id kekPVFHgEf84zp1O2)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'daysBack': 90,
    'districts': ['Al Reem Island'],
    'propertyTypes': ['apartment'],
    'maxItems': 200,
}

run = client.actor("data_daemon/abu-dhabi-property-transactions").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
