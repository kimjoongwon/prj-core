"use client";

import { type SpaceDto, useGetSpacesSuspense } from "@cocrepo/api/core/spaces";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	Page,
	PageTitleBar,
	Section,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Badge, Button } from "@heroui/react";
import { Building2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

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

function buildRows(spaces: SpaceDto[]) {
	return spaces
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
}

function filterRows(rows: SpaceGroundRow[], search?: string) {
	const searchKeyword = search?.trim().toLowerCase() ?? "";
	if (searchKeyword.length === 0) {
		return rows;
	}

	return rows.filter((row) =>
		[row.name, row.businessNo, row.address]
			.filter(Boolean)
			.some((value) => value.toLowerCase().includes(searchKeyword)),
	);
}

type SpacesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetSpacesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

const SpacesGridContent = observer(function SpacesGridContent({
	queryStates,
	setQueryStates,
	columns,
}: {
	queryStates: SpacesQueryStates;
	setQueryStates: SetSpacesQueryStates;
	columns: MetaDataGridColumnConfig<SpaceGroundRow>[];
}) {
	const { data: response } = useGetSpacesSuspense();
	const spaces = (response?.data ?? []) as SpaceDto[];
	const rows = buildRows(spaces);
	const filteredRows = filterRows(rows, queryStates.search);
	const totalCount =
		queryStates.search?.trim().length
			? filteredRows.length
			: (response?.meta?.total ?? rows.length);

	return (
		<MetaDataGrid
			config={{
				entity: "Space",
				data: filteredRows,
				totalCount,
				isLoading: false,
				queryStates,
				setQueryStates,
				columns,
				leftInputs,
				emptyMessage: "등록된 공간이 없습니다.",
			}}
		/>
	);
});

const SpacesPage = observer(function SpacesPage() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	const onClickSpaceGroundName = (spaceId: string) => {
		router.push(`/spaces/${spaceId}/ground` as Route);
	};

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
				<Suspense
					fallback={
						<MetaDataGrid
							config={{
								entity: "Space",
								data: [],
								totalCount: 0,
								isLoading: true,
								queryStates,
								setQueryStates,
								columns,
								leftInputs,
								emptyMessage: "등록된 공간이 없습니다.",
							}}
						/>
					}
				>
					<SpacesGridContent
						queryStates={queryStates}
						setQueryStates={setQueryStates}
						columns={columns}
					/>
				</Suspense>
			</Section>
		</Page>
	);
});

export default SpacesPage;
