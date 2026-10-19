"""Hirist.tech Jobs Scraper - India IT and tech jobs with full descriptions, skills, salary when disclosed
Actor: https://apify.com/data_daemon/hirist-jobs-scraper  (id z2fAtS4KgvaqkK85b)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'queries': ['python developer'],
    'locations': ['Bangalore'],
    'postedWithinDays': 7,
    'includeDescription': True,
    'maxJobsPerQuery': 50,
}

run = client.actor("data_daemon/hirist-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
