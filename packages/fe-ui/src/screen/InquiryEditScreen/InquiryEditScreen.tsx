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
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { ListBox } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Select } from "../../input/Select/Select";
import { TextField } from "../../input/TextField/TextField";
export interface InquiryEditScreenBootstrap {
	fieldMeta: Record<string, AiFormFieldMeta>;
	aiSchemas: AiFormSchema[];
	ui: AiFormUiPaths;
	options: Record<string, AiFormOptionItem[]>;
}
export interface InquiryEditScreenOption {
	value: string;
	label: string;
}
export interface InquiryEditScreenFormState {
	title: string;
	category: InquiryCategory;
	priority: InquiryPriority;
	error: string;
}
export interface InquiryEditScreenProps {
	formState: InquiryEditScreenFormState;
	bootstrap?: InquiryEditScreenBootstrap;
	categoryOptions: InquiryEditScreenOption[];
	priorityOptions: InquiryEditScreenOption[];
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
export const InquiryEditScreen = observer(
	({
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
	}: InquiryEditScreenProps) => {
		const categoryOptionValues = new Set(
			categoryOptions.map((option) => option.value),
		);
		const priorityOptionValues = new Set(
			priorityOptions.map((option) => option.value),
		);
		return (
			<VStack fullWidth>
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
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								{bootstrap && (
									<Section>
										<Section.Header>
											<PageTitleBar level={2} title="AI 폼 추천" />
										</Section.Header>
										<Section.Body>
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
										</Section.Body>
									</Section>
								)}
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="문의 입력" />
									</Section.Header>
									<Section.Body>
										<VStack>
											<TextField
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
													value={
														formState.category &&
														categoryOptionValues.has(formState.category)
															? formState.category
															: null
													}
													onChange={(selectedValue) => {
														if (selectedValue) {
															onChangeCategorySelection(
																String(selectedValue) as InquiryCategory,
															);
														}
													}}
												>
													{categoryOptions.map((option) => (
														<ListBox.Item
															key={option.value}
															id={option.value}
															textValue={option.label}
														>
															{option.label}
														</ListBox.Item>
													))}
												</Select>
												<Select
													label="우선순위"
													placeholder="우선순위 선택"
													value={
														formState.priority &&
														priorityOptionValues.has(formState.priority)
															? formState.priority
															: null
													}
													onChange={(selectedValue) => {
														if (selectedValue) {
															onChangePrioritySelection(
																String(selectedValue) as InquiryPriority,
															);
														}
													}}
												>
													{priorityOptions.map((option) => (
														<ListBox.Item
															key={option.value}
															id={option.value}
															textValue={option.label}
														>
															{option.label}
														</ListBox.Item>
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
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
