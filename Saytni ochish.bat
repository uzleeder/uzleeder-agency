@echo off
chcp 65001 >nul
title UzLeeder - local server (8080)
cd /d "%~dp0"
echo.
echo  ============================================
echo   UzLeeder: sayt + admin + API — bitta server
echo   Sayt:  http://localhost:8080
echo   Admin: http://localhost:8080/admin
echo.
echo   Yopish uchun shu oynani yoping.
echo  ============================================
echo.
start "" "http://localhost:8080"
node server\local-dev.cjs
pause