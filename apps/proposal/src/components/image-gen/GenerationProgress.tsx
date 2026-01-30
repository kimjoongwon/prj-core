"use client";

import type { ProgressState, ProgressStatus } from "@cocrepo/ui";
import { ProgressPanel } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

import type { GenerationStatus } from "@/lib/comfyui";

interface GenerationProgressProps {
	status: GenerationStatus | null;
}

const statusLabels: Record<ProgressStatus, string> = {
	queued: "대기 중...",
	processing: "이미지 생성 중...",
	completed: "완료!",
	error: "오류 발생",
};

/**
 * GenerationStatus를 ProgressState로 변환
 */
function convertToProgressState(
	status: GenerationStatus | null,
): ProgressState | null {
	if (!status) return null;

	return {
		status: status.status,
		progress: status.progress,
		error: status.error,
		currentStep: status.currentNode,
	};
}

/**
 * 이미지 생성 진행률 컴포넌트
 * ComfyUI 생성 상태를 ProgressPanel로 표시
 */
export const GenerationProgress = observer(
	({ status }: GenerationProgressProps) => {
		const progressState = convertToProgressState(status);

		return (
			<ProgressPanel
				state={progressState}
				statusLabels={statusLabels}
				hideOnComplete
			/>
		);
	},
);
