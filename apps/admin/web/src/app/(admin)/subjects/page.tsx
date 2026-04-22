"use client";

import { useGetSubjects } from "@cocrepo/api/core/subjects";
import {
	adminSubjectsPageQueryInputs,
	SubjectListPage,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export default observer(function SubjectsPageRoute() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminSubjectsPageQueryInputs,
	);
	const { data: response, isLoading } = useGetSubjects();

	return (
		<SubjectListPage
			subjects={(response?.data ?? []).map((subject) => ({
				id: subject.id,
				name: subject.name,
				displayName: subject.displayName,
				group: subject.group,
				createdAt: subject.createdAt,
				removedAt: subject.removedAt,
			}))}
			totalCount={(response?.data ?? []).length}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
		/>
	);
});
