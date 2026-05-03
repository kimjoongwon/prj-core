"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type { SentimentTypeCode } from "../../../cell/InquirySentimentCell/InquirySentimentCell";
import { useT } from "../../../i18n";

export const sentimentBadgeVariants = cva(
	"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
	{
		variants: {
			sentiment: {
				POSITIVE:
					"bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
				NEUTRAL:
					"bg-default-100 text-default-700 dark:bg-default-900/30 dark:text-default-400",
				NEGATIVE:
					"bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400",
			},
		},
		defaultVariants: {
			sentiment: "NEUTRAL",
		},
	},
);

export type SentimentBadgeProps = VariantProps<
	typeof sentimentBadgeVariants
> & {
	/** 감정 타입 */
	sentiment: SentimentTypeCode;
	/** 감정 점수 (0.0 ~ 1.0) */
	score?: number;
	/** 신뢰도 (0 ~ 100%) */
	confidence?: number;
	/** 추가 클래스명 */
	className?: string;
};

const SENTIMENT_EMOJI: Record<SentimentTypeCode, ReactNode> = {
	POSITIVE: (
		<span role="img" aria-label="긍정">
			&#128522;
		</span>
	), // 😊
	NEUTRAL: (
		<span role="img" aria-label="중립">
			&#128528;
		</span>
	), // 😐
	NEGATIVE: (
		<span role="img" aria-label="부정">
			&#128544;
		</span>
	), // 😠
};

const SENTIMENT_LABEL: Record<SentimentTypeCode, string> = {
	POSITIVE: "긍정",
	NEUTRAL: "중립",
	NEGATIVE: "부정",
};

/**
 * 감정 분석 결과를 표시하는 배지 컴포넌트
 *
 * @example
 * ```tsx
 * <SentimentBadge sentiment="POSITIVE" score={0.85} confidence={92} />
 * <SentimentBadge sentiment="NEGATIVE" />
 * ```
 */
export const SentimentBadge = observer(function SentimentBadge({
	sentiment,
	score: _score,
	confidence,
	className,
}: SentimentBadgeProps) {
	const t = useT();
	const emoji = SENTIMENT_EMOJI[sentiment] ?? SENTIMENT_EMOJI.NEUTRAL;
	const label = SENTIMENT_LABEL[sentiment] ?? sentiment;

	return (
		<span className={sentimentBadgeVariants({ sentiment, className })}>
			{emoji}
			<span>{t(label)}</span>
			{confidence !== undefined && (
				<span className="opacity-70">
					({t("신뢰도")} {confidence}%)
				</span>
			)}
		</span>
	);
});
