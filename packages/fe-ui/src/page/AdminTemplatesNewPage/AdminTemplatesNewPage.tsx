"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	TemplateForm,
	type TemplateFormData,
	type VariableEditItem,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export interface AdminTemplatesNewPageProps {
	formData: TemplateFormData;
	variables: VariableEditItem[];
	errors: Record<string, string>;
	isSubmitting: boolean;
	onFormDataChange: (data: Partial<TemplateFormData>) => void;
	onVariablesChange: (variables: VariableEditItem[]) => void;
	onSubmitForm: () => void;
	onClickCancelButton: () => void;
}

export const AdminTemplatesNewPage = observer(
	({
		formData,
		variables,
		errors,
		isSubmitting,
		onFormDataChange,
		onVariablesChange,
		onSubmitForm,
		onClickCancelButton,
	}: AdminTemplatesNewPageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="템플릿 등록"
						description="새로운 메시지 템플릿을 등록합니다."
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<TemplateForm
							mode="create"
							formData={formData}
							variables={variables}
							onFormDataChange={onFormDataChange}
							onVariablesChange={onVariablesChange}
							onSubmit={onSubmitForm}
							onCancel={onClickCancelButton}
							isSubmitting={isSubmitting}
							errors={errors}
						/>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	},
);
