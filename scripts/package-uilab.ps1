$repoRoot = Split-Path -Parent $PSScriptRoot
$distRoot = Join-Path $repoRoot 'dist'
$stagingRoot = Join-Path $repoRoot 'artifacts\uilab-zip-root'
$zipPath = Join-Path $repoRoot 'artifacts\HouseToDo-Mockup-uilab-v1.zip'

node (Join-Path $PSScriptRoot 'build-uilab-package.mjs')
New-Item -ItemType Directory -Path (Join-Path $stagingRoot 'dist') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $distRoot 'index.html') -Destination (Join-Path $stagingRoot 'dist\index.html') -Force
Copy-Item -LiteralPath (Join-Path $distRoot '.uilab') -Destination $stagingRoot -Recurse -Force
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
Compress-Archive -Path (Join-Path $stagingRoot 'dist'), (Join-Path $stagingRoot '.uilab') -DestinationPath $zipPath -CompressionLevel Optimal
Write-Output "Created $zipPath"
