# Daemon Data - Apify actor examples

Ready-to-run Python, Node.js and n8n examples for the [Daemon Data](https://apify.com/ege_daemon) pay-per-result data actors on Apify. Every actor reads a site's own JSON endpoints, so runs are fast, cheap and need no proxy or login.

| Actor | Data | Examples |
|---|---|---|
| [India IPO Tracker](https://apify.com/ege_daemon/india-ipo-tracker) | IPO GMP, live subscription, listing performance, calendar | [python](python/india-ipo-tracker.py) · [node](node/india-ipo-tracker.mjs) · [n8n](n8n/india-ipo-tracker.json) |
| [Hirist Jobs Scraper](https://apify.com/ege_daemon/hirist-jobs-scraper) | India IT jobs with full descriptions, salary, recruiter activity | [python](python/hirist-jobs-scraper.py) · [node](node/hirist-jobs-scraper.mjs) · [n8n](n8n/hirist-jobs-scraper.json) |
| [IIMJobs Scraper](https://apify.com/ege_daemon/iimjobs-jobs-scraper) | India management, finance and MBA jobs | [python](python/iimjobs-jobs-scraper.py) · [node](node/iimjobs-jobs-scraper.mjs) · [n8n](n8n/iimjobs-jobs-scraper.json) |
| [Tickertape India Stocks Scraper](https://apify.com/ege_daemon/tickertape-stocks-scraper) | NSE/BSE fundamentals, shareholding history, screener | [python](python/tickertape-stocks-scraper.py) · [node](node/tickertape-stocks-scraper.mjs) · [n8n](n8n/tickertape-stocks-scraper.json) |
| [Oracle Cloud HCM Jobs Scraper](https://apify.com/ege_daemon/oracle-hcm-jobs-scraper) | every requisition on any Oracle Recruiting career site | [python](python/oracle-hcm-jobs-scraper.py) · [node](node/oracle-hcm-jobs-scraper.mjs) · [n8n](n8n/oracle-hcm-jobs-scraper.json) |
| [Dubai Property Transactions](https://apify.com/ege_daemon/dubai-property-transactions) | Dubai Land Department sales, mortgages and gifts | [python](python/dubai-property-transactions.py) · [node](node/dubai-property-transactions.mjs) · [n8n](n8n/dubai-property-transactions.json) |
| [UK Gazette Insolvency Notices](https://apify.com/ege_daemon/uk-gazette-insolvency-notices) | winding-up petitions, administrations, liquidations | [python](python/uk-gazette-insolvency-notices.py) · [node](node/uk-gazette-insolvency-notices.mjs) · [n8n](n8n/uk-gazette-insolvency-notices.json) |
| [Startup India DPIIT Directory](https://apify.com/ege_daemon/startup-india-dpiit-scraper) | India's recognised startups with sector, stage, CIN | [python](python/startup-india-dpiit-scraper.py) · [node](node/startup-india-dpiit-scraper.mjs) · [n8n](n8n/startup-india-dpiit-scraper.json) |

## Quick start

```bash
pip install apify-client        # or: npm i apify-client
export APIFY_TOKEN=...          # https://console.apify.com/settings/integrations
python python/tickertape-stocks-scraper.py
```

Every actor also works as an MCP tool for AI agents via https://mcp.apify.com and has a plain REST endpoint:

```bash
curl -X POST "https://api.apify.com/v2/acts/ege_daemon~india-ipo-tracker/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" -d '{"reports":["gmp"]}'
```

## n8n

Import any file from `n8n/` into n8n (Workflows > Import from file), add your Apify credential, and it runs the actor on a schedule and returns the dataset items for the next node (Google Sheets, Slack, a database, ...).

## Pricing

Pay per record, typically $0.001-$0.02 depending on the actor; no compute charges. Apify's free plan includes $5/month of usage, enough to try every example here.

## Issues

Bug or missing field? Open an issue on the actor's Issues tab on Apify, or here.
