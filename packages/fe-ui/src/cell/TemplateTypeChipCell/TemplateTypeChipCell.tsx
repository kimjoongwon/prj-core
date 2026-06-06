"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { useT } from "../../i18n";

interface TemplateTypeChipCellProps {
	/** 템플릿 유형 */
	type?: "EMAIL" | "SMS" | "PUSH" | null;
}

const TYPE_CONFIG: Record<
	string,
	{ label: string; color: "primary" | "secondary" | "warning" | "default" }
> = {
	EMAIL: { label: "이메일", color: "primary" },
	SMS: { label: "SMS", color: "secondary" },
	PUSH: { label: "푸시", color: "warning" },
};

/**
 * 메시지 템플릿 유형을 컬러 코딩된 Chip으로 표시하는 Cell 컴포넌트
 */
export const TemplateTypeChipCell = observer(function TemplateTypeChipCell({
	type,
}: TemplateTypeChipCellProps) {
	const t = useT();

	if (!type) return <span className="text-muted">-</span>;

	const config = TYPE_CONFIG[type] ?? {
		label: type,
		color: "default" as const,
	};

	return (
		<div className="flex w-full justify-center">
			<Chip size="sm" color={config.color} variant="flat">
				{t(config.label)}
			</Chip>
		</div>
	);
});
