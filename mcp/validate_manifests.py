"""Validate the six R1 publication candidates using the Registry's JSON schema."""
import json
from pathlib import Path
from urllib.request import urlopen

import jsonschema

TARGETS = ['india-jobs-mcp', 'india-jobs-feed', 'naukri-jobs-scraper',
           'iimjobs-jobs-scraper', 'india-ipo-tracker', 'uk-gazette-insolvency-notices']
ROOT = Path(__file__).resolve().parent


def main():
    with urlopen('https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json', timeout=60) as response:
        schema = json.load(response)
    for slug in TARGETS:
        entry = json.loads((ROOT / slug / 'server.json').read_text(encoding='utf-8'))
        jsonschema.validate(entry, schema)
        assert entry['name'] == 'io.github.datadmon/' + slug
        assert len(entry['description']) <= 100
        for remote in entry['remotes']:
            assert 'token=' not in remote['url']
            auth = next(h for h in remote['headers'] if h['name'] == 'Authorization')
            assert auth['isRequired'] and auth['isSecret']
        print('Validated', entry['name'], entry['version'])


if __name__ == '__main__':
    main()
