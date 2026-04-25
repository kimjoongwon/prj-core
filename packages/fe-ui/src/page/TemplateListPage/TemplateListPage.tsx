"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildTemplateTableColumns,
	MetaDataGrid,
	MetaDataGridStateModel,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름, 코드로 검색...",
		props: {
			placement: "column-header",
		},
	},
];

export const adminTemplatesPageQueryInputs = [...leftInputs];

export interface TemplateListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	isActive: string;
}
export type TemplateListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface TemplateListPageTemplate {
	id: string;
	code: string;
	name: string;
	isActive: boolean;
	createdAt: string | Date | null;
}

export interface TemplateListPageProps {
	templates: TemplateListPageTemplate[];
	totalCount: number;
	isLoading: boolean;
	isToggling: boolean;
	queryStates: TemplateListPageQueryStates;
	setQueryStates: TemplateListPageSetQueryStates;
	onClickCreateButton: () => void;
	onClickTemplateCode: (templateId: string) => void;
	onToggleTemplateStatusSwitch: (templateId: string) => Promise<void>;
}

function TemplatesPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="메시지 템플릿"
				description="시스템에 등록된 메시지 템플릿을 관리합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

export const TemplateListPage = observer(({
	templates,
	totalCount,
	isLoading,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onClickTemplateCode,
	onToggleTemplateStatusSwitch,
}: TemplateListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	const columns = buildTemplateTableColumns<TemplateListPageTemplate>({
		onClickTemplateCode,
		onToggleTemplateStatusSwitch,
	});

	if (isLoading) {
		return <TemplatesPageFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="메시지 템플릿"
				description="시스템에 등록된 메시지 템플릿을 관리합니다."
				actions={
					<Button
						color="primary"
						startContent={<Plus className="h-4 w-4" />}
						onPress={onClickCreateButton}
					>
						템플릿 등록
					</Button>
				}
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "Template",
						columns,
						leftInputs,
						emptyMessage: "등록된 템플릿이 없습니다.",
					}}
	rows={templates}
	totalCount={totalCount}
	isLoading={false}
	state={gridState}
/>
			</Surface>
		</div>
	);
});
