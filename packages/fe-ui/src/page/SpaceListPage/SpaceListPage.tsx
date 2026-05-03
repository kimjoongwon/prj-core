"use client";

import type { SpaceDto } from "@cocrepo/api/core/spaces";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildSpaceTableColumns,
	CONTENT_LANGUAGE_OPTIONS,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { Button } from "@cocrepo/ui/heroui";
import { Building2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "시설명, 사업자등록번호로 검색...",
	},
	{
		type: "select",
		id: "contentLanguageCode",
		label: "콘텐츠 언어",
		placeholder: "콘텐츠 언어",
		props: {
			options: CONTENT_LANGUAGE_OPTIONS.map((language) => ({
				label: language.label,
				value: language.code,
			})),
			isClearable: true,
		},
	},
];

export const adminSpacesPageQueryInputs = [...leftInputs];

export interface SpaceListPageQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	contentLanguageCode: string;
}
export type SpaceListPageSetQueryStates = DataGridSetQueryStates;

export interface SpaceListPageProps {
	spaces?: SpaceDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: SpaceListPageQueryStates;
	setQueryStates: SpaceListPageSetQueryStates;
	onClickCreateButton: () => void;
	onClickSpaceGroundName: (spaceId: string) => void;
}

function filterRows(
	rows: SpaceDto[],
	search?: string,
	contentLanguageCode?: string,
) {
	const searchKeyword = search?.trim().toLowerCase() ?? "";
	return rows.filter(
		(row) =>
			(!contentLanguageCode ||
				row.contentLanguageCode === contentLanguageCode) &&
			(searchKeyword.length === 0 ||
				[row.ground?.name, row.ground?.businessNo, row.ground?.address]
					.filter(Boolean)
					.some((value) => value!.toLowerCase().includes(searchKeyword))),
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

export const SpaceListPage = observer(
	({
		spaces,
		totalCount: totalSpaceCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickSpaceGroundName,
	}: SpaceListPageProps) => {
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const spaceRows = spaces ?? [];
		const filteredRows = filterRows(
			spaceRows,
			queryStates.search,
			queryStates.contentLanguageCode,
		);
		const totalCount = queryStates.search?.trim().length
			? filteredRows.length
			: totalSpaceCount;
		const columns = buildSpaceTableColumns<SpaceDto>({
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
					<DataGrid
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
	},
);
