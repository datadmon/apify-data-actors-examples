"""Call a Daemon Data actor with one HTTP request and get the records back. Standard library only.

    export APIFY_TOKEN=...   # https://console.apify.com/settings/integrations
    python run_sync.py data_daemon/iimjobs-jobs-scraper '{"queries":["product manager"],"postedWithinDays":7,"maxJobs":20}'
    python run_sync.py data_daemon/india-ipo-tracker '{"reports":["gmp"]}' --csv > gmp.csv

Actor ids (either form works in the URL; a slash in the name becomes a tilde):
    data_daemon/iimjobs-jobs-scraper          fEBnL9mUQr81TGuh4
    data_daemon/hirist-jobs-scraper           z2fAtS4KgvaqkK85b
    data_daemon/oracle-hcm-jobs-scraper       ADeJJ5VJCcUqYI87X
    data_daemon/india-ipo-tracker             Q8tYzzX5YLgPLbQu4
    data_daemon/tickertape-stocks-scraper     LjrpONBpsSkqWrHs5
    data_daemon/dubai-property-transactions   fSoMCyHMdU0YHp4kk
    data_daemon/uk-gazette-insolvency-notices 4We8IBpLtJp6OkQd8
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.apify.com/v2"
TOKEN = os.environ["APIFY_TOKEN"]
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}


def run_sync(actor: str, run_input: dict, fmt: str = "json", fields: list[str] | None = None, timeout_secs: int = 300):
    """run-sync-get-dataset-items: waits up to 300 s and returns the dataset items (list for json, str for csv/xlsx).

    For runs that may take longer (full-board exports, thousands of Oracle requisitions) use run_async() below.
    """
    params = {"clean": "1", "format": fmt}
    if fields:
        params["fields"] = ",".join(fields)
    url = f"{API}/acts/{actor.replace('/', '~')}/run-sync-get-dataset-items?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, data=json.dumps(run_input).encode(), method="POST", headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout_secs + 30) as resp:
            body = resp.read().decode("utf-8-sig")
    except urllib.error.HTTPError as e:
        if e.code == 408:  # the run is still going; it keeps running on Apify, fetch it later from the console/API
            raise TimeoutError("run exceeded the 300 s sync limit; use run_async() for this input") from e
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode()[:300]}") from e
    return json.loads(body) if fmt == "json" else body


def run_async(actor: str, run_input: dict, poll_secs: int = 10) -> list[dict]:
    """Start the run, poll until it finishes, then download every dataset item. No time limit."""
    req = urllib.request.Request(f"{API}/acts/{actor.replace('/', '~')}/runs", data=json.dumps(run_input).encode(), method="POST", headers=HEADERS)
    run = json.load(urllib.request.urlopen(req, timeout=60))["data"]
    while run["status"] in ("READY", "RUNNING"):
        time.sleep(poll_secs)
        run = json.load(urllib.request.urlopen(urllib.request.Request(f"{API}/actor-runs/{run['id']}", headers=HEADERS), timeout=60))["data"]
    if run["status"] != "SUCCEEDED":
        raise RuntimeError(f"run {run['id']} ended with {run['status']}: {run.get('statusMessage')}")
    items, offset = [], 0
    while True:
        page = json.load(urllib.request.urlopen(urllib.request.Request(
            f"{API}/datasets/{run['defaultDatasetId']}/items?clean=1&limit=1000&offset={offset}", headers=HEADERS), timeout=120))
        items.extend(page)
        if len(page) < 1000:
            return items
        offset += 1000


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    actor, run_input = sys.argv[1], json.loads(sys.argv[2])
    if "--csv" in sys.argv:
        sys.stdout.write(run_sync(actor, run_input, fmt="csv"))
    else:
        items = run_sync(actor, run_input)
        print(f"{len(items)} records", file=sys.stderr)
        print(json.dumps(items, indent=2, ensure_ascii=False))
