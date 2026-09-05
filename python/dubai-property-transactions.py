"""Dubai Property Transactions - Dubai Land Department sales, mortgages and gifts
Actor: https://apify.com/data_daemon/dubai-property-transactions
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "fromDate": "2026-09-01",
    "toDate": "2026-09-07",
    "transactionGroup": "sales",
    "maxItems": 500
}

run = client.actor("data_daemon/dubai-property-transactions").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
