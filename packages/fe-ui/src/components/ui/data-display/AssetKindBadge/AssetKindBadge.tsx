"use client";

import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";

export type AssetKind = "IMAGE" | "VIDEO" | "DOCUMENT";

export interface AssetKindBadgeProps {
	/** 에셋 종류 */
	kind: AssetKind;
	/** 추가 클래스명 */
	className?: string;
}

const KIND_CONFIG: Record<
	AssetKind,
	{ label: string; color: "primary" | "secondary" | "default" }
> = {
	IMAGE: { label: "이미지", color: "primary" },
	VIDEO: { label: "비디오", color: "secondary" },
	DOCUMENT: { label: "문서", color: "default" },
};

/**
 * 에셋 종류를 표시하는 Badge 컴포넌트
 */
export const AssetKindBadge = observer(
	({ kind, className }: AssetKindBadgeProps) => {
		const config = KIND_CONFIG[kind];

		return (
			<Chip size="sm" color={config.color} variant="flat" className={className}>
				{config.label}
			</Chip>
		);
	},
);
