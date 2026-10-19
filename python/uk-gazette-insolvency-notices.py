"""UK Gazette Insolvency Notices - winding-up petitions, administrations, liquidations from The Gazette
Actor: https://apify.com/data_daemon/uk-gazette-insolvency-notices  (id 4We8IBpLtJp6OkQd8)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'noticeTypes': ['2450'],
    'includeLinkedData': True,
    'maxItems': 40,
}

run = client.actor("data_daemon/uk-gazette-insolvency-notices").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
