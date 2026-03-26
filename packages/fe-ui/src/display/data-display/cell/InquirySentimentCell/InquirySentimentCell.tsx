import { Smile, Meh, Frown } from "lucide-react";

/** 감정 분석값 (Prisma Enum 값과 동일) */
export type SentimentTypeCode = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

interface InquirySentimentCellProps {
	/** 감정 분석값 */
	value?: SentimentTypeCode | null;
	/** 감정 점수 (0.0 ~ 1.0) */
	score?: number | null;
}

/** 감정별 설정 */
const SENTIMENT_CONFIG: Record<
	SentimentTypeCode,
	{
		label: string;
		icon: React.ReactNode;
		color: "success" | "default" | "danger";
	}
> = {
	POSITIVE: {
		label: "긍정",
		icon: <Smile className="h-3.5 w-3.5" />,
		color: "success",
	},
	NEUTRAL: {
		label: "중립",
		icon: <Meh className="h-3.5 w-3.5" />,
		color: "default",
	},
	NEGATIVE: {
		label: "부정",
		icon: <Frown className="h-3.5 w-3.5" />,
		color: "danger",
	},
};

/**
 * 문의 감정 분석 결과를 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <InquirySentimentCell value="POSITIVE" score={0.85} />
 * <InquirySentimentCell value="NEGATIVE" score={0.2} />
 * ```
 */
export const InquirySentimentCell = ({
	value,
	score,
}: InquirySentimentCellProps) => {
	if (!value) {
		return <span className="text-default-400">-</span>;
	}

	const config = SENTIMENT_CONFIG[value];
	const displayScore =
		score !== null && score !== undefined ? Math.round(score * 100) : null;

	return (
		<div className="flex w-full items-center justify-center gap-1.5">
			<span
				className={
					value === "NEGATIVE"
						? "text-danger"
						: value === "POSITIVE"
							? "text-success"
							: "text-default-500"
				}
			>
				{config.icon}
			</span>
			{displayScore !== null && (
				<span className="text-xs text-default-400">{displayScore}%</span>
			)}
		</div>
	);
};
