"use client";

import type { AIFormTemplate } from "@cocrepo/type";
import {
	Input,
	Select,
	SelectItem,
	type SelectProps,
	type SharedSelection,
} from "@heroui/react";
import { Search, Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export interface AIFormSelectorProps
	extends Omit<
		SelectProps,
		"children" | "selectedKeys" | "onSelectionChange" | "onSelect"
	> {
	/** 대상 도메인 (예: "Inquiry", "Member") */
	domain: string;
	/** 템플릿 목록 */
	templates: AIFormTemplate[];
	/** 템플릿 선택 시 호출 */
	onSelect: (template: AIFormTemplate) => void;
	/** 선택된 템플릿 ID */
	selectedTemplateId?: string;
	/** 비활성화 여부 */
	disabled?: boolean;
	/** 플레이스홀더 */
	placeholder?: string;
}

/**
 * AIFormSelector 컴포넌트
 * 도메인별 AI 폼 템플릿을 선택할 수 있는 드롭다운 위젯입니다.
 * 검색 기능과 도메인 필터링을 지원합니다.
 *
 * @example
 * ```tsx
 * <AIFormSelector
 *   domain="Inquiry"
 *   templates={templates}
 *   selectedTemplateId={selectedId}
 *   onSelect={handleSelect}
 *   placeholder="AI 폼 선택"
 * />
 * ```
 */
export const AIFormSelector = observer(
	({
		domain,
		templates,
		onSelect,
		selectedTemplateId,
		disabled = false,
		placeholder = "AI 폼 선택",
		...rest
	}: AIFormSelectorProps) => {
		const [searchValue, setSearchValue] = useState("");

		// 도메인 필터링 및 검색
		const filteredTemplates = templates.filter((template) => {
			const matchesDomain = template.targetDomain === domain;
			const matchesSearch =
				searchValue === "" ||
				template.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				template.description?.toLowerCase().includes(searchValue.toLowerCase());
			return matchesDomain && matchesSearch && template.status === "ACTIVE";
		});

		const handleSelectionChange = (keys: SharedSelection) => {
			// SharedSelection이 'all' 문자열일 수 있으므로 체크
			if (keys === "all") return;

			const selectedId = Array.from(keys)[0] as string;
			if (selectedId) {
				const selected = templates.find((t) => t.id === selectedId);
				if (selected) {
					onSelect(selected);
				}
			}
		};

		const selectedKeys = selectedTemplateId
			? new Set([selectedTemplateId])
			: new Set([]);

		return (
			<Select
				{...rest}
				items={filteredTemplates}
				selectedKeys={selectedKeys}
				onSelectionChange={handleSelectionChange}
				placeholder={placeholder}
				isDisabled={disabled}
				startContent={<Sparkles className="size-4 text-primary" />}
				classNames={{
					base: "min-w-[200px]",
					trigger: "h-10",
					popoverContent: "p-0",
				}}
				popoverProps={{
					classNames: {
						content: "p-0",
					},
				}}
				renderValue={(items) => {
					const item = items[0];
					if (!item) return null;
					return (
						<span className="flex items-center gap-2">
							<Sparkles className="size-3.5 text-primary" />
							{item.data?.name}
						</span>
					);
				}}
				listboxProps={{
					topContent: (
						<div className="sticky top-0 z-10 bg-content1 p-2 pb-0">
							<Input
								aria-label="템플릿 검색"
								placeholder="템플릿 검색..."
								size="sm"
								value={searchValue}
								onValueChange={setSearchValue}
								startContent={<Search className="size-3.5 text-default-400" />}
								classNames={{
									inputWrapper: "bg-content2",
								}}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					),
				}}
			>
				{(template) => (
					<SelectItem
						key={template.id}
						textValue={template.name}
						description={template.description}
					>
						<div className="flex flex-col gap-0.5">
							<span className="font-medium">{template.name}</span>
							{template.description && (
								<span className="text-xs text-default-400 line-clamp-1">
									{template.description}
								</span>
							)}
						</div>
					</SelectItem>
				)}
			</Select>
		);
	},
);

AIFormSelector.displayName = "AIFormSelector";
