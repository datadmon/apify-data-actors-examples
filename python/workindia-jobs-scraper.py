"""WorkIndia Jobs Scraper - WorkIndia (workindia.in) India jobs with monthly salary range, city, locality, PIN, category and full description
Actor: https://apify.com/data_daemon/workindia-jobs-scraper  (id xwVW54YeKxvNMEmaW)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'cities': ['Mumbai'],
    'maxResults': 50,
}

run = client.actor("data_daemon/workindia-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
