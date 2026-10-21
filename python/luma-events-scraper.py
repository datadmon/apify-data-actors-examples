"""Luma Events Scraper - lu.ma events by city, category, keyword or calendar: dates, venue, tickets, hosts
Actor: https://apify.com/data_daemon/luma-events-scraper  (id 51GnTTp3L9zzrKcb7)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'cities': ['London'],
    'categories': ['ai'],
    'daysAhead': 30,
    'includeDetails': True,
    'maxEvents': 50,
}

run = client.actor("data_daemon/luma-events-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
