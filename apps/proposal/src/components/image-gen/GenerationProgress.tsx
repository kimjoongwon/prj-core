"use client";

import { Progress } from "@heroui/react";
import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { GenerationStatus } from "@/lib/comfyui";

interface GenerationProgressProps {
	status: GenerationStatus | null;
}

const statusLabels: Record<GenerationStatus["status"], string> = {
	queued: "대기 중...",
	processing: "이미지 생성 중...",
	completed: "완료!",
	error: "오류 발생",
};

export const GenerationProgress = observer(
	({ status }: GenerationProgressProps) => {
		if (!status || status.status === "completed") {
			return null;
		}

		const isError = status.status === "error";
		const progress = status.progress ?? 0;

		return (
			<div className="p-4 rounded-xl bg-content1 border border-divider">
				<div className="flex items-center gap-3 mb-3">
					{!isError && (
						<Loader2 className="w-5 h-5 text-primary animate-spin" />
					)}
					<span
						className={`text-sm font-medium ${isError ? "text-danger" : "text-default-700"}`}
					>
						{statusLabels[status.status]}
					</span>
				</div>

				{!isError && (
					<Progress
						value={progress}
						color="primary"
						size="sm"
						className="mb-2"
						aria-label="생성 진행률"
					/>
				)}

				{isError && status.error && (
					<p className="text-sm text-danger-500 mt-2">{status.error}</p>
				)}

				{status.currentNode && (
					<p className="text-xs text-default-400">
						현재 노드: {status.currentNode}
					</p>
				)}
			</div>
		);
	},
);
