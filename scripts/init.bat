@echo off
title backend-api - DB & Redis Init

echo ============================================
echo   backend-api - Database & Cache Init
echo ============================================
echo.

:: --- PostgreSQL ---
echo [PostgreSQL Setup]
echo -------------------

:: Check psql
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] psql not found. Is PostgreSQL installed and in PATH?
    pause
    exit /b 1
)

:: Show installed version
for /f "tokens=*" %%a in ('psql -U postgres -t -c "SELECT version();" 2^>nul') do set pg_ver=%%a
if defined pg_ver (
    echo [INFO] %pg_ver%
) else (
    echo [WARN] Could not detect PostgreSQL version. Make sure the service is running.
)

:: Run init script
echo.
echo Creating user and database...
psql -U postgres -f "%~dp0init.sql"
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL initialized successfully.
) else (
    echo [ERROR] PostgreSQL init failed. Check your postgres password or run manually:
    echo        psql -U postgres -f scripts/init.sql
)
echo.

:: --- Redis ---
echo [Redis Setup]
echo -------------

where redis-cli >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('redis-cli --version 2^>nul') do set redis_ver=%%a
    if defined redis_ver (
        echo [INFO] %redis_ver%
    )

    redis-cli ping >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Redis is running on localhost:6379.
    ) else (
        echo [WARN] Redis is installed but not running. Start it with:
        echo        redis-server
    )
) else (
    echo [WARN] redis-cli not found. Install Redis or Memurai for Windows.
    echo       Download: https://github.com/tporadowski/redis/releases
)
echo.

echo [DONE] Init complete.
pause
