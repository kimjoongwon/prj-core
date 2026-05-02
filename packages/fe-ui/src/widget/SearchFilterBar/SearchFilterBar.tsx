"use client";

import { Button, Input } from "@cocrepo/ui/heroui";
import { Filter, Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

export interface SearchFilterBarProps {
	/** 검색어 값 */
	searchValue: string;
	/** 검색어 변경 핸들러 */
	onSearchChange: (value: string) => void;
	/** 검색 실행 핸들러 (Enter 또는 버튼 클릭) */
	onSearch?: () => void;
	/** 필터 토글 핸들러 */
	onFilterToggle?: () => void;
	/** 필터 패널 열림 상태 */
	isFilterOpen?: boolean;
	/** 적용된 필터 수 (0보다 크면 버튼에 배지 표시) */
	filterCount?: number;
	/** 검색 플레이스홀더 */
	placeholder?: string;
	/** 필터 버튼 표시 여부 */
	showFilterButton?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SearchFilterBar 컴포넌트
 * 검색창과 필터 토글 버튼을 조합한 위젯입니다.
 *
 * @example
 * ```tsx
 * <SearchFilterBar
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   onSearch={handleSearch}
 *   onFilterToggle={() => setFilterOpen(!filterOpen)}
 *   isFilterOpen={filterOpen}
 *   filterCount={3}
 * />
 * ```
 */
export const SearchFilterBar = observer(
	({
		searchValue,
		onSearchChange,
		onSearch,
		onFilterToggle,
		isFilterOpen = false,
		filterCount = 0,
		placeholder = "검색어를 입력하세요...",
		showFilterButton = true,
		className = "",
	}: SearchFilterBarProps) => {
		const t = useT();
		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				onSearch?.();
			}
		};

		return (
			<div className={`flex items-center gap-3 ${className}`}>
				<Input
					placeholder={t(placeholder)}
					size="md"
					value={searchValue}
					onValueChange={onSearchChange}
					onKeyDown={handleKeyDown}
					startContent={<Search className="size-4 text-default-400" />}
					classNames={{
						base: "flex-1",
						inputWrapper: "bg-content2",
					}}
				/>
				{showFilterButton && onFilterToggle && (
					<Button
						variant={isFilterOpen ? "solid" : "flat"}
						color={filterCount > 0 ? "primary" : "default"}
						onPress={onFilterToggle}
						startContent={<Filter className="size-4" />}
						className="shrink-0"
					>
						{t("필터")}
						{filterCount > 0 && (
							<span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 text-xs">
								{filterCount}
							</span>
						)}
					</Button>
				)}
			</div>
		);
	},
);
