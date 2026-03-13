"use client";
import { type ActionDto, useGetActions } from "@cocrepo/api/core/actions";

import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	Page,
	PageTitleBar,
	Section,
	StatusChipCell,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Chip } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * group 색상 매핑
 */
const getGroupColor = (
	group?: string,
): "primary" | "secondary" | "success" | "warning" | "danger" | "default" => {
	switch (group) {
		case "crud":
			return "primary";
		case "visibility":
			return "secondary";
		case "workflow":
			return "success";
		case "bulk":
			return "warning";
		default:
			return "default";
	}
};

/**
 * 컬럼 정의
 */
const columns: MetaDataGridColumnConfig<ActionDto>[] = [
	{
		field: "name",
		label: "행위 식별자",
		size: 200,
		isRequired: true,
		cell: ({ getValue }) => (
			<span className="font-mono text-sm">{getValue() as string}</span>
		),
	},
	{
		field: "displayName",
		label: "표시명",
		size: 150,
	},
	{
		field: "group",
		label: "분류",
		size: 120,
		align: "center",
		cell: ({ getValue }) => {
			const group = getValue() as string | undefined;
			if (!group) return <span className="text-default-400">-</span>;
			return (
				<Chip size="sm" color={getGroupColor(group)} variant="flat">
					{group}
				</Chip>
			);
		},
	},
	{
		field: "order",
		label: "순서",
		size: 80,
		align: "center",
	},
	{
		field: "isSystem",
		label: "시스템",
		size: 100,
		align: "center",
		cell: ({ getValue }) => {
			const isSystem = getValue() as boolean;
			return (
				<Chip size="sm" color={isSystem ? "warning" : "default"} variant="flat">
					{isSystem ? "시스템" : "사용자"}
				</Chip>
			);
		},
	},
	{
		field: "createdAt",
		label: "생성일",
		size: 150,
		cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
	},
	{
		field: "removedAt",
		label: "상태",
		size: 100,
		align: "center",
		cell: ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
	},
];

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

/**
 * Action 목록 페이지 - 클라이언트 컴포넌트
 */
function ActionsPageClient() {
	const router = useRouter();

	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	// API 조회 (GetActionsParams는 group만 받음)
	const { data: response, isLoading } = useGetActions({
		group: queryStates.group as string | undefined,
	});

	const actions = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.total ?? 0;

	/**
	 * 신규 등록 핸들러
	 */
	const onClickCreateButton = () => {
		router.push("/actions/new" as Route);
	};

	/**
	 * 우측 입력 정의 (등록 버튼)
	 */
	const rightInputs: InputConfig[] = [
		{
			type: "button",
			id: "create",
			label: "등록",
			props: {
				variant: "flat",
				color: "primary",
				startContent: <Plus className="h-4 w-4" />,
			},
			handlers: {
				onClick: onClickCreateButton,
			},
		},
	];

	return (
		<Page
			top={
				<PageTitleBar
					title="Action 목록"
					description="시스템에 등록된 Action을 조회합니다."
				/>
			}
		>
			<Section>
				<MetaDataGrid
					config={{
						entity: "Action",
						data: actions,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						rightInputs,
						emptyMessage: "조회된 Action이 없습니다.",
					}}
				/>
			</Section>
		</Page>
	);
}

export default observer(ActionsPageClient);
