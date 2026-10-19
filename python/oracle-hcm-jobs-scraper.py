"""Oracle HCM / Recruiting Cloud Jobs Scraper - every requisition on any Oracle Recruiting Cloud career site
Actor: https://apify.com/data_daemon/oracle-hcm-jobs-scraper  (id ADeJJ5VJCcUqYI87X)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'careerSiteUrls': [   'https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_45001/requisitions'],
    'keyword': 'engineer',
    'postedWithinDays': 30,
    'includeDetails': True,
    'maxJobsPerSite': 50,
}

run = client.actor("data_daemon/oracle-hcm-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
