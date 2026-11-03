"""OnlineJobs.ph Scraper - OnlineJobs.ph Philippine remote and virtual-assistant jobs with wage parsed to min/max/currency/period, hours per week, skills and full description
Actor: https://apify.com/data_daemon/onlinejobs-ph-scraper  (id aB8dgZ90P3f9LQtO4)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'keywords': ['virtual assistant'],
    'maxResults': 50,
}

run = client.actor("data_daemon/onlinejobs-ph-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
