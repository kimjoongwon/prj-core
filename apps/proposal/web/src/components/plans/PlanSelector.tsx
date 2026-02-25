"use client";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";

interface SelectorItem {
	id: string;
	label: string;
	description?: string;
}

interface PlanSelectorProps {
	/** 현재 선택된 값 표시 텍스트 */
	displayValue: string;
	/** 선택 가능한 항목 목록 */
	items: SelectorItem[];
	/** 선택 시 콜백 */
	onSelect: (id: string) => void;
	/** 비활성화 여부 */
	isDisabled?: boolean;
	/** 플레이스홀더 */
	placeholder?: string;
}

/**
 * 기획서 선택용 드롭다운 컴포넌트
 */
export const PlanSelector = observer(function PlanSelector({
	displayValue,
	items,
	onSelect,
	isDisabled = false,
	placeholder = "선택",
}: PlanSelectorProps) {
	const handleSelectionChange = (keys: Set<string> | "all") => {
		if (keys === "all") return;
		const selectedId = Array.from(keys)[0];
		if (selectedId) {
			onSelect(selectedId);
		}
	};

	return (
		<Dropdown isDisabled={isDisabled || items.length === 0}>
			<DropdownTrigger>
				<Button
					variant="light"
					className="px-2 h-8 min-w-0 data-[hover=true]:bg-default-100"
					endContent={<ChevronDown className="w-3 h-3 text-default-500" />}
					isDisabled={isDisabled || items.length === 0}
				>
					<span className="text-sm font-medium truncate max-w-[200px]">
						{displayValue || placeholder}
					</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="선택"
				selectionMode="single"
				selectedKeys={new Set([displayValue])}
				onSelectionChange={(keys) =>
					handleSelectionChange(keys as Set<string> | "all")
				}
				className="max-h-[300px] overflow-y-auto"
			>
				{items.map((item) => (
					<DropdownItem
						key={item.id}
						description={item.description}
						className="py-2"
					>
						{item.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
});
