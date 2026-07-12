@echo off
title backend-api

echo ============================================
echo   backend-api - Setup ^& Run Script (Windows)
echo ============================================
echo.

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please download and install it from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node -v

:: Check for npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)
echo [OK] npm found: 
npm -v
echo.

:: Install dependencies
echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo [OK] Dependencies installed.
echo.

:: Setup .env from example if missing
echo [2/5] Setting up environment variables...
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [OK] Created .env from .env.example.
        echo [INFO] Please edit .env with your database and secrets configuration.
    ) else (
        echo [WARN] No .env.example found. Create a .env file manually.
    )
) else (
    echo [OK] .env already exists.
)
echo.

:: Generate Prisma client
echo [3/5] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Prisma generate failed.
    pause
    exit /b 1
)
echo [OK] Prisma client generated.
echo.

:: Run Prisma migrations
echo [4/5] Running database migrations...
call npx prisma migrate dev
if %errorlevel% neq 0 (
    echo [WARN] Migration failed. Make sure your DATABASE_URL in .env is correct.
    echo       You can run migrations later with: npm run db:migrate
)
echo.

:: Start development server
echo [5/5] Starting development server...
echo.
call npm run dev

pause
