"""Get on Board Jobs Scraper - LATAM tech jobs with monthly USD salary, full descriptions, country eligibility and persistent only-new feeds
Actor: https://apify.com/data_daemon/getonbrd-jobs-scraper  (id S9jm2Eykh93efOMpg)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'categories': ['programming'],
    'remoteOnly': True,
    'minSalaryUsd': 1000,
    'maxItems': 20,
}

run = client.actor("data_daemon/getonbrd-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
