"use client";

import { type SpaceDto, useGetSpacesSuspense } from "@cocrepo/api/core/spaces";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	buildSpaceTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
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

function buildRows(spaces: SpaceDto[]) {
	return spaces.flatMap((space) => {
		const ground = space.ground;
		if (!ground) {
			return [];
		}

		return [
			{
				id: space.id,
				createdAt: space.createdAt,
				name: ground.name,
				label: ground.label ?? null,
				businessNo: ground.businessNo,
				address: ground.address,
				phone: ground.phone,
				email: ground.email,
			},
		];
	});
}

function filterRows(rows: ReturnType<typeof buildRows>, search?: string) {
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
	columns: MetaDataGridColumnConfig<ReturnType<typeof buildRows>[number]>[];
}) {
	const { data: response } = useGetSpacesSuspense();
	const spaces = (response?.data ?? []) as SpaceDto[];
	const rows = buildRows(spaces);
	const filteredRows = filterRows(rows, queryStates.search);
	const totalCount = queryStates.search?.trim().length
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

function SpacesPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="공간 목록"
				description="시스템에 등록된 공간과 시설 detail을 관리합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

const SpacesPageInner = observer(function SpacesPageInner() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	const onClickSpaceGroundName = (spaceId: string) => {
		router.push(`/spaces/${spaceId}/ground` as Route);
	};

	const columns = buildSpaceTableColumns<ReturnType<typeof buildRows>[number]>({
		onClickSpaceGroundName,
	});

	return (
		<div className="space-y-5">
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
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
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
			</Surface>
		</div>
	);
});

export const AdminSpacesPage = observer(function SpacesPage() {
	return (
		<Suspense fallback={<SpacesPageFallback />}>
			<SpacesPageInner />
		</Suspense>
	);
});

export default AdminSpacesPage;
