"""ChatGPT Product Feed Generator (Business Hub CSV / JSONL) - OpenAI product feed for ChatGPT Business Hub built from a Google Merchant feed, a WooCommerce store or schema.org product pages, with every row checked against the spec
Actor: https://apify.com/data_daemon/chatgpt-product-feed-generator  (id 6cuh8ouL5WfAtpXi1)
Install: pip install apify-client   |   Token: https://console.apify.com/settings/integrations
Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.py
"""
import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    'merchantFeedUrls': ['https://datadmon.github.io/data/samples/google-merchant-sample-feed.xml'],
    'sellerName': 'Juniper Ridge Outfitters',
}

run = client.actor("data_daemon/chatgpt-product-feed-generator").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"{len(items)} records")
print(json.dumps(items[0], indent=2, ensure_ascii=False) if items else "no data")
