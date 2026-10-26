"""Unstop Scraper - Unstop jobs, internships, hackathons and competitions with salary or stipend, prizes, deadlines and eligibility
Actor: https://apify.com/data_daemon/unstop-scraper  (id g822pXuHqVz1LRaxK)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'opportunityTypes': ['internships'],
    'workplaceTypes': ['wfh'],
    'pay': 'paid',
    'maxResultsPerSearch': 50,
}

run = client.actor("data_daemon/unstop-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
