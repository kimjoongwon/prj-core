"use client";

import type {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
} from "@cocrepo/enum";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Select } from "../../selection/Select/Select";
import { TextArea } from "../../input/TextArea/TextArea";
import { Button } from "../../action/Button/Button";
import { Card, Separator } from "@heroui/react";
import { Input } from "../../input/Input/Input";
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

export interface InquiryFormCustomerSearchResult {
	/** 고객 ID */
	id: string;
	/** 고객명 */
	name: string;
	/** 이메일 */
	email?: string;
	/** 연락처 */
	phone?: string;
	/** 표시용 라벨 */
	label: string;
	/** 설명 (부가 정보) */
	description?: string;
}

export interface InquiryFormAssignee {
	/** 사용자 ID */
	id: string;
	/** 사용자명 */
	name: string;
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

export interface InquiryFormOption {
	value: string;
	label: string;
}

export interface InquiryFormOptions {
	category: InquiryFormOption[];
	channel: InquiryFormOption[];
	priority: InquiryFormOption[];
}

export interface InquiryFormProps {
	/** 폼 제출 핸들러 */
	onSubmit: (data: InquiryFormData) => void;
	/** 백엔드 폼 bootstrap에서 내려온 선택 옵션 */
	options: InquiryFormOptions;
	/** 내용 변경 핸들러 (AI 분류 트리거용) */
	onContentChange?: (content: string) => void;
	/** 고객 검색 핸들러 */
	onSearchCustomer?: (
		keyword: string,
	) => Promise<InquiryFormCustomerSearchResult[]>;
	/** 담당자 목록 */
	assignees?: InquiryFormAssignee[];
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
 *   options={bootstrap.options}
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
		options,
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
		const [customerKeyword, setCustomerKeyword] = useState("");
		const [_customerInfo, setCustomerInfo] =
			useState<InquiryFormCustomerSearchResult | null>(null);
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
		const [searchResults, setSearchResults] = useState<
			InquiryFormCustomerSearchResult[]
		>([]);

		// 에러 상태
		const [errors, setErrors] = useState<Record<string, string>>({});
		const assigneeOptions = [
			{ value: "", text: "미배정" },
			...(assignees ?? []).map((assignee) => ({
				value: assignee.id,
				text: assignee.name,
			})),
		];

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
			setCustomerKeyword(keyword);

			if (!keyword.trim()) {
				setCustomerId("");
				setCustomerInfo(null);
				setSearchResults([]);
				return;
			}

			if (!onSearchCustomer) {
				return;
			}

			const results = await onSearchCustomer(keyword);
			setSearchResults(results);
		};

		const handleCustomerSelect = (
			customer: InquiryFormCustomerSearchResult | null,
		) => {
			if (customer) {
				setCustomerId(customer.id);
				setCustomerKeyword(customer.label);
				setCustomerInfo(customer);
				setSearchResults([]);
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
			setCustomerKeyword("");
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
			<Card className={className}>
				<Card.Content className="gap-4 p-6">
					{/* 고객 선택 */}
					<div className="space-y-2">
						<Input
							label="고객"
							labelPlacement="outside"
							placeholder="고객명, 이메일, 전화번호로 검색"
							value={customerKeyword}
							onValueChange={(value) => {
								void handleCustomerSearch(value);
							}}
							isRequired
							errorMessage={errors.customerId}
							isInvalid={!!errors.customerId}
						/>
						{searchResults.length > 0 && (
							<div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-border p-2">
								{searchResults.map((customer) => (
									<button
										key={customer.id}
										type="button"
										onClick={() => handleCustomerSelect(customer)}
										className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-default"
									>
										<div className="text-sm font-medium">
											{customer.label}
										</div>
										<div className="text-xs text-muted">
											{customer.description ||
												[customer.email, customer.phone]
													.filter(Boolean)
													.join(" | ") ||
												customer.id}
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					<Separator />

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
					<TextArea
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

					<Separator />

					{/* 분류 정보 */}
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<Select
							label="카테고리"
							placeholder="카테고리를 선택하세요"
							options={options.category}
							value={category ?? undefined}
							onValueChange={(value) => setCategory(value as InquiryCategory)}
							isRequired
							isInvalid={!!errors.category}
							errorMessage={errors.category}
						/>

						<Select
							label="채널"
							placeholder="채널을 선택하세요"
							options={options.channel}
							value={channel ?? undefined}
							onValueChange={(value) => setChannel(value as InquiryChannel)}
							isRequired
							isInvalid={!!errors.channel}
							errorMessage={errors.channel}
						/>

						<Select
							label="우선순위"
							placeholder="우선순위를 선택하세요"
							options={options.priority}
							value={priority ?? undefined}
							onValueChange={(value) => setPriority(value as InquiryPriority)}
							isRequired
							isInvalid={!!errors.priority}
							errorMessage={errors.priority}
						/>

						{assignees && (
							<Select
								label="담당자"
								value={assigneeId}
								onValueChange={setAssigneeId}
								options={assigneeOptions}
							/>
						)}
					</div>

					<div className="h-2" />

					<Separator />

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
				</Card.Content>
			</Card>
		);
	},
);

InquiryForm.displayName = "InquiryForm";
