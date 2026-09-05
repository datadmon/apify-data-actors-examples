"""Oracle Cloud HCM Jobs Scraper - every requisition on any Oracle Recruiting career site
Actor: https://apify.com/data_daemon/oracle-hcm-jobs-scraper
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "careerSiteUrls": [
        "https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/requisitions"
    ],
    "keyword": "engineer",
    "postedWithinDays": 30,
    "maxJobsPerSite": 100
}

run = client.actor("data_daemon/oracle-hcm-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
