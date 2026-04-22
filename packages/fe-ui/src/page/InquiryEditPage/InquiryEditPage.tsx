"use client";

import type {
	InquiryCategory,
	InquiryPriority,
} from "@cocrepo/api/core/inquiries";
import type {
	AiFormFieldMeta,
	AiFormFillRequest,
	AiFormFillResponse,
	AiFormOptionItem,
	AiFormPatch,
	AiFormSchema,
	AiFormUiPaths,
} from "@cocrepo/type";
import {
	AiForm,
	Button,
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSection,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Input, Select, SelectItem, type Selection } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";

const getSelectedValue = (keys: Selection): string => {
	if (keys === "all") {
		return "";
	}

	const selectedKey = keys.values().next().value;
	return selectedKey ? String(selectedKey) : "";
};

export interface InquiryEditPageBootstrap {
	fieldMeta: Record<string, AiFormFieldMeta>;
	aiSchemas: AiFormSchema[];
	ui: AiFormUiPaths;
	options: Record<string, AiFormOptionItem[]>;
}

export interface InquiryEditPageOption {
	value: string;
	label: string;
}

export interface InquiryEditPageFormState {
	title: string;
	category: InquiryCategory;
	priority: InquiryPriority;
	error: string;
}

export interface InquiryEditPageProps {
	formState: InquiryEditPageFormState;
	bootstrap?: InquiryEditPageBootstrap;
	categoryOptions: InquiryEditPageOption[];
	priorityOptions: InquiryEditPageOption[];
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onFillAiForm: (
		input: AiFormFillRequest<Record<string, unknown>>,
	) => Promise<AiFormFillResponse>;
	onApplyAiPatch: (patches: AiFormPatch[]) => void;
	onChangeTitleInput: (value: string) => void;
	onChangeCategorySelection: (value: InquiryCategory) => void;
	onChangePrioritySelection: (value: InquiryPriority) => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}

export const InquiryEditPage = observer(({
	formState,
	bootstrap,
	categoryOptions,
	priorityOptions,
	isSubmitting,
	onClickBackButton,
	onFillAiForm,
	onApplyAiPatch,
	onChangeTitleInput,
	onChangeCategorySelection,
	onChangePrioritySelection,
	onClickCancelButton,
	onClickSubmitButton,
}: InquiryEditPageProps) => {
	const categoryOptionValues = new Set(
		categoryOptions.map((option) => option.value),
	);
	const priorityOptionValues = new Set(
		priorityOptions.map((option) => option.value),
	);

	return (
		<FormPage
			top={
				<PageTitleBar
					title="문의 수정"
					description="문의 메타 정보를 수정하고 AiForm으로 추천 값을 반영합니다."
					actions={
						<Button
							variant="flat"
							startContent={<ArrowLeft className="size-4" />}
							onPress={onClickBackButton}
							isDisabled={isSubmitting}
						>
							상세로
						</Button>
					}
				/>
			}
		>
			<FormPageSurface>
				<VStack gap={4}>
					{bootstrap && (
						<FormSectionCard>
							<FormSection top={<PageTitleBar level={2} title="AI 폼 추천" />}>
								<AiForm
									formState={{
										title: formState.title,
										category: formState.category,
										priority: formState.priority,
									}}
									fieldMeta={bootstrap.fieldMeta}
									aiSchemas={bootstrap.aiSchemas}
									ui={bootstrap.ui}
									options={bootstrap.options}
									onFill={onFillAiForm}
									applyPatch={onApplyAiPatch}
									disabled={isSubmitting}
								/>
							</FormSection>
						</FormSectionCard>
					)}
					<FormSectionCard>
						<FormSection top={<PageTitleBar level={2} title="문의 입력" />}>
							<VStack gap={4}>
								<Input
									label="문의 제목"
									labelPlacement="outside"
									value={formState.title}
									onValueChange={onChangeTitleInput}
									isInvalid={Boolean(formState.error)}
									errorMessage={formState.error}
								/>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<Select
										label="카테고리"
										placeholder="카테고리 선택"
										selectedKeys={
											formState.category &&
											categoryOptionValues.has(formState.category)
												? [formState.category]
												: []
										}
										onSelectionChange={(keys) => {
											const selectedValue = getSelectedValue(keys);
											if (selectedValue) {
												onChangeCategorySelection(
													selectedValue as InquiryCategory,
												);
											}
										}}
									>
										{categoryOptions.map((option) => (
											<SelectItem key={option.value}>{option.label}</SelectItem>
										))}
									</Select>
									<Select
										label="우선순위"
										placeholder="우선순위 선택"
										selectedKeys={
											formState.priority &&
											priorityOptionValues.has(formState.priority)
												? [formState.priority]
												: []
										}
										onSelectionChange={(keys) => {
											const selectedValue = getSelectedValue(keys);
											if (selectedValue) {
												onChangePrioritySelection(
													selectedValue as InquiryPriority,
												);
											}
										}}
									>
										{priorityOptions.map((option) => (
											<SelectItem key={option.value}>{option.label}</SelectItem>
										))}
									</Select>
								</div>
								<div className="flex justify-end gap-2">
									<Button
										variant="light"
										onPress={onClickCancelButton}
										isDisabled={isSubmitting}
									>
										취소
									</Button>
									<Button
										color="primary"
										onPress={onClickSubmitButton}
										isLoading={isSubmitting}
									>
										저장
									</Button>
								</div>
							</VStack>
						</FormSection>
					</FormSectionCard>
				</VStack>
			</FormPageSurface>
		</FormPage>
	);
});
