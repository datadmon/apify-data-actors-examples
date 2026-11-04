"""Naukri Jobs Scraper - Naukri.com jobs with salary in LPA, experience, skills, applicants, views, AmbitionBox rating and full description; whole-board daily export and only-new mode
Actor: https://apify.com/data_daemon/naukri-jobs-scraper  (id DOYOSKHQvhLynNBd7)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'queries': ['data analyst'],
    'locations': ['Bangalore'],
    'postedWithinDays': 3,
    'maxJobsPerQuery': 50,
}

run = client.actor("data_daemon/naukri-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
