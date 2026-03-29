"use client";

import {
	getGetTemplatesQueryKey,
	type TemplateDto,
	useGetTemplates,
	useToggleTemplateStatus,
} from "@cocrepo/api/core/templates";
import {
	adminTemplatesPageQueryInputs,
	AdminTemplatesPage,
	type AdminTemplatesPageTemplate,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function TemplatesPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminTemplatesPageQueryInputs,
	);
	const { data: response, isLoading } = useGetTemplates(
		getTemplatesParams(queryStates),
	);
	const toggleMutation = useToggleTemplateStatus();
	const templates = (response?.data ?? []).map(mapTemplateRow);

	return (
		<AdminTemplatesPage
			templates={templates}
			totalCount={response?.meta?.total ?? 0}
			isLoading={isLoading}
			isToggling={toggleMutation.isPending}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/templates/new" as Route);
			}}
			onClickTemplateCode={(templateId) => {
				router.push(`/templates/${templateId}` as Route);
			}}
			onToggleTemplateStatusSwitch={async (templateId) => {
				try {
					await toggleMutation.mutateAsync({ templateId });
					await queryClient.invalidateQueries({
						queryKey: getGetTemplatesQueryKey(),
					});
					addToast({
						title: "상태 변경 완료",
						description: "템플릿 활성 상태가 변경되었습니다.",
						color: "success",
					});
				} catch (error) {
					addToast({
						title: "상태 변경 실패",
						description: "템플릿 상태 변경 중 오류가 발생했습니다.",
						color: "danger",
					});
					throw error;
				}
			}}
		/>
	);
});

function getTemplatesParams(
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0],
) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		isActive:
			queryStates.isActive === "true"
				? true
				: queryStates.isActive === "false"
					? false
					: undefined,
	};
}

function mapTemplateRow(template: TemplateDto): AdminTemplatesPageTemplate {
	return {
		id: template.id,
		code: template.code,
		name: template.name,
		isActive: template.isActive,
		createdAt: template.createdAt,
	};
}
