"use client";

import type { SubjectDto } from "@cocrepo/api/core/subjects";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildSubjectTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	useT,
	VStack,
} from "@cocrepo/ui";
import { Tabs } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type Key, useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "대상명으로 검색...",
	},
];
const SUBJECT_GROUP_FILTER_ALL_KEY = "__all_subjects";
const subjectGroupFilters = [
	{
		key: SUBJECT_GROUP_FILTER_ALL_KEY,
		label: "전체",
		description: "등록된 모든 권한 대상을 한 번에 확인합니다.",
	},
	{
		key: "all",
		label: "공통",
		description: "모든 화면과 데이터에 넓게 적용되는 공통 권한 대상입니다.",
	},
	{
		key: "entity",
		label: "데이터",
		description:
			"사용자, 역할, 공간처럼 업무 데이터에 접근하는 권한 대상입니다.",
	},
	{
		key: "menu",
		label: "메뉴",
		description:
			"좌측 메뉴나 내비게이션에서 특정 메뉴를 볼 수 있는 대상입니다.",
	},
	{
		key: "page",
		label: "화면",
		description: "특정 관리 화면에 들어갈 수 있는지 제어하는 권한 대상입니다.",
	},
	{
		key: "feature",
		label: "기능",
		description:
			"내보내기, 가져오기, 알림 발송처럼 화면 안에서 실행하는 작업입니다.",
	},
	{
		key: "ui",
		label: "화면 요소",
		description:
			"버튼, 탭, 배너처럼 화면 일부를 보거나 사용할 수 있는 대상입니다.",
	},
] as const;
export const adminSubjectsPageQueryInputs: InputConfig[] = [...leftInputs];
export interface SubjectListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	group: string;
}
export type SubjectListScreenSetQueryStates = DataGridSetQueryStates;
export interface SubjectListScreenProps {
	subjects?: SubjectDto[];
	isLoading: boolean;
	queryStates: SubjectListScreenQueryStates;
	setQueryStates: SubjectListScreenSetQueryStates;
	onClickSubject: (subjectId: string) => void;
}
const subjectTableColumns = buildSubjectTableColumns<SubjectDto>();
function getSubjectGroupFilterKey(group: string) {
	return group || SUBJECT_GROUP_FILTER_ALL_KEY;
}
function findSubjectGroupFilter(key: string) {
	return (
		subjectGroupFilters.find((filter) => filter.key === key) ??
		subjectGroupFilters[0]
	);
}
function getSubjectGroupQueryValue(key: Key) {
	const selectedKey = String(key);
	return selectedKey === SUBJECT_GROUP_FILTER_ALL_KEY ? null : selectedKey;
}
function filterSubjects(
	subjects: SubjectDto[],
	queryStates: SubjectListScreenQueryStates,
) {
	const searchKeyword = queryStates.search?.trim().toLowerCase() ?? "";
	const groupFilter = queryStates.group?.trim().toLowerCase() ?? "";
	return subjects.filter((subject) => {
		if (
			searchKeyword &&
			![subject.name, subject.displayName]
				.filter(Boolean)
				.some((value) => value!.toLowerCase().includes(searchKeyword))
		) {
			return false;
		}
		if (groupFilter && (subject.group ?? "").toLowerCase() !== groupFilter) {
			return false;
		}
		return true;
	});
}
function paginateSubjects(
	subjects: SubjectDto[],
	queryStates: SubjectListScreenQueryStates,
) {
	const start = Math.max(queryStates.skip, 0);
	const end = start + Math.max(queryStates.take, 1);
	return subjects.slice(start, end);
}
interface SubjectGroupFilterTabsProps {
	selectedGroup: string;
	onChangeGroup: (group: string | null) => void;
}
const SubjectGroupFilterTabs = observer(
	({ selectedGroup, onChangeGroup }: SubjectGroupFilterTabsProps) => {
		const t = useT();
		const selectedKey = getSubjectGroupFilterKey(selectedGroup);
		const selectedFilter = findSubjectGroupFilter(selectedKey);
		const handleSelectionChange = (key: Key) => {
			onChangeGroup(getSubjectGroupQueryValue(key));
		};
		return (
			<VStack>
				<Tabs
					aria-label={t("대상 유형 필터")}
					selectedKey={selectedKey}
					onSelectionChange={handleSelectionChange}
					variant="secondary"
				>
					<Tabs.List>
						{subjectGroupFilters.map((filter) => (
							<Tabs.Tab key={filter.key} id={filter.key}>
								{t(filter.label)}
							</Tabs.Tab>
						))}
					</Tabs.List>
				</Tabs>
				<div className="rounded-lg border border-border bg-surface-secondary p-4">
					<div className="text-sm font-semibold text-foreground">
						{t(selectedFilter.label)} {t("대상")}
					</div>
					<p className="mt-1 text-sm text-muted">
						{t(selectedFilter.description)}
					</p>
				</div>
			</VStack>
		);
	},
);
export const SubjectListScreen = observer(
	({
		subjects,
		isLoading,
		queryStates,
		setQueryStates,
		onClickSubject,
	}: SubjectListScreenProps) => {
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
		const subjectRows = subjects ?? [];
		const filteredSubjects = filterSubjects(subjectRows, queryStates);
		const visibleSubjects = paginateSubjects(filteredSubjects, queryStates);
		const totalCount = filteredSubjects.length;
		const handleRowClick = (subject: SubjectDto) => {
			onClickSubject(subject.id);
		};
		const handleSubjectGroupFilterChange = (group: string | null) => {
			void setQueryStates({
				group,
				skip: 0,
			});
		};
		if (isLoading) {
			return <SubjectsScreenFallback />;
		}
		return (
			<div className="space-y-5">
				<Screen.Header
					title="권한 대상 목록"
					description="역할이나 정책에서 무엇을 허용할지 선택할 때 사용하는 관리 대상입니다."
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<VStack>
								<SubjectGroupFilterTabs
									selectedGroup={queryStates.group}
									onChangeGroup={handleSubjectGroupFilterChange}
								/>
								<DataGrid
									config={{
										entity: "Subject",
										columns: subjectTableColumns,
										leftInputs,
										onRowClick: handleRowClick,
										emptyMessage: "조회된 대상이 없습니다.",
									}}
									rows={visibleSubjects}
									totalCount={totalCount}
									state={gridState}
								/>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</div>
		);
	},
);
const SubjectsScreenFallback = observer(function SubjectsScreenFallback() {
	return (
		<div className="space-y-5">
			<Screen.Header
				title="권한 대상 목록"
				description="역할이나 정책에서 무엇을 허용할지 선택할 때 사용하는 관리 대상입니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	);
});
