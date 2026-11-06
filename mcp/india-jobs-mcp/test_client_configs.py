"""Check published config templates using MCP transports; no tools/call requests."""
import asyncio
import json
import os
from pathlib import Path
import shutil

import httpx2 as httpx
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.client.streamable_http import streamable_http_client

ROOT = Path(__file__).resolve().parent
EXPECTED = {'search_jobs', 'search_all_boards', 'new_jobs_since', 'get_results', 'list_boards'}


async def check_session(read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        result = await session.list_tools()
        names = {t.name for t in result.tools}
        assert names == EXPECTED, f'Unexpected tools: {sorted(names)}'
        return sorted(names)


async def main():
    token = os.environ['APIFY_TOKEN']
    if not token:
        raise ValueError('Set APIFY_TOKEN locally')
    for name in ['claude-code.json', 'cursor.json', 'gemini.json']:
        config = json.loads((ROOT/name).read_text(encoding='utf-8'))['mcpServers']['india-jobs']
        header = config['headers']['Authorization']
        for placeholder in ['${APIFY_TOKEN}', '${env:APIFY_TOKEN}', '<YOUR_APIFY_TOKEN>']:
            header = header.replace(placeholder, token)
        url = config.get('url') or config['httpUrl']
        async with httpx.AsyncClient(headers={'Authorization': header}, timeout=90) as http:
            async with streamable_http_client(url, http_client=http) as (read, write):
                names = await check_session(read, write)
        print(name, 'initialize/tools/list OK:', ', '.join(names), flush=True)
    config = json.loads((ROOT/'claude-desktop.json').read_text(encoding='utf-8'))['mcpServers']['india-jobs']
    params = StdioServerParameters(command=shutil.which(config['command']) or config['command'], args=config['args'],
                                   env={**os.environ, 'AUTH_HEADER': 'Bearer ' + token})
    # Third-party bridge logs must never echo credentials to terminal or artifacts.
    with open(os.devnull, 'w') as discarded:
        async with stdio_client(params, errlog=discarded) as (read, write):
            names = await check_session(read, write)
    print('claude-desktop.json pinned bridge initialize/tools/list OK:', ', '.join(names), flush=True)


if __name__ == '__main__':
    # Only diagnostic summaries are printed; exception strings from dependencies can include headers.
    try:
        asyncio.run(main())
    except Exception as exc:
        def summarize(error):
            children = getattr(error, 'exceptions', ())
            if children:
                return '; '.join(summarize(child) for child in children)
            message = str(error).replace(os.environ.get('APIFY_TOKEN') or '<unset>', '<redacted>')
            return type(error).__name__ + ': ' + message[:400]
        print('Config test failed:', summarize(exc))
        raise SystemExit(1)
