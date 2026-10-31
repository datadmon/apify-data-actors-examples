"""Magicbricks Scraper - Magicbricks India property listings: price, price per sq ft, carpet area, BHK, furnishing, locality, project, coordinates
Actor: https://apify.com/data_daemon/magicbricks-property-scraper  (id hR1IF1Ih1Z2XgF1Zh)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'cities': ['Pune'],
    'transactionType': 'rent',
    'minBedrooms': 2,
    'maxResults': 40,
}

run = client.actor("data_daemon/magicbricks-property-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
