"""India IPO Tracker - live IPO GMP, QIB/NII/retail subscription, calendar, listing data
Actor: https://apify.com/data_daemon/india-ipo-tracker  (id Q8tYzzX5YLgPLbQu4)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "reports": [
        "gmp",
        "subscription"
    ],
    "category": "all"
}

run = client.actor("data_daemon/india-ipo-tracker").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
