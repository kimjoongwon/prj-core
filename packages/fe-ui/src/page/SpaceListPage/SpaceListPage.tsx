"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildSpaceTableColumns,
	MetaDataGrid,
	MetaDataGridStateModel,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Building2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "시설명, 사업자등록번호로 검색...",
	},
];

export const adminSpacesPageQueryInputs = [...leftInputs];

export interface SpaceListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
}
export type SpaceListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface SpaceListPageSpace {
	id: string;
	createdAt: string;
	name: string;
	label: string | null;
	businessNo: string;
	address: string;
	phone: string;
	email: string;
}

export interface SpaceListPageProps {
	spaces: SpaceListPageSpace[];
	totalCount: number;
	isLoading: boolean;
	queryStates: SpaceListPageQueryStates;
	setQueryStates: SpaceListPageSetQueryStates;
	onClickCreateButton: () => void;
	onClickSpaceGroundName: (spaceId: string) => void;
}

function filterRows(rows: SpaceListPageSpace[], search?: string) {
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

export const SpaceListPage = observer(({
	spaces,
	totalCount: totalSpaceCount,
	isLoading,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onClickSpaceGroundName,
}: SpaceListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	const filteredRows = filterRows(spaces, queryStates.search);
	const totalCount = queryStates.search?.trim().length
		? filteredRows.length
		: totalSpaceCount;
	const columns = buildSpaceTableColumns<SpaceListPageSpace>({
		onClickSpaceGroundName,
	});

	if (isLoading) {
		return <SpacesPageFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="공간 목록"
				description="시스템에 등록된 공간과 시설 detail을 관리합니다."
				actions={
					<Button
						color="primary"
						startContent={<Building2 className="h-4 w-4" />}
						onPress={onClickCreateButton}
					>
						공간 등록
					</Button>
				}
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "Space",
						columns,
						leftInputs,
						emptyMessage: "등록된 공간이 없습니다.",
					}}
					rows={filteredRows}
					totalCount={totalCount}
					isLoading={false}
					state={gridState}
				/>
			</Surface>
		</div>
	);
});
