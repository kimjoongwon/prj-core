"use client";

import {
	getSubjectFields,
	type SubjectDto,
	type SubjectFieldDto,
	useGetSubjectById,
} from "@cocrepo/api/core/subjects";
import { AdminSubjectsSubjectIdPage } from "@cocrepo/ui";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function SubjectDetailPageRoute() {
	const subjectId = useParams<{ subjectId: string }>().subjectId;
	const router = useRouter();
	const { data: response, isLoading } = useGetSubjectById(subjectId);
	const subject = response?.data as SubjectDto | undefined;
	const shouldLoadFields = subject?.group === "entity";
	const { data: fieldsResponse, isLoading: isFieldsLoading } = useQuery({
		queryKey: ["subject-fields", subjectId],
		queryFn: () => getSubjectFields(subjectId),
		enabled: shouldLoadFields,
	});

	return (
		<AdminSubjectsSubjectIdPage
			subject={
				subject
					? {
							name: subject.name,
							displayName: subject.displayName,
							icon: subject.icon,
							group: subject.group,
							order: subject.order,
							isSystem: subject.isSystem,
							createdAt: subject.createdAt,
							updatedAt: subject.updatedAt,
						}
					: undefined
			}
			subjectFields={(
				(fieldsResponse?.data as SubjectFieldDto[] | undefined) ?? []
			).map((field) => ({
				name: field.name,
				displayName: field.displayName,
				type: field.type,
				isRequired: field.isRequired,
				isRelation: field.isRelation,
			}))}
			isLoading={isLoading}
			isFieldsLoading={shouldLoadFields ? isFieldsLoading : false}
			onClickBackButton={() => {
				router.push("/subjects" as Route);
			}}
		/>
	);
});
