"use client";

import { useGetSubjects } from "@cocrepo/api/core/subjects";
import {
	adminSubjectsPageQueryInputs,
	AdminSubjectsPage,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export default observer(function SubjectsPageRoute() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminSubjectsPageQueryInputs,
	);
	const { data: response, isLoading } = useGetSubjects();

	return (
		<AdminSubjectsPage
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
