"""Dubai DLD Property Transactions - Dubai Land Department sales, mortgages and gifts with AED value and price/sqm
Actor: https://apify.com/data_daemon/dubai-property-transactions  (id fSoMCyHMdU0YHp4kk)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'transactionGroup': 'sales',
    'maxItems': 500,
}

run = client.actor("data_daemon/dubai-property-transactions").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
