"use client";

import { Card, ProgressBar } from "@heroui/react";
import { Check, Sparkles, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";

export interface AIClassificationResult {
	/** 추천 카테고리 코드 */
	category: string;
	/** 추천 카테고리명 */
	categoryName: string;
	/** 추천 우선순위 코드 */
	priority: string;
	/** 추천 우선순위명 */
	priorityName: string;
	/** 신뢰도 (0-100) */
	confidence: number;
	/** 추천 태그 */
	suggestedTags?: string[];
}

export interface AIClassificationSuggestionProps {
	/** AI 분류 결과 */
	result: AIClassificationResult;
	/** 적용 핸들러 */
	onApply: () => void;
	/** 무시 핸들러 */
	onDismiss: () => void;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

const confidenceColors = {
	high: "success" as const,
	medium: "warning" as const,
	low: "danger" as const,
};

const priorityColors: Record<
	string,
	"danger" | "warning" | "primary" | "default"
> = {
	URGENT: "danger",
	HIGH: "warning",
	NORMAL: "primary",
	LOW: "default",
};

/**
 * AIClassificationSuggestion 컴포넌트
 * AI가 분석한 문의 분류 추천 결과를 표시합니다.
 * 추천 카테고리, 우선순위, 신뢰도를 보여주며 적용/무시 버튼을 제공합니다.
 *
 * @example
 * ```tsx
 * <AIClassificationSuggestion
 *   result={{
 *     category: "DELIVERY",
 *     categoryName: "배송",
 *     priority: "HIGH",
 *     priorityName: "높음",
 *     confidence: 92,
 *     suggestedTags: ["배송", "긴급"],
 *   }}
 *   onApply={handleApply}
 *   onDismiss={handleDismiss}
 * />
 * ```
 */
export const AIClassificationSuggestion = observer(
	({
		result,
		onApply,
		onDismiss,
		isLoading = false,
		className = "",
	}: AIClassificationSuggestionProps) => {
		const confidenceLevel =
			result.confidence >= 80
				? "high"
				: result.confidence >= 50
					? "medium"
					: "low";

		const confidenceColor = confidenceColors[confidenceLevel];

		return (
			<Card
				className={`bg-gradient-to-r from-accent-soft to-default ${className}`}
			>
				<Card.Content className="gap-3 p-4">
					{/* 헤더 */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Sparkles className="size-5 text-accent" />
							<h3 className="text-sm font-semibold text-foreground">
								AI 분류 제안
							</h3>
						</div>
						<Chip size="sm" variant="flat" color={confidenceColor}>
							신뢰도 {result.confidence}%
						</Chip>
					</div>

					{/* 신뢰도 프로그레스 바 */}
					<ProgressBar
						aria-label="AI 신뢰도"
						value={result.confidence}
						color={confidenceColor}
						size="sm"
						className="h-1"
					/>

					{/* 추천 내용 */}
					<div className="flex flex-col gap-2 rounded-lg bg-white/50 p-3">
						<div className="flex items-center gap-2">
							<span className="text-xs text-muted">카테고리:</span>
							<Chip size="sm" variant="flat" color="primary">
								{result.categoryName}
							</Chip>
						</div>

						<div className="flex items-center gap-2">
							<span className="text-xs text-muted">우선순위:</span>
							<Chip
								size="sm"
								variant="flat"
								color={priorityColors[result.priority] || "default"}
							>
								{result.priorityName}
							</Chip>
						</div>

						{result.suggestedTags && result.suggestedTags.length > 0 && (
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted">추천 태그:</span>
								<div className="flex flex-wrap gap-1">
									{result.suggestedTags.map((tag) => (
										<Chip key={tag} size="sm" variant="dot" color="primary">
											{tag}
										</Chip>
									))}
								</div>
							</div>
						)}
					</div>

					{/* 액션 버튼 */}
					<div className="flex justify-end gap-2">
						<Button
							size="sm"
							variant="flat"
							color="default"
							startContent={<X className="size-4" />}
							onPress={onDismiss}
							isDisabled={isLoading}
						>
							무시
						</Button>
						<Button
							size="sm"
							variant="solid"
							color="primary"
							startContent={<Check className="size-4" />}
							onPress={onApply}
							isLoading={isLoading}
						>
							적용
						</Button>
					</div>
				</Card.Content>
			</Card>
		);
	},
);

AIClassificationSuggestion.displayName = "AIClassificationSuggestion";
