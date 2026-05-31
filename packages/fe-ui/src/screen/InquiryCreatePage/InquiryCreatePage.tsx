"use client";

import type {
	InquiryCategory,
	InquiryChannel,
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
	FormSection,
	FormSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import {
	Input,
	Select,
	SelectItem,
	type Selection,
	Textarea,
} from "../../design-system/primitives";

const getSelectedValue = (keys: Selection): string => {
	if (keys === "all") {
		return "";
	}

	const selectedKey = keys.values().next().value;
	return selectedKey ? String(selectedKey) : "";
};

export interface InquiryCreatePageCustomerSearchResult {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	label: string;
	description: string;
}

export interface InquiryCreatePageOption {
	value: string;
	text: string;
}

export interface InquiryCreatePageBootstrap {
	fieldMeta: Record<string, AiFormFieldMeta>;
	aiSchemas: AiFormSchema[];
	ui: AiFormUiPaths;
	options: Record<string, AiFormOptionItem[]>;
}

export interface InquiryCreatePageFormState {
	customerId: string;
	customerKeyword: string;
	title: string;
	content: string;
	category: InquiryCategory;
	channel: InquiryChannel;
	priority: InquiryPriority;
	searchResults: InquiryCreatePageCustomerSearchResult[];
	errors: Record<string, string>;
}

export interface InquiryCreatePageProps {
	formState: InquiryCreatePageFormState;
	bootstrap?: InquiryCreatePageBootstrap;
	categoryOptions: InquiryCreatePageOption[];
	channelOptions: InquiryCreatePageOption[];
	priorityOptions: InquiryCreatePageOption[];
	isLoading: boolean;
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onChangeCustomerKeyword: (value: string) => void;
	onSearchCustomer: (keyword: string) => void;
	onSelectCustomer: (customer: InquiryCreatePageCustomerSearchResult) => void;
	onChangeTitleInput: (value: string) => void;
	onChangeContentTextarea: (value: string) => void;
	onChangeCategorySelection: (value: InquiryCategory) => void;
	onChangeChannelSelection: (value: InquiryChannel) => void;
	onChangePrioritySelection: (value: InquiryPriority) => void;
	onFillAiForm: (
		input: AiFormFillRequest<Record<string, unknown>>,
	) => Promise<AiFormFillResponse>;
	onApplyAiPatch: (patches: AiFormPatch[]) => void;
	onRevalidateAiForm: () => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}

export const InquiryCreatePage = observer(
	({
		formState,
		bootstrap,
		categoryOptions,
		channelOptions,
		priorityOptions,
		isLoading,
		isSubmitting,
		onClickBackButton,
		onChangeCustomerKeyword,
		onSearchCustomer,
		onSelectCustomer,
		onChangeTitleInput,
		onChangeContentTextarea,
		onChangeCategorySelection,
		onChangeChannelSelection,
		onChangePrioritySelection,
		onFillAiForm,
		onApplyAiPatch,
		onRevalidateAiForm,
		onClickCancelButton,
		onClickSubmitButton,
	}: InquiryCreatePageProps) => {
		const hiddenPaths = bootstrap?.ui.hiddenPaths ?? [];
		const isHidden = (path: string) => hiddenPaths.includes(path);
		const categoryOptionValues = new Set(
			categoryOptions.map((option) => option.value),
		);
		const channelOptionValues = new Set(
			channelOptions.map((option) => option.value),
		);
		const priorityOptionValues = new Set(
			priorityOptions.map((option) => option.value),
		);

		return (
			<FormPage
				top={
					<PageTitleBar
						title="문의 접수"
						description="문의 생성 bootstrap과 AiForm을 이용해 문의를 등록합니다."
						actions={
							<Button
								variant="flat"
								startContent={<ArrowLeft className="size-4" />}
								onPress={onClickBackButton}
								isDisabled={isSubmitting}
							>
								목록으로
							</Button>
						}
					/>
				}
			>
				<FormPageSurface>
					<VStack gap={4}>
						{bootstrap && (
							<FormSectionCard>
								<FormSection
									top={<PageTitleBar level={2} title="AI 폼 추천" />}
								>
									<AiForm
										formState={{
											customerId: formState.customerId,
											title: formState.title,
											content: formState.content,
											category: formState.category,
											channel: formState.channel,
											priority: formState.priority,
										}}
										fieldMeta={bootstrap.fieldMeta}
										aiSchemas={bootstrap.aiSchemas}
										ui={bootstrap.ui}
										options={bootstrap.options}
										onFill={onFillAiForm}
										applyPatch={onApplyAiPatch}
										onRevalidate={onRevalidateAiForm}
										disabled={isSubmitting}
									/>
								</FormSection>
							</FormSectionCard>
						)}
						<FormSectionCard>
							<FormSection top={<PageTitleBar level={2} title="문의 입력" />}>
								<VStack gap={4}>
									{!isHidden("customerId") && (
										<div className="space-y-2">
											<Input
												label="고객"
												labelPlacement="outside"
												placeholder="고객명/이메일/전화번호 검색"
												value={formState.customerKeyword}
												onValueChange={(value) => {
													onChangeCustomerKeyword(value);
													onSearchCustomer(value);
												}}
												isRequired
												isInvalid={Boolean(formState.errors.customerId)}
												errorMessage={formState.errors.customerId}
											/>
											{formState.searchResults.length > 0 && (
												<div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-divider p-2">
													{formState.searchResults.map((customer) => (
														<button
															key={customer.id}
															type="button"
															onClick={() => {
																onSelectCustomer(customer);
															}}
															className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-default-100"
														>
															<div className="text-sm font-medium">
																{customer.label}
															</div>
															<div className="text-xs text-default-500">
																{customer.description || customer.id}
															</div>
														</button>
													))}
												</div>
											)}
											{formState.customerId && (
												<div className="text-xs text-default-500">
													선택된 고객 ID: {formState.customerId}
												</div>
											)}
										</div>
									)}
									{!isHidden("title") && (
										<Input
											label="문의 제목"
											labelPlacement="outside"
											placeholder="문의 제목을 입력하세요"
											value={formState.title}
											onValueChange={onChangeTitleInput}
											isRequired
											isInvalid={Boolean(formState.errors.title)}
											errorMessage={formState.errors.title}
										/>
									)}
									{!isHidden("content") && (
										<Textarea
											label="문의 내용"
											labelPlacement="outside"
											placeholder="문의 내용을 입력하세요"
											value={formState.content}
											onValueChange={onChangeContentTextarea}
											minRows={6}
											isRequired
											isInvalid={Boolean(formState.errors.content)}
											errorMessage={formState.errors.content}
										/>
									)}
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										{!isHidden("category") && (
											<div>
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
													isRequired
													isInvalid={Boolean(formState.errors.category)}
													errorMessage={formState.errors.category}
												>
													{categoryOptions.map((option) => (
														<SelectItem key={option.value}>
															{option.text}
														</SelectItem>
													))}
												</Select>
											</div>
										)}
										{!isHidden("channel") && (
											<div>
												<Select
													label="채널"
													placeholder="채널 선택"
													selectedKeys={
														formState.channel &&
														channelOptionValues.has(formState.channel)
															? [formState.channel]
															: []
													}
													onSelectionChange={(keys) => {
														const selectedValue = getSelectedValue(keys);
														if (selectedValue) {
															onChangeChannelSelection(
																selectedValue as InquiryChannel,
															);
														}
													}}
													isRequired
													isInvalid={Boolean(formState.errors.channel)}
													errorMessage={formState.errors.channel}
												>
													{channelOptions.map((option) => (
														<SelectItem key={option.value}>
															{option.text}
														</SelectItem>
													))}
												</Select>
											</div>
										)}
										{!isHidden("priority") && (
											<div>
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
													isRequired
													isInvalid={Boolean(formState.errors.priority)}
													errorMessage={formState.errors.priority}
												>
													{priorityOptions.map((option) => (
														<SelectItem key={option.value}>
															{option.text}
														</SelectItem>
													))}
												</Select>
											</div>
										)}
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
											isDisabled={isLoading}
										>
											등록
										</Button>
									</div>
								</VStack>
							</FormSection>
						</FormSectionCard>
					</VStack>
				</FormPageSurface>
			</FormPage>
		);
	},
);
