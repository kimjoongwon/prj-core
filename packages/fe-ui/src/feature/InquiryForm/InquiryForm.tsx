"use client";

import type {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
} from "@cocrepo/enum";
import { Button, Card, CardBody, Divider, Input, Spacer } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
	type Assignee,
	AssigneeSelect,
} from "../../input/AssigneeSelect/AssigneeSelect";
import {
	CustomerSearchInput,
	type CustomerSearchResult,
} from "../../input/CustomerSearchInput/CustomerSearchInput";
import { InquiryCategorySelect } from "../../input/InquiryCategorySelect/InquiryCategorySelect";
import { InquiryChannelSelect } from "../../input/InquiryChannelSelect/InquiryChannelSelect";
import { InquiryPrioritySelect } from "../../input/InquiryPrioritySelect/InquiryPrioritySelect";
import { Textarea } from "../../input/Textarea/Textarea";
import { AIClassificationSuggestion } from "../../widget/AIClassificationSuggestion/AIClassificationSuggestion";

export interface CustomerInfo {
	/** 고객 ID */
	id: string;
	/** 고객명 */
	name: string;
	/** 이메일 */
	email?: string;
	/** 전화번호 */
	phone?: string;
}

export interface AIFormSuggestion {
	/** 추천 카테고리 코드 */
	category?: InquiryCategory;
	/** 추천 카테고리명 */
	categoryName?: string;
	/** 추천 우선순위 코드 */
	priority?: InquiryPriority;
	/** 추천 우선순위명 */
	priorityName?: string;
	/** 신뢰도 (0-100) */
	confidence: number;
	/** 추천 태그 */
	suggestedTags?: string[];
}

export interface InquiryFormProps {
	/** 폼 제출 핸들러 */
	onSubmit: (data: InquiryFormData) => void;
	/** 내용 변경 핸들러 (AI 분류 트리거용) */
	onContentChange?: (content: string) => void;
	/** 고객 검색 핸들러 */
	onSearchCustomer?: (keyword: string) => Promise<CustomerSearchResult[]>;
	/** 담당자 목록 */
	assignees?: Assignee[];
	/** 제출 중 여부 */
	isSubmitting?: boolean;
	/** AI 분류 제안 */
	aiSuggestion?: AIFormSuggestion | null;
	/** AI 분류 로딩 중 */
	isAiLoading?: boolean;
	/** AI 제안 적용 핸들러 */
	onApplyAiSuggestion?: () => void;
	/** AI 제안 무시 핸들러 */
	onDismissAiSuggestion?: () => void;
	/** 초기값 */
	initialValues?: Partial<InquiryFormData>;
	/** 추가 CSS 클래스 */
	className?: string;
}

export interface InquiryFormData {
	/** 고객 ID */
	customerId: string;
	/** 제목 */
	title: string;
	/** 내용 */
	content: string;
	/** 카테고리 */
	category: InquiryCategory;
	/** 채널 */
	channel: InquiryChannel;
	/** 우선순위 */
	priority: InquiryPriority;
	/** 담당자 ID */
	assigneeId?: string;
	/** 첨부 파일 URL 목록 */
	attachmentUrls?: string[];
}

const REQUIRED_MESSAGE = "필수 항목입니다";

/**
 * InquiryForm 컴포넌트
 * 문의 접수 폼으로 고객 선택, 제목/내용 입력, 카테고리/채널/우선순위 선택, AI 분류 제안 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <InquiryForm
 *   onSubmit={handleSubmit}
 *   onContentChange={handleContentChange}
 *   onSearchCustomer={searchCustomers}
 *   aiSuggestion={aiSuggestion}
 *   isSubmitting={isSubmitting}
 * />
 * ```
 */
export const InquiryForm = observer(
	({
		onSubmit,
		onContentChange,
		onSearchCustomer,
		assignees,
		isSubmitting = false,
		aiSuggestion,
		isAiLoading = false,
		onApplyAiSuggestion,
		onDismissAiSuggestion,
		initialValues,
		className = "",
	}: InquiryFormProps) => {
		// 폼 상태
		const [customerId, setCustomerId] = useState(
			initialValues?.customerId ?? "",
		);
		const [_customerInfo, setCustomerInfo] =
			useState<CustomerSearchResult | null>(null);
		const [title, setTitle] = useState(initialValues?.title ?? "");
		const [content, setContent] = useState(initialValues?.content ?? "");
		const [category, setCategory] = useState<InquiryCategory | null>(
			initialValues?.category ?? null,
		);
		const [channel, setChannel] = useState<InquiryChannel | null>(
			initialValues?.channel ?? null,
		);
		const [priority, setPriority] = useState<InquiryPriority | null>(
			initialValues?.priority ?? null,
		);
		const [assigneeId, setAssigneeId] = useState(
			initialValues?.assigneeId ?? "",
		);

		// 검색 결과 상태
		const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>(
			[],
		);

		// 에러 상태
		const [errors, setErrors] = useState<Record<string, string>>({});

		const validateForm = (): boolean => {
			const newErrors: Record<string, string> = {};

			if (!customerId) {
				newErrors.customerId = REQUIRED_MESSAGE;
			}
			if (!title.trim()) {
				newErrors.title = REQUIRED_MESSAGE;
			}
			if (!content.trim()) {
				newErrors.content = REQUIRED_MESSAGE;
			}
			if (!category) {
				newErrors.category = REQUIRED_MESSAGE;
			}
			if (!channel) {
				newErrors.channel = REQUIRED_MESSAGE;
			}
			if (!priority) {
				newErrors.priority = REQUIRED_MESSAGE;
			}

			setErrors(newErrors);
			return Object.keys(newErrors).length === 0;
		};

		const handleSubmit = () => {
			if (!validateForm()) return;

			const formData: InquiryFormData = {
				customerId,
				title,
				content,
				category: category as InquiryCategory,
				channel: channel as InquiryChannel,
				priority: priority as InquiryPriority,
				assigneeId: assigneeId || undefined,
			};

			onSubmit(formData);
		};

		const handleContentChange = (value: string) => {
			setContent(value);
			onContentChange?.(value);
		};

		const handleCustomerSearch = async (keyword: string) => {
			if (onSearchCustomer) {
				const results = await onSearchCustomer(keyword);
				setSearchResults(results);
			}
		};

		const handleCustomerSelect = (customer: CustomerSearchResult | null) => {
			if (customer) {
				setCustomerId(customer.id);
				setCustomerInfo(customer);
			}
		};

		const handleApplyAiSuggestion = () => {
			if (aiSuggestion) {
				if (aiSuggestion.category) {
					setCategory(aiSuggestion.category);
				}
				if (aiSuggestion.priority) {
					setPriority(aiSuggestion.priority);
				}
			}
			onApplyAiSuggestion?.();
		};

		const handleReset = () => {
			setCustomerId("");
			setCustomerInfo(null);
			setTitle("");
			setContent("");
			setCategory(null);
			setChannel(null);
			setPriority(null);
			setAssigneeId("");
			setErrors({});
		};

		return (
			<Card className={className} shadow="sm">
				<CardBody className="gap-4 p-6">
					{/* 고객 선택 */}
					<CustomerSearchInput
						label="고객"
						placeholder="고객명, 이메일, 전화번호로 검색"
						items={searchResults}
						onInputChange={handleCustomerSearch}
						onSelectionChange={handleCustomerSelect}
						isRequired
						errorMessage={errors.customerId}
						isInvalid={!!errors.customerId}
					/>

					<Divider />

					{/* 제목 */}
					<Input
						label="제목"
						labelPlacement="outside"
						placeholder="문의 제목을 입력하세요"
						value={title}
						onValueChange={setTitle}
						isRequired
						errorMessage={errors.title}
						isInvalid={!!errors.title}
					/>

					{/* 내용 */}
					<Textarea
						label="내용"
						labelPlacement="outside"
						placeholder="문의 내용을 상세히 입력하세요"
						value={content}
						onValueChange={handleContentChange}
						minRows={5}
						maxRows={10}
						isRequired
						errorMessage={errors.content}
						isInvalid={!!errors.content}
					/>

					{/* AI 분류 제안 */}
					{aiSuggestion && (
						<AIClassificationSuggestion
							result={{
								category: aiSuggestion.category ?? "",
								categoryName: aiSuggestion.categoryName ?? "",
								priority: aiSuggestion.priority ?? "",
								priorityName: aiSuggestion.priorityName ?? "",
								confidence: aiSuggestion.confidence,
								suggestedTags: aiSuggestion.suggestedTags,
							}}
							onApply={handleApplyAiSuggestion}
							onDismiss={onDismissAiSuggestion ?? (() => {})}
							isLoading={isAiLoading}
						/>
					)}

					<Divider />

					{/* 분류 정보 */}
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div>
							<InquiryCategorySelect
								label="카테고리"
								value={category ?? undefined}
								onChange={(v) => setCategory(v)}
								isRequired
							/>
							{errors.category && (
								<span className="text-xs text-danger">{errors.category}</span>
							)}
						</div>

						<div>
							<InquiryChannelSelect
								label="채널"
								value={channel ?? undefined}
								onChange={(v) => setChannel(v)}
								isRequired
							/>
							{errors.channel && (
								<span className="text-xs text-danger">{errors.channel}</span>
							)}
						</div>

						<div>
							<InquiryPrioritySelect
								label="우선순위"
								value={priority ?? undefined}
								onChange={(v) => setPriority(v)}
								isRequired
							/>
							{errors.priority && (
								<span className="text-xs text-danger">{errors.priority}</span>
							)}
						</div>

						{assignees && (
							<AssigneeSelect
								label="담당자"
								value={assigneeId}
								onChange={setAssigneeId}
								assignees={assignees}
							/>
						)}
					</div>

					<Spacer y={2} />

					<Divider />

					{/* 제출 버튼 */}
					<div className="flex justify-end gap-2">
						<Button
							variant="flat"
							onClick={handleReset}
							isDisabled={isSubmitting}
						>
							초기화
						</Button>
						<Button
							color="primary"
							onClick={handleSubmit}
							isLoading={isSubmitting}
						>
							문의 접수
						</Button>
					</div>
				</CardBody>
			</Card>
		);
	},
);

InquiryForm.displayName = "InquiryForm";
