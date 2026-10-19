# UzLeeder — one-command Vercel setup.
#   .\setup-vercel.ps1
# 1) connects a private Vercel Blob store (creates "uzleeder-blob" if none is connected)
# 2) uploads every non-empty key from .env to Vercel (Production + Preview), secrets as Sensitive
# 3) deploys to production
# Needs: vercel CLI logged in (vercel login) and this folder linked (it is: .vercel/project.json).
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Test-Path .env)) { Write-Host "No .env file found." -ForegroundColor Red; exit 1 }

Write-Host "`n[1/3] Blob storage" -ForegroundColor Cyan
$stores = (vercel blob list-stores 2>&1 | Out-String)
if ($stores -match "No blob stores connected") {
  Write-Host "Creating and connecting a private Blob store 'uzleeder-blob'..."
  vercel blob create-store uzleeder-blob --access private --environment production --environment preview --yes
} else { Write-Host "A Blob store is already connected." }

# ADMIN_PASSWORD=auto → create a strong password here, on this computer, and keep it in .env
$envText = Get-Content .env -Raw
if ($envText -match '(?m)^ADMIN_PASSWORD=auto\s*$') {
  $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'.ToCharArray()
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create(); $bytes = New-Object byte[] 16; $rng.GetBytes($bytes)
  $pw = 'Uzl-' + (-join ($bytes | ForEach-Object { $chars[$_ % $chars.Length] })) + '-' + (Get-Random -Minimum 10 -Maximum 99)
  $envText = $envText -replace '(?m)^ADMIN_PASSWORD=auto\s*$', "ADMIN_PASSWORD=$pw"
  [IO.File]::WriteAllText("$PSScriptRoot\.env", $envText, (New-Object Text.UTF8Encoding($false)))
  Write-Host "`n  NEW ADMIN PASSWORD:  $pw" -ForegroundColor Yellow
  Write-Host "  (also saved in .env — write it down somewhere safe)`n" -ForegroundColor Yellow
}

Write-Host "`n[2/3] Environment keys" -ForegroundColor Cyan
$sensitive = "PASSWORD|SECRET|TOKEN"
Get-Content .env | Where-Object { $_ -match '^\s*[A-Z_]+=' } | ForEach-Object {
  $k, $v = $_ -split '=', 2
  $k = $k.Trim(); $v = $v.Trim().Trim('"')
  if (-not $v) { Write-Host "  $k  (empty — kept as it is on Vercel)" -ForegroundColor DarkGray; return }
  foreach ($target in "production", "preview") {
    $flag = if ($k -match $sensitive) { "--sensitive" } else { "--no-sensitive" }
    vercel env add $k $target --value $v --force $flag --yes *> $null
    if ($LASTEXITCODE -ne 0) { Write-Host "  $k -> $target FAILED" -ForegroundColor Red } else { Write-Host "  $k -> $target" -ForegroundColor Green }
  }
}

Write-Host "`n[3/3] Deploy" -ForegroundColor Cyan
vercel deploy --prod --yes
Write-Host "`nDone. Admin: https://uzleeder.vercel.app/admin" -ForegroundColor Green