"use client";

import { type GroundDto, useGetGrounds } from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageSurface,
	SectionSurface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Badge, Button } from "@heroui/react";
import { Building2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "시설명, 사업자등록번호로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

/**
 * 시설 목록 페이지 - 클라이언트 컴포넌트
 */
function GroundsPageClient() {
	const router = useRouter();

	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetGrounds();

	const grounds = (response?.data ?? []) as GroundDto[];
	const meta = response?.meta;
	const totalCount = meta?.total ?? grounds.length;

	/** 시설명 클릭 시 상세 페이지 이동 */
	const onClickGroundName = (ground: GroundDto) => {
		router.push(`/grounds/${ground.id}`);
	};

	/**
	 * 컬럼 정의
	 */
	const columns: MetaDataGridColumnConfig<GroundDto>[] = [
		{
			field: "name",
			label: "시설명",
			size: 200,
			isRequired: true,
			cell: ({ getValue, row }) => (
				<button
					type="button"
					className="text-primary hover:underline cursor-pointer text-left"
					onClick={() => onClickGroundName(row.original as GroundDto)}
				>
					{getValue() as string}
				</button>
			),
		},
		{
			field: "label",
			label: "라벨",
			size: 120,
			align: "center",
			cell: ({ getValue }) => {
				const label = getValue() as string | null;
				if (!label) return <span className="text-default-400">-</span>;
				return (
					<Badge color="secondary" variant="flat">
						{label}
					</Badge>
				);
			},
		},
		{
			field: "businessNo",
			label: "사업자등록번호",
			size: 160,
		},
		{
			field: "address",
			label: "주소",
			size: 250,
		},
		{
			field: "phone",
			label: "전화번호",
			size: 140,
		},
		{
			field: "email",
			label: "이메일",
			size: 200,
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
			title="시설 목록"
			description="시스템에 등록된 시설을 관리합니다."
			actions={
				<Button
					as={Link}
					href="/grounds/new"
					color="primary"
					startContent={<Building2 className="h-4 w-4" />}
				>
					시설 등록
				</Button>
			}
		>
			<SectionSurface>
				<MetaDataGrid
					config={{
						entity: "Ground",
						data: grounds,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 시설이 없습니다.",
					}}
				/>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(GroundsPageClient);
