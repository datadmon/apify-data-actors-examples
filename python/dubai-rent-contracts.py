"""Dubai Rent Contracts (Ejari) - Dubai Ejari registered rent contracts from DLD open data: annual rent AED, rent/sqm, area, project, new vs renewed, lease dates
Actor: https://apify.com/data_daemon/dubai-rent-contracts  (id sWQ0zNlAEiVGQhnkG)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'daysBack': 7,
    'areas': ['Marsa Dubai'],
    'usage': 'residential',
    'propertySubTypes': ['Flat'],
    'maxItems': 200,
}

run = client.actor("data_daemon/dubai-rent-contracts").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
