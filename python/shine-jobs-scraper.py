"""Shine Jobs Scraper - Shine.com India jobs by keyword and city with full descriptions, salary range, experience, skills and industry
Actor: https://apify.com/data_daemon/shine-jobs-scraper  (id q1hOetk2h2sebleR2)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'searchTerms': ['data analyst'],
    'cities': ['Pune'],
    'postedWithinDays': 7,
    'includeDescription': True,
    'maxJobsPerSearch': 50,
}

run = client.actor("data_daemon/shine-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
