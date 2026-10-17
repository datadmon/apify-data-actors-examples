---
name: daemon-data-apify-actors
description: "Get structured data from Indian job boards (IIMJobs management/MBA/finance roles, Hirist.tech IT roles), any Oracle Recruiting Cloud / Fusion HCM career site, Indian IPOs (live GMP, subscription, calendar), NSE/BSE stocks via Tickertape (index constituents, screener, fundamentals), Dubai Land Department property transactions and UK Gazette insolvency notices, using the pay-per-record Apify actors published by data_daemon. Use when the user asks to scrape, export, monitor, count or benchmark any of these sources, wants a daily feed of new jobs/IPOs/petitions/transactions, or needs the data as JSON, CSV or Google Sheets. One HTTP call (run-sync-get-dataset-items) returns the records; no login or proxy."
author: Daemon Data
author_url: https://apify.com/data_daemon
license: MIT
metadata:
  version: "1.0"
  category: data-extraction
  keywords: "apify, iimjobs, hirist, india-jobs, oracle-hcm, oracle-recruiting-cloud, ipo-gmp, tickertape, nse, dubai-land-department, dld, uk-gazette, insolvency, winding-up-petitions"
---

# Daemon Data actors on Apify

Disclosure: the author of this skill publishes the actors it routes to (`data_daemon/*` on Apify Store). They are pay-per-event; no referral parameters are used.

Full catalog with input fields, output fields and prices: [`AGENTS.md`](../../AGENTS.md) in this repository (also at https://github.com/datadmon/apify-data-actors-examples/blob/main/AGENTS.md).

## Routing

| Request | Actor ID | Price (list, Oct 2026) |
|---|---|---|
| Indian management / MBA / finance / consulting / sales / HR jobs | `data_daemon/iimjobs-jobs-scraper` | $0.002 per job + $0.002 per description |
| Indian software / data / DevOps / tech jobs | `data_daemon/hirist-jobs-scraper` | same |
| Jobs from an `*.oraclecloud.com/hcmUI/CandidateExperience/...` career site | `data_daemon/oracle-hcm-jobs-scraper` | $0.002 per job + $0.002 per details |
| Indian IPOs: GMP, subscription, dates, SME/mainboard | `data_daemon/india-ipo-tracker` | $0.003 per row, $0.015 per detail page |
| NSE/BSE index lists, stock screener, fundamentals | `data_daemon/tickertape-stocks-scraper` | $0.002 per index/screener row, $0.02 per profile |
| Dubai property sales, mortgages, gifts (DLD) | `data_daemon/dubai-property-transactions` | $0.001 per transaction |
| UK winding-up petitions, administrations, liquidations | `data_daemon/uk-gazette-insolvency-notices` | $0.002 per notice + $0.003 per linked record |

Out of scope: Naukri/LinkedIn/Indeed, Workday/Taleo/Greenhouse sites, non-Indian IPOs, Dubai listings or rentals, Companies House filings.

## Workflow

1. **Pick the actor** from the table. If the user names a company careers page, check the URL for `oraclecloud.com/hcmUI/CandidateExperience`; if it is not Oracle, say so instead of guessing.
2. **Read the live input schema** before building the input (field names, enums and defaults can change):
   `GET https://api.apify.com/v2/acts/data_daemon~<name>/builds/default` → `data.inputSchema` (JSON string), or `apify actors info data_daemon/<name> --input`.
3. **Size the cost**: expected records x price. Cap with `maxJobs` / `maxJobsPerSite` / `maxItems`; switch off `includeDescription` / `includeDetails` / `includeLinkedData` when the user needs counts, titles or a feed rather than full text. State the estimate when it is above about $1.
4. **Run**:
   ```bash
   curl -sS -X POST "https://api.apify.com/v2/acts/data_daemon~<name>/run-sync-get-dataset-items?clean=1" \
     -H "Authorization: Bearer $APIFY_TOKEN" -H "Content-Type: application/json" -d '<input json>'
   ```
   `&format=csv&fields=a,b.c` for CSV; the call waits up to 300 s. For bigger runs: `POST /v2/acts/{id}/runs`, poll `GET /v2/actor-runs/{runId}`, read `GET /v2/datasets/{datasetId}/items`. Via MCP: `https://mcp.apify.com?tools=data_daemon/<name>` with `Authorization: Bearer <token>`.
5. **Validate and deliver**: de-duplicate on `id` (jobs), `transactionNumber` (Dubai), `noticeId` (Gazette); check returned cities/sites match the request; report how many rows a statistic rests on. Salaries on Indian boards are mostly hidden (`salaryHidden: true`); never estimate them.

## Daily feeds

IIMJobs/Hirist: `postedWithinDays: 1`, and when the live schema has them `onlyNewJobs: true` (actor remembers delivered jobs per search in the user's account; skipped jobs are free) or `skipJobIds: [...]`. Ready scripts: `examples/only-new-jobs/` (Python, Node) and `n8n/iimjobs-new-jobs-to-google-sheets-and-slack.json`. For other actors use a date filter (`startPublishDate`, `fromDate`) or `postedWithinDays: 7` on Oracle and de-duplicate on the id field.

## Verified input examples (2026-10-18)

```json
{"queries":["product manager"],"locations":["Bangalore","Mumbai"],"postedWithinDays":7,"includeDescription":true,"maxJobsPerQuery":50}
{"careerSiteUrls":["https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_45001/requisitions"],"keyword":"engineer","postedWithinDays":30,"maxJobsPerSite":100}
{"reports":["gmp","subscription"],"category":"all"}
{"mode":"index","indexSid":"NIFTY 50"}
{"transactionGroup":"sales","maxItems":500}
{"noticeTypes":["2450"],"includeLinkedData":true,"maxItems":100}
```
