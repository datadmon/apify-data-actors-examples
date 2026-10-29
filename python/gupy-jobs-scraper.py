"""Gupy Jobs Scraper - Brazil jobs from the Gupy portal with full descriptions, city, state, workplace type and contract type
Actor: https://apify.com/data_daemon/gupy-jobs-scraper  (id nUNyemqHBGy9ZfzAt)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'searchTerms': ['analista de dados'],
    'states': ['São Paulo'],
    'postedWithinDays': 7,
    'includeDescription': True,
    'maxResultsPerSearch': 50,
}

run = client.actor("data_daemon/gupy-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
