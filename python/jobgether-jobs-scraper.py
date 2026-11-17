"""Jobgether Scraper (remote jobs) - Jobgether remote jobs: company, the countries or regions a job is open to, employment type, seniority, salary when shown, skills, posting time and the employer's apply link; full description on request; only-new feed
Actor: https://apify.com/data_daemon/jobgether-jobs-scraper  (id oQDt3G0SuaslWyJec)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'keywords': ['data engineer'],
    'postedWithinDays': 7,
    'maxResults': 100,
}

run = client.actor("data_daemon/jobgether-jobs-scraper").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
