"use client";

import { type UserDto, useGetUsers } from "@cocrepo/api/core/users";
import { useDebouncedCallback } from "@cocrepo/hook";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageTitleBar,
	PhoneCell,
	StatsCard,
	StatusChipCell,
	UserRoleCell,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Chip, Input, Spinner } from "@heroui/react";
import { Search, UserCheck, UserMinus, Users } from "lucide-react";
import { observer } from "mobx-react-lite";
import { parseAsString, useQueryState } from "nuqs";
import { type ComponentType, Suspense, useEffect, useState } from "react";

const SEARCH_PLACEHOLDER = "이름, 이메일, 전화번호로 검색...";

const UsersSearchField = observer(function UsersSearchField() {
	const [query, setQuery] = useQueryState(
		"search",
		parseAsString.withDefault(""),
	);
	const [value, setValue] = useState(query);

	useEffect(() => {
		setValue(query);
	}, [query]);

	const debouncedSetQuery = useDebouncedCallback((nextValue: string) => {
		void setQuery(nextValue || null);
	}, 300);

	return (
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
			onClear={() => {
				setValue("");
				void setQuery(null);
			}}
			onValueChange={(nextValue) => {
				setValue(nextValue);
				debouncedSetQuery(nextValue);
			}}
			placeholder={SEARCH_PLACEHOLDER}
			startContent={<Search className="size-4 text-default-400" />}
			value={value}
		/>
	);
});

const UsersDirectoryHeader = observer(function UsersDirectoryHeader({
	totalCount,
}: {
	totalCount: number;
}) {
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
});

const columns: MetaDataGridColumnConfig<UserDto>[] = [
	{
		field: "name",
		label: "이름",
		size: 150,
		isRequired: true,
		cell: ({ getValue }) => (
			<div className="min-w-0">
				<span className="block truncate text-sm font-semibold tracking-tight text-foreground">
					{(getValue() as string) ?? "-"}
				</span>
			</div>
		),
	},
	{
		field: "email",
		label: "이메일",
		size: 200,
		cell: ({ getValue }) => (
			<div className="max-w-[240px] truncate text-sm text-default-500">
				{(getValue() as string) ?? "-"}
			</div>
		),
	},
	{
		field: "phone",
		label: "전화번호",
		size: 150,
		cell: ({ getValue }) => (
			<div className="text-sm font-medium tabular-nums text-foreground/80">
				<PhoneCell value={(getValue() as string) ?? ""} />
			</div>
		),
	},
	{
		field: "role",
		label: "역할",
		size: 120,
		align: "center",
		cell: ({ row }) => <UserRoleCell tenants={row.original.tenants} />,
	},
	{
		field: "status",
		label: "상태",
		size: 100,
		align: "center",
		cell: ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
	},
	{
		field: "createdAt",
		label: "가입일",
		size: 150,
		cell: ({ getValue }) => (
			<div className="text-sm text-default-500">
				<DateTimeCell value={getValue() as string} />
			</div>
		),
	},
];

const leftInputs: InputConfig[] = [
	{
		type: "custom",
		id: "search",
		props: {
			component: UsersSearchField as unknown as ComponentType<unknown>,
		},
	},
];

type GridQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];

function getUsersParams(queryStates: GridQueryStates, search: string) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		name: search || undefined,
	};
}

function UsersPageFallback() {
	return (
		<div className="flex min-h-80 items-center justify-center">
			<Spinner size="lg" />
		</div>
	);
}

const UsersPageContent = observer(function UsersPageContent() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates();
	const [searchQuery] = useQueryState("search", parseAsString.withDefault(""));
	const { data: response, isLoading } = useGetUsers(
		getUsersParams(queryStates, searchQuery),
		{
			query: {
				placeholderData: (previousData) => previousData,
			},
		},
	);
	const users = response?.data ?? [];
	const totalCount = response?.meta?.total ?? 0;
	const stats = response?.stats;

	if (isLoading && !response) {
		return <UsersPageFallback />;
	}

	return (
		<VStack gap={5}>
			{stats && (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
					<StatsCard
						className="h-full border border-primary/10 bg-primary/5 lg:col-span-6"
						description={`활성 ${(stats.active ?? 0).toLocaleString()}명 · 비활성 ${(stats.inactive ?? 0).toLocaleString()}명`}
						icon={<Users className="size-5" />}
						title="전체 이용자"
						value={stats.total ?? 0}
						color="primary"
					/>
					<StatsCard
						className="h-full border border-success/10 bg-success/5 lg:col-span-3"
						description="현재 운영 중인 계정"
						icon={<UserCheck className="size-5" />}
						title="활성 이용자"
						value={stats.active ?? 0}
						color="success"
					/>
					<StatsCard
						className="h-full border border-default-200 bg-content2/70 lg:col-span-3"
						description="접속이 중지되었거나 비활성화된 계정"
						icon={<UserMinus className="size-5" />}
						title="비활성 이용자"
						value={stats.inactive ?? 0}
						color="default"
					/>
				</div>
			)}
			<div className="overflow-hidden rounded-2xl border border-divider/80 bg-content1/70 p-6">
				<UsersDirectoryHeader totalCount={totalCount} />
				<MetaDataGrid
					config={{
						entity: "User",
						data: users,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "조회된 이용자가 없습니다.",
					}}
				/>
			</div>
		</VStack>
	);
});

export default observer(function UsersPage() {
	return (
		<Suspense fallback={<UsersPageFallback />}>
			<div className="space-y-5">
				<PageTitleBar
					title="이용자 목록"
					description="시스템에 등록된 이용자를 조회합니다."
				/>
				<UsersPageContent />
			</div>
		</Suspense>
	);
});
