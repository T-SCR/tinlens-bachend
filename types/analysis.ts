export type FactCheckStatus =
  | "verified"
  | "false"
  | "misleading"
  | "unverifiable"
  | "needs_verification";

export interface FactCheckSource {
  title: string;
  url: string;
  source?: string;
  relevance?: number;
  description?: string;
}

export interface FactCheckResult {
  claim: string;
  status: FactCheckStatus;
  confidence: number;
  analysis?: string;
  sources?: FactCheckSource[];
  error?: string;
  flags?: string[];
}

export interface FactCheckSummary {
  verifiedTrue: number;
  verifiedFalse: number;
  misleading: number;
  unverifiable: number;
  needsVerification: number;
}

export interface FactCheckData {
  verdict?: string;
  confidence?: number;
  explanation?: string;
  content?: string;
  isVerified?: boolean;
  totalClaims: number;
  checkedClaims: number;
  results: FactCheckResult[];
  summary: FactCheckSummary;
  sources?: FactCheckSource[];
  error?: string;
  flags?: string[];
}

export interface NewsDetection {
  hasNewsContent: boolean;
  confidence: number; // 0-1 probability
  newsKeywordsFound: string[];
  potentialClaims: string[];
  needsFactCheck: boolean;
  contentType: string;
}

export interface TranscriptionSegmentData {
  text: string;
  startSecond: number;
  endSecond: number;
}

export interface TranscriptionData {
  text: string;
  segments: TranscriptionSegmentData[];
  language?: string;
}

export interface PlatformStats {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  plays?: number;
}

export interface ContentMetadata {
  title: string;
  description: string;
  creator: string;
  originalUrl: string;
  platform?: string;
  contentType?: string;
  thumbnailUrl?: string;
  creatorHandle?: string;
  publishedAt?: string;
  durationSeconds?: number;
  hashtags?: string[];
  stats?: PlatformStats;
}

export interface ContentAnalysisData {
  transcription: TranscriptionData;
  metadata: ContentMetadata;
  newsDetection: NewsDetection | null;
  factCheck: FactCheckData | null;
  requiresFactCheck: boolean;
  creatorCredibilityRating?: number | null;
}
