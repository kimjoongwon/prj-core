"use client";

import type { UserDto } from "@cocrepo/api/core/users";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildUserListTableColumns,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	SectionSurface,
	StatsCard,
	VStack,
} from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { Search, UserCheck, UserMinus, Users } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ComponentType, useEffect } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { Input } from "../../input/Input/Input";

export interface UserListScreenStats {
	total: number;
	active: number;
	inactive: number;
}

export interface UserListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
}
export type UserListScreenSetQueryStates = DataGridSetQueryStates;

export interface UserListScreenProps {
	users?: UserDto[];
	totalCount: number;
	stats?: UserListScreenStats;
	isLoading: boolean;
	searchValue: string;
	onChangeSearchValue: (value: string) => void;
	onClearSearch: () => void;
	queryStates: UserListScreenQueryStates;
	setQueryStates: UserListScreenSetQueryStates;
}

const SEARCH_PLACEHOLDER = "이름, 이메일, 전화번호로 검색...";
const userListTableColumns = buildUserListTableColumns<UserDto>();

function UsersDirectoryHeader({ totalCount }: { totalCount: number }) {
	return (
		<div className="mb-5 flex flex-col gap-3 border-b border-border/80 pb-4 md:flex-row md:items-end md:justify-between">
			<div className="space-y-1">
				<h2 className="text-base font-semibold tracking-tight text-foreground">
					회원 디렉터리
				</h2>
				<p className="text-sm text-muted">
					등록된 이용자를 빠르게 검색하고 상태를 확인할 수 있습니다.
				</p>
			</div>
			<Chip
				className="h-8 px-2 text-sm font-medium"
				color="primary"
				variant="flat"
			>
				총 {totalCount.toLocaleString()}명
			</Chip>
		</div>
	);
}

const UsersScreenFallback = observer(() => {
	return (
		<div className="flex min-h-80 items-center justify-center">
			<Spinner size="lg" />
		</div>
	);
});

export const UserListScreen = observer(
	({
		users,
		totalCount,
		stats,
		isLoading,
		searchValue,
		onChangeSearchValue,
		onClearSearch,
		queryStates,
		setQueryStates,
	}: UserListScreenProps) => {
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const userRows = users ?? [];
		if (isLoading && totalCount === 0 && userRows.length === 0) {
			return <UsersScreenFallback />;
		}

		const leftInputs: InputConfig[] = [
			{
				type: "custom",
				id: "search",
				props: {
					component: (() => (
						<Input
							aria-label={SEARCH_PLACEHOLDER}
							isClearable
							onClear={onClearSearch}
							onValueChange={onChangeSearchValue}
							placeholder={SEARCH_PLACEHOLDER}
							startContent={<Search className="size-4 text-muted" />}
							value={searchValue}
						/>
					)) as unknown as ComponentType<unknown>,
				},
			},
		];

		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="이용자 목록"
					description="시스템에 등록된 이용자를 조회합니다."
				/>
				{stats ? (
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
						<StatsCard
							className="h-full border border-accent/10 bg-accent/5 lg:col-span-6"
							description={`활성 ${stats.active.toLocaleString()}명 · 비활성 ${stats.inactive.toLocaleString()}명`}
							icon={<Users className="size-5" />}
							title="전체 이용자"
							value={stats.total}
							color="primary"
						/>
						<StatsCard
							className="h-full border border-success/10 bg-success/5 lg:col-span-3"
							description="현재 운영 중인 계정"
							icon={<UserCheck className="size-5" />}
							title="활성 이용자"
							value={stats.active}
							color="success"
						/>
						<StatsCard
							className="h-full border border-border bg-surface-secondary/70 lg:col-span-3"
							description="접속이 중지되었거나 비활성화된 계정"
							icon={<UserMinus className="size-5" />}
							title="비활성 이용자"
							value={stats.inactive}
							color="default"
						/>
					</div>
				) : null}
				<SectionSurface className="overflow-hidden rounded-2xl border-border/80 bg-surface/70">
					<UsersDirectoryHeader totalCount={totalCount} />
					<DataGrid
						config={{
							entity: "User",
							columns: userListTableColumns,
							leftInputs,
							emptyMessage: "조회된 이용자가 없습니다.",
						}}
						rows={userRows}
						totalCount={totalCount}
						state={gridState}
					/>
				</SectionSurface>
			</VStack>
		);
	},
);

UserListScreen.displayName = "UserListScreen";
