"use client";

import type { TemplateDto } from "@cocrepo/api/core/templates";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildTemplateTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { Button } from "../../input/Button/Button";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름, 코드로 검색...",
	},
];
export const adminTemplatesPageQueryInputs = [...leftInputs];
export interface TemplateListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	isActive: string;
}
export type TemplateListScreenSetQueryStates = DataGridSetQueryStates;
export interface TemplateListScreenProps {
	templates?: TemplateDto[];
	totalCount: number;
	isLoading: boolean;
	isToggling: boolean;
	queryStates: TemplateListScreenQueryStates;
	setQueryStates: TemplateListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickTemplateCode: (templateId: bigint) => void;
	onToggleTemplateStatusSwitch: (templateId: bigint) => Promise<void>;
}
function TemplatesScreenFallback() {
	return (
		<div className="space-y-5">
			<Screen.Header
				title="메시지 템플릿"
				description="시스템에 등록된 메시지 템플릿을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	);
}
export const TemplateListScreen = observer(
	({
		templates,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickTemplateCode,
		onToggleTemplateStatusSwitch,
	}: TemplateListScreenProps) => {
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
		const templateRows = templates ?? [];
		const columns = buildTemplateTableColumns<TemplateDto>({
			onClickTemplateCode,
			onToggleTemplateStatusSwitch,
		});
		if (isLoading) {
			return <TemplatesScreenFallback />;
		}
		return (
			<div className="space-y-5">
				<Screen.Header
					title="메시지 템플릿"
					description="시스템에 등록된 메시지 템플릿을 관리합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							템플릿 등록
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
										entity: "Template",
										columns,
										emptyMessage: "등록된 템플릿이 없습니다.",
									},
								}}
								rows={templateRows}
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
