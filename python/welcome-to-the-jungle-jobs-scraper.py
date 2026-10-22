"""Welcome to the Jungle Jobs Scraper - France-focused public WTTJ board jobs with descriptions, company profiles and only-new feeds
Actor: https://apify.com/data_daemon/welcome-to-the-jungle-jobs-scraper  (id rJLnujVhP6ucdnrof)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'queries': ['python'],
    'countryCodes': ['FR'],
    'contractTypes': ['FULL_TIME'],
    'maxJobs': 20,
}

run = client.actor("data_daemon/welcome-to-the-jungle-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
