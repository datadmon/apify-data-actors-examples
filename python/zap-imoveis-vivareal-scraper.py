"""Zap Imoveis & VivaReal Scraper - Brazil property listings from Zap Imoveis and VivaReal: price, condo fee, IPTU, area, rooms, coordinates, agency
Actor: https://apify.com/data_daemon/zap-imoveis-vivareal-scraper  (id RBeudBKQMko3wcD0p)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'locations': ['São Paulo, SP'],
    'business': 'sale',
    'portals': ['zap'],
    'maxResults': 50,
}

run = client.actor("data_daemon/zap-imoveis-vivareal-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
