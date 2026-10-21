"""Scheduled "only new jobs" loop for IIMJobs / Hirist / Foundit. Run it every morning (cron, GitHub Actions, Task Scheduler);
each run prints only the jobs it has not delivered before. Standard library only.

    export APIFY_TOKEN=...
    python only_new_jobs.py                                  # IIMJobs, "product manager", last 1 day
    python only_new_jobs.py hirist "data engineer" "python developer"
    python only_new_jobs.py foundit "sales manager"

How the de-duplication works (checked against the actor's live input schema on every run, so this script is
correct whichever build is deployed):
  1. If the actor input has `onlyNewSinceLastRun` (monitor mode, current builds; `onlyNewJobs` on old ones): the actor
     itself remembers what it has delivered for this search, in a key-value store in YOUR Apify account, and skips
     those jobs before fetching details. Skipped jobs are not charged. `stateName` keeps several saved searches apart.
  2. Else if the input has `skipJobIds`: we send the ids we have already seen; the actor filters them out.
  3. In every case the script also keeps a local seen-ids file (.state/<site>-seen.json) and filters client-side,
     so you never process the same job twice even if you change searches.
"""
import json
import os
import pathlib
import sys
import urllib.request

API = "https://api.apify.com/v2"
HEADERS = {"Authorization": f"Bearer {os.environ['APIFY_TOKEN']}", "Content-Type": "application/json"}
ACTORS = {"iimjobs": "data_daemon~iimjobs-jobs-scraper", "hirist": "data_daemon~hirist-jobs-scraper",
          "foundit": "data_daemon~foundit-jobs-scraper"}  # ids fEBnL9mUQr81TGuh4, z2fAtS4KgvaqkK85b, UdAJvB5H72gNbfQfM
MONITOR_FLAGS = ("onlyNewSinceLastRun", "onlyNewJobs")  # boolean: actor-side memory of delivered jobs
STATE_KEY_FIELDS = ("stateName", "stateKey", "monitorKey")  # string: name of this saved search's memory (current builds use stateName)
SKIP_LIST_FIELDS = ("skipJobIds", "excludeJobIds")  # string[]: ids to leave out of this run


def input_schema_props(actor: str) -> dict:
    """Properties of the actor's current default build input schema (GET /v2/acts/{id}/builds/default)."""
    build = json.load(urllib.request.urlopen(urllib.request.Request(f"{API}/acts/{actor}/builds/default", headers=HEADERS), timeout=60))["data"]
    return json.loads(build.get("inputSchema") or "{}").get("properties", {})


def fetch_new_jobs(site: str, queries: list[str], posted_within_days: int = 1, with_descriptions: bool = False, state_dir: str = ".state") -> list[dict]:
    actor = ACTORS[site]
    state_path = pathlib.Path(state_dir) / f"{site}-seen.json"
    seen: dict[str, str] = json.loads(state_path.read_text()) if state_path.exists() else {}  # id -> first seen date

    run_input = {"queries": queries, "postedWithinDays": posted_within_days, "includeDescription": with_descriptions, "maxJobsPerQuery": 200}
    props = input_schema_props(actor)
    flag = next((f for f in MONITOR_FLAGS if f in props), None)
    skip_field = next((f for f in SKIP_LIST_FIELDS if f in props), None)
    if flag:
        run_input[flag] = True
        key_field = next((f for f in STATE_KEY_FIELDS if f in props), None)
        if key_field:  # one memory per saved search
            run_input[key_field] = f"{site}-" + "-".join(q.replace(" ", "_") for q in sorted(queries))[:30]
    elif skip_field and seen:
        run_input[skip_field] = list(seen)
    print(f"dedupe: {'actor-side ' + flag if flag else ('actor-side ' + skip_field if skip_field else 'client-side only')}", file=sys.stderr)

    req = urllib.request.Request(f"{API}/acts/{actor}/run-sync-get-dataset-items?clean=1", data=json.dumps(run_input).encode(), method="POST", headers=HEADERS)
    items = json.load(urllib.request.urlopen(req, timeout=330))

    today = __import__("datetime").date.today().isoformat()
    new = [j for j in items if str(j["id"]) not in seen]
    for j in new:
        seen[str(j["id"])] = today
    # forget ids older than ~120 days so the file (and any skip list) stays small
    cutoff = (__import__("datetime").date.today() - __import__("datetime").timedelta(days=120)).isoformat()
    seen = {k: v for k, v in seen.items() if v >= cutoff}
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(seen))
    print(f"{len(items)} returned, {len(new)} new (seen set now {len(seen)})", file=sys.stderr)
    return new


if __name__ == "__main__":
    site = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] in ACTORS else "iimjobs"
    queries = [a for a in sys.argv[1:] if a not in ACTORS] or ["product manager"]
    for job in fetch_new_jobs(site, queries):
        company = (job.get("company") or {}).get("name") or "(confidential)"
        print(f"{job['postedAt'][:10]}  {job['title']}  |  {company}  |  {', '.join(job.get('locations') or [])}  |  {job['url']}")
