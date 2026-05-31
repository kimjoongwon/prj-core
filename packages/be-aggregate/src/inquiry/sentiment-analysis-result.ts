import type { SentimentType } from "@cocrepo/prisma";

export interface SentimentAnalysisResult {
	sentiment: SentimentType;
	score: number;
	confidence: number;
	keywords?: string[];
}
