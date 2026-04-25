"use client";

import type {
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildAbilityListTableColumns,
	MetaDataGrid,
	MetaDataGridStateModel,
} from "@cocrepo/ui";
import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { Plus, Search } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { VStack } from "../../rhythm";
import { Surface } from "../../surface";
import { PageTitleBar } from "../../widget";

export interface AbilityListPageOption {
	id: string;
	label: string;
}

export interface AbilityListPageAbility {
	id: string;
	name: string;
	subjectId: string;
	actionId: string;
	subjectLabel: string;
	actionLabel: string;
	inverted: boolean;
	fieldCount: number;
	hasConditions: boolean;
	createdAt: string | Date | null;
}

export interface AbilityListPageFilters {
	searchTerm: string;
	selectedSubjectId: string;
	selectedActionId: string;
	selectedInverted: string;
}

export interface AbilityListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
}
export type AbilityListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface AbilityListPageProps {
	abilities: AbilityListPageAbility[];
	totalCount: number;
	subjects: AbilityListPageOption[];
	actions: AbilityListPageOption[];
	filters: AbilityListPageFilters;
	isLoading: boolean;
	queryStates: AbilityListPageQueryStates;
	setQueryStates: AbilityListPageSetQueryStates;
	onChangeSearchTerm: (value: string) => void;
	onChangeSubjectId: (value: string) => void;
	onChangeActionId: (value: string) => void;
	onChangeInverted: (value: string) => void;
	onClickResetFiltersButton: () => void;
	onClickAbilityRow: (abilityId: string) => void;
	onClickCreateButton: () => void;
}

const abilityListTableColumns =
	buildAbilityListTableColumns<AbilityListPageProps["abilities"][number]>();

const AbilityListPageFallback = observer(() => {
	return (
		<div className="space-y-5">
			<Surface
				className="rounded-2xl border-divider/80 bg-content1/70"
				padding="lg"
			>
				<div className="flex items-center justify-center gap-2">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</Surface>
			<Surface
				className="rounded-2xl border-divider/80 bg-content1/70"
				padding="lg"
			>
				<div className="flex items-center justify-center gap-2">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</Surface>
		</div>
	);
});

export const AbilityListPage = observer(({
	abilities,
	totalCount,
	subjects,
	actions,
	filters,
	isLoading,
	queryStates,
	setQueryStates,
	onChangeSearchTerm,
	onChangeSubjectId,
	onChangeActionId,
	onChangeInverted,
	onClickResetFiltersButton,
	onClickAbilityRow,
	onClickCreateButton,
}: AbilityListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	const subjectOptionIds = new Set(subjects.map((subject) => subject.id));
	const actionOptionIds = new Set(actions.map((action) => action.id));
	const handleAbilityRowClick = (ability: AbilityListPageAbility) => {
		onClickAbilityRow(ability.id);
	};

	if (isLoading) {
		return <AbilityListPageFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="권한 목록"
				description="시스템에 등록된 CASL 권한을 관리합니다."
				actions={
					<Button
						color="primary"
						startContent={<Plus className="h-4 w-4" />}
						onPress={onClickCreateButton}
					>
						권한 추가
					</Button>
				}
			/>
			<VStack gap="section">
				<Surface className="rounded-2xl border-divider/80 bg-content1/70">
					<div className="mb-5 border-b border-divider/80 pb-4">
						<PageTitleBar level={2} title="필터" />
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						<Input
							aria-label="권한 이름 검색"
							placeholder="권한 이름 검색"
							value={filters.searchTerm}
							onValueChange={onChangeSearchTerm}
							startContent={<Search className="h-4 w-4 text-default-400" />}
							isClearable
							onClear={() => onChangeSearchTerm("")}
						/>
						<Select
							aria-label="Subject 선택"
							placeholder="Subject 선택"
							selectedKeys={
								filters.selectedSubjectId &&
								subjectOptionIds.has(filters.selectedSubjectId)
									? [filters.selectedSubjectId]
									: []
							}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								onChangeSubjectId(selected || "");
							}}
						>
							{subjects.map((subject) => (
								<SelectItem key={subject.id}>{subject.label}</SelectItem>
							))}
						</Select>
						<Select
							aria-label="Action 선택"
							placeholder="Action 선택"
							selectedKeys={
								filters.selectedActionId &&
								actionOptionIds.has(filters.selectedActionId)
									? [filters.selectedActionId]
									: []
							}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								onChangeActionId(selected || "");
							}}
						>
							{actions.map((action) => (
								<SelectItem key={action.id}>{action.label}</SelectItem>
							))}
						</Select>
						<Select
							aria-label="유형 선택"
							placeholder="유형 선택"
							selectedKeys={
								filters.selectedInverted === "true" ||
								filters.selectedInverted === "false"
									? [filters.selectedInverted]
									: []
							}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								onChangeInverted(selected || "");
							}}
						>
							<SelectItem key="false">허용(can)</SelectItem>
							<SelectItem key="true">거부(cannot)</SelectItem>
						</Select>
					</div>
					<div className="mt-3 flex justify-end">
						<Button
							size="sm"
							variant="flat"
							onPress={onClickResetFiltersButton}
						>
							필터 초기화
						</Button>
					</div>
				</Surface>

				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					<div className="mb-4 border-b border-divider/80 pb-4">
						<PageTitleBar level={2} title="권한 목록" />
					</div>
					<MetaDataGrid
						config={{
							entity: "Ability",
							columns: abilityListTableColumns,
							onRowClick: handleAbilityRowClick,
							emptyMessage:
								totalCount === 0
									? "등록된 권한이 없습니다."
									: "검색 조건에 맞는 권한이 없습니다.",
						}}
	rows={abilities}
	totalCount={abilities.length}
	isLoading={false}
	state={gridState}
/>
				</Surface>
			</VStack>
		</div>
	);
});
