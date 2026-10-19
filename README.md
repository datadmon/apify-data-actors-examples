# Daemon Data - Apify actor examples

Ready-to-run **Python, Node.js, curl and n8n** examples for the [Daemon Data](https://apify.com/data_daemon) pay-per-result data actors on Apify, plus an [`AGENTS.md`](AGENTS.md) and a [Claude/agent skill](skills/daemon-data-apify-actors/SKILL.md) that describe every actor (id, when to use it, input, output fields) for AI agents and coding assistants.

Every actor reads a site's own JSON endpoints, so runs take seconds, need no proxy or login, and you pay per record returned (compute is included).

## Actors

<!-- actors:start -->
| Actor | Data | Actor ID | Examples |
|---|---|---|---|
| [IIMJobs Jobs Scraper](https://apify.com/data_daemon/iimjobs-jobs-scraper) | India MBA, finance, consulting and management jobs with full descriptions | `fEBnL9mUQr81TGuh4` | [python](python/iimjobs-jobs-scraper.py) · [node](node/iimjobs-jobs-scraper.mjs) · [n8n](n8n/iimjobs-jobs-scraper.json) |
| [Hirist.tech Jobs Scraper](https://apify.com/data_daemon/hirist-jobs-scraper) | India IT and tech jobs with full descriptions, skills, salary when disclosed | `z2fAtS4KgvaqkK85b` | [python](python/hirist-jobs-scraper.py) · [node](node/hirist-jobs-scraper.mjs) · [n8n](n8n/hirist-jobs-scraper.json) |
| [Oracle HCM / Recruiting Cloud Jobs Scraper](https://apify.com/data_daemon/oracle-hcm-jobs-scraper) | every requisition on any Oracle Recruiting Cloud career site | `ADeJJ5VJCcUqYI87X` | [python](python/oracle-hcm-jobs-scraper.py) · [node](node/oracle-hcm-jobs-scraper.mjs) · [n8n](n8n/oracle-hcm-jobs-scraper.json) |
| [India IPO Tracker](https://apify.com/data_daemon/india-ipo-tracker) | live IPO GMP, QIB/NII/retail subscription, calendar, listing data | `Q8tYzzX5YLgPLbQu4` | [python](python/india-ipo-tracker.py) · [node](node/india-ipo-tracker.mjs) · [n8n](n8n/india-ipo-tracker.json) |
| [Tickertape India Stocks Scraper](https://apify.com/data_daemon/tickertape-stocks-scraper) | NSE/BSE index constituents, ratio screener, full stock profiles | `LjrpONBpsSkqWrHs5` | [python](python/tickertape-stocks-scraper.py) · [node](node/tickertape-stocks-scraper.mjs) · [n8n](n8n/tickertape-stocks-scraper.json) |
| [Dubai DLD Property Transactions](https://apify.com/data_daemon/dubai-property-transactions) | Dubai Land Department sales, mortgages and gifts with AED value and price/sqm | `fSoMCyHMdU0YHp4kk` | [python](python/dubai-property-transactions.py) · [node](node/dubai-property-transactions.mjs) · [n8n](n8n/dubai-property-transactions.json) |
| [UK Gazette Insolvency Notices](https://apify.com/data_daemon/uk-gazette-insolvency-notices) | winding-up petitions, administrations, liquidations from The Gazette | `4We8IBpLtJp6OkQd8` | [python](python/uk-gazette-insolvency-notices.py) · [node](node/uk-gazette-insolvency-notices.mjs) · [n8n](n8n/uk-gazette-insolvency-notices.json) |
<!-- actors:end -->

The hex id and `data_daemon/<name>` are interchangeable everywhere in the Apify API (write the name as `data_daemon~<name>` inside URLs).

## Quick start (SDK)

```bash
pip install apify-client        # or: npm i apify-client
export APIFY_TOKEN=...          # https://console.apify.com/settings/integrations
python python/india-ipo-tracker.py
node node/iimjobs-jobs-scraper.mjs
```

## REST: one call in, data out

`run-sync-get-dataset-items` starts the actor, waits (up to 300 s) and returns the dataset items in the response. No SDK needed.

```bash
curl -sS -X POST "https://api.apify.com/v2/acts/data_daemon~iimjobs-jobs-scraper/run-sync-get-dataset-items?clean=1" \
  -H "Authorization: Bearer $APIFY_TOKEN" -H "Content-Type: application/json" \
  -d '{"queries":["product manager"],"locations":["Bangalore","Mumbai"],"postedWithinDays":7,"maxJobsPerQuery":50}'
```

- Add `&format=csv&fields=title,company.name,locations,applicants,postedAt,url` for a CSV with chosen columns (also `xlsx`, `xml`, `rss`).
- For runs that can exceed 300 s (full-board exports, thousands of Oracle requisitions) start the run with `POST /v2/acts/{id}/runs`, poll `GET /v2/actor-runs/{runId}`, then read `GET /v2/datasets/{datasetId}/items`.
- Working versions of both patterns, for every actor: [`examples/run-sync/curl.sh`](examples/run-sync/curl.sh), [`run_sync.py`](examples/run-sync/run_sync.py) (stdlib only), [`run_sync.mjs`](examples/run-sync/run_sync.mjs) (Node 18+, no dependencies).

## Schedule it: only new jobs, every morning

[`examples/only-new-jobs/`](examples/only-new-jobs/) is a daily loop for IIMJobs and Hirist that returns each job once. It reads the actor's live input schema and uses `onlyNewSinceLastRun` (actor-side memory in your own Apify account, skipped jobs are not charged) or `skipJobIds` when the build offers them, and always keeps a local seen-ids file as a safety net. Python and Node versions, cron and GitHub Actions snippets included.

No-code alternative: in Apify Console, fill the input, *Save as task*, *Schedules → Create schedule* (daily), then in the task's *Integrations* tab add Google Sheets, Slack, a webhook, Make or Zapier.

## n8n

- [`n8n/iimjobs-new-jobs-to-google-sheets-and-slack.json`](n8n/iimjobs-new-jobs-to-google-sheets-and-slack.json): Schedule (08:00 daily) → HTTP Request to `run-sync-get-dataset-items` → Google Sheets *append or update* (matched on job `id`, so re-runs never duplicate rows) → one Slack message with the count. Uses only built-in n8n nodes.
- `n8n/<actor>.json`: the same schedule → HTTP Request → Google Sheets *append* pattern for every actor.

Import with *Workflows → Import from file*, then create two credentials: **Header Auth** (name `Authorization`, value `Bearer <your Apify token>`) for the HTTP Request node, and your Google Sheets (and Slack) account. Replace the sheet URL in the Google Sheets node.

## AI agents and MCP

- [`AGENTS.md`](AGENTS.md): every actor's id, when to use it (and when not to), a verified input example, output fields and list price, plus the REST/MCP/CLI call patterns and cost-sizing rules. Drop it into your agent's context or repository.
- [`skills/daemon-data-apify-actors/SKILL.md`](skills/daemon-data-apify-actors/SKILL.md): the same catalog as a skill with frontmatter, for Claude Code, Codex and other skill-aware assistants.
- MCP: add `https://mcp.apify.com?tools=data_daemon/iimjobs-jobs-scraper,data_daemon/india-ipo-tracker` (any list of our actor names) to your MCP client, with header `Authorization: Bearer <APIFY_TOKEN>` or OAuth. Docs: https://docs.apify.com/platform/integrations/mcp

## Pricing (list prices, October 2026)

Pay per event; platform compute is included. The actor page shows the price for your Apify plan.

| Actor | Events |
|---|---|
| IIMJobs, Hirist | `job` $0.002 + `job-description` $0.002 when `includeDescription` is on (default) → $2 per 1,000 jobs, $4 with full descriptions |
| Oracle HCM | `job` $0.002 + `job-details` $0.002 when `includeDetails` is on (default) |
| India IPO Tracker | `report-row` $0.003; `ipo-detail` $0.015 when `includeIpoDetails` is on |
| Tickertape | `quote-row` $0.002 (index constituent or screener row); `stock-profile` $0.02 (full profile) |
| Dubai DLD | `transaction` $0.001 |
| UK Gazette | `notice` $0.002 + `notice-details` $0.003 when `includeLinkedData` is on (default) |

Apify's free plan includes $5 of usage a month, enough to try every example here. Cap test runs with `maxJobs` / `maxItems`.

## Support

Bug or missing field? Open an issue on the actor's *Issues* tab on Apify (fastest) or here. A quick review on the actor page helps other users find it.

MIT licensed. Not affiliated with IIMJobs, Hirist, Oracle, Tickertape, Chittorgarh, InvestorGain, the Dubai Land Department or The Gazette.
