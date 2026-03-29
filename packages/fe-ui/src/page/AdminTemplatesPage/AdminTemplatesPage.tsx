"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig } from "@cocrepo/type";
import {
	buildTemplateTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름, 코드로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

export const adminTemplatesPageQueryInputs = [...leftInputs];

export type AdminTemplatesPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type AdminTemplatesPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface AdminTemplatesPageTemplate {
	id: string;
	code: string;
	name: string;
	isActive: boolean;
	createdAt: string | Date | null;
}

export interface AdminTemplatesPageProps {
	templates: AdminTemplatesPageTemplate[];
	totalCount: number;
	isLoading: boolean;
	isToggling: boolean;
	queryStates: AdminTemplatesPageQueryStates;
	setQueryStates: AdminTemplatesPageSetQueryStates;
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

export const AdminTemplatesPage = observer(function AdminTemplatesPage({
	templates,
	totalCount,
	isLoading,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onClickTemplateCode,
	onToggleTemplateStatusSwitch,
}: AdminTemplatesPageProps) {
	const columns = buildTemplateTableColumns<AdminTemplatesPageTemplate>({
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
						data: templates,
						totalCount,
						isLoading: false,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 템플릿이 없습니다.",
					}}
				/>
			</Surface>
		</div>
	);
});

export default AdminTemplatesPage;
