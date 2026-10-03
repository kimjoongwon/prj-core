"use client";

import type {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
} from "@cocrepo/api/core/inquiries";
import type { FormFieldMeta, FormOptionItem, FormUiPaths } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { Button } from "../../input/Button/Button";
import { Select } from "../../input/Select";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";
import { Section } from "../../layout/Section/Section";
import { HStack, VStack } from "../../rhythm";
export interface InquiryFormCustomerSearchResult {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	label: string;
	description: string;
}
export interface InquiryFormOption {
	value: string;
	label?: string;
	text?: string;
}
export interface InquiryFormBootstrap {
	fieldMeta: Record<string, FormFieldMeta>;
	ui: FormUiPaths;
	options: Record<string, FormOptionItem[]>;
}
export interface InquiryFormState {
	customerId: string;
	customerKeyword: string;
	title: string;
	content: string;
	category: InquiryCategory;
	channel: InquiryChannel;
	priority: InquiryPriority;
	searchResults: InquiryFormCustomerSearchResult[];
	errors: Record<string, string>;
}
export interface InquiryFormProps {
	state: InquiryFormState;
	bootstrap?: InquiryFormBootstrap;
	categoryOptions: InquiryFormOption[];
	priorityOptions: InquiryFormOption[];
	channelOptions?: InquiryFormOption[];
	readOnly?: boolean;
	isLoading?: boolean;
	isSubmitting: boolean;
	showCustomerField?: boolean;
	showContentField?: boolean;
	showChannelField?: boolean;
	submitLabel: string;
	onSearchCustomer?: (keyword: string) => void;
	onSelectCustomer?: (customer: InquiryFormCustomerSearchResult) => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}
const optionLabel = (option: InquiryFormOption) =>
	option.label ?? option.text ?? option.value;
function clearFieldError(state: InquiryFormState, field: string) {
	if (state.errors[field]) {
		delete state.errors[field];
	}
}

/**
 * Inquiry aggregate의 접수/수정 필드 조합입니다.
 * route가 노출할 필드와 readOnly를 정하고, form은 필드 편집 상태만 관리합니다.
 */
export const InquiryForm = observer(
	({
		state,
		bootstrap,
		categoryOptions,
		priorityOptions,
		channelOptions = [],
		readOnly = false,
		isLoading = false,
		isSubmitting,
		showCustomerField = false,
		showContentField = false,
		showChannelField = false,
		submitLabel,
		onSearchCustomer,
		onSelectCustomer,
		onClickCancelButton,
		onClickSubmitButton,
	}: InquiryFormProps) => {
		const hiddenPaths = bootstrap?.ui.hiddenPaths ?? [];
		const isHidden = (path: string) => hiddenPaths.includes(path);
		const isEditable = !readOnly && !isSubmitting;
		return (
			<VStack>
				<Section>
					<Section.Header title="문의 입력" />
					<Section.Body>
						<VStack>
							{showCustomerField && !isHidden("customerId") ? (
								<VStack gap="block">
									<TextField
										label="고객"
										labelPlacement="outside"
										placeholder="고객명/이메일/전화번호 검색"
										state={state}
										path="customerKeyword"
										isReadOnly={!isEditable}
										isDisabled={!isEditable}
										isRequired
										isInvalid={Boolean(state.errors.customerId)}
										errorMessage={state.errors.customerId}
										onValueChange={(value) => {
											clearFieldError(state, "customerId");
											onSearchCustomer?.(value);
										}}
									/>
									{state.searchResults.length > 0 && isEditable ? (
										<VStack
											gap="dense"
											className="max-h-56 overflow-y-auto rounded-xl border border-border p-2"
										>
											{state.searchResults.map((customer) => (
												<button
													key={customer.id}
													type="button"
													onClick={() => onSelectCustomer?.(customer)}
													className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-default"
												>
													<Typography type="body-sm" weight="medium">
														{customer.label}
													</Typography>
													<Typography type="body-xs" color="muted">
														{customer.description || customer.id}
													</Typography>
												</button>
											))}
										</VStack>
									) : null}
									{state.customerId ? (
										<Typography type="body-xs" color="muted">
											선택된 고객 ID: {state.customerId}
										</Typography>
									) : null}
								</VStack>
							) : null}
							{!isHidden("title") ? (
								<TextField
									label="문의 제목"
									labelPlacement="outside"
									placeholder="문의 제목을 입력하세요"
									state={state}
									path="title"
									isReadOnly={!isEditable}
									isDisabled={!isEditable}
									isRequired
									isInvalid={Boolean(state.errors.title)}
									errorMessage={state.errors.title}
									onValueChange={() => clearFieldError(state, "title")}
								/>
							) : null}
							{showContentField && !isHidden("content") ? (
								<TextArea
									label="문의 내용"
									labelPlacement="outside"
									placeholder="문의 내용을 입력하세요"
									state={state}
									path="content"
									isReadOnly={!isEditable}
									isDisabled={!isEditable}
									minRows={6}
									isRequired
									isInvalid={Boolean(state.errors.content)}
									errorMessage={state.errors.content}
								/>
							) : null}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								{!isHidden("category") ? (
									<Select
										label="카테고리"
										placeholder="카테고리 선택"
										state={state}
										path="category"
										options={categoryOptions.map((option) => ({
											value: option.value,
											label: optionLabel(option),
										}))}
										isDisabled={!isEditable}
										isRequired
										isInvalid={Boolean(state.errors.category)}
										errorMessage={state.errors.category}
										onValueChange={() => clearFieldError(state, "category")}
									/>
								) : null}
								{showChannelField && !isHidden("channel") ? (
									<Select
										label="채널"
										placeholder="채널 선택"
										state={state}
										path="channel"
										options={channelOptions.map((option) => ({
											value: option.value,
											label: optionLabel(option),
										}))}
										isDisabled={!isEditable}
										isRequired
										isInvalid={Boolean(state.errors.channel)}
										errorMessage={state.errors.channel}
										onValueChange={() => clearFieldError(state, "channel")}
									/>
								) : null}
								{!isHidden("priority") ? (
									<Select
										label="우선순위"
										placeholder="우선순위 선택"
										state={state}
										path="priority"
										options={priorityOptions.map((option) => ({
											value: option.value,
											label: optionLabel(option),
										}))}
										isDisabled={!isEditable}
										isRequired
										isInvalid={Boolean(state.errors.priority)}
										errorMessage={state.errors.priority}
										onValueChange={() => clearFieldError(state, "priority")}
									/>
								) : null}
							</div>
							{readOnly ? null : (
								<HStack justifyContent="end">
									<Button
										variant="ghost"
										onPress={onClickCancelButton}
										isDisabled={isSubmitting}
									>
										취소
									</Button>
									<Button
										variant="primary"
										onPress={onClickSubmitButton}
										isLoading={isSubmitting}
										isDisabled={isLoading}
									>
										{submitLabel}
									</Button>
								</HStack>
							)}
						</VStack>
					</Section.Body>
				</Section>
			</VStack>
		);
	},
);
