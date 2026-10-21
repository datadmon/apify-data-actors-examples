# Only new jobs, every morning (IIMJobs / Hirist / Foundit)

A daily feed that returns each job once. Works with [IIMJobs Jobs Scraper](https://apify.com/data_daemon/iimjobs-jobs-scraper) (`fEBnL9mUQr81TGuh4`), [Hirist.tech Jobs Scraper](https://apify.com/data_daemon/hirist-jobs-scraper) (`z2fAtS4KgvaqkK85b`) and [Foundit Jobs Scraper](https://apify.com/data_daemon/foundit-jobs-scraper) (`UdAJvB5H72gNbfQfM`). IIMJobs and Hirist share one input and output schema; Foundit uses the same `queries` / `postedWithinDays` / `onlyNewSinceLastRun` / `skipJobIds` input fields and the same `id`, `title`, `company.name`, `locations`, `postedAt` and `url` output fields that this script prints.

```bash
export APIFY_TOKEN=...                                   # https://console.apify.com/settings/integrations
python only_new_jobs.py iimjobs "product manager"        # or: node only_new_jobs.mjs hirist "data engineer" | python only_new_jobs.py foundit "sales manager"
```

Each run calls `POST /v2/acts/{actor}/run-sync-get-dataset-items` with `postedWithinDays: 1`, then prints only jobs it has not printed before. State lives in `.state/<site>-seen.json` next to the script.

## Three ways the duplicates are removed

The script reads the actor's live input schema (`GET /v2/acts/{actor}/builds/default`) and picks the best available option, so it is correct on any build:

| Actor input field | What happens | Charged for skipped jobs? |
|---|---|---|
| `onlyNewSinceLastRun: true` (+ optional `stateKey`), monitor mode in the latest builds | The actor keeps the ids it has delivered for that search in a key-value store **in your Apify account** and skips them before fetching details. Set `stateKey` to keep several saved searches apart; use a new key to start a fresh feed. | No |
| `skipJobIds: [...]` | The script sends the ids it has already seen; the actor leaves them out. | No |
| neither | Everything posted in the last day comes back and the script filters locally. | Yes, for the repeats |

Check which fields your build has: `curl -s -H "Authorization: Bearer $APIFY_TOKEN" https://api.apify.com/v2/acts/data_daemon~iimjobs-jobs-scraper/builds/default | python -c "import json,sys; print(list(json.loads(json.load(sys.stdin)['data']['inputSchema'])['properties']))"`.

## Scheduling it

- **cron**: `0 8 * * * cd /path/to/examples/only-new-jobs && APIFY_TOKEN=... python only_new_jobs.py iimjobs "product manager" >> new-jobs.log`
- **GitHub Actions**: `on: schedule: - cron: "30 2 * * *"` (08:00 IST), add `APIFY_TOKEN` as a repository secret, commit `.state/` back or cache it. With `onlyNewSinceLastRun` you can skip the state file entirely because the actor remembers for you.
- **No code at all**: in Apify Console open the actor, fill the input, click *Save as task*, then *Schedules → Create schedule* (daily) and add the task. In the task's *Integrations* tab add Google Sheets, Slack, a webhook, Make or Zapier. See [`../../n8n/iimjobs-new-jobs-to-google-sheets-and-slack.json`](../../n8n/iimjobs-new-jobs-to-google-sheets-and-slack.json) for the n8n version.

## Cost

List prices (October 2026): IIMJobs and Hirist $0.002 per job returned, plus $0.002 per job when `includeDescription` is on (default `true`; the scripts turn it off for a feed and you can turn it back on). Foundit $0.0008 per job with the description included either way, plus $0.001 per run. A "product manager" feed on IIMJobs returned about 50 new jobs a day in October 2026, i.e. about $0.10 a day without descriptions. Jobs skipped by `onlyNewSinceLastRun` or `skipJobIds` cost nothing.
