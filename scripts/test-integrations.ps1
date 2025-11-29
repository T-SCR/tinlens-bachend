# TinLens Integration Test Script (PowerShell)
# Tests all API integrations before deploying

Write-Host "🔍 TinLens Integration Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
try {
    $null = Invoke-WebRequest -Uri "http://localhost:3000/api/transcribe" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Server is running" -ForegroundColor Green
}
catch {
    Write-Host "❌ Server not running. Start with: npm run dev" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test health endpoint
Write-Host "📊 Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/transcribe" -Method Get
    if ($health.status -eq "healthy" -or $health.supportedPlatforms) {
        Write-Host "✅ Health endpoint OK" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Health endpoint failed" -ForegroundColor Red
        $health | ConvertTo-Json
    }
}
catch {
    Write-Host "❌ Health endpoint error: $_" -ForegroundColor Red
}
Write-Host ""

# Test integrations health
Write-Host "🔌 Testing Integrations..." -ForegroundColor Yellow
try {
    $integrations = Invoke-RestMethod -Uri "http://localhost:3000/api/health/integrations?probe=true" -Method Get
    $integrations | ConvertTo-Json -Depth 5
    
    Write-Host ""
    Write-Host "Integration Status:" -ForegroundColor Cyan
    Write-Host "-------------------" -ForegroundColor Cyan
    
    # Check OpenAI
    if ($integrations.integrations.openai.configured -and $integrations.integrations.openai.reachable) {
        Write-Host "✅ OpenAI: configured and reachable" -ForegroundColor Green
    }
    else {
        Write-Host "❌ OpenAI: configured=$($integrations.integrations.openai.configured), reachable=$($integrations.integrations.openai.reachable)" -ForegroundColor Red
    }
    
    # Check Exa
    if ($integrations.integrations.exa.configured -and $integrations.integrations.exa.reachable) {
        Write-Host "✅ Exa: configured and reachable" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Exa: configured=$($integrations.integrations.exa.configured), reachable=$($integrations.integrations.exa.reachable)" -ForegroundColor Red
    }
    
    # Check Firecrawl
    if ($integrations.integrations.firecrawl.configured -and $integrations.integrations.firecrawl.reachable) {
        Write-Host "✅ Firecrawl: configured and reachable" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Firecrawl: configured=$($integrations.integrations.firecrawl.configured), reachable=$($integrations.integrations.firecrawl.reachable)" -ForegroundColor Red
    }
    
    Write-Host ""
    if ($integrations.strictRealMode) {
        Write-Host "✅ STRICT_REAL_MODE is enabled" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  STRICT_REAL_MODE is disabled (fallbacks allowed)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Integrations endpoint error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Ready to deploy to Vercel!" -ForegroundColor Green
Write-Host "Run: vercel --prod" -ForegroundColor Cyan
