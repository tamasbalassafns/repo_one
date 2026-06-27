#!/usr/bin/env pwsh
# dev.ps1 — start the calculator backend and frontend together.
#
# Usage (from anywhere):
#   .\dev.ps1          start both servers, each in its own window
#   .\dev.ps1 -Setup   install backend + frontend dependencies first, then start
#
# Backend  -> http://localhost:8000  (FastAPI, auto-reload)
# Frontend -> http://localhost:5173  (Vite dev server)
#
# Each server opens in its own PowerShell window. Close that window
# (or press Ctrl+C in it) to stop the corresponding server.

param(
    [switch]$Setup
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

if (-not (Test-Path $backend) -or -not (Test-Path $frontend)) {
    Write-Error "Could not find backend/ and frontend/ next to dev.ps1 (looked in '$root')."
}

if ($Setup) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    Push-Location $backend; python -m pip install -r requirements.txt; Pop-Location
    Write-Host "Installing frontend dependencies..." -ForegroundColor Green
    Push-Location $frontend; npm install; Pop-Location
}

Write-Host "Starting backend  -> http://localhost:8000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    '-NoExit', '-Command',
    "Set-Location '$backend'; python -m uvicorn app.main:app --reload"
)

Write-Host "Starting frontend -> http://localhost:5173" -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    '-NoExit', '-Command',
    "Set-Location '$frontend'; npm run dev"
)

Write-Host "`nBoth servers are launching in separate windows." -ForegroundColor Yellow
Write-Host "Open http://localhost:5173 in your browser. Close the windows to stop." -ForegroundColor Yellow
