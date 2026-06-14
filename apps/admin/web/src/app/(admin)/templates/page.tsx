"use client";

import {
	getGetTemplatesQueryKey,
	useGetTemplates,
	useToggleTemplateStatus,
} from "@cocrepo/api/core/templates";
import { TemplateListScreen } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

interface TemplatesQueryStates {
	take: number;
	skip: number;
	search: string;
	isActive: string;
}

export default observer(function TemplatesPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		isActive: parseAsString.withDefault(""),
	});
	const { data: response, isLoading } = useGetTemplates(
		getTemplatesParams(queryStates),
	);
	const toggleMutation = useToggleTemplateStatus();

	return (
		<>
			<TemplateListScreen
				templates={response?.data}
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
						toast.success("상태 변경 완료", {
							description: "템플릿 활성 상태가 변경되었습니다.",
						});
					} catch (error) {
						toast.danger("상태 변경 실패", {
							description: "템플릿 상태 변경 중 오류가 발생했습니다.",
						});
						throw error;
					}
				}}
			/>
		</>
	);
});

function getTemplatesParams(queryStates: TemplatesQueryStates) {
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
