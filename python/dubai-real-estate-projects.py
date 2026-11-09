"""Dubai Real Estate Projects (DLD register) - every project registered with the Dubai Land Department: developer, status, declared value, escrow account, % completed, units, area, approval and completion dates; plus the registered-developers list
Actor: https://apify.com/data_daemon/dubai-real-estate-projects  (id hWi68uNKaalGylgiP)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'status': 'active',
    'daysBack': 30,
    'dateType': 'adoptionDate',
    'maxItems': 0,
}

run = client.actor("data_daemon/dubai-real-estate-projects").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
