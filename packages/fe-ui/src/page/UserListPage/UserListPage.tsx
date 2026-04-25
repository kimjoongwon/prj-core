"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildUserListTableColumns,
	MetaDataGrid,
	MetaDataGridStateModel,
	PageTitleBar,
	StatsCard,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { Chip, Input, Spinner } from "@heroui/react";
import { Search, UserCheck, UserMinus, Users } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, type ComponentType } from "react";
import { UserRoleCell } from "../../cell";

export interface UserListPageUser {
	id: string;
	name: string;
	email?: string | null;
	phone?: string | null;
	removedAt?: string | null;
	createdAt: string;
	tenants?: Parameters<typeof UserRoleCell>[0]["tenants"];
}

export interface UserListPageStats {
	total: number;
	active: number;
	inactive: number;
}

export interface UserListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
}
export type UserListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface UserListPageProps {
	users: UserListPageUser[];
	totalCount: number;
	stats?: UserListPageStats;
	isLoading: boolean;
	searchValue: string;
	onChangeSearchValue: (value: string) => void;
	onClearSearch: () => void;
	queryStates: UserListPageQueryStates;
	setQueryStates: UserListPageSetQueryStates;
}

const SEARCH_PLACEHOLDER = "이름, 이메일, 전화번호로 검색...";
const userListTableColumns = buildUserListTableColumns<UserListPageUser>();

function UsersDirectoryHeader({ totalCount }: { totalCount: number }) {
	return (
		<div className="mb-5 flex flex-col gap-3 border-b border-divider/80 pb-4 md:flex-row md:items-end md:justify-between">
			<div className="space-y-1">
				<h2 className="text-base font-semibold tracking-tight text-foreground">
					회원 디렉터리
				</h2>
				<p className="text-sm text-default-500">
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

const UsersPageFallback = observer(() => {
	return (
		<div className="flex min-h-80 items-center justify-center">
			<Spinner size="lg" />
		</div>
	);
});

export const UserListPage = observer(({
	users,
	totalCount,
	stats,
	isLoading,
	searchValue,
	onChangeSearchValue,
	onClearSearch,
	queryStates,
	setQueryStates,
}: UserListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	if (isLoading && totalCount === 0 && users.length === 0) {
		return <UsersPageFallback />;
	}

	const leftInputs: InputConfig[] = [
		{
			type: "custom",
			id: "search",
			props: {
				component: (() => (
					<Input
						aria-label={SEARCH_PLACEHOLDER}
						classNames={{
							base: "w-full min-w-0 md:w-[360px] lg:w-[440px]",
							inputWrapper:
								"h-11 border border-divider bg-content2/70 shadow-none transition-colors hover:border-default-300 group-data-[focus=true]:border-primary group-data-[focus=true]:bg-background",
							input: "text-sm",
							innerWrapper: "gap-2",
						}}
						isClearable
						onClear={onClearSearch}
						onValueChange={onChangeSearchValue}
						placeholder={SEARCH_PLACEHOLDER}
						startContent={<Search className="size-4 text-default-400" />}
						value={searchValue}
					/>
				)) as unknown as ComponentType<unknown>,
			},
		},
	];

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="이용자 목록"
				description="시스템에 등록된 이용자를 조회합니다."
			/>
			<VStack gap={5}>
				{stats ? (
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
						<StatsCard
							className="h-full border border-primary/10 bg-primary/5 lg:col-span-6"
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
							className="h-full border border-default-200 bg-content2/70 lg:col-span-3"
							description="접속이 중지되었거나 비활성화된 계정"
							icon={<UserMinus className="size-5" />}
							title="비활성 이용자"
							value={stats.inactive}
							color="default"
						/>
					</div>
				) : null}
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					<UsersDirectoryHeader totalCount={totalCount} />
					<MetaDataGrid
						config={{
							entity: "User",
							columns: userListTableColumns,
							leftInputs,
							emptyMessage: "조회된 이용자가 없습니다.",
						}}
	rows={users}
	totalCount={totalCount}
	isLoading={isLoading}
	state={gridState}
/>
				</Surface>
			</VStack>
		</div>
	);
});

UserListPage.displayName = "UserListPage";
