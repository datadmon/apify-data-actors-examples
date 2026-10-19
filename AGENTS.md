# AGENTS.md - Daemon Data actors on Apify

Machine-readable notes for AI agents, coding assistants and MCP clients that need structured data from Indian job boards, Oracle Recruiting Cloud career sites, Indian IPO/stock sources, the Dubai Land Department or The Gazette (UK insolvency). All actors are published by `data_daemon` on Apify Store (https://apify.com/data_daemon), run on Apify's platform, read each site's own JSON endpoints (no login, no proxy), and charge per record returned. Prices below are list prices on 2026-10-18; the actor page shows the price for the user's plan. Input examples marked "verified" returned data on 2026-10-18.

## 1. Which actor

| The user wants | Use | Not for |
|---|---|---|
| Indian management, MBA, finance, consulting, CA/CFA, sales, HR, senior roles; salary bands (when disclosed); applicant counts; who is hiring in India | `data_daemon/iimjobs-jobs-scraper` | Tech roles (use Hirist); Naukri/LinkedIn/Indeed (not covered) |
| Indian software, data, DevOps, product-tech roles; skills demand; tech salary bands | `data_daemon/hirist-jobs-scraper` | Non-tech roles (use IIMJobs) |
| Every open job of one employer whose careers page is on Oracle Recruiting Cloud / Fusion HCM (`*.oraclecloud.com/hcmUI/CandidateExperience/...`): JPMorgan Chase, Marriott, Oracle, Kotak, DTCC and thousands more | `data_daemon/oracle-hcm-jobs-scraper` | Workday, Taleo, Greenhouse, Lever, SuccessFactors sites |
| Indian IPOs: live grey market premium (GMP), QIB/NII/retail subscription, open/close/listing dates, mainboard vs SME, full IPO detail pages | `data_daemon/india-ipo-tracker` | Non-Indian IPOs; secondary-market prices (use Tickertape) |
| NSE/BSE listed companies: index constituents (NIFTY 50/100/500, NIFTY BANK, SENSEX), ratio screener, full fundamentals profile per stock | `data_daemon/tickertape-stocks-scraper` | Intraday tick data; derivatives; mutual fund NAVs |
| Dubai real-estate transactions from the official DLD register: sales (incl. off-plan), mortgages, gifts, with AED value, size and price per sqm | `data_daemon/dubai-property-transactions` | Listings/asking prices; rental contracts; other emirates |
| UK corporate insolvency notices from The Gazette: winding-up petitions (incl. HMRC), orders, administrations, liquidations, creditor meetings, with company number, addresses and insolvency practitioner | `data_daemon/uk-gazette-insolvency-notices` | Companies House filings; Scottish/Irish court records outside The Gazette |

## 2. How to call any of them

Authentication: header `Authorization: Bearer <APIFY_TOKEN>` (token at https://console.apify.com/settings/integrations). In URLs write the actor as `data_daemon~<name>` or use the hex id.

```bash
# synchronous: start, wait (max 300 s), get the records back as JSON (or &format=csv / xlsx; &fields=a,b.c to pick columns)
curl -sS -X POST "https://api.apify.com/v2/acts/data_daemon~iimjobs-jobs-scraper/run-sync-get-dataset-items?clean=1" \
  -H "Authorization: Bearer $APIFY_TOKEN" -H "Content-Type: application/json" \
  -d '{"queries":["product manager"],"postedWithinDays":7,"maxJobsPerQuery":50}'

# asynchronous (for runs that may exceed 300 s): start, poll, read
curl -sS -X POST "https://api.apify.com/v2/acts/data_daemon~oracle-hcm-jobs-scraper/runs" -H "Authorization: Bearer $APIFY_TOKEN" -H "Content-Type: application/json" -d '{...}'   # -> data.id
curl -sS "https://api.apify.com/v2/actor-runs/{runId}" -H "Authorization: Bearer $APIFY_TOKEN"                                 # -> data.status, data.defaultDatasetId
curl -sS "https://api.apify.com/v2/datasets/{datasetId}/items?clean=1&limit=1000&offset=0" -H "Authorization: Bearer $APIFY_TOKEN"

# live input schema of the deployed build (field names, enums, defaults) - read this before building an input
curl -sS "https://api.apify.com/v2/acts/data_daemon~iimjobs-jobs-scraper/builds/default" -H "Authorization: Bearer $APIFY_TOKEN"   # -> data.inputSchema (JSON string)
```

Other routes: Apify MCP server `https://mcp.apify.com?tools=data_daemon/iimjobs-jobs-scraper,data_daemon/india-ipo-tracker` (comma-separate any of the names above; Bearer header or OAuth; tools `search-actors`, `fetch-actor-details`, `call-actor` are also available), Apify CLI `apify call data_daemon/<name> -i '<json>'`, SDKs `apify-client` (Python, Node). Ready scripts: [`examples/run-sync/`](examples/run-sync/), [`examples/only-new-jobs/`](examples/only-new-jobs/).

Rules of thumb:
- **Size the cost first**: records x price per event. Cap with `maxJobs`, `maxJobsPerSite`, `maxItems`. Tell the user the estimate when it is above about $1.
- **Turn off detail fetching when the user only needs counts or titles** (`includeDescription`, `includeDetails`, `includeLinkedData`, `includeIpoDetails` are on by default on the actors that have them and double the per-record price).
- **Daily feeds**: for IIMJobs/Hirist set `postedWithinDays: 1` and, if the live schema has it, `onlyNewSinceLastRun: true` (actor-side memory per search, skipped jobs not charged) or `skipJobIds: [...]`. Always de-duplicate on `id` client-side too.
- **Never fill gaps**: salaries are hidden on most Indian postings (`salaryHidden: true`); report the count of disclosed salaries next to any statistic.
- **Run-sync limit**: 300 s. Full-board exports and big Oracle tenants (JPMC has 7,000+ open jobs) need the async pattern.

## 3. Actor catalog

### 3.1 IIMJobs Jobs Scraper - `data_daemon/iimjobs-jobs-scraper` (`fEBnL9mUQr81TGuh4`)

https://apify.com/data_daemon/iimjobs-jobs-scraper - IIMJobs.com, India's board for MBA, finance, consulting, CA/CFA, sales, HR and senior management roles.

Use when: Indian non-tech hiring data; salary (LPA) where disclosed; applicant counts per posting; company hiring signals with AmbitionBox rating; a daily feed of new management roles.

Input (verified: `{"queries":["product manager"],"postedWithinDays":7,"maxJobsPerQuery":3}` → 3 jobs):

```json
{
  "queries": ["product manager", "investment banking"],
  "locations": ["Bangalore", "Mumbai"],
  "minExperience": 5,
  "maxExperience": 12,
  "postedWithinDays": 7,
  "includeDescription": true,
  "maxJobsPerQuery": 100,
  "maxJobs": 0
}
```

| Field | Notes |
|---|---|
| `queries` string[] | one search per keyword; results de-duplicated across keywords |
| `locations` string[] | city filter matched against the job's listed cities: `Bangalore`, `Mumbai`, `Delhi NCR`, `Gurgaon`, `Pune`, `Hyderabad`, `Chennai`, `Remote`, `Anywhere in India` |
| `minExperience` / `maxExperience` int | years; overlap with the posting's range |
| `postedWithinDays` int | 1, 3, 7, 15, 30; omit for all |
| `includeDescription` bool (default true) | full JD text + HTML and company profile; +$0.002 per job |
| `maxJobsPerQuery` int (default 40), `maxJobs` int (0 = no cap) | cost caps |
| `onlyNewSinceLastRun` bool, `stateKey` string, `skipJobIds` array | monitor mode and explicit exclusions; read the live schema |

Output, one record per job: `id`, `site`, `url`, `title`, `designation`, `company` {`name`, `domain`, `logo`, `confidential`, `ambitionBoxRating`, `ambitionBoxReviews`, `ambitionBoxUrl`, `about`}, `recruiter` {`designation`; `name` only where the board shows it publicly, otherwise masked}, `experienceMinYears`, `experienceMaxYears`, `salaryMinLpa`, `salaryMaxLpa`, `salaryHidden`, `locations` [], `remote`, `skills` [], `mandatorySkills` [], `applicants`, `postedAt` (ISO), `description`, `descriptionHtml` (with `includeDescription`), `query`, `scrapedAt`.

Cost: `job` $0.002 + `job-description` $0.002 → $4 per 1,000 jobs with descriptions, $2 without.

### 3.2 Hirist.tech Jobs Scraper - `data_daemon/hirist-jobs-scraper` (`z2fAtS4KgvaqkK85b`)

https://apify.com/data_daemon/hirist-jobs-scraper - Hirist.tech (hirist.com), India's tech-only board (same publisher as IIMJobs). **Identical input and output schema to 3.1**; the only difference is the board.

Use when: Indian software/data/DevOps/product-tech roles; skills demand (tagged `skills` and `mandatorySkills` per posting); tech salary bands where disclosed; a daily feed of new tech roles.

Input (verified: `{"queries":["python developer"],"postedWithinDays":7,"maxJobsPerQuery":3}` → 3 jobs):

```json
{ "queries": ["data engineer", "python developer"], "locations": ["Bangalore", "Remote"], "postedWithinDays": 1, "includeDescription": false, "maxJobsPerQuery": 200 }
```

Output and cost: as 3.1 (`job` $0.002 + `job-description` $0.002).

### 3.3 Oracle HCM / Recruiting Cloud Jobs Scraper - `data_daemon/oracle-hcm-jobs-scraper` (`ADeJJ5VJCcUqYI87X`)

https://apify.com/data_daemon/oracle-hcm-jobs-scraper - every requisition on any Oracle Recruiting Cloud (Oracle Fusion Cloud HCM) career site.

Use when: the user names an employer whose careers page URL contains `oraclecloud.com/hcmUI/CandidateExperience`; counting an employer's open roles by location/category; monitoring a large employer's new postings; building a jobs feed from enterprise career sites. To find a company's site, web-search `site:oraclecloud.com CandidateExperience "<company>"`. Known sites: Oracle `https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_45001/requisitions`, JPMorgan Chase `https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/requisitions`, Marriott `https://ejwl.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX/requisitions`, Kotak Mahindra Bank `https://hcbt.fa.em2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX/requisitions`, DTCC `https://ebxr.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/requisitions`.

Input (verified: Oracle CX_45001 with `"keyword":"engineer","maxJobsPerSite":3` → 3 jobs):

```json
{
  "careerSiteUrls": ["https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/requisitions"],
  "keyword": "software engineer",
  "location": "India",
  "postedWithinDays": 7,
  "workplaceTypes": ["ORA_REMOTE", "ORA_HYBRID"],
  "includeDetails": true,
  "maxJobsPerSite": 500,
  "maxJobs": 0
}
```

| Field | Notes |
|---|---|
| `careerSiteUrls` string[] (required) | any page of the site works, including a single job URL |
| `keyword` string | omit to list every open requisition |
| `location` string | as typed on the site, e.g. `India`, `London`, `Texas, United States` |
| `postedWithinDays` int | Oracle supports exactly 7 or 30 (other values round up) |
| `workplaceTypes` string[] | `ORA_REMOTE`, `ORA_HYBRID`, `ORA_ON_SITE` |
| `includeDetails` bool (default true) | full description, qualifications, responsibilities, flex fields; +$0.002 per job |
| `maxJobsPerSite` int (default 50; 0 = all), `maxJobs` int | cost caps |

Output, one record per requisition: `id`, `title`, `url`, `applyUrl`, `tenantHost`, `careerSite` {`origin`, `siteNumber`, `name`}, `postedDate`, `externalPostedStartDate`, `language`, `primaryLocation`, `country`, `locations` [], `remote`, `workplaceType`, `jobFunction`, `category`, `hotJob`, `trending`, `shortDescription`, and with `includeDetails`: `description`, `descriptionHtml`, `qualifications`, `responsibilities`, `corporateDescription`, `skills` [], `flexFields` {employer-defined, e.g. `Role`, `Job Type`}; plus `scrapedAt`. The employer name is `careerSite.name`.

Cost: `job` $0.002 + `job-details` $0.002.

### 3.4 India IPO Tracker - `data_daemon/india-ipo-tracker` (`Q8tYzzX5YLgPLbQu4`)

https://apify.com/data_daemon/india-ipo-tracker - current and upcoming Indian IPOs, live grey market premium, live subscription, calendar, optional detail pages (sources: Chittorgarh, InvestorGain).

Use when: "what IPOs are open / upcoming in India", "GMP of X", "how many times is X subscribed (QIB/NII/retail)", IPO calendars and alert bots, mainboard vs SME.

Input (verified: `{"reports":["gmp"],"maxItems":5}` → 5 rows):

```json
{ "reports": ["currentIpos", "gmp", "subscription", "calendar"], "category": "all", "includeIpoDetails": false, "maxItems": 0 }
```

| Field | Notes |
|---|---|
| `reports` string[] | `currentIpos` (status, price band, lot, dates), `gmp` (live grey market premium), `subscription` (QIB/NII/retail multiples), `calendar` (events). Other values exist in the schema (`ipoList`, `gmpPerformance`, `listingPerformance`); check the actor page before relying on them. |
| `category` | `all`, `mainboard`, `sme` |
| `includeIpoDetails` bool (default false) | one `ipoDetail` record per IPO: price band, lot size, timetable, reservation, anchors, financials, objects; $0.015 each |
| `financialYear` string | e.g. `2025-26`, for list reports |
| `maxItems` int | 0 = no limit |

Output, one record per report row with `reportType` set: common `ipoName`, `slug`, `url`, `category` (Mainboard/SME), `status`, `openDate`, `closeDate`, `listingDate`, `issuePrice`, `issueSizeCr`, `lotSize`, `scrapedAt`; `gmp` rows add `gmp`, `gmpPercent`, `gmpText`, `rating`, `subscriptionText`, `priceToEarnings`, `allotmentDate`, `anchorInvestors`, `updatedOn`; `subscription` rows add `qibX`, `niiX`, `sNiiX`, `bNiiX`, `retailX`, `totalX`, `applications`, `subscriptionAsOn`. Every row also carries `fields` (all source columns, cleaned) and `meta` (hidden machine columns such as ISIN/symbol).

Cost: `report-row` $0.003; `ipo-detail` $0.015.

### 3.5 Tickertape India Stocks Scraper - `data_daemon/tickertape-stocks-scraper` (`LjrpONBpsSkqWrHs5`)

https://apify.com/data_daemon/tickertape-stocks-scraper - NSE/BSE listed companies via Tickertape: index constituents, a ratio screener, and full fundamentals profiles.

Use when: "list of NIFTY 50 / NIFTY BANK / NIFTY 500 stocks with price and sector", "screen Indian stocks by market cap / PE / dividend yield / ROE", "fundamentals, shareholding history and 10-year financials of RELIANCE".

Input (verified: `{"mode":"index","indexSid":"NIFTY 50","maxItems":5}` → 5 rows; `{"mode":"screener","screenerMatch":{"mrktCapf":{"g":50000}},"maxItems":5}` → 5 rows):

```json
{ "mode": "index", "indexSid": "NIFTY 50" }
{ "mode": "screener", "screenerMatch": { "mrktCapf": { "g": 10000 }, "apef": { "l": 25 }, "divYield": { "g": 1 } }, "screenerSortBy": "mrktCapf", "screenerSortDesc": true, "maxItems": 200 }
{ "mode": "stocks", "stocks": ["RELIANCE", "TCS", "HDFCBANK"], "fullProfile": true }
```

| Field | Notes |
|---|---|
| `mode` | `index`, `screener`, `stocks` |
| `indexSid` | `NIFTY 50`, `NIFTY 100`, `NIFTY 500`, `NIFTY BANK`, `SENSEX`, or Tickertape ids like `.NSEI`, `.NSEBANK` |
| `screenerMatch` object | Tickertape filter: `mrktCapf` (market cap, Cr), `apef` (PE), `pbr` (PB), `divYield`, `roe`, `pr1y` ... with `g` (greater) / `l` (less) |
| `screenerFields` string[] | extra ratio columns on top of the defaults |
| `stocks` string[] | NSE tickers, company names or Tickertape URLs (profile mode) |
| `maxItems` int | 0 = no limit |

Output: index rows `indexSid`, `sid`, `ticker`, `name`, `sector`, `lastPrice`, `change1dPct`, `freeFloatPct`, `url`, `scrapedAt`; screener rows `sid`, `ticker`, `name`, `sector`, `subindustry`, `lastPrice`, `mrktCapf`, `apef`, `pbr`, `divYield`, `roe`, `beta`, `pr1w`, `4wpct`, `url`, `scrapedAt` (+ requested `screenerFields`); stock profiles `ticker`, `name`, `sector`, `industry`, `isin`, `quote`, `marketCapCr`, `pe`, `pb`, `dividendYield`, `roe`, `week52High`, `week52Low`, `scorecard`, `shareholding` (quarterly promoter/FII/DII/MF/retail), `incomeStatementAnnual`, `balanceSheetAnnual`, `cashFlowAnnual`, `incomeStatementQuarterly`, `analystForecast`, `dividends`, `corporateActions`, `mutualFundHoldings`, `peers`, `investmentChecklist`.

Cost: `quote-row` $0.002 (index and screener rows); `stock-profile` $0.02.

### 3.6 Dubai DLD Property Transactions - `data_daemon/dubai-property-transactions` (`fSoMCyHMdU0YHp4kk`)

https://apify.com/data_daemon/dubai-property-transactions - registered transactions from the Dubai Land Department open-data register.

Use when: sold prices and price per sqm by area/project; off-plan vs ready sales volumes; mortgage registrations; weekly market stats for Dubai; comps for a valuation.

Input (verified: `{"transactionGroup":"sales","maxItems":3}` → 3 rows; dates default to the last 7 days):

```json
{ "fromDate": "2026-10-01", "toDate": "2026-10-07", "transactionGroup": "sales", "offPlan": "all", "usage": "residential", "propertyType": "unit", "maxItems": 2000 }
```

| Field | Notes |
|---|---|
| `fromDate` / `toDate` `YYYY-MM-DD` | default: 7 days ago → today |
| `transactionGroup` | `all`, `sales`, `mortgages`, `gifts` |
| `offPlan` | `all`, `offplan`, `ready` |
| `freehold` | `all`, `freehold`, `nonfreehold` |
| `usage` | `all`, `residential`, `commercial` |
| `propertyType` | `all`, `unit`, `building`, `land` |
| `areaId` string | one DLD area id (each row carries its `areaId`) |
| `includeArabic` bool | adds Arabic names |
| `maxItems` int (default 200; 0 = all in range) | a busy week has 5,000+ sales |

Output, one record per transaction: `transactionNumber`, `transactionDate`, `transactionDateTime`, `group`, `groupId`, `procedure` (e.g. `Sell`, `Sell - Pre registration`, `Mortgage Registration`), `procedureId`, `usage`, `offPlan`, `freehold`, `area`, `areaId`, `project`, `masterProject`, `propertyType`, `propertySubType`, `rooms`, `parking`, `buildingAge`, `parcelId`, `propertyId`, `transactionValueAed`, `procedureAreaSqm`, `actualAreaSqm`, `pricePerSqmAed`, `nearestMetro`, `nearestMall`, `nearestLandmark`, `totalSellers`, `totalBuyers`, `source`, `scrapedAt`.

Cost: `transaction` $0.001 ($1 per 1,000).

### 3.7 UK Gazette Insolvency Notices - `data_daemon/uk-gazette-insolvency-notices` (`4We8IBpLtJp6OkQd8`)

https://apify.com/data_daemon/uk-gazette-insolvency-notices - official UK insolvency notices from The Gazette (Open Government Licence).

Use when: lists of companies facing winding-up petitions (incl. HMRC petitions), winding-up orders, administrations, liquidations, creditor meetings; credit-risk and supplier monitoring; insolvency practitioner leads.

Input (verified: `{"noticeTypes":["2450"],"maxItems":3,"includeLinkedData":true}` → 3 rows):

```json
{ "service": "insolvency", "noticeTypes": ["2450", "2452", "2410"], "startPublishDate": "2026-10-01", "text": "", "sortBy": "latest-date", "includeLinkedData": true, "maxItems": 200 }
```

| Field | Notes |
|---|---|
| `service` | `insolvency` (default), `companies`, `all-notices`, `wills-and-probate` |
| `noticeTypes` string[] | Gazette codes: `2450` petitions to wind up, `2451` partnership winding-up petitions, `2452` winding-up orders, `2441` resolutions for winding up, `2432`/`2443` appointment of liquidators, `2410` administration appointments, `2442` meetings of creditors, `2433` notices to creditors; omit for all types in the service |
| `categoryCode` string | e.g. `G205000000` corporate insolvency, `G206000000` personal insolvency |
| `text` string | free text: company name, practitioner, town |
| `startPublishDate` / `endPublishDate` `YYYY-MM-DD` | publication window |
| `includeLinkedData` bool (default true) | adds the structured record (company number, addresses, court case, practitioners); +$0.003 per notice |
| `maxItems` int (default 40) | cost cap |

Output, one record per notice: `noticeId`, `url`, `title`, `category`, `categories`, `noticeCode`, `noticeTypes`, `published`, `updated`, `publisher`, `status`, `summary`, `contentHtml`, `source`, `scrapedAt`; with `includeLinkedData`: `companyName`, `companyNumber`, `companyTypes`, `registeredOffice`, `principalTradingAddress`, `subjectType`, `dateOfHearing`, `dateOfPetitionPresentation`, `dateToRequestAppearance`, `practitioners` [{`name`, `type`, `firm`, `email`, `telephone`, `address`}], and the full `linkedData` object (petitioner under `linkedData.petitioner`, court and case under `linkedData.hasCourtCase.hasCourt.courtName` / `linkedData.hasCourtCase.caseCode`).

Cost: `notice` $0.002 + `notice-details` $0.003.

## 4. Not covered (do not route here)

Naukri, LinkedIn, Indeed, Foundit, Glassdoor; Workday/Taleo/Greenhouse/Lever career sites; Indian equity price history or F&O; mutual funds; Dubai rental contracts or listings; Companies House filings. Startup India / DPIIT directory data: the `data_daemon/startup-india-dpiit-scraper` actor is currently private while its source API is down; do not call it.

## 5. Examples in this repository

`python/<actor>.py` and `node/<actor>.mjs` (apify-client SDK), `examples/run-sync/` (plain REST, sync and async, stdlib/no-deps), `examples/only-new-jobs/` (scheduled de-duplicated jobs feed), `n8n/` (schedule → HTTP → Google Sheets/Slack workflows), `skills/daemon-data-apify-actors/SKILL.md` (this catalog as an agent skill).
