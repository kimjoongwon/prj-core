"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig } from "@cocrepo/type";
import {
	buildSubjectTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

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

export type AdminSubjectsPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type AdminSubjectsPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface AdminSubjectsPageSubject {
	id: string;
	name: string;
	displayName?: string | null;
	group?: string | null;
	createdAt: string | Date | null;
	removedAt?: string | null;
}

export interface AdminSubjectsPageProps {
	subjects: AdminSubjectsPageSubject[];
	totalCount: number;
	isLoading: boolean;
	queryStates: AdminSubjectsPageQueryStates;
	setQueryStates: AdminSubjectsPageSetQueryStates;
}

const subjectTableColumns =
	buildSubjectTableColumns<AdminSubjectsPageSubject>();

function filterSubjects(
	subjects: AdminSubjectsPageSubject[],
	queryStates: AdminSubjectsPageQueryStates,
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

export const AdminSubjectsPage = observer(function AdminSubjectsPage({
	subjects,
	totalCount,
	isLoading,
	queryStates,
	setQueryStates,
}: AdminSubjectsPageProps) {
	const filteredSubjects = filterSubjects(subjects, queryStates);

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
				<MetaDataGrid
					config={{
						entity: "Subject",
						data: filteredSubjects,
						totalCount,
						isLoading: false,
						queryStates,
						setQueryStates,
						columns: subjectTableColumns,
						leftInputs,
						rightInputs,
						emptyMessage: "조회된 Subject가 없습니다.",
					}}
				/>
			</Surface>
		</div>
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

export default AdminSubjectsPage;
