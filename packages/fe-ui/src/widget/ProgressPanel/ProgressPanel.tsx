"use client";

import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { ProgressBar } from "@heroui/react";

export type ProgressStatus = "queued" | "processing" | "completed" | "error";

export interface ProgressState {
	/** 현재 상태 */
	status: ProgressStatus;
	/** 진행률 (0-100) */
	progress?: number;
	/** 에러 메시지 */
	error?: string;
	/** 현재 단계 이름 */
	currentStep?: string;
}

export interface ProgressPanelProps {
	/** 진행 상태 */
	state: ProgressState | null;
	/** 상태별 라벨 */
	statusLabels?: Record<ProgressStatus, string>;
	/** 로딩 아이콘 */
	loadingIcon?: ReactNode;
	/** 완료 시 숨김 여부 */
	hideOnComplete?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

const defaultStatusLabels: Record<ProgressStatus, string> = {
	queued: "대기 중...",
	processing: "처리 중...",
	completed: "완료!",
	error: "오류 발생",
};

/**
 * ProgressPanel 컴포넌트
 * 작업 진행 상황을 프로그레스바와 함께 시각적으로 표시합니다.
 * 대기/처리중/완료/에러 상태를 지원합니다.
 *
 * @example
 * ```tsx
 * <ProgressPanel
 *   state={{
 *     status: "processing",
 *     progress: 45,
 *     currentStep: "이미지 분석 중"
 *   }}
 *   hideOnComplete
 * />
 * ```
 */
export const ProgressPanel = observer(
	({
		state,
		statusLabels = defaultStatusLabels,
		loadingIcon = <Loader2 className="w-5 h-5 text-accent animate-spin" />,
		hideOnComplete = true,
		className = "",
	}: ProgressPanelProps) => {
		if (!state || (hideOnComplete && state.status === "completed")) {
			return null;
		}

		const isError = state.status === "error";
		const progress = state.progress ?? 0;

		return (
			<div
				className={`p-4 rounded-xl bg-surface border border-border ${className}`}
			>
				<div className="flex items-center gap-3 mb-3">
					{!isError && loadingIcon}
					<span
						className={`text-sm font-medium ${isError ? "text-danger" : "text-foreground"}`}
					>
						{statusLabels[state.status]}
					</span>
				</div>

				{!isError && (
						<ProgressBar
							value={progress}
							color="accent"
							size="sm"
						className="mb-2"
						aria-label="진행률"
					/>
				)}

				{isError && state.error && (
					<p className="text-sm text-danger-500 mt-2">{state.error}</p>
				)}

				{state.currentStep && (
					<p className="text-xs text-muted">
						현재 단계: {state.currentStep}
					</p>
				)}
			</div>
		);
	},
);
