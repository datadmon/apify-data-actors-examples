"""UK Gazette Insolvency Notices - winding-up petitions, administrations, liquidations
Actor: https://apify.com/ege_daemon/uk-gazette-insolvency-notices
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "noticeTypes": [
        "2450",
        "2410"
    ],
    "startPublishDate": "2026-09-01",
    "maxItems": 100
}

run = client.actor("ege_daemon/uk-gazette-insolvency-notices").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
