"use client";

import type { SpaceDto } from "@cocrepo/api/core/spaces";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildSpaceTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
} from "@cocrepo/ui";
import { Building2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
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
export interface SpaceListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	contentLanguageCode: string;
}
export type SpaceListScreenSetQueryStates = DataGridSetQueryStates;

export type SpaceListScreenSpace = SpaceDto;

export interface SpaceListScreenProps {
	spaces?: SpaceListScreenSpace[];
	totalCount: number;
	isLoading: boolean;
	queryStates: SpaceListScreenQueryStates;
	setQueryStates: SpaceListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickSpaceFitnessCenterName: (spaceId: string) => void;
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
					row.fitnessCenter?.name,
					row.fitnessCenter?.company?.businessNo,
					row.fitnessCenter?.company?.address,
				]
					.filter(Boolean)
					.some((value) => value!.toLowerCase().includes(searchKeyword))),
	);
}
function SpacesScreenFallback() {
	return (
		<div className="space-y-5">
			<Screen.Header
				title="공간 목록"
				description="시스템에 등록된 공간과 피트니스 센터 정보를 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	);
}
export const SpaceListScreen = observer(
	({
		spaces,
		totalCount: totalSpaceCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickSpaceFitnessCenterName,
	}: SpaceListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
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
		const columns = buildSpaceTableColumns<SpaceListScreenSpace>({
			onClickSpaceFitnessCenterName,
		});
		if (isLoading) {
			return <SpacesScreenFallback />;
		}
		return (
			<div className="space-y-5">
				<Screen.Header
					title="공간 목록"
					description="시스템에 등록된 공간과 피트니스 센터 정보를 관리합니다."
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
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									toolbar: {
										leftInputs,
									},
									table: {
										entity: "Space",
										columns,
										emptyMessage: "등록된 공간이 없습니다.",
									},
								}}
								rows={filteredRows}
								totalCount={totalCount}
								state={gridState}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
			</div>
		);
	},
);
