"use client";

import type { TemplateDto } from "@cocrepo/api/core/templates";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildTemplateTableColumns,
	createDataGridState,
	DataGrid,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Button } from "../../input/Button/Button";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름, 코드로 검색...",
	},
];
export const adminTemplatesPageQueryInputs = [...leftInputs];
export interface TemplateListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
	search: string;
	isActive: string;
}
export type TemplateListScreenSetQueryStates = DataGridSetQueryStates;
export interface TemplateListScreenProps {
	templates: TemplateDto[];
	totalCount: number;
	isToggling: boolean;
	queryStates: TemplateListScreenQueryStates;
	setQueryStates: TemplateListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickTemplateCode: (templateId: bigint) => void;
	onToggleTemplateStatusSwitch: (templateId: bigint) => Promise<void>;
}
export const TemplateListScreen = observer(
	({
		templates,
		totalCount,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickTemplateCode,
		onToggleTemplateStatusSwitch,
	}: TemplateListScreenProps) => {
		const gridState = useMemo(
			() =>
				createDataGridState<TemplateDto>({
					query: queryStates,
					setQueryStates,
					pagination: { totalCount },
					toolbar: { leftInputs },
					table: {
						rows: templates,
						columns: buildTemplateTableColumns<TemplateDto>({
							onClickTemplateCode,
							onToggleTemplateStatusSwitch,
						}),
					},
				}),
			[
				templates,
				totalCount,
				queryStates,
				setQueryStates,
				onClickTemplateCode,
				onToggleTemplateStatusSwitch,
			],
		);
		return (
			<VStack gap="page">
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
							<DataGrid state={gridState} />
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
