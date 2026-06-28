"use client";

import {
	PageTitleBar,
	Section,
	SectionSurface,
	TemplateForm,
	type TemplateFormData,
	type VariableEditItem,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
export interface TemplateCreateScreenProps {
	formData: TemplateFormData;
	variables: VariableEditItem[];
	errors: Record<string, string>;
	isSubmitting: boolean;
	onFormDataChange: (data: Partial<TemplateFormData>) => void;
	onVariablesChange: (variables: VariableEditItem[]) => void;
	onSubmitForm: () => void;
	onClickCancelButton: () => void;
}
export const TemplateCreateScreen = observer(
	({
		formData,
		variables,
		errors,
		isSubmitting,
		onFormDataChange,
		onVariablesChange,
		onSubmitForm,
		onClickCancelButton,
	}: TemplateCreateScreenProps) => {
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="템플릿 등록"
					description="새로운 메시지 템플릿을 등록합니다."
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
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
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
