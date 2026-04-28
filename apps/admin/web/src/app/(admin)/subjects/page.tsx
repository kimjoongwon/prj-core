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
			subjects={response?.data}
			totalCount={response?.data?.length ?? 0}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
		/>
	);
});
