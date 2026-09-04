"""Startup India DPIIT Directory - India's recognised startups with sector, stage, CIN
Actor: https://apify.com/ege_daemon/startup-india-dpiit-scraper
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "states": [
        "Karnataka"
    ],
    "includeProfile": true,
    "maxItems": 100
}

run = client.actor("ege_daemon/startup-india-dpiit-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
