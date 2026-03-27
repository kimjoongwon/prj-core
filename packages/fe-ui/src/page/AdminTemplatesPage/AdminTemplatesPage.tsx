"use client";

import {
	type TemplateDto,
	getGetTemplatesQueryKey,
	useGetTemplatesSuspense,
	useToggleTemplateStatus,
} from "@cocrepo/api/core/templates";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	buildTemplateTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast, Button } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름, 코드로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

type TemplatesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetTemplatesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

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

const TemplatesGridContent = observer(function TemplatesGridContent({
	queryStates,
	setQueryStates,
	columns,
}: {
	queryStates: TemplatesQueryStates;
	setQueryStates: SetTemplatesQueryStates;
	columns: MetaDataGridColumnConfig<TemplateDto>[];
}) {
	const { data: response } = useGetTemplatesSuspense(
		getTemplatesParams(queryStates),
	);

	const templates = (response?.data ?? []) as TemplateDto[];
	const totalCount = response?.meta?.total ?? 0;

	return (
		<MetaDataGrid
			config={{
				entity: "Template",
				data: templates,
				totalCount,
				isLoading: false,
				queryStates,
				setQueryStates,
				columns,
				leftInputs,
				emptyMessage: "등록된 템플릿이 없습니다.",
			}}
		/>
	);
});

function TemplatesPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="메시지 템플릿"
				description="시스템에 등록된 메시지 템플릿을 관리합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

const TemplatesPageInner = observer(function TemplatesPageInner() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
	const toggleMutation = useToggleTemplateStatus();

	const onToggleTemplateStatusSwitch = async (templateId: string) => {
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
		} catch {
			addToast({
				title: "상태 변경 실패",
				description: "템플릿 상태 변경 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw new Error("토글 실패");
		}
	};

	const onClickTemplateCode = (template: TemplateDto) => {
		router.push(`/templates/${template.id}`);
	};

	const columns = buildTemplateTableColumns({
		onClickTemplateCode,
		onToggleTemplateStatusSwitch,
	});

	const createTemplateButton = (
		<Button
			as={Link}
			href="/templates/new"
			color="primary"
			startContent={<Plus className="h-4 w-4" />}
		>
			템플릿 등록
		</Button>
	);

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="메시지 템플릿"
				description="시스템에 등록된 메시지 템플릿을 관리합니다."
				actions={createTemplateButton}
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<Suspense
					fallback={
						<MetaDataGrid
							config={{
								entity: "Template",
								data: [],
								totalCount: 0,
								isLoading: true,
								queryStates,
								setQueryStates,
								columns,
								leftInputs,
								emptyMessage: "등록된 템플릿이 없습니다.",
							}}
						/>
					}
				>
					<TemplatesGridContent
						queryStates={queryStates}
						setQueryStates={setQueryStates}
						columns={columns}
					/>
				</Suspense>
			</Surface>
		</div>
	);
});

export const AdminTemplatesPage = observer(function TemplatesPage() {
	return (
		<Suspense fallback={<TemplatesPageFallback />}>
			<TemplatesPageInner />
		</Suspense>
	);
});

export default AdminTemplatesPage;
