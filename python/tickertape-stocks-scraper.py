"""Tickertape India Stocks Scraper - NSE/BSE fundamentals, shareholding history, screener
Actor: https://apify.com/ege_daemon/tickertape-stocks-scraper
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "mode": "stocks",
    "stocks": [
        "RELIANCE",
        "TCS",
        "HDFCBANK"
    ]
}

run = client.actor("ege_daemon/tickertape-stocks-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
