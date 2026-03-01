"use client";

import {
	getUsers,
	type InquiryCategory,
	type InquiryChannel,
	type InquiryPriority,
	useCreateInquiry,
	useFillInquiryFormWithAi,
	useGetInquiryCreateForm,
} from "@cocrepo/api";
import { ADMIN_PATHS } from "@cocrepo/constant";
import {
	AiForm,
	Button,
	PageSurface,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Input, Select, SelectItem, type Selection, Textarea } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REQUIRED_MESSAGE = "필수 항목입니다.";

interface CustomerSearchResult {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	label: string;
	description: string;
}

const getSelectedValue = (keys: Selection): string => {
	if (keys === "all") {
		return "";
	}
	const selectedKey = keys.values().next().value;
	return selectedKey ? String(selectedKey) : "";
};

function InquiriesNewPageClient() {
	const router = useRouter();
	const { data: bootstrapResponse, isLoading } = useGetInquiryCreateForm();
	const createInquiryMutation = useCreateInquiry();
	const fillMutation = useFillInquiryFormWithAi();
	const bootstrap = bootstrapResponse?.data;

	const state = useLocalObservable(() => ({
		initialized: false,
		isSubmitting: false,
		customerId: "",
		customerKeyword: "",
		title: "",
		content: "",
		category: "GENERAL" as InquiryCategory,
		channel: "WEB" as InquiryChannel,
		priority: "NORMAL" as InquiryPriority,
		searchResults: [] as CustomerSearchResult[],
		errors: {} as Record<string, string>,
		initFromBootstrap() {
			if (!bootstrap || this.initialized) {
				return;
			}
			this.title =
				typeof bootstrap.defaultObject.title === "string"
					? bootstrap.defaultObject.title
					: "";
			this.content =
				typeof bootstrap.defaultObject.content === "string"
					? bootstrap.defaultObject.content
					: "";
			this.category =
				typeof bootstrap.defaultObject.category === "string"
					? (bootstrap.defaultObject.category as InquiryCategory)
					: "GENERAL";
			this.channel =
				typeof bootstrap.defaultObject.channel === "string"
					? (bootstrap.defaultObject.channel as InquiryChannel)
					: "WEB";
			this.priority =
				typeof bootstrap.defaultObject.priority === "string"
					? (bootstrap.defaultObject.priority as InquiryPriority)
					: "NORMAL";
			this.initialized = true;
		},
		toFormObject() {
			return {
				customerId: this.customerId,
				title: this.title,
				content: this.content,
				category: this.category,
				channel: this.channel,
				priority: this.priority,
			} satisfies Record<string, unknown>;
		},
		applyPatch(patches: Array<{ path: string; value: unknown }>) {
			for (const patch of patches) {
				switch (patch.path) {
					case "title":
						if (typeof patch.value === "string") this.title = patch.value;
						break;
					case "content":
						if (typeof patch.value === "string") this.content = patch.value;
						break;
					case "category":
						if (typeof patch.value === "string")
							this.category = patch.value as InquiryCategory;
						break;
					case "priority":
						if (typeof patch.value === "string")
							this.priority = patch.value as InquiryPriority;
						break;
					default:
						break;
				}
			}
		},
		validate() {
			const nextErrors: Record<string, string> = {};
			if (!this.customerId) nextErrors.customerId = REQUIRED_MESSAGE;
			if (!this.title.trim()) nextErrors.title = REQUIRED_MESSAGE;
			if (!this.content.trim()) nextErrors.content = REQUIRED_MESSAGE;
			if (!this.category) nextErrors.category = REQUIRED_MESSAGE;
			if (!this.channel) nextErrors.channel = REQUIRED_MESSAGE;
			if (!this.priority) nextErrors.priority = REQUIRED_MESSAGE;
			this.errors = nextErrors;
			return Object.keys(nextErrors).length === 0;
		},
	}));

	useEffect(() => {
		state.initFromBootstrap();
	}, [state, bootstrap]);

	const hiddenPaths = bootstrap?.ui.hiddenPaths ?? [];
	const isHidden = (path: string) => hiddenPaths.includes(path);

	const categoryOptions = (bootstrap?.options.category ?? []).map((item) => ({
		value: String(item.value ?? ""),
		text: item.label,
	}));
	const channelOptions = (bootstrap?.options.channel ?? []).map((item) => ({
		value: String(item.value ?? ""),
		text: item.label,
	}));
	const priorityOptions = (bootstrap?.options.priority ?? []).map((item) => ({
		value: String(item.value ?? ""),
		text: item.label,
	}));

	const onSearchCustomer = async (keyword: string) => {
		if (keyword.length < 2) {
			state.searchResults = [];
			return;
		}

		const response = await getUsers({ name: keyword, take: 10 });
		state.searchResults = (response?.data ?? []).map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			label: user.name,
			description: [user.email, user.phone].filter(Boolean).join(" | "),
		}));
	};

	const onSelectCustomer = (customer: CustomerSearchResult) => {
		state.customerId = customer.id;
		state.customerKeyword = customer.label;
		state.searchResults = [];
	};

	const onSubmit = async () => {
		if (!state.validate()) {
			return;
		}

		state.isSubmitting = true;
		try {
			const result = await createInquiryMutation.mutateAsync({
				data: {
					customerId: state.customerId || undefined,
					title: state.title.trim(),
					content: state.content.trim(),
					category: state.category,
					channel: state.channel,
					priority: state.priority,
				},
			});

			const inquiryId = result?.data?.id;
			if (inquiryId) {
				router.push(
					ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", inquiryId) as Route,
				);
				return;
			}
			router.push(ADMIN_PATHS.INQUIRIES as Route);
		} finally {
			state.isSubmitting = false;
		}
	};

	return (
		<PageSurface
			title="문의 접수"
			description="문의 생성 bootstrap과 AiForm을 이용해 문의를 등록합니다."
			actions={
				<Button
					variant="flat"
					startContent={<ArrowLeft className="size-4" />}
					onPress={() => router.push(ADMIN_PATHS.INQUIRIES as Route)}
					isDisabled={state.isSubmitting}
				>
					목록으로
				</Button>
			}
		>
			<VStack gap={4}>
				{bootstrap && (
					<AiForm
						formState={state.toFormObject()}
						fieldMeta={bootstrap.fieldMeta}
						aiSchemas={bootstrap.aiSchemas}
						ui={bootstrap.ui}
						options={bootstrap.options}
						onFill={async (input) => {
							const result = await fillMutation.mutateAsync({
								data: {
									mode: "CREATE",
									schemaKey: input.schemaKey,
									selectedPaths: input.selectedPaths,
									currentObject: input.currentObject,
									userPrompt: input.userPrompt,
								},
							});
							return result?.data ?? { patches: [] };
						}}
						applyPatch={(patches) => {
							state.applyPatch(patches);
						}}
						onRevalidate={() => {
							state.validate();
						}}
						disabled={state.isSubmitting}
					/>
				)}

				<SectionSurface>
					<VStack gap={4}>
						{!isHidden("customerId") && (
							<div className="space-y-2">
								<Input
									label="고객"
									labelPlacement="outside"
									placeholder="고객명/이메일/전화번호 검색"
									value={state.customerKeyword}
									onValueChange={(value) => {
										state.customerKeyword = value;
										void onSearchCustomer(value);
									}}
									isRequired
									isInvalid={Boolean(state.errors.customerId)}
									errorMessage={state.errors.customerId}
								/>
								{state.searchResults.length > 0 && (
									<div className="max-h-56 overflow-y-auto rounded-xl border border-divider p-2 space-y-1">
										{state.searchResults.map((customer) => (
											<button
												key={customer.id}
												type="button"
												onClick={() => {
													onSelectCustomer(customer);
												}}
												className="w-full rounded-lg px-3 py-2 text-left hover:bg-default-100 transition-colors"
											>
												<div className="text-sm font-medium">{customer.label}</div>
												<div className="text-xs text-default-500">
													{customer.description || customer.id}
												</div>
											</button>
										))}
									</div>
								)}
								{state.customerId && (
									<div className="text-xs text-default-500">
										선택된 고객 ID: {state.customerId}
									</div>
								)}
							</div>
						)}

						{!isHidden("title") && (
							<Input
								label="문의 제목"
								labelPlacement="outside"
								placeholder="문의 제목을 입력하세요"
								value={state.title}
								onValueChange={(value) => {
									state.title = value;
								}}
								isRequired
								isInvalid={Boolean(state.errors.title)}
								errorMessage={state.errors.title}
							/>
						)}

						{!isHidden("content") && (
							<Textarea
								label="문의 내용"
								labelPlacement="outside"
								placeholder="문의 내용을 입력하세요"
								value={state.content}
								onValueChange={(value) => {
									state.content = value;
								}}
								minRows={6}
								isRequired
								isInvalid={Boolean(state.errors.content)}
								errorMessage={state.errors.content}
							/>
						)}

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{!isHidden("category") && (
								<div>
									<Select
										label="카테고리"
										placeholder="카테고리 선택"
										selectedKeys={state.category ? [state.category] : []}
										onSelectionChange={(keys) => {
											const selectedValue = getSelectedValue(keys);
											if (selectedValue) {
												state.category = selectedValue as InquiryCategory;
											}
										}}
										isRequired
										isInvalid={Boolean(state.errors.category)}
										errorMessage={state.errors.category}
									>
										{categoryOptions.map((option) => (
											<SelectItem key={option.value}>{option.text}</SelectItem>
										))}
									</Select>
								</div>
							)}
							{!isHidden("channel") && (
								<div>
									<Select
										label="채널"
										placeholder="채널 선택"
										selectedKeys={state.channel ? [state.channel] : []}
										onSelectionChange={(keys) => {
											const selectedValue = getSelectedValue(keys);
											if (selectedValue) {
												state.channel = selectedValue as InquiryChannel;
											}
										}}
										isRequired
										isInvalid={Boolean(state.errors.channel)}
										errorMessage={state.errors.channel}
									>
										{channelOptions.map((option) => (
											<SelectItem key={option.value}>{option.text}</SelectItem>
										))}
									</Select>
								</div>
							)}
							{!isHidden("priority") && (
								<div>
									<Select
										label="우선순위"
										placeholder="우선순위 선택"
										selectedKeys={state.priority ? [state.priority] : []}
										onSelectionChange={(keys) => {
											const selectedValue = getSelectedValue(keys);
											if (selectedValue) {
												state.priority = selectedValue as InquiryPriority;
											}
										}}
										isRequired
										isInvalid={Boolean(state.errors.priority)}
										errorMessage={state.errors.priority}
									>
										{priorityOptions.map((option) => (
											<SelectItem key={option.value}>{option.text}</SelectItem>
										))}
									</Select>
								</div>
							)}
						</div>

						<div className="flex justify-end gap-2">
							<Button
								variant="light"
								onPress={() => router.push(ADMIN_PATHS.INQUIRIES as Route)}
								isDisabled={state.isSubmitting}
							>
								취소
							</Button>
							<Button
								color="primary"
								onPress={onSubmit}
								isLoading={state.isSubmitting || createInquiryMutation.isPending}
								isDisabled={isLoading}
							>
								등록
							</Button>
						</div>
					</VStack>
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(InquiriesNewPageClient);
