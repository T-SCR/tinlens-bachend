# TinLens Environment Variables Setup Script
# Run this to add all environment variables to Vercel

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# EXA_API_KEY
Write-Host "`nAdding EXA_API_KEY..." -ForegroundColor Yellow
"3d578d69-7673-412d-92d4-5c350547c615" | vercel env add EXA_API_KEY production

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Write-Host "`nAdding NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY..." -ForegroundColor Yellow
"pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

# CLERK_SECRET_KEY
Write-Host "`nAdding CLERK_SECRET_KEY..." -ForegroundColor Yellow
"sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ" | vercel env add CLERK_SECRET_KEY production

# CONVEX_DEPLOYMENT
Write-Host "`nAdding CONVEX_DEPLOYMENT..." -ForegroundColor Yellow
"dev:elated-wildcat-321" | vercel env add CONVEX_DEPLOYMENT production

# NEXT_PUBLIC_CONVEX_URL
Write-Host "`nAdding NEXT_PUBLIC_CONVEX_URL..." -ForegroundColor Yellow
"https://elated-wildcat-321.convex.cloud" | vercel env add NEXT_PUBLIC_CONVEX_URL production

# FIRECRAWL_API_KEY
Write-Host "`nAdding FIRECRAWL_API_KEY..." -ForegroundColor Yellow
"fc-f5e31858821c4dbcb8d9b8c643ecd528" | vercel env add FIRECRAWL_API_KEY production

Write-Host "`n✅ All environment variables added!" -ForegroundColor Green
Write-Host "Run 'vercel --prod' to deploy to production" -ForegroundColor Cyan
