"use client";

import type { Option } from "@cocrepo/type";
import { Card } from "@heroui/react";
import { RotateCcw, Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Input } from "../../input/Input/Input";
import { DateRangePicker } from "../../selection/DateRangePicker/DateRangePicker";
import { Select } from "../../selection/Select/Select";

export interface InquiryFilterValue {
	/** 상태 필터 */
	status?: string;
	/** 카테고리 필터 */
	category?: string;
	/** 채널 필터 */
	channel?: string;
	/** 우선순위 필터 */
	priority?: string;
	/** 담당자 ID 필터 */
	assigneeId?: string;
	/** 기간 필터 */
	dateRange?: { start: string; end: string };
	/** 검색어 */
	search?: string;
}

export interface InquiryFilterPanelProps {
	/** 현재 필터 값 */
	value: InquiryFilterValue;
	/** 필터 변경 핸들러 */
	onChange: (value: InquiryFilterValue) => void;

	/** 상태 옵션 */
	statusOptions: Option[];
	/** 카테고리 옵션 */
	categoryOptions: Option[];
	/** 채널 옵션 */
	channelOptions: Option[];
	/** 우선순위 옵션 */
	priorityOptions: Option[];
	/** 담당자 옵션 */
	assigneeOptions: Option[];

	/** 초기화 버튼 텍스트 */
	resetLabel?: string;
	/** 검색 placeholder */
	searchPlaceholder?: string;

	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * InquiryFilterPanel 컴포넌트
 * 문의 목록 필터링을 위한 패널입니다.
 * 상태, 카테고리, 채널, 우선순위, 담당자, 기간, 검색어 필터를 제공합니다.
 *
 * @example
 * ```tsx
 * <InquiryFilterPanel
 *   value={{ status: "IN_PROGRESS", search: "" }}
 *   onChange={setFilter}
 *   statusOptions={statusOptions}
 *   categoryOptions={categoryOptions}
 *   channelOptions={channelOptions}
 *   priorityOptions={priorityOptions}
 *   assigneeOptions={assigneeOptions}
 * />
 * ```
 */
export const InquiryFilterPanel = observer(
	({
		value,
		onChange,
		statusOptions,
		categoryOptions,
		channelOptions,
		priorityOptions,
		assigneeOptions,
		resetLabel = "초기화",
		searchPlaceholder = "제목, 고객명, 문의번호로 검색...",
		className = "",
	}: InquiryFilterPanelProps) => {
		const handleFieldChange = (
			field: keyof InquiryFilterValue,
			fieldValue: string | { start: string; end: string } | undefined,
		) => {
			onChange({
				...value,
				[field]: fieldValue,
			});
		};

		const handleSelectChange = (field: keyof InquiryFilterValue) => {
			return (selectedValue: string | number | null) => {
				handleFieldChange(
					field,
					selectedValue == null
						? undefined
						: String(selectedValue) || undefined,
				);
			};
		};

		const handleDateChange = (
			dateValue: { start: string; end: string } | undefined,
		) => {
			handleFieldChange("dateRange", dateValue);
		};

		const handleReset = () => {
			onChange({});
		};

		const hasActiveFilters = Object.values(value).some(
			(v) => v !== undefined && v !== "",
		);

		return (
			<Card className={`bg-surface ${className}`}>
				<Card.Content className="gap-4 p-4">
					{/* 검색 */}
					<Input
						placeholder={searchPlaceholder}
						size="sm"
						value={value.search || ""}
						onValueChange={(v) => handleFieldChange("search", v || undefined)}
						startContent={<Search className="size-4 text-muted" />}
						classNames={{
							input: "bg-surface-secondary",
						}}
					/>

					{/* 필터 그리드 */}
					<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
						{/* 상태 */}
						<Select
							size="sm"
							placeholder="전체 상태"
							options={statusOptions}
							value={value.status || ""}
							onChange={handleSelectChange("status")}
						/>

						{/* 카테고리 */}
						<Select
							size="sm"
							placeholder="전체 카테고리"
							options={categoryOptions}
							value={value.category || ""}
							onChange={handleSelectChange("category")}
						/>

						{/* 채널 */}
						<Select
							size="sm"
							placeholder="전체 채널"
							options={channelOptions}
							value={value.channel || ""}
							onChange={handleSelectChange("channel")}
						/>

						{/* 우선순위 */}
						<Select
							size="sm"
							placeholder="전체 우선순위"
							options={priorityOptions}
							value={value.priority || ""}
							onChange={handleSelectChange("priority")}
						/>

						{/* 담당자 */}
						<Select
							size="sm"
							placeholder="전체 담당자"
							options={assigneeOptions}
							value={value.assigneeId || ""}
							onChange={handleSelectChange("assigneeId")}
						/>
					</div>

					{/* 기간 선택 및 초기화 */}
					<div className="flex items-center justify-between">
						<DateRangePicker
							size="sm"
							label="기간"
							value={value.dateRange}
							onChange={handleDateChange}
						/>

						<Button
							size="sm"
							variant="flat"
							color="default"
							startContent={<RotateCcw className="size-4" />}
							onPress={handleReset}
							isDisabled={!hasActiveFilters}
						>
							{resetLabel}
						</Button>
					</div>
				</Card.Content>
			</Card>
		);
	},
);

InquiryFilterPanel.displayName = "InquiryFilterPanel";
