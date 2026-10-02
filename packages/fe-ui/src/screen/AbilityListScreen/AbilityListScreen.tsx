"use client";

import type { AbilityResponseDto } from "@cocrepo/api/core/abilities";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import { DataGrid, DataGridState, Screen, SectionSurface } from "@cocrepo/ui";
import { Card, ListBox, Spinner } from "@heroui/react";
import {
	Ban,
	FilterX,
	ListChecks,
	Plus,
	Search,
	ShieldCheck,
	SlidersHorizontal,
} from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ReactNode, useEffect } from "react";
import { Chip } from "../../data-display";
import { buildAbilityListTableColumns } from "../../data-grid/columns";
import { Button } from "../../input/Button/Button";
import { Select } from "../../input/Select/Select";
import { TextField } from "../../input/TextField/TextField";
import { Section } from "../../layout";
import { HStack, VStack } from "../../rhythm";
export interface AbilityListScreenOption {
	id: bigint;
	label: string;
}
export interface AbilityListScreenFilters {
	searchTerm: string;
	selectedSubjectId: string;
	selectedActionId: string;
	selectedInverted: string;
}
export interface AbilityListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	subjectId: string;
	actionId: string;
	inverted: string;
}
export type AbilityListScreenSetQueryStates = DataGridSetQueryStates;
export interface AbilityListScreenSummary {
	total: number;
	filtered: number;
	allow: number;
	deny: number;
	conditional: number;
	fieldScoped: number;
}
export interface AbilityListScreenProps {
	abilities?: AbilityResponseDto[];
	totalCount: number;
	summary: AbilityListScreenSummary;
	subjects: AbilityListScreenOption[];
	actions: AbilityListScreenOption[];
	filters: AbilityListScreenFilters;
	isLoading: boolean;
	queryStates: AbilityListScreenQueryStates;
	setQueryStates: AbilityListScreenSetQueryStates;
	onChangeSearchTerm: (value: string) => void;
	onChangeSubjectId: (value: string) => void;
	onChangeActionId: (value: string) => void;
	onChangeInverted: (value: string) => void;
	onClickResetFiltersButton: () => void;
	onClickAbilityRow: (abilityId: bigint) => void;
	onClickCreateButton: () => void;
}
const abilityListTableColumns =
	buildAbilityListTableColumns<AbilityResponseDto>();
const metricCardColorStyles = {
	accent: {
		icon: "text-accent",
		value: "text-accent",
	},
	success: {
		icon: "text-success",
		value: "text-success",
	},
	danger: {
		icon: "text-danger",
		value: "text-danger",
	},
	warning: {
		icon: "text-warning",
		value: "text-warning",
	},
};
function MetricCard({
	title,
	value,
	description,
	icon,
	color,
	className = "",
}: {
	title: string;
	value: number | string;
	description?: string;
	icon?: ReactNode;
	color: keyof typeof metricCardColorStyles;
	className?: string;
}) {
	const styles = metricCardColorStyles[color];
	return (
		<Card className={`bg-surface ${className}`}>
			<Card.Content className="p-4">
				<HStack alignItems="center" gap="section">
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
				</HStack>
			</Card.Content>
		</Card>
	);
}
function getOptionLabel(options: AbilityListScreenOption[], optionId: string) {
	return options.find((option) => String(option.id) === optionId)?.label ?? "";
}
function getRuleTypeLabel(value: string) {
	if (value === "false") {
		return "허용";
	}
	if (value === "true") {
		return "거부";
	}
	return "";
}
function hasActiveFilters(filters: AbilityListScreenFilters) {
	return Boolean(
		filters.searchTerm ||
			filters.selectedSubjectId ||
			filters.selectedActionId ||
			filters.selectedInverted,
	);
}
const AbilityListScreenFallback = observer(() => {
	return (
		<VStack gap="page">
			<SectionSurface className="rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>
						<HStack alignItems="center" justifyContent="center">
							<Spinner size="sm" />
							<span className="text-muted">로딩 중...</span>
						</HStack>
					</Section.Body>
				</Section>
			</SectionSurface>
			<SectionSurface className="rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>
						<HStack alignItems="center" justifyContent="center">
							<Spinner size="sm" />
							<span className="text-muted">로딩 중...</span>
						</HStack>
					</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	);
});
export const AbilityListScreen = observer(
	({
		abilities,
		totalCount,
		summary,
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
	}: AbilityListScreenProps) => {
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
		const abilityRows = abilities ?? [];
		const subjectOptionIds = new Set(
			subjects.map((subject) => String(subject.id)),
		);
		const actionOptionIds = new Set(actions.map((action) => String(action.id)));
		const selectedSubjectLabel = getOptionLabel(
			subjects,
			filters.selectedSubjectId,
		);
		const selectedActionLabel = getOptionLabel(
			actions,
			filters.selectedActionId,
		);
		const selectedRuleTypeLabel = getRuleTypeLabel(filters.selectedInverted);
		const activeFilters = hasActiveFilters(filters);
		const handleAbilityRowClick = (ability: AbilityResponseDto) => {
			onClickAbilityRow(ability.id);
		};
		const handleSearchClear = () => {
			onChangeSearchTerm("");
		};
		const handleSubjectSelectionChange = (value: string | number | null) => {
			onChangeSubjectId(typeof value === "string" ? value : "");
		};
		const handleActionSelectionChange = (value: string | number | null) => {
			onChangeActionId(typeof value === "string" ? value : "");
		};
		const handleInvertedSelectionChange = (value: string | number | null) => {
			onChangeInverted(typeof value === "string" ? value : "");
		};
		if (isLoading) {
			return <AbilityListScreenFallback />;
		}
		return (
			<VStack gap="page">
				<Screen.Header
					title="권한 정의"
					description="대상과 행동을 조합해 운영 권한 규칙을 확인합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							권한 추가
						</Button>
					}
				/>
				<VStack>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						<MetricCard
							className="h-full border border-accent/10 bg-accent/5"
							color="accent"
							description={`허용 ${summary.allow.toLocaleString()}건`}
							icon={<ListChecks className="size-5" />}
							title="전체"
							value={summary.total}
						/>
						<MetricCard
							className="h-full border border-success/10 bg-success/5"
							color="success"
							description="현재 검색/필터 결과"
							icon={<ShieldCheck className="size-5" />}
							title="표시 중"
							value={summary.filtered}
						/>
						<MetricCard
							className="h-full border border-danger/10 bg-danger/5"
							color="danger"
							description="cannot 규칙"
							icon={<Ban className="size-5" />}
							title="거부 규칙"
							value={summary.deny}
						/>
						<MetricCard
							className="h-full border border-warning/10 bg-warning/5"
							color="warning"
							description={`조건 ${summary.conditional.toLocaleString()}건 · 필드 ${summary.fieldScoped.toLocaleString()}건`}
							icon={<SlidersHorizontal className="size-5" />}
							title="조건/필드 제한"
							value={summary.conditional + summary.fieldScoped}
						/>
					</div>
					<SectionSurface className="rounded-2xl border-border/80 bg-surface">
						<Section>
							<Section.Body>
								<div className="mb-5 border-b border-border/80 pb-4">
									<Section.Header
										title="찾기와 좁히기"
										description="권한 이름뿐 아니라 설명, 대상, 행동으로도 검색할 수 있습니다."
									/>
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
									<TextField
										aria-label="권한 이름 검색"
										placeholder="권한, 대상, 행동 검색"
										value={filters.searchTerm}
										onValueChange={onChangeSearchTerm}
										startContent={<Search className="h-4 w-4 text-muted" />}
										isClearable
										onClear={handleSearchClear}
									/>
									<Select
										aria-label="대상 선택"
										placeholder="대상(Subject)"
										value={
											filters.selectedSubjectId &&
											subjectOptionIds.has(filters.selectedSubjectId)
												? filters.selectedSubjectId
												: null
										}
										onChange={handleSubjectSelectionChange}
									>
										{subjects.map((subject) => (
											<ListBox.Item
												key={String(subject.id)}
												id={String(subject.id)}
												textValue={subject.label}
											>
												{subject.label}
											</ListBox.Item>
										))}
									</Select>
									<Select
										aria-label="행동 선택"
										placeholder="행동(Action)"
										value={
											filters.selectedActionId &&
											actionOptionIds.has(filters.selectedActionId)
												? filters.selectedActionId
												: null
										}
										onChange={handleActionSelectionChange}
									>
										{actions.map((action) => (
											<ListBox.Item
												key={String(action.id)}
												id={String(action.id)}
												textValue={action.label}
											>
												{action.label}
											</ListBox.Item>
										))}
									</Select>
									<Select
										aria-label="규칙 유형 선택"
										placeholder="규칙 유형"
										value={
											filters.selectedInverted === "true" ||
											filters.selectedInverted === "false"
												? filters.selectedInverted
												: null
										}
										onChange={handleInvertedSelectionChange}
									>
										<ListBox.Item key="false" id="false" textValue="허용">
											허용
										</ListBox.Item>
										<ListBox.Item key="true" id="true" textValue="거부">
											거부
										</ListBox.Item>
									</Select>
								</div>
								<VStack
									gap="block"
									className="mt-4 md:flex-row md:items-center md:justify-between"
								>
									<HStack alignItems="center" className="flex-wrap min-h-8">
										{filters.searchTerm ? (
											<Chip size="sm" variant="soft" color="accent">
												검색: {filters.searchTerm}
											</Chip>
										) : null}
										{selectedSubjectLabel ? (
											<Chip size="sm" variant="soft" color="default">
												대상: {selectedSubjectLabel}
											</Chip>
										) : null}
										{selectedActionLabel ? (
											<Chip size="sm" variant="soft" color="default">
												행동: {selectedActionLabel}
											</Chip>
										) : null}
										{selectedRuleTypeLabel ? (
											<Chip
												size="sm"
												variant="soft"
												color={
													filters.selectedInverted === "true"
														? "danger"
														: "success"
												}
											>
												유형: {selectedRuleTypeLabel}
											</Chip>
										) : null}
										{!activeFilters ? (
											<span className="text-sm text-muted">
												적용된 필터가 없습니다.
											</span>
										) : null}
									</HStack>
									<Button
										size="sm"
										variant="tertiary"
										startContent={<FilterX className="h-4 w-4" />}
										isDisabled={!activeFilters}
										onPress={onClickResetFiltersButton}
									>
										필터 초기화
									</Button>
								</VStack>
							</Section.Body>
						</Section>
					</SectionSurface>

					<SectionSurface className="rounded-2xl border-border/80 bg-surface">
						<Section overflow="hidden">
							<Section.Body>
								<div className="mb-4 border-b border-border/80 pb-4">
									<Section.Header
										title="권한 규칙"
										description="행을 선택하면 상세 정보와 JSON 조건을 확인할 수 있습니다."
									/>
								</div>
								<DataGrid
									config={{
										table: {
											entity: "Ability",
											columns: abilityListTableColumns,
											onRowClick: handleAbilityRowClick,
											emptyMessage:
												totalCount === 0
													? "등록된 권한이 없습니다."
													: "검색 조건에 맞는 권한이 없습니다.",
										},
									}}
									rows={abilityRows}
									totalCount={totalCount}
									state={gridState}
								/>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			</VStack>
		);
	},
);
