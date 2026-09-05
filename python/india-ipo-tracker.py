"""India IPO Tracker - IPO GMP, live subscription, listing performance, calendar
Actor: https://apify.com/data_daemon/india-ipo-tracker
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
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
