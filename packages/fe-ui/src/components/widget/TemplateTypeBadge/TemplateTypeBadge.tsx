"use client";

import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";

type TemplateType = "EMAIL" | "SMS" | "PUSH";

export interface TemplateTypeBadgeProps {
	/** 템플릿 유형 */
	type: TemplateType;
	/** Badge 크기 */
	size?: "sm" | "md" | "lg";
}

const TYPE_CONFIG: Record<
	TemplateType,
	{ label: string; color: "primary" | "secondary" | "warning" }
> = {
	EMAIL: { label: "이메일", color: "primary" },
	SMS: { label: "SMS", color: "secondary" },
	PUSH: { label: "푸시", color: "warning" },
};

/**
 * TemplateTypeBadge 컴포넌트
 * 메시지 템플릿 유형을 컬러 코딩된 Badge로 표시합니다.
 * 상세/수정 화면에서 메시지 유형 표시 용도로 사용합니다.
 *
 * @example
 * ```tsx
 * <TemplateTypeBadge type="EMAIL" />
 * <TemplateTypeBadge type="SMS" size="lg" />
 * ```
 */
export const TemplateTypeBadge = observer(
	({ type, size = "md" }: TemplateTypeBadgeProps) => {
		const config = TYPE_CONFIG[type];

		return (
			<Chip size={size} color={config.color} variant="flat">
				{config.label}
			</Chip>
		);
	},
);

TemplateTypeBadge.displayName = "TemplateTypeBadge";
