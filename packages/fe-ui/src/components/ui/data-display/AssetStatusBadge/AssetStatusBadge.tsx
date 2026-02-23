"use client";

import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";

export type AssetStatus = "UPLOADING" | "READY" | "FAILED";

export interface AssetStatusBadgeProps {
	/** 에셋 상태 */
	status: AssetStatus;
	/** 추가 클래스명 */
	className?: string;
}

const STATUS_CONFIG: Record<
	AssetStatus,
	{ label: string; color: "warning" | "success" | "danger" }
> = {
	UPLOADING: { label: "업로드중", color: "warning" },
	READY: { label: "준비완료", color: "success" },
	FAILED: { label: "실패", color: "danger" },
};

/**
 * 에셋 상태를 표시하는 Badge 컴포넌트
 */
export const AssetStatusBadge = observer(
	({ status, className }: AssetStatusBadgeProps) => {
		const config = STATUS_CONFIG[status];

		return (
			<Chip size="sm" color={config.color} variant="flat" className={className}>
				{config.label}
			</Chip>
		);
	},
);
