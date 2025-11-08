export type Language = "en" | "hi";

export interface Translations {
  // Header
  tinlens: string;
  getNews: string;
  signIn: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  urlPlaceholder: string;
  analyzeButton: string;
  analyzing: string;
  tryAgain: string;
  reset: string;
  saveAnalysis: string;
  saving: string;
  saved: string;
  analysisComplete: string;
  showAnalysis: string;
  hideAnalysis: string;

  // Analysis Results
  transcription: string;
  metadata: string;
  title: string;
  description: string;
  creator: string;
  platform: string;
  newsDetection: string;
  hasNewsContent: string;
  confidence: string;
  needsFactCheck: string;
  requiresFactCheck: string;
  contentType: string;
  factCheck: string;
  verdict: string;
  explanation: string;
  sources: string;
  credibleSources: string;

  // Status labels
  verified: string;
  true: string;
  false: string;
  misleading: string;
  unverifiable: string;

  // How it works
  howItWorksTitle: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;

  // CTA Section
  ctaTitle: string;
  ctaDescription: string;
  getStarted: string;
  learnMore: string;

  // How It Works Steps
  inputTikTokLink: string;
  inputTikTokLinkDesc: string;
  audioTranscription: string;
  audioTranscriptionDesc: string;
  newsDetection2: string;
  newsDetectionDesc: string;
  researchFactCheck: string;
  researchFactCheckDesc: string;
  credibilityReport: string;
  credibilityReportDesc: string;
  howItWorksSubtitle: string;

  // Footer
  builtWith: string;
  fightMisinformation: string;

  // Messages
  enterUrl: string;
  analysisStarted: string;
  cannotSave: string;
  alreadySaved: string;
  analysisSaved: string;
  failedToSave: string;

  // Theme toggle
  toggleTheme: string;
  light: string;
  dark: string;
  system: string;

  // Language toggle
  toggleLanguage: string;
  english: string;
  malay: string;
  chinese: string;

  // Additional Hero Section
  aiPoweredFactChecking: string;
  tryExample: string;
  analysisFailed: string;
  overallVerification: string;
  analysis: string;
  showLess: string;
  showMore: string;
  sourcesFound: string;
  verifiedLabel: string;
  yes: string;
  no: string;
  signInToSave: string;
  analyzing2: string;
  transcriptionComplete: string;
  checkingFacts: string;

  // News Page
  trendingOnTinlens: string;
  topCredibleSources: string;
  topMisinformationSources: string;
  viewDetails: string;
  noCredibleSources: string;
  noMisinformationSources: string;

  // Creator Page
  highlyCredible: string;
  moderatelyCredible: string;
  lowCredibility: string;
  credibilityRating: string;
  totalAnalyses: string;
  lastAnalyzed: string;
  analyses: string;
  contentAnalyses: string;
  noAnalysesFound: string;
  untitledVideo: string;
  rating: string;
  view: string;
  communityComments: string;
  shareThoughts: string;
  postComment: string;
  noCommentsYet: string;
  anonymous: string;
  creatorNotFound: string;
  creatorNotFoundMessage: string;

  // Analysis Page
  loadingAnalysis: string;
  pleaseWait: string;
  analysisNotFound: string;
  analysisNotFoundMessage: string;
  backToNews: string;
  backToAllAnalyses: string;
  unknownCreator: string;
  viewOriginalVideo: string;
  viewAuthor: string;
  language: string;
  contentAnalysis: string;
  factCheckResults: string;
  overallVerificationStatus: string;
  verifiedTrue: string;
  needsVerification: string;
  claim: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    tinlens: "TinLens",
    getNews: "Get News",
    signIn: "Sign In",

    // Hero Section
    heroTitle: "Verify Content with TinLens",
    heroSubtitle:
      "Detect and verify misinformation with AI. Paste text, Twitter posts, YouTube links, or upload media to get instant fact-checking with confidence scores and citations.",
    urlPlaceholder: "Enter  URL (e.g., https://vm.tiktok.com/...)",
    analyzeButton: "Analyze Content",
    analyzing: "Analyzing...",
    tryAgain: "Try Again",
    reset: "Reset",
    saveAnalysis: "Save Analysis",
    saving: "Saving...",
    saved: "Saved",
    analysisComplete: "Analysis Complete",
    showAnalysis: "Show Full Analysis",
    hideAnalysis: "Hide Analysis",

    // Analysis Results
    transcription: "Transcription",
    metadata: "Video Metadata",
    title: "Title",
    description: "Description",
    creator: "Creator",
    platform: "Platform",
    newsDetection: "News Detection",
    hasNewsContent: "Has News Content",
    confidence: "Confidence",
    needsFactCheck: "Needs Fact Check",
    requiresFactCheck: "Requires Fact-Check",
    contentType: "Content Type",
    factCheck: "Fact Check",
    verdict: "Verdict",
    explanation: "Explanation",
    sources: "Sources",
    credibleSources: "Credible Sources",

    // Status labels
    verified: "Verified",
    true: "True",
    false: "False",
    misleading: "Misleading",
    unverifiable: "Unverifiable",

    // How it works
    howItWorksTitle: "How It Works",
    step1Title: "Paste URL",
    step1Description: "Simply paste any TikTok video URL into our analyzer.",
    step2Title: "AI Analysis",
    step2Description:
      "Our AI transcribes the content and performs comprehensive fact-checking.",
    step3Title: "Get Results",
    step3Description:
      "Receive detailed credibility assessment with sources and explanations.",

    // CTA Section
    ctaTitle: "Ready to Fight Misinformation?",
    ctaDescription:
      "Join the fight against misinformation. Start fact-checking TikTok content today.",
    getStarted: "Get Started Free",
    learnMore: "Learn More",

    // How It Works Steps
    inputTikTokLink: "Input TikTok Link",
    inputTikTokLinkDesc:
      "Simply paste any TikTok video URL into our secure input field",
    audioTranscription: "Audio Transcription",
    audioTranscriptionDesc:
      "AI-powered transcription extracts and converts speech to text",
    newsDetection2: "News Detection",
    newsDetectionDesc:
      "AI classifies content to identify news and factual claims",
    researchFactCheck: "Research & Fact-Check",
    researchFactCheckDesc:
      "Cross-reference claims with credible sources and databases",
    credibilityReport: "Credibility Report",
    credibilityReportDesc:
      "Get a comprehensive report with sources and verification status",
    howItWorksSubtitle:
      "Our 5-step process ensures comprehensive fact-checking",

    // Footer
    builtWith: "Built with",
    fightMisinformation: "© 2024 TinLens. No possible way to escape. Fighting misinformation with AI.",

    // Messages
    enterUrl: "Please enter a URL to analyze.",
    analysisStarted: "Starting analysis... This may take a moment.",
    cannotSave: "Cannot save analysis - please ensure you're logged in",
    alreadySaved: "Analysis already saved!",
    analysisSaved: "Analysis saved successfully!",
    failedToSave: "Failed to save analysis. Please try again.",

    // Theme toggle
    toggleTheme: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",

    // Language toggle
    toggleLanguage: "Toggle language",
    english: "English",
    malay: "Malay",
    chinese: "Chinese",

    // Additional Hero Section
    aiPoweredFactChecking: "AI-Powered Fact-Checking",
    tryExample: "Try Example",
    analysisFailed: "Analysis failed. Please try again.",
    overallVerification: "Overall Verification",
    analysis: "Analysis",
    showLess: "Show Less",
    showMore: "Show More",
    sourcesFound: "Sources Found",
    verifiedLabel: "Verified",
    yes: "Yes",
    no: "No",
    signInToSave: "Sign in to save analysis",
    analyzing2: "Analyzing...",
    transcriptionComplete: "Transcription complete",
    checkingFacts: "Checking facts...",

    // News Page
    trendingOnTinlens: "Trending on TinLens",
    topCredibleSources: "Top Credible Sources",
    topMisinformationSources: "Top Misinformation Sources",
    viewDetails: "View Details",
    noCredibleSources: "No credible sources found yet",
    noMisinformationSources: "No misinformation sources found yet",

    // Creator Page
    highlyCredible: "Highly Credible",
    moderatelyCredible: "Moderately Credible",
    lowCredibility: "Low Credibility",
    credibilityRating: "Credibility Rating",
    totalAnalyses: "Total Analyses",
    lastAnalyzed: "Last Analyzed",
    analyses: "analyses",
    contentAnalyses: "Content Analyses",
    noAnalysesFound: "No analyses found for this creator yet.",
    untitledVideo: "Untitled Video",
    rating: "Rating",
    view: "View",
    communityComments: "Community Comments",
    shareThoughts: "Share your thoughts about this creator...",
    postComment: "Post Comment",
    noCommentsYet: "No comments yet. Be the first to share your thoughts!",
    anonymous: "Anonymous",
    creatorNotFound: "Creator Not Found",
    creatorNotFoundMessage: "could not be found.",

    // Analysis Page
    loadingAnalysis: "Loading Analysis...",
    pleaseWait: "Please wait while we fetch the details.",
    analysisNotFound: "Analysis Not Found",
    analysisNotFoundMessage:
      "The requested analysis does not exist or could not be loaded.",
    backToNews: "Back to News",
    backToAllAnalyses: "Back to All Analyses",
    unknownCreator: "Unknown Creator",
    viewOriginalVideo: "View Original Video",
    viewAuthor: "View Author",
    language: "Language",
    contentAnalysis: "Content Analysis",
    factCheckResults: "Fact-Check Results",
    overallVerificationStatus: "Overall Verification Status",
    verifiedTrue: "Verified True",
    needsVerification: "Needs Verification",
    claim: "Claim:",
  },

  hi: {
    // Header
    tinlens: "TinLens",
    getNews: "Dapatkan Berita",
    signIn: "Log Masuk",

    // Hero Section
    heroTitle: "Sahkan Kandungan dengan Checkmate",
    heroSubtitle:
      "Tampalkan mana-mana URL TikTok, X (Twitter), blog, atau berita untuk mendapat transkripsi segera, analisis, dan penilaian kredibiliti dikuasakan oleh AI canggih.",
    urlPlaceholder: "Masukkan URL  (cth., https://vm.tiktok.com/...)",
    analyzeButton: "Analisis Kandungan",
    analyzing: "Menganalisis...",
    tryAgain: "Cuba Lagi",
    reset: "Set Semula",
    saveAnalysis: "Simpan Analisis",
    saving: "Menyimpan...",
    saved: "Disimpan",
    analysisComplete: "Analisis Selesai",
    showAnalysis: "Tunjukkan Analisis Penuh",
    hideAnalysis: "Sembunyikan Analisis",

    // Analysis Results
    transcription: "Transkripsi",
    metadata: "Metadata Video",
    title: "Tajuk",
    description: "Keterangan",
    creator: "Pencipta",
    platform: "Platform",
    newsDetection: "Pengesanan Berita",
    hasNewsContent: "Mempunyai Kandungan Berita",
    confidence: "Keyakinan",
    needsFactCheck: "Memerlukan Pemeriksaan Fakta",
    requiresFactCheck: "Perlu Pemeriksaan Fakta",
    contentType: "Jenis Kandungan",
    factCheck: "Pemeriksaan Fakta",
    verdict: "Keputusan",
    explanation: "Penjelasan",
    sources: "Sumber",
    credibleSources: "Sumber Boleh Dipercayai",

    // Status labels
    verified: "Disahkan",
    true: "Benar",
    false: "Palsu",
    misleading: "Mengelirukan",
    unverifiable: "Tidak Boleh Disahkan",

    // How it works
    howItWorksTitle: "Bagaimana Ia Berfungsi",

    // Additional How it works (for compatibility with Translations type)
    step1Title: "Tampal URL",
    step1Description:
      "Hanya tampalkan mana-mana URL video TikTok ke dalam penganalisis kami.",
    step2Title: "Analisis AI",
    step2Description:
      "AI kami mentranskrip kandungan dan melakukan pemeriksaan fakta yang komprehensif.",
    step3Title: "Dapatkan Keputusan",
    step3Description:
      "Terima penilaian kredibiliti terperinci dengan sumber dan penjelasan.",

    // CTA Section
    ctaTitle: "Bersedia untuk Melawan Maklumat Palsu?",
    ctaDescription:
      "Sertai perjuangan melawan maklumat palsu. Mula semak fakta kandungan TikTok hari ini.",
    getStarted: "Mula Percuma",
    learnMore: "Ketahui Lagi",

    // How It Works Steps
    inputTikTokLink: "Masukkan Pautan TikTok",
    inputTikTokLinkDesc:
      "Hanya tampalkan mana-mana URL video TikTok ke dalam medan input selamat kami",
    audioTranscription: "Transkripsi Audio",
    audioTranscriptionDesc:
      "Transkripsi berkuasa AI mengekstrak dan menukar pertuturan kepada teks",
    newsDetection2: "Pengesanan Berita",
    newsDetectionDesc:
      "AI mengklasifikasikan kandungan untuk mengenal pasti berita dan dakwaan fakta",
    researchFactCheck: "Penyelidikan & Pemeriksaan Fakta",
    researchFactCheckDesc:
      "Rujuk silang dakwaan dengan sumber dan pangkalan data yang boleh dipercayai",
    credibilityReport: "Laporan Kredibiliti",
    credibilityReportDesc:
      "Dapatkan laporan komprehensif dengan sumber dan status pengesahan",
    howItWorksSubtitle:
      "Proses 5 langkah kami memastikan pemeriksaan fakta yang komprehensif",

    // Footer
    builtWith: "Dibina dengan",
    fightMisinformation: "© 2024 TinLens. Melawan maklumat palsu dengan AI.",

    // Messages
    enterUrl: "Sila masukkan URL untuk dianalisis.",
    analysisStarted:
      "Memulakan analisis... Ini mungkin mengambil sedikit masa.",
    cannotSave:
      "Tidak dapat menyimpan analisis - sila pastikan anda sudah log masuk",
    alreadySaved: "Analisis sudah disimpan!",
    analysisSaved: "Analisis berjaya disimpan!",
    failedToSave: "Gagal menyimpan analisis. Sila cuba lagi.",

    // Theme toggle
    toggleTheme: "Tukar tema",
    light: "Terang",
    dark: "Gelap",
    system: "Sistem",

    // Language toggle
    toggleLanguage: "Tukar bahasa",
    english: "Bahasa Inggeris",
    malay: "Bahasa Melayu",
    chinese: "Bahasa Cina",

    // Additional Hero Section (for compatibility with Translations type)
    aiPoweredFactChecking: "Pemeriksaan Fakta Berkuasa AI",
    tryExample: "Cuba Contoh",
    analysisFailed: "Analisis gagal. Sila cuba lagi.",
    overallVerification: "Pengesahan Keseluruhan",
    analysis: "Analisis",
    showLess: "Tunjuk Kurang",
    showMore: "Tunjuk Lagi",
    sourcesFound: "Sumber Ditemui",
    verifiedLabel: "Disahkan",
    yes: "Ya",
    no: "Tidak",
    signInToSave: "Log masuk untuk simpan analisis",
    analyzing2: "Menganalisis...",
    transcriptionComplete: "Transkripsi selesai",
    checkingFacts: "तथ्यों की जाँच हो रही है...",

    // News Page
    trendingOnTinlens: "TinLens पर ट्रेंडिंग",
    topCredibleSources: "Sumber Paling Boleh Dipercayai",
    topMisinformationSources: "Sumber Maklumat Palsu Tertinggi",
    viewDetails: "Lihat Butiran",
    noCredibleSources: "Tiada sumber boleh dipercayai ditemui lagi",
    noMisinformationSources: "Tiada sumber maklumat palsu ditemui lagi",

    // Creator Page
    highlyCredible: "Sangat Boleh Dipercayai",
    moderatelyCredible: "Sederhana Boleh Dipercayai",
    lowCredibility: "Kredibiliti Rendah",
    credibilityRating: "Penilaian Kredibiliti",
    totalAnalyses: "Jumlah Analisis",
    lastAnalyzed: "Terakhir Dianalisis",
    analyses: "analisis",
    contentAnalyses: "Analisis Kandungan",
    noAnalysesFound: "Tiada analisis ditemui untuk pencipta ini lagi.",
    untitledVideo: "Video Tanpa Tajuk",
    rating: "Penilaian",
    view: "Lihat",
    communityComments: "Komen Komuniti",
    shareThoughts: "Kongsikan pemikiran anda tentang pencipta ini...",
    postComment: "Hantar Komen",
    noCommentsYet:
      "Tiada komen lagi. Jadilah yang pertama untuk berkongsi pemikiran!",
    anonymous: "Tanpa Nama",
    creatorNotFound: "Pencipta Tidak Ditemui",
    creatorNotFoundMessage: "tidak dapat ditemui.",

    // Analysis Page
    loadingAnalysis: "Memuatkan Analisis...",
    pleaseWait: "Sila tunggu sementara kami mengambil butiran.",
    analysisNotFound: "Analisis Tidak Ditemui",
    analysisNotFoundMessage:
      "Analisis yang diminta tidak wujud atau tidak dapat dimuatkan.",
    backToNews: "Kembali ke Berita",
    backToAllAnalyses: "Kembali ke Semua Analisis",
    unknownCreator: "Pencipta Tidak Diketahui",
    viewOriginalVideo: "Lihat Video Asal",
    viewAuthor: "Lihat Pencipta",
    language: "Bahasa",
    contentAnalysis: "Analisis Kandungan",
    factCheckResults: "Keputusan Pemeriksaan Fakta",
    overallVerificationStatus: "Status Pengesahan Keseluruhan",
    verifiedTrue: "Disahkan Benar",
    needsVerification: "Perlu Pengesahan",
    claim: "दावा:",
  },
};
