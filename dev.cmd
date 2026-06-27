@echo off
REM dev.cmd — double-click this to start the calculator app.
REM It just runs dev.ps1 with the execution policy bypassed.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0dev.ps1" %*
