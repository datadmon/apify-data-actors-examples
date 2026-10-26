"""Apna Jobs Scraper - Apna (apna.co) India jobs with salary, locality, department, work mode and full descriptions; full-board export
Actor: https://apify.com/data_daemon/apna-jobs-scraper  (id B2p841zTWw3MlLWxy)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'cities': ['Pune'],
    'departments': ['Delivery / Driver / Logistics'],
    'postedWithin': '7d',
    'maxJobsPerSearch': 50,
}

run = client.actor("data_daemon/apna-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
