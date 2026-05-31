"use client";

import {
	FormPage,
	FormPageSurface,
	FormSectionCard,
	PageTitleBar,
	TemplateForm,
	type TemplateFormData,
	type VariableEditItem,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Button, Spinner } from "../../design-system/primitives";

export interface TemplateEditPageProps {
	templateName?: string;
	formData: TemplateFormData;
	variables: VariableEditItem[];
	errors: Record<string, string>;
	isLoading: boolean;
	isNotFound: boolean;
	isSubmitting: boolean;
	onFormDataChange: (data: Partial<TemplateFormData>) => void;
	onVariablesChange: (variables: VariableEditItem[]) => void;
	onSubmitForm: () => void;
	onClickCancelButton: () => void;
}

export const TemplateEditPage = observer(
	({
		templateName,
		formData,
		variables,
		errors,
		isLoading,
		isNotFound,
		isSubmitting,
		onFormDataChange,
		onVariablesChange,
		onSubmitForm,
		onClickCancelButton,
	}: TemplateEditPageProps) => {
		if (isLoading) {
			return (
				<FormPage
					top={<PageTitleBar title="템플릿 수정" description="로딩 중..." />}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex items-center justify-center gap-2 p-8">
								<Spinner size="sm" />
								<span className="text-default-500">로딩 중...</span>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		if (isNotFound) {
			return (
				<FormPage
					top={
						<PageTitleBar
							title="템플릿 수정"
							description="템플릿을 찾을 수 없습니다."
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">템플릿을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickCancelButton}>
									목록으로
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		return (
			<FormPage
				top={
					<PageTitleBar
						title="템플릿 수정"
						description={
							templateName
								? `${templateName} 템플릿을 수정합니다.`
								: "템플릿을 수정합니다."
						}
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<TemplateForm
							mode="edit"
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
