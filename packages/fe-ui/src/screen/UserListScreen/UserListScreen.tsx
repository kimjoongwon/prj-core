"use client";

import type { UserDto } from "@cocrepo/api/core/users";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { Search } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ComponentType, useEffect } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { buildUserListTableColumns } from "../../data-grid/columns";
import { TextField } from "../../input/TextField/TextField";
export interface UserListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
}
export type UserListScreenSetQueryStates = DataGridSetQueryStates;
export interface UserListScreenProps {
	users?: UserDto[];
	totalCount: number;
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
		<VStack
			gap="block"
			className="mb-5 border-b border-border/80 pb-4 md:flex-row md:items-end md:justify-between"
		>
			<VStack gap="dense">
				<h2 className="text-base font-semibold tracking-tight text-foreground">
					회원 디렉터리
				</h2>
				<p className="text-sm text-muted">
					등록된 이용자를 빠르게 검색하고 상태를 확인할 수 있습니다.
				</p>
			</VStack>
			<Chip
				className="h-8 px-2 text-sm font-medium"
				color="accent"
				variant="soft"
			>
				총 {totalCount.toLocaleString()}명
			</Chip>
		</VStack>
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
		isLoading,
		searchValue,
		onChangeSearchValue,
		onClearSearch,
		queryStates,
		setQueryStates,
	}: UserListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
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
						<TextField
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
			<Screen>
				<Screen.Header
					title="이용자 목록"
					description="시스템에 등록된 이용자를 조회합니다."
				/>
				<Screen.Body>
					<SectionSurface className="rounded-2xl border-border/80 bg-surface">
						<Section overflow="hidden">
							<Section.Body>
								<UsersDirectoryHeader totalCount={totalCount} />
								<DataGrid
									config={{
										toolbar: {
											leftInputs,
										},
										table: {
											entity: "User",
											columns: userListTableColumns,
											emptyMessage: "조회된 이용자가 없습니다.",
										},
									}}
									rows={userRows}
									totalCount={totalCount}
									state={gridState}
								/>
							</Section.Body>
						</Section>
					</SectionSurface>
				</Screen.Body>
			</Screen>
		);
	},
);
UserListScreen.displayName = "UserListScreen";
