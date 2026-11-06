param(
    [switch]$UseExistingLogin,
    [switch]$ValidateOnly,
    [string]$Publisher = ""
)
$ErrorActionPreference = 'Stop'
if (-not $Publisher) {
    $workspacePublisher = Join-Path $PSScriptRoot '../../tools/mcp-publisher/mcp-publisher.exe'
    if (Test-Path -LiteralPath $workspacePublisher) { $Publisher = (Resolve-Path -LiteralPath $workspacePublisher).Path }
    else { $Publisher = (Get-Command mcp-publisher -ErrorAction Stop).Source }
}
$targets = @('india-jobs-mcp','india-jobs-feed','naukri-jobs-scraper',
             'iimjobs-jobs-scraper','india-ipo-tracker','uk-gazette-insolvency-notices')
$venvPython = Join-Path $PSScriptRoot '../../tmp/reach-r1r2-venv/Scripts/python.exe'
$Python = if (Test-Path -LiteralPath $venvPython) { (Resolve-Path -LiteralPath $venvPython).Path } else { (Get-Command python).Source }
& $Python (Join-Path $PSScriptRoot 'validate_manifests.py')
if ($LASTEXITCODE -ne 0) { throw 'Manifest validation failed; nothing published.' }
if ($ValidateOnly) { exit 0 }
if (-not $UseExistingLogin) {
    & $Publisher login github
    if ($LASTEXITCODE -ne 0) { throw 'GitHub device login failed. Log in as datadmon.' }
}
foreach ($slug in $targets) {
    $manifest = Join-Path $PSScriptRoot "$slug/server.json"
    $entry = Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json
    $encodedName = [uri]::EscapeDataString($entry.name)
    $url = "https://registry.modelcontextprotocol.io/v0.1/servers/$encodedName/versions/$($entry.version)"
    $existing = $null
    try { $existing = Invoke-RestMethod -Uri $url }
    catch { if ([int]$_.Exception.Response.StatusCode -ne 404) { throw } }
    if ($existing) {
        $actual = $existing.server
        if ($actual.description -ne $entry.description -or $actual.remotes[0].url -ne $entry.remotes[0].url) {
            throw "Version $($entry.version) already exists with different metadata: $slug. Bump version before publishing."
        }
        Write-Output "Already published and verified: $slug $($entry.version)"
        continue
    }
    & $Publisher publish $manifest
    if ($LASTEXITCODE -ne 0) { throw "Publication failed for $slug. Re-run the command to renew device login; completed versions are skipped." }
    $verified = Invoke-RestMethod -Uri $url
    if ($verified.server.version -ne $entry.version -or $verified.server.remotes[0].url -ne $entry.remotes[0].url) {
        throw "Registry verification failed for $slug"
    }
    Write-Output "Published and verified: $slug $($entry.version)"
}
