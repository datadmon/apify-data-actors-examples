"""Saudi Etimad Tenders (government tenders & awards) - Saudi government tenders from the Etimad portal: agency, type, activity, region, Gregorian and Hijri deadlines, document fee, status; detail pages add purpose, contract duration and award results (bidders, winning supplier, amount)
Actor: https://apify.com/data_daemon/saudi-etimad-tenders  (id exAkYmXl5W8aoBart)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'publishedWithin': '2d',
    'activities': ['contracting'],
    'regions': ['Riyadh'],
    'includeDetails': False,
    'maxItems': 50,
}

run = client.actor("data_daemon/saudi-etimad-tenders").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
