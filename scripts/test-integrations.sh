#!/bin/bash

# TinLens Integration Test Script
# Tests all API integrations before deploying

echo "🔍 TinLens Integration Test"
echo "================================"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/api/transcribe > /dev/null; then
    echo "❌ Server not running. Start with: npm run dev"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Test health endpoint
echo "📊 Testing Health Endpoint..."
HEALTH=$(curl -s http://localhost:3000/api/transcribe)
if echo "$HEALTH" | grep -q "healthy"; then
    echo "✅ Health endpoint OK"
else
    echo "❌ Health endpoint failed"
    echo "$HEALTH"
fi
echo ""

# Test integrations health
echo "🔌 Testing Integrations..."
INTEGRATIONS=$(curl -s "http://localhost:3000/api/health/integrations?probe=true")
echo "$INTEGRATIONS" | jq .

# Check each integration
OPENAI_CONFIGURED=$(echo "$INTEGRATIONS" | jq -r '.integrations.openai.configured')
OPENAI_REACHABLE=$(echo "$INTEGRATIONS" | jq -r '.integrations.openai.reachable')
EXA_CONFIGURED=$(echo "$INTEGRATIONS" | jq -r '.integrations.exa.configured')
EXA_REACHABLE=$(echo "$INTEGRATIONS" | jq -r '.integrations.exa.reachable')
FIRECRAWL_CONFIGURED=$(echo "$INTEGRATIONS" | jq -r '.integrations.firecrawl.configured')
FIRECRAWL_REACHABLE=$(echo "$INTEGRATIONS" | jq -r '.integrations.firecrawl.reachable')

echo ""
echo "Integration Status:"
echo "-------------------"

if [ "$OPENAI_CONFIGURED" = "true" ] && [ "$OPENAI_REACHABLE" = "true" ]; then
    echo "✅ OpenAI: configured and reachable"
else
    echo "❌ OpenAI: configured=$OPENAI_CONFIGURED, reachable=$OPENAI_REACHABLE"
fi

if [ "$EXA_CONFIGURED" = "true" ] && [ "$EXA_REACHABLE" = "true" ]; then
    echo "✅ Exa: configured and reachable"
else
    echo "❌ Exa: configured=$EXA_CONFIGURED, reachable=$EXA_REACHABLE"
fi

if [ "$FIRECRAWL_CONFIGURED" = "true" ] && [ "$FIRECRAWL_REACHABLE" = "true" ]; then
    echo "✅ Firecrawl: configured and reachable"
else
    echo "❌ Firecrawl: configured=$FIRECRAWL_CONFIGURED, reachable=$FIRECRAWL_REACHABLE"
fi

echo ""
STRICT=$(echo "$INTEGRATIONS" | jq -r '.strictRealMode')
if [ "$STRICT" = "true" ]; then
    echo "✅ STRICT_REAL_MODE is enabled"
else
    echo "⚠️  STRICT_REAL_MODE is disabled (fallbacks allowed)"
fi

echo ""
echo "================================"
echo "Ready to deploy to Vercel!"
echo "Run: vercel --prod"
