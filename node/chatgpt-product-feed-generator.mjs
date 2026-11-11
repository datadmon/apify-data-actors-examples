// ChatGPT Product Feed Generator (Business Hub CSV / JSONL) - OpenAI product feed for ChatGPT Business Hub built from a Google Merchant feed, a WooCommerce store or schema.org product pages, with every row checked against the spec
// Actor: https://apify.com/data_daemon/chatgpt-product-feed-generator  (id 6cuh8ouL5WfAtpXi1)
// Install: npm i apify-client   |   Token: https://console.apify.com/settings/integrations
// Plain REST alternative (no SDK): see ../examples/run-sync/run_sync.mjs
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const input = {
    "merchantFeedUrls": [
        "https://datadmon.github.io/data/samples/google-merchant-sample-feed.xml"
    ],
    "sellerName": "Juniper Ridge Outfitters"
};

const run = await client.actor('data_daemon/chatgpt-product-feed-generator').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`${items.length} records`);
console.log(JSON.stringify(items[0], null, 2));
