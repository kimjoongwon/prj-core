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
	DataGridStateModel,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름으로 검색...",
	},
];

const rightInputs: InputConfig[] = [
	{
		type: "select",
		id: "group",
		placeholder: "분류",
		props: {
			defaultValue: "",
		},
	},
];

export const adminSubjectsPageQueryInputs: InputConfig[] = [
	...leftInputs,
	...rightInputs,
];

export interface SubjectListPageQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	group: string;
}
export type SubjectListPageSetQueryStates = DataGridSetQueryStates;

export interface SubjectListPageProps {
	subjects?: SubjectDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: SubjectListPageQueryStates;
	setQueryStates: SubjectListPageSetQueryStates;
}

const subjectTableColumns = buildSubjectTableColumns<SubjectDto>();

function filterSubjects(
	subjects: SubjectDto[],
	queryStates: SubjectListPageQueryStates,
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

export const SubjectListPage = observer(
	({
		subjects,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
	}: SubjectListPageProps) => {
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const subjectRows = subjects ?? [];
		const filteredSubjects = filterSubjects(subjectRows, queryStates);

		if (isLoading) {
			return <SubjectsPageFallback />;
		}

		return (
			<div className="space-y-5">
				<PageTitleBar
					title="Subject 목록"
					description="시스템에 등록된 Subject를 조회합니다."
				/>
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					<DataGrid
						config={{
							entity: "Subject",
							columns: subjectTableColumns,
							leftInputs,
							rightInputs,
							emptyMessage: "조회된 Subject가 없습니다.",
						}}
						rows={filteredSubjects}
						totalCount={totalCount}
						isLoading={false}
						state={gridState}
					/>
				</Surface>
			</div>
		);
	},
);

function SubjectsPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="Subject 목록"
				description="시스템에 등록된 Subject를 조회합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}
