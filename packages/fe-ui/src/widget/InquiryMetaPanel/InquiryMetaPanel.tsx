"use client";

import { Button, Card, CardBody, Chip, Input } from "@heroui/react";
import type { Option } from "@cocrepo/type";
import { Plus, Tag } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Select } from "../../input/Select/Select";

export interface InquiryMetaPanelProps {
	/** 문의 상태 */
	status: string;
	/** 상태 옵션 */
	statusOptions: Option[];
	/** 상태 변경 핸들러 */
	onStatusChange: (status: string) => void;

	/** 우선순위 */
	priority: string;
	/** 우선순위 옵션 */
	priorityOptions: Option[];
	/** 우선순위 변경 핸들러 */
	onPriorityChange: (priority: string) => void;

	/** 카테고리 */
	category: string;
	/** 카테고리 옵션 */
	categoryOptions: Option[];
	/** 카테고리 변경 핸들러 */
	onCategoryChange: (category: string) => void;

	/** 담당자 ID */
	assigneeId?: string;
	/** 담당자 이름 */
	assigneeName?: string;
	/** 담당자 옵션 */
	assigneeOptions: Option[];
	/** 담당자 변경 핸들러 */
	onAssigneeChange: (assigneeId: string) => void;

	/** 태그 목록 */
	tags?: string[];
	/** 태그 추가 핸들러 */
	onTagAdd?: (tag: string) => void;
	/** 태그 삭제 핸들러 */
	onTagRemove?: (tag: string) => void;

	/** 편집 가능 여부 */
	isEditable?: boolean;

	/** 추가 CSS 클래스 */
	className?: string;
}

const priorityColors: Record<string, "danger" | "warning" | "primary" | "default"> = {
	URGENT: "danger",
	HIGH: "warning",
	NORMAL: "primary",
	LOW: "default",
};

/**
 * InquiryMetaPanel 컴포넌트
 * 문의의 메타 정보(상태, 우선순위, 카테고리, 담당자, 태그)를 표시하고 인라인 편집을 지원합니다.
 *
 * @example
 * ```tsx
 * <InquiryMetaPanel
 *   status="IN_PROGRESS"
 *   statusOptions={statusOptions}
 *   onStatusChange={handleStatusChange}
 *   priority="HIGH"
 *   priorityOptions={priorityOptions}
 *   onPriorityChange={handlePriorityChange}
 *   category="DELIVERY"
 *   categoryOptions={categoryOptions}
 *   onCategoryChange={handleCategoryChange}
 *   assigneeId="user-1"
 *   assigneeName="김상담"
 *   assigneeOptions={assigneeOptions}
 *   onAssigneeChange={handleAssigneeChange}
 *   tags={["배송", "긴급"]}
 *   onTagAdd={handleTagAdd}
 *   onTagRemove={handleTagRemove}
 * />
 * ```
 */
export const InquiryMetaPanel = observer(
	({
		status,
		statusOptions,
		onStatusChange,
		priority,
		priorityOptions,
		onPriorityChange,
		category,
		categoryOptions,
		onCategoryChange,
		assigneeId,
		assigneeName,
		assigneeOptions,
		onAssigneeChange,
		tags = [],
		onTagAdd,
		onTagRemove,
		isEditable = true,
		className = "",
	}: InquiryMetaPanelProps) => {
		const [newTag, setNewTag] = useState("");
		const [isAddingTag, setIsAddingTag] = useState(false);

		const handleAddTag = () => {
			if (newTag.trim() && onTagAdd) {
				onTagAdd(newTag.trim());
				setNewTag("");
				setIsAddingTag(false);
			}
		};

		const getStatusLabel = () => {
			const option = statusOptions.find((o) => o.value === status);
			return option?.text || status;
		};

		const getPriorityLabel = () => {
			const option = priorityOptions.find((o) => o.value === priority);
			return option?.text || priority;
		};

		const getCategoryLabel = () => {
			const option = categoryOptions.find((o) => o.value === category);
			return option?.text || category;
		};

		return (
			<Card className={`bg-content1 ${className}`} shadow="sm">
				<CardBody className="gap-4 p-4">
					{/* 헤더 */}
					<h3 className="text-sm font-semibold text-default-500">
						🏷️ 메타 정보
					</h3>

					{/* 상태 */}
					<div className="flex flex-col gap-1">
						<label className="text-xs text-default-500">상태</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={statusOptions}
								value={status}
								onChange={onStatusChange}
							/>
						) : (
							<Chip size="sm" variant="flat">
								{getStatusLabel()}
							</Chip>
						)}
					</div>

					{/* 우선순위 */}
					<div className="flex flex-col gap-1">
						<label className="text-xs text-default-500">우선순위</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={priorityOptions}
								value={priority}
								onChange={onPriorityChange}
							/>
						) : (
							<Chip
								size="sm"
								variant="flat"
								color={priorityColors[priority] || "default"}
							>
								{getPriorityLabel()}
							</Chip>
						)}
					</div>

					{/* 카테고리 */}
					<div className="flex flex-col gap-1">
						<label className="text-xs text-default-500">카테고리</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={categoryOptions}
								value={category}
								onChange={onCategoryChange}
							/>
						) : (
							<Chip size="sm" variant="flat" color="primary">
								{getCategoryLabel()}
							</Chip>
						)}
					</div>

					{/* 담당자 */}
					<div className="flex flex-col gap-1">
						<label className="text-xs text-default-500">담당자</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={assigneeOptions}
								value={assigneeId || ""}
								onChange={onAssigneeChange}
								placeholder="담당자 선택"
							/>
						) : (
							<span className="text-sm text-default-800">
								{assigneeName || "미배정"}
							</span>
						)}
					</div>

					{/* 태그 */}
					<div className="flex flex-col gap-2">
						<label className="text-xs text-default-500">태그</label>
						<div className="flex flex-wrap gap-1">
							{tags.map((tag) => (
								<Chip
									key={tag}
									size="sm"
									variant="flat"
									color="primary"
									onClose={isEditable ? () => onTagRemove?.(tag) : undefined}
								>
									#{tag}
								</Chip>
							))}
							{isEditable && !isAddingTag && (
								<Button
									size="sm"
									variant="flat"
									startContent={<Plus className="size-3" />}
									onPress={() => setIsAddingTag(true)}
									className="h-6 min-w-0 px-2"
								>
									추가
								</Button>
							)}
						</div>
						{isEditable && isAddingTag && (
							<Input
								size="sm"
								placeholder="태그 입력..."
								value={newTag}
								onValueChange={setNewTag}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleAddTag();
									} else if (e.key === "Escape") {
										setIsAddingTag(false);
										setNewTag("");
									}
								}}
								onBlur={() => {
									if (newTag.trim()) {
										handleAddTag();
									} else {
										setIsAddingTag(false);
									}
								}}
								startContent={<Tag className="size-3 text-default-400" />}
								classNames={{
									input: "text-sm",
								}}
							/>
						)}
					</div>
				</CardBody>
			</Card>
		);
	},
);

InquiryMetaPanel.displayName = "InquiryMetaPanel";
