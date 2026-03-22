"use client";

import {
	type SubjectDto,
	useGetSubjectsSuspense,
} from "@cocrepo/api/core/subjects";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageTitleBar,
	StatusChipCell,
	Surface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Suspense } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

const rightInputs: InputConfig[] = [
	{
		type: "select",
		id: "group",
		props: {
			defaultValue: "",
		},
	},
];

const columns: MetaDataGridColumnConfig<SubjectDto>[] = [
	{
		field: "name",
		label: "Subject 식별자",
		size: 220,
		isRequired: true,
		cell: ({ getValue }) => (
			<span className="font-mono text-sm">{getValue() as string}</span>
		),
	},
	{
		field: "displayName",
		label: "표시명",
		size: 180,
	},
	{
		field: "group",
		label: "분류",
		size: 160,
	},
	{
		field: "createdAt",
		label: "생성일",
		size: 160,
		cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
	},
	{
		field: "removedAt",
		label: "상태",
		size: 120,
		align: "center",
		cell: ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
	},
];

type SubjectsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetSubjectsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

function filterSubjects(
	subjects: SubjectDto[],
	queryStates: SubjectsQueryStates,
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

const SubjectsPageContent = observer(function SubjectsPageContent({
	queryStates,
	setQueryStates,
}: {
	queryStates: SubjectsQueryStates;
	setQueryStates: SetSubjectsQueryStates;
}) {
	const { data: response } = useGetSubjectsSuspense();
	const subjects = response?.data ?? [];
	const filteredSubjects = filterSubjects(subjects, queryStates);

	return (
		<MetaDataGrid
			config={{
				entity: "Subject",
				data: filteredSubjects,
				totalCount: filteredSubjects.length,
				isLoading: false,
				queryStates,
				setQueryStates,
				columns,
				leftInputs,
				rightInputs,
				emptyMessage: "조회된 Subject가 없습니다.",
			}}
		/>
	);
});

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

const SubjectsPageInner = observer(function SubjectsPageInner() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates([
		...leftInputs,
		...rightInputs,
	]);

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="Subject 목록"
				description="시스템에 등록된 Subject를 조회합니다."
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<Suspense
					fallback={
						<MetaDataGrid
							config={{
								entity: "Subject",
								data: [],
								totalCount: 0,
								isLoading: true,
								queryStates,
								setQueryStates,
								columns,
								leftInputs,
								rightInputs,
								emptyMessage: "조회된 Subject가 없습니다.",
							}}
						/>
					}
				>
					<SubjectsPageContent
						queryStates={queryStates}
						setQueryStates={setQueryStates}
					/>
				</Suspense>
			</Surface>
		</div>
	);
});

export default observer(function SubjectsPage() {
	return (
		<Suspense fallback={<SubjectsPageFallback />}>
			<SubjectsPageInner />
		</Suspense>
	);
});
