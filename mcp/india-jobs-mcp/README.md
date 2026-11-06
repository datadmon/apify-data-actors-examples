# India Jobs MCP: Claude, Cursor and Gemini setup

[India Jobs MCP](https://apify.com/data_daemon/india-jobs-mcp) searches ten Indian boards:
Naukri, IIMJobs, Hirist, foundit, Instahyre, Shine, Cutshort, Apna, WorkIndia and Unstop.
Its five tools are `search_jobs`, `search_all_boards`, `new_jobs_since`, `get_results` and `list_boards`.
This is a real Standby MCP server; the other board/feed manifests point to filtered Apify MCP Actor tools.

**Streamable HTTP URL:** `https://data-daemon--india-jobs-mcp.apify.actor/mcp`.
**Required header:** `Authorization: Bearer <APIFY_TOKEN>`; retain the `Bearer ` prefix.
Get your own token from [Apify Console → Settings → API & Integrations](https://console.apify.com/settings/integrations).
The token is never part of the endpoint URL. Searches run and charge the board Actors in your own Apify account.
There is no extra per-job MCP fee, but the Standby process consumes platform usage. Board prices are returned by `list_boards`.

Replace `<YOUR_APIFY_TOKEN>` locally in the Desktop/Gemini examples. Those two files are templates, not shell-variable
expansion promises. Keep credential-bearing local configs out of Git. Code and Cursor use their documented variable syntaxes.
Merge only this server entry into your existing config. Restart the client after editing.

### Claude Code — project `.mcp.json`; launch Claude from a shell containing `APIFY_TOKEN`

[`claude-code.json`](claude-code.json):

```json
{
  "mcpServers": {
    "india-jobs": {
      "type": "http",
      "url": "https://data-daemon--india-jobs-mcp.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer ${APIFY_TOKEN}"
      }
    }
  }
}
```

### Cursor — `~/.cursor/mcp.json`; make `APIFY_TOKEN` available to the app process

[`cursor.json`](cursor.json):

```json
{
  "mcpServers": {
    "india-jobs": {
      "url": "https://data-daemon--india-jobs-mcp.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer ${env:APIFY_TOKEN}"
      }
    }
  }
}
```

### Gemini CLI — `~/.gemini/settings.json`; merge into existing `mcpServers`

[`gemini.json`](gemini.json):

```json
{
  "mcpServers": {
    "india-jobs": {
      "httpUrl": "https://data-daemon--india-jobs-mcp.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      },
      "timeout": 120000
    }
  }
}
```

### Claude Desktop — Settings → Developer → Edit Config; Node.js 22+ required

[`claude-desktop.json`](claude-desktop.json):

```json
{
  "mcpServers": {
    "india-jobs": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@0.16.1",
        "https://data-daemon--india-jobs-mcp.apify.actor/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

Desktop uses a tested stdio-to-HTTP `mcp-remote` bridge. `Authorization:${AUTH_HEADER}` has no spaces in the
argument; this avoids the Windows client argument-escaping problem. The space lives in the environment value.
On Windows, use the full path to `npx.cmd` if Desktop cannot find `npx`.

## Check discovery before running a search

Connect and inspect the five tools using `/mcp` in Claude Code or Gemini CLI, or the MCP tools panel in Cursor/Desktop.
Start with `list_boards` to inspect live prices; search tools start paid board runs. An unauthenticated `initialize` or
`tools/list` receives HTTP 401 at the Apify gateway, before this server handles it. A 401 is not evidence the board is down.
Tools are not available anonymously, even when the requested operation is only `tools/list`.

The [protocol check](test_client_configs.py) starts no search or board run:

```bash
python -m pip install -r requirements-test.txt
export APIFY_TOKEN=your_local_token
python test_client_configs.py
```

Run from this folder. It resolves templates in memory and verifies `initialize` + `tools/list` for the three HTTP configs,
then launches the actual pinned Desktop bridge over stdio and discovers the same tools. It prints tool names only.
Validation is at the config/transport level; it does not claim the four GUI/CLI applications were exercised end to end.
The Standby server may start while connecting; its small platform usage is separate from board search fees.

## IIMJobs Glama health diagnosis (2026-11-06)

[Glama's IIMJobs connector](https://glama.ai/mcp/connectors/io.github.datadmon/iimjobs-jobs-scraper) is a mirror of
[`io.github.datadmon/iimjobs-jobs-scraper`](../iimjobs-jobs-scraper/server.json), whose endpoint is
`https://mcp.apify.com/?tools=data_daemon/iimjobs-jobs-scraper`. Both remote routes require the same Bearer header.
Unauthenticated initialization returned **401**; the same request with a valid header returned **200**, and authenticated
`tools/list` returned the IIMJobs tool plus Apify run/storage helpers. No scraper call was needed.

Glama reports that the last two health checks failed and says a separate test profile supplies credentials for health
checks and tool discovery. Its page directs the owner to claim the connector and set **Admin → Test Profile**.
This supports an authentication barrier as the likely cause; we cannot inspect Glama's private test profile, logs,
probe cadence or exact RPC sequence, so the evidence does not prove which credential Glama used or that its badge is fixed.
The existing manifest already marked Authorization required/secret; the updated description and README make this explicit.
The safe next step is an owner-controlled, suitably limited test credential after reviewing permissions/cost controls.
Never paste an unrestricted account token into a public manifest or hand it to a directory just to turn a badge green.
No account was created, no credential was supplied to Glama, and no message was sent to Glama.

Sources: [Glama connector/test-profile notice](https://glama.ai/mcp/connectors/io.github.datadmon/iimjobs-jobs-scraper),
[Apify MCP authentication](https://docs.apify.com/platform/integrations/mcp),
[Claude Code MCP config](https://code.claude.com/docs/en/mcp),
[Cursor MCP config](https://cursor.com/docs/context/mcp),
[Gemini MCP config](https://geminicli.com/docs/tools/mcp-server/),
[mcp-remote header documentation](https://github.com/punkpeye/mcp-remote#custom-headers).
