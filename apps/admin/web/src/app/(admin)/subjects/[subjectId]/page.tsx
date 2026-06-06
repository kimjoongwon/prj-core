"use client";

import {
	type SubjectDto,
	type SubjectFieldDto,
	useGetSubjectById,
	useGetSubjectFields,
} from "@cocrepo/api/core/subjects";
import { SubjectDetailPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function SubjectDetailPageRoute() {
	const subjectId = useParams<{ subjectId: string }>().subjectId;
	const router = useRouter();
	const { data: response, isLoading } = useGetSubjectById(subjectId);
	const subject = response?.data as SubjectDto | undefined;
	const shouldLoadFields = subject?.group === "entity";
	const { data: fieldsResponse, isLoading: isFieldsLoading } =
		useGetSubjectFields(subjectId, {
			query: {
				enabled: shouldLoadFields,
			},
		});

	return (
		<SubjectDetailPage
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
