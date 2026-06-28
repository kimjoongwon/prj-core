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
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
export interface TemplateEditScreenProps {
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
export const TemplateEditScreen = observer(
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
	}: TemplateEditScreenProps) => {
		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar title="템플릿 수정" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center gap-2 p-8">
									<Spinner size="sm" />
									<span className="text-muted">로딩 중...</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound) {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title="템플릿 수정"
						description="템플릿을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">템플릿을 찾을 수 없습니다.</p>
									<Button variant="flat" onPress={onClickCancelButton}>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack fullWidth>
				<PageTitleBar
					title="템플릿 수정"
					description={
						templateName
							? `${templateName} 템플릿을 수정합니다.`
							: "템플릿을 수정합니다."
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
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
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
