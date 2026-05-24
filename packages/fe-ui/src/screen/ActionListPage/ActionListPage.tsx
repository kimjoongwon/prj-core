"use client";

import type { ActionDto } from "@cocrepo/api/core/actions";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildActionTableColumns,
	DataGrid,
	DataGridStateModel,
	HStack,
	PageTitleBar,
	Surface,
	VStack,
	Button,
	useT,
} from "@cocrepo/ui";
import { Tab, Tabs } from "@cocrepo/ui/heroui";
import { KeyRound, Layers3, Plus, ShieldCheck } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type Key, type ReactNode, useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "액션명 또는 표시명 검색",
	},
];

export const adminActionsPageQueryInputs: InputConfig[] = [...leftInputs];

const ACTION_GROUP_FILTER_ALL_KEY = "__all_actions";

const actionGroupFilters = [
	{
		key: ACTION_GROUP_FILTER_ALL_KEY,
		label: "전체",
		description: "등록된 모든 권한 액션을 확인합니다.",
	},
	{
		key: "crud",
		label: "CRUD",
		description: "생성, 조회, 수정, 삭제처럼 기본 데이터 조작에 쓰입니다.",
	},
	{
		key: "visibility",
		label: "표시/마스킹",
		description: "민감 정보 노출 수준과 마스킹 조회 권한을 구분합니다.",
	},
	{
		key: "bulk",
		label: "일괄",
		description: "가져오기, 내보내기처럼 여러 데이터를 한 번에 다룹니다.",
	},
	{
		key: "workflow",
		label: "워크플로우",
		description: "접근, 승인, 반려 같은 운영 흐름의 상태 전환에 쓰입니다.",
	},
] as const;

export interface ActionListPageQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	group: string;
}
export type ActionListPageSetQueryStates = DataGridSetQueryStates;

export interface ActionListPageProps {
	actions?: ActionDto[];
	isLoading: boolean;
	queryStates: ActionListPageQueryStates;
	setQueryStates: ActionListPageSetQueryStates;
	onClickCreateButton: () => void;
	onClickActionRow: (actionId: string) => void;
}

function getActionGroupFilterKey(group: string) {
	return group || ACTION_GROUP_FILTER_ALL_KEY;
}

function findActionGroupFilter(key: string) {
	return (
		actionGroupFilters.find((filter) => filter.key === key) ??
		actionGroupFilters[0]
	);
}

function getActionGroupQueryValue(key: Key) {
	const selectedKey = String(key);
	return selectedKey === ACTION_GROUP_FILTER_ALL_KEY ? null : selectedKey;
}

function filterActions(
	actions: ActionDto[],
	queryStates: ActionListPageQueryStates,
) {
	const searchKeyword = queryStates.search?.trim().toLowerCase() ?? "";
	const groupFilter = queryStates.group?.trim().toLowerCase() ?? "";

	return actions.filter((action) => {
		if (
			searchKeyword &&
			![action.name, action.displayName]
				.filter(Boolean)
				.some((value) => value!.toLowerCase().includes(searchKeyword))
		) {
			return false;
		}

		if (groupFilter && (action.group ?? "").toLowerCase() !== groupFilter) {
			return false;
		}

		return true;
	});
}

function paginateActions(
	actions: ActionDto[],
	queryStates: ActionListPageQueryStates,
) {
	const start = Math.max(queryStates.skip, 0);
	const end = start + Math.max(queryStates.take, 1);

	return actions.slice(start, end);
}

export const ActionListPage = observer(
	({
		actions,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickActionRow,
	}: ActionListPageProps) => {
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const actionRows = actions ?? [];
		const filteredActions = filterActions(actionRows, queryStates);
		const visibleActions = paginateActions(filteredActions, queryStates);
		const totalCount = filteredActions.length;
		const handleActionRowClick = (action: ActionDto) => {
			onClickActionRow(action.id);
		};
		const handleActionGroupFilterChange = (group: string | null) => {
			void setQueryStates({ group, skip: 0 });
		};
		const actionTableColumns = buildActionTableColumns<ActionDto>({
			onClickDetailButton: handleActionRowClick,
		});

		if (isLoading) {
			return <ActionsPageFallback />;
		}

		return (
			<VStack gap="section">
				<PageTitleBar
					title="권한 액션 목록"
					description="역할과 정책에서 허용할 동작 단위를 관리하는 권한 액션 카탈로그입니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							액션 등록
						</Button>
					}
				/>
				<ActionContextPanel />
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					<VStack gap="section">
						<ActionGroupFilterTabs
							selectedGroup={queryStates.group}
							onChangeGroup={handleActionGroupFilterChange}
						/>
						<DataGrid
							config={{
								entity: "Action",
								columns: actionTableColumns,
								leftInputs,
								onRowClick: handleActionRowClick,
								emptyMessage: "조건에 맞는 권한 액션이 없습니다.",
							}}
							rows={visibleActions}
							totalCount={totalCount}
							isLoading={false}
							state={gridState}
						/>
					</VStack>
				</Surface>
			</VStack>
		);
	},
);

const ActionContextPanel = observer(() => {
	return (
		<Surface className="rounded-2xl border-divider/80 bg-content1/70">
			<VStack gap="block">
				<PageTitleBar
					level={2}
					title="권한 액션 카탈로그"
					description="액션은 권한 규칙이 사용자의 동작을 판단할 때 참조하는 기준입니다."
				/>
				<div className="grid divide-y divide-divider/80 overflow-hidden rounded-xl border border-divider/80 bg-content2/30 md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-divider/80">
					<ActionContextItem
						icon={<KeyRound className="h-5 w-5" />}
						title="동작 단위"
						description="액션은 역할과 정책에서 허용할 동작 단위입니다."
					/>
					<ActionContextItem
						icon={<Layers3 className="h-5 w-5" />}
						title="Ability 조합"
						description="Ability = 대상 + 액션 조합으로 실제 권한을 구성합니다."
					/>
					<ActionContextItem
						icon={<ShieldCheck className="h-5 w-5" />}
						title="시스템 액션"
						description="시스템 액션은 기본 제공 항목이며 수정/삭제가 제한됩니다."
					/>
				</div>
			</VStack>
		</Surface>
	);
});

interface ActionContextItemProps {
	icon: ReactNode;
	title: string;
	description: string;
}

const ActionContextItem = observer(
	({ icon, title, description }: ActionContextItemProps) => {
		const t = useT();

		return (
			<HStack
				gap="block"
				alignItems="start"
				className="border-divider/80 p-4 md:border-b-0"
			>
				<span className="rounded-lg bg-primary/10 p-2 text-primary">
					{icon}
				</span>
				<VStack gap="dense">
					<span className="text-sm font-semibold text-foreground">
						{t(title)}
					</span>
					<span className="text-sm text-default-600">{t(description)}</span>
				</VStack>
			</HStack>
		);
	},
);

interface ActionGroupFilterTabsProps {
	selectedGroup: string;
	onChangeGroup: (group: string | null) => void;
}

const ActionGroupFilterTabs = observer(
	({ selectedGroup, onChangeGroup }: ActionGroupFilterTabsProps) => {
		const t = useT();
		const selectedKey = getActionGroupFilterKey(selectedGroup);
		const selectedFilter = findActionGroupFilter(selectedKey);
		const handleSelectionChange = (key: Key) => {
			onChangeGroup(getActionGroupQueryValue(key));
		};

		return (
			<VStack gap="block">
				<Tabs
					aria-label={t("권한 액션 그룹 필터")}
					selectedKey={selectedKey}
					onSelectionChange={handleSelectionChange}
					variant="bordered"
					color="primary"
					radius="full"
					classNames={{
						tabList: "flex-wrap",
						tab: "h-9",
					}}
				>
					{actionGroupFilters.map((filter) => (
						<Tab key={filter.key} title={t(filter.label)} />
					))}
				</Tabs>
				<div className="rounded-lg border border-divider bg-content2/40 p-4">
					<div className="text-sm font-semibold text-foreground">
						{t(selectedFilter.label)} {t("액션")}
					</div>
					<p className="mt-1 text-sm text-default-600">
						{t(selectedFilter.description)}
					</p>
				</div>
			</VStack>
		);
	},
);

const ActionsPageFallback = observer(() => {
	return (
		<VStack gap="section">
			<PageTitleBar
				title="권한 액션 목록"
				description="역할과 정책에서 허용할 동작 단위를 관리하는 권한 액션 카탈로그입니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</VStack>
	);
});
