"""India Jobs Feed - one search across nine Indian job boards (IIMJobs, Hirist, foundit, Instahyre, Shine, Cutshort, Apna, WorkIndia, Unstop) in one schema with salary in LPA and cross-board duplicates folded
Actor: https://apify.com/data_daemon/india-jobs-feed  (id 4i5PwMsrMLQ4GCFxH)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'keywords': ['data analyst'],
    'locations': ['Bangalore'],
    'postedWithinDays': 3,
    'maxJobsPerBoard': 20,
}

run = client.actor("data_daemon/india-jobs-feed").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
