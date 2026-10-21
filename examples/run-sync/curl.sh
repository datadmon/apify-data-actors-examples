#!/usr/bin/env bash
# One HTTP call per actor: start the run, wait for it (up to 300 s) and get the dataset items back.
#
#   export APIFY_TOKEN=...        # https://console.apify.com/settings/integrations
#   ./curl.sh iimjobs             # or: hirist | foundit | instahyre | oracle | ipo | tickertape | dubai | gazette | luma | csv | async
#
# Endpoint: POST https://api.apify.com/v2/acts/{actorId}/run-sync-get-dataset-items
#   {actorId} is "data_daemon~<actor-name>" (tilde, not slash) or the hex id shown in the table.
#   Query options: clean=1 (drop empty/hidden fields), format=json|csv|xlsx|xml|rss, fields=a,b,c (pick columns),
#                  limit=N, offset=N, timeout=<secs>, memory=<MB>, build=latest
#   Each actor charges per record returned, so cap the run with maxJobs / maxItems while testing.
#
# | actor                           | actor id          |
# | data_daemon~iimjobs-jobs-scraper        | fEBnL9mUQr81TGuh4 |
# | data_daemon~hirist-jobs-scraper         | z2fAtS4KgvaqkK85b |
# | data_daemon~oracle-hcm-jobs-scraper     | ADeJJ5VJCcUqYI87X |
# | data_daemon~india-ipo-tracker           | Q8tYzzX5YLgPLbQu4 |
# | data_daemon~tickertape-stocks-scraper   | LjrpONBpsSkqWrHs5 |
# | data_daemon~dubai-property-transactions | fSoMCyHMdU0YHp4kk |
# | data_daemon~uk-gazette-insolvency-notices | 4We8IBpLtJp6OkQd8 |
# | data_daemon~foundit-jobs-scraper        | UdAJvB5H72gNbfQfM |
# | data_daemon~instahyre-jobs-scraper      | GMe0nzJEhMj9PV8Mb |
# | data_daemon~luma-events-scraper         | 51GnTTp3L9zzrKcb7 |
set -euo pipefail
: "${APIFY_TOKEN:?set APIFY_TOKEN first}"
API=https://api.apify.com/v2

run_sync() { # run_sync <actor> <json-input> [extra query params]
  curl -sS -X POST "$API/acts/$1/run-sync-get-dataset-items?clean=1${3:-}" \
    -H "Authorization: Bearer $APIFY_TOKEN" -H "Content-Type: application/json" \
    -d "$2"
}

case "${1:-help}" in
  iimjobs)   run_sync data_daemon~iimjobs-jobs-scraper '{"queries":["product manager"],"locations":["Bangalore","Mumbai"],"postedWithinDays":7,"includeDescription":true,"maxJobsPerQuery":50}' ;;
  hirist)    run_sync data_daemon~hirist-jobs-scraper  '{"queries":["python developer"],"locations":["Bangalore"],"postedWithinDays":7,"includeDescription":true,"maxJobsPerQuery":50}' ;;
  oracle)    run_sync data_daemon~oracle-hcm-jobs-scraper '{"careerSiteUrls":["https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_45001/requisitions"],"keyword":"engineer","postedWithinDays":30,"includeDetails":true,"maxJobsPerSite":100}' ;;
  ipo)       run_sync data_daemon~india-ipo-tracker '{"reports":["gmp","subscription"],"category":"all"}' ;;
  tickertape) run_sync data_daemon~tickertape-stocks-scraper '{"mode":"index","indexSid":"NIFTY 50"}' ;;
  dubai)     run_sync data_daemon~dubai-property-transactions '{"transactionGroup":"sales","maxItems":500}' ;;
  gazette)   run_sync data_daemon~uk-gazette-insolvency-notices '{"noticeTypes":["2450"],"includeLinkedData":true,"maxItems":100}' ;;
  foundit)   run_sync data_daemon~foundit-jobs-scraper '{"queries":["data analyst"],"locations":["Bangalore"],"postedWithinDays":7,"includeDescription":true,"maxJobsPerQuery":50}' ;;
  instahyre) run_sync data_daemon~instahyre-jobs-scraper '{"queries":["python"],"locations":["Bangalore"],"companySizes":["small","medium"],"includeDescription":true,"maxJobsPerQuery":50}' ;;
  luma)      run_sync data_daemon~luma-events-scraper '{"cities":["London"],"categories":["ai"],"daysAhead":30,"includeDetails":true,"maxEvents":50}' ;;

  # CSV with chosen columns (nested fields use dots; arrays become locations/0, locations/1, ...)
  csv)       run_sync data_daemon~iimjobs-jobs-scraper '{"queries":["investment banking"],"postedWithinDays":7,"includeDescription":false,"maxJobsPerQuery":100}' \
               '&format=csv&fields=title,company.name,locations,experienceMinYears,experienceMaxYears,applicants,postedAt,url' ;;

  # Runs longer than 300 s (big exports): start async, poll, then read the dataset.
  async)
    RUN=$(curl -sS -X POST "$API/acts/data_daemon~oracle-hcm-jobs-scraper/runs" \
      -H "Authorization: Bearer $APIFY_TOKEN" -H "Content-Type: application/json" \
      -d '{"careerSiteUrls":["https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/requisitions"],"postedWithinDays":7,"includeDetails":false,"maxJobsPerSite":0}')
    RUN_ID=$(printf '%s' "$RUN" | python -c 'import json,sys; print(json.load(sys.stdin)["data"]["id"])')
    while :; do
      STATUS=$(curl -sS "$API/actor-runs/$RUN_ID" -H "Authorization: Bearer $APIFY_TOKEN" | python -c 'import json,sys; print(json.load(sys.stdin)["data"]["status"])')
      echo "run $RUN_ID: $STATUS" >&2
      case "$STATUS" in SUCCEEDED|FAILED|ABORTED|TIMED-OUT) break ;; esac
      sleep 10
    done
    curl -sS "$API/actor-runs/$RUN_ID/dataset/items?clean=1&format=json" -H "Authorization: Bearer $APIFY_TOKEN" ;;

  *) echo "usage: $0 iimjobs|hirist|foundit|oracle|ipo|tickertape|dubai|gazette|luma|csv|async" >&2; exit 1 ;;
esac
