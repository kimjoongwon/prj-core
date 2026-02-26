"use client";

import {
	getGetTemplatesQueryKey,
	type TemplateDto,
	useGetTemplates,
	useToggleTemplateStatus,
} from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageSurface,
	SectionSurface,
	TemplateActiveToggleCell,
	TemplateTypeChipCell,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast, Button } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 좌측 입력 정의 (검색 + 유형 필터 + 상태 필터)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름, 코드로 검색...",
		props: {
			debounceMs: 300,
		},
	},
	{
		type: "select",
		id: "type",
		placeholder: "유형",
		props: {
			options: [
				{ label: "전체", value: "" },
				{ label: "이메일", value: "EMAIL" },
				{ label: "SMS", value: "SMS" },
				{ label: "푸시", value: "PUSH" },
			],
		},
	},
	{
		type: "select",
		id: "isActive",
		placeholder: "상태",
		props: {
			options: [
				{ label: "전체", value: "" },
				{ label: "활성", value: "true" },
				{ label: "비활성", value: "false" },
			],
		},
	},
];

/**
 * 메시지 템플릿 목록 페이지 - 클라이언트 컴포넌트
 */
function TemplatesPageClient() {
	const router = useRouter();
	const queryClient = useQueryClient();

	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetTemplates({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		type: queryStates.type || undefined,
		isActive:
			queryStates.isActive === "true"
				? true
				: queryStates.isActive === "false"
					? false
					: undefined,
	});

	const templates = (response?.data ?? []) as TemplateDto[];
	const meta = response?.meta;
	const totalCount = meta?.total ?? 0;

	// 활성 토글 뮤테이션
	const toggleMutation = useToggleTemplateStatus();

	/** 활성/비활성 토글 핸들러 (Cell 컴포넌트에 전달) */
	const handleToggleStatus = async (templateId: string) => {
		try {
			await toggleMutation.mutateAsync({ templateId });
			queryClient.invalidateQueries({
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

	/** 코드 클릭 시 상세 페이지 이동 */
	const onClickTemplateCode = (template: TemplateDto) => {
		router.push(`/templates/${template.id}`);
	};

	/**
	 * 컬럼 정의
	 */
	const columns: MetaDataGridColumnConfig<TemplateDto>[] = [
		{
			field: "code",
			label: "코드",
			size: 180,
			isRequired: true,
			cell: ({ getValue, row }) => (
				<button
					type="button"
					className="text-primary hover:underline cursor-pointer text-left"
					onClick={() => onClickTemplateCode(row.original as TemplateDto)}
				>
					{getValue() as string}
				</button>
			),
		},
		{
			field: "name",
			label: "이름",
			size: 200,
		},
		{
			field: "type",
			label: "유형",
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<TemplateTypeChipCell type={getValue() as "EMAIL" | "SMS" | "PUSH"} />
			),
		},
		{
			field: "isActive",
			label: "활성",
			size: 80,
			align: "center",
			cell: ({ row }) => (
				<TemplateActiveToggleCell
					isActive={(row.original as TemplateDto).isActive}
					templateId={(row.original as TemplateDto).id}
					onToggle={handleToggleStatus}
				/>
			),
		},
		{
			field: "description",
			label: "설명",
			size: 250,
			cell: ({ getValue }) => (
				<span className="text-default-500 text-sm line-clamp-1">
					{(getValue() as string) || "-"}
				</span>
			),
		},
		{
			field: "createdAt",
			label: "등록일",
			size: 150,
			cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
		},
	];

	return (
		<PageSurface
			title="메시지 템플릿"
			description="시스템에 등록된 메시지 템플릿을 관리합니다."
			actions={
				<Button
					as={Link}
					href="/templates/new"
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
				>
					템플릿 등록
				</Button>
			}
		>
			<SectionSurface>
				<MetaDataGrid
					config={{
						entity: "Template",
						data: templates,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 템플릿이 없습니다.",
					}}
				/>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(TemplatesPageClient);
