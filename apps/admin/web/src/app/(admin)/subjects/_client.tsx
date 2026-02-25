"use client";

import { useGetSubjects, type SubjectDto } from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	BooleanCell,
	DateTimeCell,
	DefaultCell,
	MetaDataGrid,
	PageSurface,
	SectionSurface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Chip, Select, SelectItem } from "@heroui/react";
import { observer } from "mobx-react-lite";

/**
 * group 필터 옵션
 */
const GROUP_OPTIONS = [
	{ value: "all", label: "전체" },
	{ value: "entity", label: "Entity" },
	{ value: "menu", label: "Menu" },
	{ value: "feature", label: "Feature" },
	{ value: "ui", label: "UI" },
];

/**
 * group별 Chip 색상 반환
 */
function getGroupColor(
	group?: string,
): "primary" | "secondary" | "success" | "warning" | "default" {
	switch (group) {
		case "entity":
			return "primary";
		case "menu":
			return "secondary";
		case "feature":
			return "success";
		case "ui":
			return "warning";
		default:
			return "default";
	}
}

/**
 * 컬럼 정의
 */
const columns: MetaDataGridColumnConfig<SubjectDto>[] = [
	{
		field: "name",
		label: "식별자",
		size: 200,
		isRequired: true,
	},
	{
		field: "displayName",
		label: "표시명",
		size: 150,
		cell: ({ getValue }) => {
			const value = getValue() as string | undefined;
			return <DefaultCell value={value || "-"} />;
		},
	},
	{
		field: "group",
		label: "분류",
		size: 120,
		align: "center",
		cell: ({ getValue }) => {
			const group = getValue() as string | undefined;
			return group ? (
				<Chip color={getGroupColor(group)} size="sm" variant="flat">
					{group}
				</Chip>
			) : (
				<DefaultCell value="-" />
			);
		},
	},
	{
		field: "isSystem",
		label: "시스템",
		size: 100,
		align: "center",
		cell: ({ getValue }) => <BooleanCell value={getValue() as boolean} />,
	},
	{
		field: "order",
		label: "정렬 순서",
		size: 100,
		align: "center",
	},
	{
		field: "createdAt",
		label: "생성일",
		size: 150,
		cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
	},
];

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "식별자, 표시명으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

/**
 * 우측 입력 정의 (필터)
 */
const rightInputs: InputConfig[] = [
	{
		type: "select",
		id: "group",
		placeholder: "분류",
		props: {
			options: GROUP_OPTIONS,
		},
	},
];

/**
 * Subject 목록 페이지 - 클라이언트 컴포넌트
 */
function SubjectsPageClient() {
	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates([
		...leftInputs,
		...rightInputs,
	]);

	// API 조회
	const { data: response, isLoading } = useGetSubjects();

	const subjects = response?.data ?? [];

	// 클라이언트 사이드 필터링
	const filteredSubjects = subjects.filter((subject) => {
		// 검색 필터
		if (queryStates.search) {
			const searchLower = queryStates.search.toLowerCase();
			const nameMatch = subject.name?.toLowerCase().includes(searchLower);
			const displayNameMatch = subject.displayName
				?.toLowerCase()
				.includes(searchLower);
			if (!nameMatch && !displayNameMatch) return false;
		}

		// 그룹 필터
		if (queryStates.group && queryStates.group !== "all") {
			if (subject.group !== queryStates.group) return false;
		}

		return true;
	});

	const totalCount = filteredSubjects.length;

	return (
		<PageSurface
			title="Subject 목록"
			description="시스템에 등록된 Subject를 조회합니다."
		>
			<VStack gap={4}>
				{/* MetaDataGrid */}
				<SectionSurface>
					<MetaDataGrid
						config={{
							entity: "Subject",
							data: filteredSubjects,
							totalCount,
							isLoading,
							queryStates,
							setQueryStates,
							columns,
							leftInputs,
							rightInputs,
							emptyMessage: "조회된 Subject가 없습니다.",
						}}
					/>
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(SubjectsPageClient);
