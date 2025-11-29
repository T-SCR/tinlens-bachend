import { ContentAnalysisData } from "@/types/analysis";

// Realistic mock scenarios based on actual misinformation patterns
const MOCK_SCENARIOS = [
  {
    id: "operation_sindoor",
    title: "Operation Sindoor - Viral Video Claims",
    creator: "@DefenseWatch_IN",
    description: "Video claims to show live footage of Indian Air Force strikes during Operation Sindoor. The clip has gone viral with 2.3M views.",
    transcription: `Breaking: Exclusive footage of Operation Sindoor strikes on terrorist camps in Pakistan-occupied Kashmir.

This video allegedly shows Indian Air Force jets conducting precision strikes on 9 terror targets. The poster claims this is "live footage" from May 7, 2025.

Key claims in this video:
• "Live footage of Mirage 2000 jets striking Muridke"
• "All 9 targets destroyed with zero collateral damage"
• "Pakistani air defense failed to respond"

WARNING: This video has been flagged for potential manipulation. The footage appears to be from a 2019 military exercise, not the actual Operation Sindoor strikes. Official government sources have not released any operational footage.

PIB Fact Check has debunked similar viral content. Always verify with official MOD sources.`,
    verdict: "misleading" as const,
    confidence: 92,
    factCheckContent: `**Fact-Check Analysis: Operation Sindoor Video Claims**

This viral video claiming to show "live footage" of Operation Sindoor has been **DEBUNKED**.

**Verification Findings:**
• **Video Origin:** Reverse image search traces this footage to a 2019 IAF training exercise at Pokhran range
• **Audio Analysis:** Audio appears to be spliced from multiple sources
• **Official Sources:** Ministry of Defence has NOT released any operational footage
• **PIB Alert:** Press Information Bureau issued warning about fake Op Sindoor videos

**Sources Consulted:**
• PIB Fact Check (@PIBFactCheck)
• Alt News Investigation
• India Today Fact Check
• AFP Fact Check South Asia

**Verdict: MISLEADING**
The video uses recycled military footage to make false claims about a current operation. This is a common disinformation tactic during security operations.`,
    sources: [
      { title: "PIB Fact Check", url: "https://pib.gov.in/factcheck", source: "pib.gov.in", relevance: 98 },
      { title: "Alt News", url: "https://www.altnews.in", source: "altnews.in", relevance: 95 },
      { title: "AFP Fact Check", url: "https://factcheck.afp.com", source: "factcheck.afp.com", relevance: 92 },
    ],
    claims: [
      { claim: "Video shows live Operation Sindoor footage", status: "false" as const, confidence: 96 },
      { claim: "Footage is from 2019 training exercise", status: "verified" as const, confidence: 94 },
      { claim: "Government has released no official footage", status: "verified" as const, confidence: 98 },
    ],
    summary: { verifiedTrue: 2, verifiedFalse: 1, misleading: 0, unverifiable: 0, needsVerification: 0 },
    credibility: 2.1,
  },
  {
    id: "health_misinfo",
    title: "Viral Health Cure Claims",
    creator: "@NaturalCures_Daily",
    description: "Video claims drinking warm lemon water with turmeric cures diabetes in 7 days. Has 890K views and thousands of shares.",
    transcription: `Doctor reveals: The pharmaceutical industry doesn't want you to know this simple cure!

Just drink warm lemon water with turmeric every morning for 7 days. Your diabetes will be completely reversed. No more insulin needed!

Key claims:
• "100% natural diabetes cure"
• "Proven by ancient Ayurvedic texts"
• "Big Pharma is hiding this from you"
• "Works in just 7 days"

This video promotes dangerous medical misinformation. Diabetes is a chronic condition requiring proper medical management. Stopping prescribed medication can lead to life-threatening complications.

Consult your doctor before making any changes to your diabetes treatment.`,
    verdict: "false" as const,
    confidence: 98,
    factCheckContent: `**Fact-Check Analysis: Diabetes "Cure" Claims**

This viral video promoting a "natural diabetes cure" is **FALSE AND DANGEROUS**.

**Medical Facts:**
• **No cure exists:** Type 1 and Type 2 diabetes cannot be "cured" by any food or drink
• **Stopping medication is dangerous:** Can cause diabetic ketoacidosis (DKA), a life-threatening condition
• **Turmeric benefits overstated:** While turmeric has anti-inflammatory properties, it cannot replace diabetes medication

**Expert Verification:**
• Indian Medical Association: "Such claims are dangerous quackery"
• WHO: Diabetes requires ongoing medical management
• ICMR: No evidence supports these cure claims

**Harm Potential: HIGH**
Following this advice could lead to hospitalization or death. Several patients have been harmed by similar viral health misinformation.

**Verdict: FALSE - DANGEROUS HEALTH MISINFORMATION**`,
    sources: [
      { title: "WHO Diabetes Guidelines", url: "https://www.who.int/diabetes", source: "who.int", relevance: 99 },
      { title: "ICMR Health Portal", url: "https://icmr.nic.in", source: "icmr.nic.in", relevance: 96 },
      { title: "Indian Medical Association", url: "https://ima-india.org", source: "ima-india.org", relevance: 94 },
    ],
    claims: [
      { claim: "Lemon-turmeric water cures diabetes", status: "false" as const, confidence: 99 },
      { claim: "You can stop insulin after 7 days", status: "false" as const, confidence: 99 },
      { claim: "Big Pharma is hiding natural cures", status: "false" as const, confidence: 95 },
    ],
    summary: { verifiedTrue: 0, verifiedFalse: 3, misleading: 0, unverifiable: 0, needsVerification: 0 },
    credibility: 1.2,
  },
  {
    id: "political_misquote",
    title: "Politician Misquote Going Viral",
    creator: "@PoliticalUpdates24",
    description: "Clip claims PM made controversial statement about farmers. The 15-second clip has been shared 500K times.",
    transcription: `Breaking: PM's shocking statement about farmers caught on camera!

"Farmers are the biggest problem for India's economy..."

This clip is being shared with claims that the PM made anti-farmer remarks.

CONTEXT CHECK: This 15-second clip has been edited from a 45-minute speech. The full quote reads:
"Farmers' issues are the biggest problem for India's economy to solve. We must prioritize their welfare above all else."

The clip was deliberately cut to reverse the meaning of the statement.

This is a classic example of "clipping" - taking a small portion of a longer statement out of context to misrepresent the speaker's views.`,
    verdict: "misleading" as const,
    confidence: 94,
    factCheckContent: `**Fact-Check Analysis: PM Quote Clip**

This viral clip is **MISLEADING due to deliberate editing**.

**Investigation:**
• **Original Speech:** 45-minute address on agricultural policy (Jan 15, 2025)
• **Viral Clip:** 15-second excerpt cut mid-sentence
• **Full Quote:** "Farmers' issues are the biggest problem for India's economy to solve. We must prioritize their welfare above all else."
• **Edited Version:** Cuts off at "...biggest problem for India's economy" removing crucial context

**Editing Analysis:**
• Audio shows clear cut point at 14.3 seconds
• Original video available on official PMO YouTube channel
• Clip creator has history of sharing manipulated content

**Verdict: MISLEADING - DECEPTIVE EDITING**
The clip reverses the actual meaning through selective editing.`,
    sources: [
      { title: "PMO Official YouTube", url: "https://youtube.com/pikiHd-1?si=WUh5Mg4UM", source: "youtube.com", relevance: 99 },
      { title: "Factly.in", url: "https://factly.in", source: "factly.in", relevance: 93 },
      { title: "Boom Live", url: "https://boomlive.in", source: "boomlive.in", relevance: 91 },
    ],
    claims: [
      { claim: "Clip shows PM's actual statement", status: "misleading" as const, confidence: 96 },
      { claim: "Quote was edited out of context", status: "verified" as const, confidence: 98 },
      { claim: "Full speech contradicts viral interpretation", status: "verified" as const, confidence: 97 },
    ],
    summary: { verifiedTrue: 2, verifiedFalse: 0, misleading: 1, unverifiable: 0, needsVerification: 0 },
    credibility: 3.5,
  },
  {
    id: "financial_scam",
    title: "Crypto Investment Scam Alert",
    creator: "@CryptoGains_Official",
    description: "Video promises 500% returns on new cryptocurrency. Uses fake celebrity endorsements and urgency tactics.",
    transcription: `🚀 URGENT: Elon Musk just announced a new cryptocurrency! 

Get in NOW before it explodes! I turned ₹10,000 into ₹5 lakhs in just 3 days!

Elon personally endorsed this project on Twitter. Limited spots available - only first 1000 investors get the special rate.

Click the link in bio NOW! Use code MOON500 for bonus tokens.

This is NOT financial advice (wink emoji)

Features of this scam:
• Fake celebrity endorsement
• Unrealistic return promises
• Artificial urgency ("limited spots")
• Unregistered investment scheme
• "Not financial advice" disclaimer to avoid liability`,
    verdict: "false" as const,
    confidence: 99,
    factCheckContent: `**Fact-Check Analysis: Crypto Scam Alert**

This video is a **FINANCIAL SCAM**. Do NOT invest.

**Red Flags Identified:**
• **Fake Celebrity Endorsement:** Elon Musk has NOT endorsed any new cryptocurrency
• **Unrealistic Returns:** 500% in 3 days is mathematically impossible for legitimate investments
• **Urgency Tactics:** "Limited spots" is a classic scam pressure technique
• **Unregistered Scheme:** Not registered with SEBI or any financial regulator

**Verification:**
• Elon Musk's Twitter: No such endorsement exists
• SEBI Investor Alert List: Similar scheme flagged
• Cyber Crime Portal: 200+ complaints about this creator

**Potential Loss:** Victims typically lose 100% of invested amount

**Report to:**
• Cyber Crime Portal: cybercrime.gov.in
• SEBI SCORES: scores.gov.in
• RBI Sachet: sachet.rbi.org.in

**Verdict: SCAM - REPORT IMMEDIATELY**`,
    sources: [
      { title: "SEBI Investor Alerts", url: "https://www.sebi.gov.in", source: "sebi.gov.in", relevance: 99 },
      { title: "Cyber Crime Portal", url: "https://cybercrime.gov.in", source: "cybercrime.gov.in", relevance: 97 },
      { title: "RBI Sachet", url: "https://sachet.rbi.org.in", source: "sachet.rbi.org.in", relevance: 95 },
    ],
    claims: [
      { claim: "Elon Musk endorsed this cryptocurrency", status: "false" as const, confidence: 100 },
      { claim: "500% returns are possible", status: "false" as const, confidence: 100 },
      { claim: "This is a registered investment", status: "false" as const, confidence: 99 },
    ],
    summary: { verifiedTrue: 0, verifiedFalse: 3, misleading: 0, unverifiable: 0, needsVerification: 0 },
    credibility: 0.5,
  },
  {
    id: "verified_news",
    title: "Breaking News Verification",
    creator: "@Reuters",
    description: "Reuters reports on major international development. Official news agency coverage with multiple source verification.",
    transcription: `BREAKING: International Climate Summit reaches historic agreement.

195 nations have signed the Global Carbon Reduction Accord in Geneva today.

Key provisions:
• 50% emission reduction by 2035
• $100 billion annual climate fund for developing nations
• Binding enforcement mechanisms
• Technology transfer agreements

This report is based on:
• Official UN press release
• On-ground Reuters correspondents in Geneva
• Statements from multiple world leaders
• Document review of the signed accord

This is verified reporting from Reuters News Agency, a wire service with 170+ years of editorial standards.`,
    verdict: "verified" as const,
    confidence: 96,
    factCheckContent: `**Fact-Check Analysis: Climate Summit Report**

This news report is **VERIFIED** as accurate journalism.

**Verification Process:**
• **Primary Source:** Official UN press release confirms agreement
• **Multiple Correspondents:** Reuters has journalists present in Geneva
• **Document Verification:** Full accord text available on UN website
• **Cross-Reference:** Confirmed by AP, AFP, and other wire services

**Source Credibility:**
• Reuters: 170+ years of verified journalism
• Editorial standards: Multiple editor review process
• Corrections policy: Transparent error correction

**Quality Indicators:**
✓ Named sources
✓ Official documentation
✓ On-ground reporting
✓ Multiple independent confirmations

**Verdict: VERIFIED - RELIABLE NEWS SOURCE**`,
    sources: [
      { title: "United Nations Official", url: "https://news.un.org", source: "news.un.org", relevance: 99 },
      { title: "Reuters", url: "https://www.reuters.com", source: "reuters.com", relevance: 98 },
      { title: "Associated Press", url: "https://apnews.com", source: "apnews.com", relevance: 97 },
    ],
    claims: [
      { claim: "195 nations signed the agreement", status: "verified" as const, confidence: 98 },
      { claim: "50% emission reduction target set", status: "verified" as const, confidence: 97 },
      { claim: "Agreement includes binding mechanisms", status: "verified" as const, confidence: 95 },
    ],
    summary: { verifiedTrue: 3, verifiedFalse: 0, misleading: 0, unverifiable: 0, needsVerification: 0 },
    credibility: 9.8,
  },
];

// Track which scenario was shown last to rotate
let lastScenarioIndex = -1;

/**
 * Detects platform from URL
 */
function detectPlatform(url: string): string {
  if (url.includes("tiktok.com")) return "TikTok";
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter/X";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("facebook.com")) return "Facebook";
  return "Web";
}

/**
 * Gets next scenario in rotation (cycles through all scenarios)
 */
function getNextScenario() {
  lastScenarioIndex = (lastScenarioIndex + 1) % MOCK_SCENARIOS.length;
  return MOCK_SCENARIOS[lastScenarioIndex];
}

export function buildMockAnalysis(originalUrl: string): ContentAnalysisData {
  const safeUrl =
    originalUrl && originalUrl.startsWith("http")
      ? originalUrl
      : "https://x.com/example/status/123456789";

  const platform = detectPlatform(safeUrl);
  
  // Get rotating scenario
  const scenario = getNextScenario();

  return {
    transcription: {
      text: scenario.transcription,
      segments: [
        {
          text: `Analysis of content: ${scenario.title}`,
          startSecond: 0,
          endSecond: 15,
        },
        {
          text: "Key claims identified and verified against trusted sources.",
          startSecond: 16,
          endSecond: 45,
        },
        {
          text: "Cross-referencing complete. Results generated.",
          startSecond: 46,
          endSecond: 75,
        },
      ],
      language: "en",
    },
    metadata: {
      title: scenario.title,
      description: scenario.description,
      creator: scenario.creator,
      originalUrl: safeUrl,
      platform: platform.toLowerCase(),
      contentType: "Video Content",
    },
    newsDetection: {
      hasNewsContent: true,
      confidence: scenario.confidence / 100,
      newsKeywordsFound: ["breaking", "viral", "fact-check", "verified", "trending"],
      potentialClaims: scenario.claims.map((c) => c.claim),
      needsFactCheck: scenario.verdict !== "verified",
      contentType: "News/Factual",
    },
    factCheck: {
      verdict: scenario.verdict,
      confidence: scenario.confidence,
      explanation: `TinLens Analysis: ${scenario.description}`,
      content: scenario.factCheckContent,
      isVerified: scenario.verdict === "verified",
      totalClaims: scenario.claims.length,
      checkedClaims: scenario.claims.length,
      results: scenario.claims.map((claim) => ({
        claim: claim.claim,
        status: claim.status,
        confidence: claim.confidence,
        analysis: `Verification result for: "${claim.claim}"`,
        sources: scenario.sources.slice(0, 2),
        flags: ["demo_mode"],
      })),
      summary: scenario.summary,
      sources: scenario.sources,
      error: undefined,
      flags: ["mock_demo", scenario.id],
    },
    requiresFactCheck: scenario.verdict !== "verified",
    creatorCredibilityRating: scenario.credibility,
  };
}

/**
 * Get scenario name for display
 */
export function getCurrentScenarioName(): string {
  if (lastScenarioIndex < 0) return "Demo";
  return MOCK_SCENARIOS[lastScenarioIndex].title;
}
