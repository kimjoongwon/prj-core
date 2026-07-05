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
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Card, Spinner } from "@heroui/react";
import { Search, UserCheck, UserMinus, Users } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ComponentType, type ReactNode, useEffect } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { TextField } from "../../input/TextField/TextField";
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
const metricCardColorStyles = {
	default: {
		icon: "text-muted",
		value: "text-foreground",
	},
	primary: {
		icon: "text-accent",
		value: "text-accent",
	},
	success: {
		icon: "text-success",
		value: "text-success",
	},
};
function MetricCard({
	title,
	value,
	description,
	icon,
	color = "default",
	className = "",
}: {
	title: string;
	value: number | string;
	description?: string;
	icon?: ReactNode;
	color?: keyof typeof metricCardColorStyles;
	className?: string;
}) {
	const styles = metricCardColorStyles[color];
	return (
		<Card className={`bg-surface ${className}`}>
			<Card.Content className="flex flex-row items-center gap-4 p-4">
				{icon ? (
					<div
						className={`flex size-10 items-center justify-center rounded-lg bg-surface-secondary ${styles.icon}`}
					>
						{icon}
					</div>
				) : null}
				<div className="flex flex-1 flex-col">
					<span className="text-sm text-muted">{title}</span>
					<span className={`text-2xl font-bold ${styles.value}`}>
						{typeof value === "number" ? value.toLocaleString() : value}
					</span>
					{description ? (
						<span className="text-xs text-muted">{description}</span>
					) : null}
				</div>
			</Card.Content>
		</Card>
	);
}
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
			<VStack fullWidth>
				<Screen.Header
					title="이용자 목록"
					description="시스템에 등록된 이용자를 조회합니다."
				/>
				{stats ? (
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
						<MetricCard
							className="h-full border border-accent/10 bg-accent/5 lg:col-span-6"
							description={`활성 ${stats.active.toLocaleString()}명 · 비활성 ${stats.inactive.toLocaleString()}명`}
							icon={<Users className="size-5" />}
							title="전체 이용자"
							value={stats.total}
							color="primary"
						/>
						<MetricCard
							className="h-full border border-success/10 bg-success/5 lg:col-span-3"
							description="현재 운영 중인 계정"
							icon={<UserCheck className="size-5" />}
							title="활성 이용자"
							value={stats.active}
							color="success"
						/>
						<MetricCard
							className="h-full border border-border bg-surface-secondary/70 lg:col-span-3"
							description="접속이 중지되었거나 비활성화된 계정"
							icon={<UserMinus className="size-5" />}
							title="비활성 이용자"
							value={stats.inactive}
							color="default"
						/>
					</div>
				) : null}
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden">
						<Section.Body>
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
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
UserListScreen.displayName = "UserListScreen";
