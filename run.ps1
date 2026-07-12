Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  backend-api - Setup & Run Script (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = node -v
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed." -ForegroundColor Red
    Write-Host "Please download and install it from: https://nodejs.org/"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check for npm
try {
    $npmVersion = npm -v
    Write-Host "[OK] npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm is not installed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Install dependencies
Write-Host "[1/5] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Dependencies installed." -ForegroundColor Green
Write-Host ""

# Setup .env from example if missing
Write-Host "[2/5] Setting up environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[OK] Created .env from .env.example." -ForegroundColor Green
        Write-Host "[INFO] Please edit .env with your database and secrets configuration." -ForegroundColor Yellow
    } else {
        Write-Host "[WARN] No .env.example found. Create a .env file manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] .env already exists." -ForegroundColor Green
}
Write-Host ""

# Generate Prisma client
Write-Host "[3/5] Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Prisma generate failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Prisma client generated." -ForegroundColor Green
Write-Host ""

# Run Prisma migrations
Write-Host "[4/5] Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Migration failed. Make sure your DATABASE_URL in .env is correct." -ForegroundColor Yellow
    Write-Host "      You can run migrations later with: npm run db:migrate" -ForegroundColor Yellow
}
Write-Host ""

# Start development server
Write-Host "[5/5] Starting development server..." -ForegroundColor Yellow
Write-Host ""
npm run dev

Read-Host "Press Enter to exit"
