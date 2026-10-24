"use client";

import type { SpaceDto } from "@cocrepo/api/core/spaces";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildSpaceTableColumns,
	createDataGridState,
	DataGrid,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Building2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { CONTENT_LANGUAGE_OPTIONS } from "../../data-display/content-language";
import { Button } from "../../input/Button/Button";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "피트니스 센터명, 사업자등록번호로 검색...",
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
export interface SpaceListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
	search: string;
	contentLanguageCode: string;
}
export type SpaceListScreenSetQueryStates = DataGridSetQueryStates;

export type SpaceListScreenSpace = SpaceDto;

export interface SpaceListScreenProps {
	spaces: SpaceListScreenSpace[];
	totalCount: number;
	queryStates: SpaceListScreenQueryStates;
	setQueryStates: SpaceListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickSpaceFitnessCenterName: (spaceId: bigint) => void;
}
function filterRows(
	rows: SpaceListScreenSpace[],
	search?: string,
	contentLanguageCode?: string,
) {
	const searchKeyword = search?.trim().toLowerCase() ?? "";
	return rows.filter(
		(row) =>
			(!contentLanguageCode ||
				row.contentLanguageCode === contentLanguageCode) &&
			(searchKeyword.length === 0 ||
				[
					row.name,
					row.fitnessCenter?.company?.businessNo,
					row.fitnessCenter?.company?.address,
				]
					.filter(Boolean)
					.some((value) => value!.toLowerCase().includes(searchKeyword))),
	);
}
export const SpaceListScreen = observer(
	({
		spaces,
		totalCount: totalSpaceCount,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickSpaceFitnessCenterName,
	}: SpaceListScreenProps) => {
		const gridState = useMemo(() => {
			const filteredRows = filterRows(
				spaces,
				queryStates.search,
				queryStates.contentLanguageCode,
			);
			const totalCount = queryStates.search?.trim().length
				? filteredRows.length
				: totalSpaceCount;
			return createDataGridState<SpaceListScreenSpace>({
				query: queryStates,
				setQueryStates,
				pagination: { totalCount },
				toolbar: { leftInputs },
				table: {
					rows: filteredRows,
					columns: buildSpaceTableColumns<SpaceListScreenSpace>({
						onClickSpaceFitnessCenterName,
					}),
				},
			});
		}, [
			spaces,
			totalSpaceCount,
			queryStates,
			setQueryStates,
			onClickSpaceFitnessCenterName,
		]);
		return (
			<VStack gap="page">
				<Screen.Header
					title="공간 목록"
					description="시스템에 등록된 공간과 피트니스 센터 정보를 관리합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Building2 className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							공간 등록
						</Button>
					}
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid state={gridState} />
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
