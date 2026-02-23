"use client";

import { Button } from "@heroui/react";
import { FolderInput, Trash2, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { HStack } from "../../ui/surfaces/HStack/HStack";

export interface SelectionActionBarProps {
	/** 선택된 항목 수 */
	selectedCount: number;
	/** 삭제 핸들러 */
	onDelete?: () => void;
	/** 이동 핸들러 */
	onMove?: () => void;
	/** 선택 해제 핸들러 */
	onClear: () => void;
	/** 커스텀 액션 버튼 */
	customActions?: ReactNode;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * SelectionActionBar Widget 컴포넌트
 *
 * 다중 선택 시 하단에 표시되는 액션 바입니다.
 * 일괄 작업(삭제, 이동 등)을 수행할 수 있습니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <SelectionActionBar
 *   selectedCount={5}
 *   onDelete={handleDelete}
 *   onMove={handleMove}
 *   onClear={handleClearSelection}
 * />
 * ```
 */
export const SelectionActionBar = observer(
	({
		selectedCount,
		onDelete,
		onMove,
		onClear,
		customActions,
		className,
	}: SelectionActionBarProps) => {
		if (selectedCount === 0) {
			return null;
		}

		return (
			<div
				className={`
					fixed bottom-6 left-1/2 -translate-x-1/2 z-50
					bg-content1 border border-divider rounded-xl shadow-lg
					px-4 py-3
					${className ?? ""}
				`}
			>
				<HStack alignItems="center" gap={4}>
					{/* 선택된 항목 수 */}
					<HStack alignItems="center" gap={2}>
						<span className="text-sm font-medium">
							<span className="text-primary">{selectedCount}</span>개 선택됨
						</span>
						<Button
							size="sm"
							variant="light"
							isIconOnly
							onPress={onClear}
							aria-label="선택 해제"
						>
							<X className="w-4 h-4" />
						</Button>
					</HStack>

					{/* 구분선 */}
					<div className="w-px h-6 bg-divider" />

					{/* 액션 버튼들 */}
					<HStack gap={2}>
						{onMove && (
							<Button
								size="sm"
								variant="flat"
								color="default"
								onPress={onMove}
								startContent={<FolderInput className="w-4 h-4" />}
							>
								이동
							</Button>
						)}

						{onDelete && (
							<Button
								size="sm"
								variant="flat"
								color="danger"
								onPress={onDelete}
								startContent={<Trash2 className="w-4 h-4" />}
							>
								삭제
							</Button>
						)}

						{customActions}
					</HStack>
				</HStack>
			</div>
		);
	},
);

SelectionActionBar.displayName = "SelectionActionBar";
