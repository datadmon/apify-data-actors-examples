"""Tickertape India Stocks Scraper - NSE/BSE index constituents, ratio screener, full stock profiles
Actor: https://apify.com/data_daemon/tickertape-stocks-scraper  (id LjrpONBpsSkqWrHs5)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'mode': 'index',
    'indexSid': 'NIFTY 50',
}

run = client.actor("data_daemon/tickertape-stocks-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
