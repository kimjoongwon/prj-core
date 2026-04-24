"use client";

import { useGetSubjects } from "@cocrepo/api/core/subjects";
import { SubjectListPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function SubjectsPageRoute() {
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		group: parseAsString.withDefault(""),
	});
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
