"""HKEX News: Announcements, Director Dealings & CCASS (Hong Kong) - Hong Kong Exchange data: HKEXnews announcements with category, title and document link; director and substantial-shareholder dealings (disclosure of interests) with shares, average price and holding afterwards; CCASS shareholding by participant
Actor: https://apify.com/data_daemon/hkex-news-filings  (id qtn4fSQcCZUvhUjW3)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'reports': ['announcements', 'directorDealings'],
    'stockCodes': ['00700', '00005', '09988'],
    'daysBack': 30,
    'maxItems': 100,
}

run = client.actor("data_daemon/hkex-news-filings").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
