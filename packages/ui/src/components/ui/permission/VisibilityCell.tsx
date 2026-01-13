import {
	Button,
	Chip,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
} from "@heroui/react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { ReactNode } from "react";

/**
 * 가시성 상태 타입
 * - full: 전체 공개
 * - masked: 부분 마스킹
 * - hidden: 숨김
 */
export type VisibilityStatus = "full" | "masked" | "hidden";

export interface VisibilityCellProps {
	/**
	 * 가시성 상태
	 */
	status: VisibilityStatus;
	/**
	 * 필드 이름 (툴팁에 표시)
	 */
	fieldName?: string;
	/**
	 * 역할 이름 (툴팁에 표시)
	 */
	roleName?: string;
	/**
	 * 편집 가능 여부 (클릭 시 상태 변경 팝오버 표시)
	 */
	editable?: boolean;
	/**
	 * 상태 변경 콜백
	 */
	onStatusChange?: (status: VisibilityStatus) => void;
}

/**
 * 상태별 설정
 */
const statusConfig: Record<
	VisibilityStatus,
	{
		icon: ReactNode;
		color: "success" | "warning" | "danger";
		label: string;
		description: string;
	}
> = {
	full: {
		icon: <CheckCircle size={14} />,
		color: "success",
		label: "전체 공개",
		description: "모든 데이터가 표시됩니다",
	},
	masked: {
		icon: <AlertTriangle size={14} />,
		color: "warning",
		label: "부분 마스킹",
		description: "일부 데이터가 마스킹되어 표시됩니다",
	},
	hidden: {
		icon: <XCircle size={14} />,
		color: "danger",
		label: "숨김",
		description: "데이터가 표시되지 않습니다",
	},
};

/**
 * 가시성 상태를 표시하는 셀 컴포넌트
 *
 * 사용 예시:
 * ```tsx
 * // 읽기 전용
 * <VisibilityCell status="full" />
 *
 * // 편집 가능
 * <VisibilityCell
 *   status="masked"
 *   fieldName="이메일"
 *   roleName="일반 사용자"
 *   editable
 *   onStatusChange={(status) => console.log(status)}
 * />
 * ```
 */
export function VisibilityCell({
	status,
	fieldName,
	roleName,
	editable = false,
	onStatusChange,
}: VisibilityCellProps) {
	const config = statusConfig[status];

	// 툴팁 내용 생성
	const tooltipContent = buildTooltipContent(config, fieldName, roleName);

	// 칩 렌더링
	const chip = (
		<Chip
			color={config.color}
			size="sm"
			variant="flat"
			startContent={config.icon}
			className={editable ? "cursor-pointer" : undefined}
		>
			{config.label}
		</Chip>
	);

	// 편집 불가능한 경우: 툴팁만 표시
	if (!editable) {
		return (
			<Tooltip content={tooltipContent} placement="top">
				{chip}
			</Tooltip>
		);
	}

	// 편집 가능한 경우: 팝오버로 상태 변경 UI 제공
	return (
		<Popover placement="bottom">
			<Tooltip content={tooltipContent} placement="top">
				<div className="inline-block">
					<PopoverTrigger>{chip}</PopoverTrigger>
				</div>
			</Tooltip>
			<PopoverContent>
				<div className="p-2">
					<p className="text-sm font-medium mb-2">가시성 상태 변경</p>
					<div className="flex flex-col gap-1">
						{(Object.keys(statusConfig) as VisibilityStatus[]).map(
							(statusKey) => {
								const itemConfig = statusConfig[statusKey];
								const isSelected = statusKey === status;

								return (
									<Button
										key={statusKey}
										size="sm"
										variant={isSelected ? "flat" : "light"}
										color={itemConfig.color}
										startContent={itemConfig.icon}
										className="justify-start"
										onPress={() => onStatusChange?.(statusKey)}
									>
										{itemConfig.label}
									</Button>
								);
							},
						)}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

/**
 * 툴팁 내용을 생성합니다
 */
function buildTooltipContent(
	config: (typeof statusConfig)[VisibilityStatus],
	fieldName?: string,
	roleName?: string,
): string {
	const parts: string[] = [];

	if (fieldName && roleName) {
		parts.push(`${roleName}의 ${fieldName} 필드`);
	} else if (fieldName) {
		parts.push(`${fieldName} 필드`);
	} else if (roleName) {
		parts.push(`${roleName}`);
	}

	parts.push(config.description);

	return parts.join(": ");
}
