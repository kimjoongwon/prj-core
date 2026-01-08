"use client";

import {
	Button,
	Chip,
	Input,
	Select,
	SelectItem,
	type Selection,
} from "@heroui/react";
import { Filter, RotateCcw, Search, X } from "lucide-react";
import type {
	MemberFilters,
	MemberRole,
	MemberStatus,
} from "../_stores/MemberListStore";

interface MemberFiltersProps {
	filters: MemberFilters;
	onChangeSearch: (value: string) => void;
	onChangeRoleFilter: (roles: MemberRole[]) => void;
	onChangeStatusFilter: (status: MemberStatus | "all") => void;
	onClickResetButton: () => void;
}

const ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
	{ value: "USER", label: "일반 회원" },
	{ value: "ADMIN", label: "관리자" },
	{ value: "SUPER_ADMIN", label: "슈퍼 관리자" },
];

const STATUS_OPTIONS: { value: MemberStatus | "all"; label: string }[] = [
	{ value: "all", label: "전체" },
	{ value: "active", label: "활성" },
	{ value: "inactive", label: "비활성" },
	{ value: "removed", label: "삭제됨" },
];

/**
 * 회원 검색 및 필터 영역
 */
export function MemberFilters({
	filters,
	onChangeSearch,
	onChangeRoleFilter,
	onChangeStatusFilter,
	onClickResetButton,
}: MemberFiltersProps) {
	// 역할 필터 변경 핸들러
	const handleRoleChange = (keys: Selection) => {
		if (keys === "all") {
			onChangeRoleFilter([]);
		} else {
			onChangeRoleFilter(Array.from(keys) as MemberRole[]);
		}
	};

	// 상태 필터 변경 핸들러
	const handleStatusChange = (keys: Selection) => {
		const selected = Array.from(keys)[0] as MemberStatus | "all";
		onChangeStatusFilter(selected || "all");
	};

	// 활성 필터 여부
	const hasActiveFilters =
		filters.search || filters.roles.length > 0 || filters.status !== "all";

	return (
		<div className="flex flex-col gap-4">
			{/* 검색 및 필터 바 */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* 검색 입력 */}
				<div className="flex-1">
					<Input
						placeholder="이름, 이메일, 전화번호 검색"
						value={filters.search}
						onValueChange={onChangeSearch}
						startContent={<Search className="h-4 w-4 text-default-400" />}
						endContent={
							filters.search && (
								<button
									type="button"
									onClick={() => onChangeSearch("")}
									className="text-default-400 hover:text-default-600"
								>
									<X className="h-4 w-4" />
								</button>
							)
						}
						size="sm"
						classNames={{
							inputWrapper: "bg-default-100",
						}}
					/>
				</div>

				{/* 역할 필터 */}
				<Select
					placeholder="역할"
					selectionMode="multiple"
					selectedKeys={new Set(filters.roles)}
					onSelectionChange={handleRoleChange}
					size="sm"
					className="w-full sm:w-40"
					startContent={<Filter className="h-4 w-4 text-default-400" />}
				>
					{ROLE_OPTIONS.map((option) => (
						<SelectItem key={option.value}>{option.label}</SelectItem>
					))}
				</Select>

				{/* 상태 필터 */}
				<Select
					placeholder="상태"
					selectedKeys={new Set([filters.status])}
					onSelectionChange={handleStatusChange}
					size="sm"
					className="w-full sm:w-32"
				>
					{STATUS_OPTIONS.map((option) => (
						<SelectItem key={option.value}>{option.label}</SelectItem>
					))}
				</Select>

				{/* 초기화 버튼 */}
				{hasActiveFilters && (
					<Button
						variant="light"
						size="sm"
						onPress={onClickResetButton}
						startContent={<RotateCcw className="h-4 w-4" />}
					>
						<span>초기화</span>
					</Button>
				)}
			</div>

			{/* 필터 칩 */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2">
					{filters.search && (
						<Chip variant="flat" onClose={() => onChangeSearch("")} size="sm">
							<span>검색: {filters.search}</span>
						</Chip>
					)}
					{filters.roles.map((role) => (
						<Chip
							key={role}
							variant="flat"
							color="primary"
							onClose={() =>
								onChangeRoleFilter(filters.roles.filter((r) => r !== role))
							}
							size="sm"
						>
							<span>{ROLE_OPTIONS.find((o) => o.value === role)?.label}</span>
						</Chip>
					))}
					{filters.status !== "all" && (
						<Chip
							variant="flat"
							color="secondary"
							onClose={() => onChangeStatusFilter("all")}
							size="sm"
						>
							<span>
								{STATUS_OPTIONS.find((o) => o.value === filters.status)?.label}
							</span>
						</Chip>
					)}
				</div>
			)}
		</div>
	);
}
