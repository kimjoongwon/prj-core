"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig } from "@cocrepo/type";
import {
	buildSpaceTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Building2 } from "lucide-react";
import { observer } from "mobx-react-lite";

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

export const adminSpacesPageQueryInputs = [...leftInputs];

export type AdminSpacesPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type AdminSpacesPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface AdminSpacesPageSpace {
	id: string;
	createdAt: string;
	name: string;
	label: string | null;
	businessNo: string;
	address: string;
	phone: string;
	email: string;
}

export interface AdminSpacesPageProps {
	spaces: AdminSpacesPageSpace[];
	totalCount: number;
	isLoading: boolean;
	queryStates: AdminSpacesPageQueryStates;
	setQueryStates: AdminSpacesPageSetQueryStates;
	onClickCreateButton: () => void;
	onClickSpaceGroundName: (spaceId: string) => void;
}

function filterRows(rows: AdminSpacesPageSpace[], search?: string) {
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

export const AdminSpacesPage = observer(function AdminSpacesPage({
	spaces,
	totalCount: totalSpaceCount,
	isLoading,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onClickSpaceGroundName,
}: AdminSpacesPageProps) {
	const filteredRows = filterRows(spaces, queryStates.search);
	const totalCount = queryStates.search?.trim().length
		? filteredRows.length
		: totalSpaceCount;
	const columns = buildSpaceTableColumns<AdminSpacesPageSpace>({
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
			</Surface>
		</div>
	);
});

export default AdminSpacesPage;
