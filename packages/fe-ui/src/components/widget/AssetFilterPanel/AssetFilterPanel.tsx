"use client";

import { Select, SelectItem, type Selection } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { AssetKind } from "../../ui/data-display/AssetKindBadge";
import type { AssetStatus } from "../../ui/data-display/AssetStatusBadge";
import { HStack } from "../../ui/surfaces/HStack/HStack";

/**
 * 에셋 필터 타입
 */
export interface AssetFilters {
	kind?: AssetKind | "all";
	status?: AssetStatus | "all";
}

export interface AssetFilterPanelProps {
	/** 현재 필터 값 */
	filters: AssetFilters;
	/** 필터 변경 핸들러 */
	onChange: (filters: AssetFilters) => void;
	/** 종류 필터 표시 여부 */
	showKindFilter?: boolean;
	/** 상태 필터 표시 여부 */
	showStatusFilter?: boolean;
	/** 추가 클래스명 */
	className?: string;
}

const KIND_OPTIONS = [
	{ key: "all", label: "전체" },
	{ key: "IMAGE", label: "이미지" },
	{ key: "VIDEO", label: "비디오" },
	{ key: "DOCUMENT", label: "문서" },
] as const;

const STATUS_OPTIONS = [
	{ key: "all", label: "전체" },
	{ key: "UPLOADING", label: "업로드중" },
	{ key: "READY", label: "준비완료" },
	{ key: "FAILED", label: "실패" },
] as const;

/**
 * AssetFilterPanel Widget 컴포넌트
 *
 * 에셋 목록의 필터를 표시하는 순수 UI 컴포넌트입니다.
 * 종류(kind)와 상태(status)로 필터링할 수 있습니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetFilterPanel
 *   filters={{ kind: "all", status: "all" }}
 *   onChange={setFilters}
 * />
 * ```
 */
export const AssetFilterPanel = observer(
	({
		filters,
		onChange,
		showKindFilter = true,
		showStatusFilter = true,
		className,
	}: AssetFilterPanelProps) => {
		const handleKindChange = (keys: Selection) => {
			if (keys === "all") {
				onChange({ ...filters, kind: "all" });
				return;
			}
			const keyArray = Array.from(keys as Set<string>);
			if (keyArray.length > 0) {
				onChange({
					...filters,
					kind: keyArray[0] as AssetKind | "all",
				});
			}
		};

		const handleStatusChange = (keys: Selection) => {
			if (keys === "all") {
				onChange({ ...filters, status: "all" });
				return;
			}
			const keyArray = Array.from(keys as Set<string>);
			if (keyArray.length > 0) {
				onChange({
					...filters,
					status: keyArray[0] as AssetStatus | "all",
				});
			}
		};

		return (
			<HStack gap={4} className={className}>
				{showKindFilter && (
					<Select
						selectedKeys={filters.kind ? new Set([filters.kind]) : new Set(["all"])}
						onSelectionChange={handleKindChange}
						placeholder="종류"
						size="sm"
						className="w-32"
						classNames={{
							trigger: "bg-content2",
						}}
					>
						{KIND_OPTIONS.map((option) => (
							<SelectItem key={option.key}>{option.label}</SelectItem>
						))}
					</Select>
				)}

				{showStatusFilter && (
					<Select
						selectedKeys={filters.status ? new Set([filters.status]) : new Set(["all"])}
						onSelectionChange={handleStatusChange}
						placeholder="상태"
						size="sm"
						className="w-32"
						classNames={{
							trigger: "bg-content2",
						}}
					>
						{STATUS_OPTIONS.map((option) => (
							<SelectItem key={option.key}>{option.label}</SelectItem>
						))}
					</Select>
				)}
			</HStack>
		);
	},
);

AssetFilterPanel.displayName = "AssetFilterPanel";
