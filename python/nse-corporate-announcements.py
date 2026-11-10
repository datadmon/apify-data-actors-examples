"""NSE Corporate Announcements & Filings (India) - NSE India corporate filings: announcements with category, summary and PDF link, corporate actions with ex-dates, board meetings, bulk and block deals, credit ratings, shareholding patterns and IPO offer documents
Actor: https://apify.com/data_daemon/nse-corporate-announcements  (id eSClXUsJuOu5RdzmW)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'reports': ['announcements', 'corporateActions'],
    'symbols': ['RELIANCE', 'TCS', 'INFY'],
    'daysBack': 30,
    'daysAhead': 60,
    'maxItems': 100,
}

run = client.actor("data_daemon/nse-corporate-announcements").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
