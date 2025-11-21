# PowerShell script to help connect to PostgreSQL
# Try different methods to connect

Write-Host "=== PostgreSQL Connection Helper ===" -ForegroundColor Cyan
Write-Host ""

# Method 1: Try to find psql
$pgPaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "Found PostgreSQL at: $path" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "PostgreSQL psql.exe not found in common locations." -ForegroundColor Yellow
    Write-Host "Please find it manually or use pgAdmin instead." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Trying to connect with Windows authentication..." -ForegroundColor Cyan
Write-Host "If it asks for password, try:" -ForegroundColor Yellow
Write-Host "  1. Press Enter (empty password)" -ForegroundColor Yellow
Write-Host "  2. Your Windows login password" -ForegroundColor Yellow
Write-Host "  3. Cancel and use pgAdmin instead" -ForegroundColor Yellow
Write-Host ""

# Try to connect
& $psqlPath -U postgres -d postgres

Write-Host ""
Write-Host "If you successfully connected, run this SQL command:" -ForegroundColor Cyan
Write-Host "  ALTER USER postgres WITH PASSWORD 'postgres';" -ForegroundColor Green
Write-Host "  \q" -ForegroundColor Green
Write-Host ""






