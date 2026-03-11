"use client";

import { type SpaceDto, useGetSpaces } from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell, MetaDataGrid, Page, PageTitleBar, Section, useMetaDataGridQueryStates } from "@cocrepo/ui";
import { Badge, Button } from "@heroui/react";
import { Building2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import type { Route } from "next";
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

interface SpaceGroundRow {
	id: string;
	createdAt: string;
	name: string;
	label: string | null;
	businessNo: string;
	address: string;
	phone: string;
	email: string;
}

/**
 * 공간 목록 페이지 - 클라이언트 컴포넌트
 */
function SpacesPageClient() {
	const router = useRouter();

	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetSpaces();

	const spaces = (response?.data ?? []) as SpaceDto[];
	const rows = spaces
		.map((space) => {
			const ground = space.ground;
			if (!ground) {
				return null;
			}

			return {
				id: space.id,
				createdAt: space.createdAt,
				name: ground.name,
				label: ground.label ?? null,
				businessNo: ground.businessNo,
				address: ground.address,
				phone: ground.phone,
				email: ground.email,
			} satisfies SpaceGroundRow;
		})
		.filter((row): row is SpaceGroundRow => row !== null);
	const meta = response?.meta;
	const searchKeyword = queryStates.search?.trim().toLowerCase() ?? "";
	const filteredRows =
		searchKeyword.length === 0
			? rows
			: rows.filter((row) =>
					[row.name, row.businessNo, row.address]
						.filter(Boolean)
						.some((value) => value.toLowerCase().includes(searchKeyword)),
				);
	const totalCount =
		searchKeyword.length > 0 ? filteredRows.length : (meta?.total ?? rows.length);

	/** 시설명 클릭 시 child detail 페이지 이동 */
	const onClickSpaceGroundName = (spaceId: string) => {
		router.push(`/spaces/${spaceId}/ground` as Route);
	};

	/**
	 * 컬럼 정의
	 */
	const columns: MetaDataGridColumnConfig<SpaceGroundRow>[] = [
		{
			field: "name",
			label: "시설명",
			size: 200,
			isRequired: true,
			cell: ({ getValue, row }) => (
				<button
					type="button"
					className="text-primary hover:underline cursor-pointer text-left"
					onClick={() =>
						onClickSpaceGroundName((row.original as SpaceGroundRow).id)
					}
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
		<Page
			top={
				<PageTitleBar
					title="공간 목록"
					description="시스템에 등록된 공간과 시설 detail을 관리합니다."
					actions={
						<Button
							as={Link}
							href={"/spaces/new" as Route}
							color="primary"
							startContent={<Building2 className="h-4 w-4" />}
						>
							공간 등록
						</Button>
					}
				/>
			}
		>
			<Section>
				<MetaDataGrid
					config={{
						entity: "Space",
						data: filteredRows,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 공간이 없습니다.",
					}}
				/>
			</Section>
		</Page>
	);
}

export default observer(SpacesPageClient);
