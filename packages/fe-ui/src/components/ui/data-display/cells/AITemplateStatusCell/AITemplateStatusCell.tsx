import { Chip } from "@heroui/react";

/**
 * AI 템플릿 상태 타입
 */
type AITemplateStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

interface AITemplateStatusCellProps {
	/** 템플릿 상태 */
	status?: AITemplateStatus;
}

/**
 * AI 템플릿 상태를 Chip으로 표시하는 Cell 컴포넌트
 */
export const AITemplateStatusCell = ({ status }: AITemplateStatusCellProps) => {
	const config = STATUS_CONFIG[status ?? "DRAFT"];

	return (
		<div className="flex w-full justify-center">
			<Chip size="sm" color={config.color} variant="flat">
				{config.label}
			</Chip>
		</div>
	);
};

const STATUS_CONFIG: Record<
	AITemplateStatus,
	{
		label: string;
		color:
			| "success"
			| "warning"
			| "danger"
			| "default"
			| "primary"
			| "secondary";
	}
> = {
	DRAFT: { label: "초안", color: "warning" },
	ACTIVE: { label: "활성", color: "success" },
	INACTIVE: { label: "비활성", color: "default" },
	ARCHIVED: { label: "보관", color: "secondary" },
};

export type { AITemplateStatusCellProps };
