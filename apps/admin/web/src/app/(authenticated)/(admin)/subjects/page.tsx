"use client";

import { useGetSubjects } from "@cocrepo/api/core/subjects";
import { SubjectListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function SubjectsPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		group: parseAsString.withDefault(""),
	});
	const { data: response, isLoading } = useGetSubjects({
		group: queryStates.group || undefined,
	});
	const onClickSubjectRow = (subjectId: bigint) => {
		router.push(`/subjects/${String(subjectId)}` as Route);
	};

	return (
		<SubjectListScreen
			subjects={response?.data}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickSubject={onClickSubjectRow}
		/>
	);
});
