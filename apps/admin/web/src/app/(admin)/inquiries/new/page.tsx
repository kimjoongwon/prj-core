"use client";

import {
	type InquiryCategory,
	type InquiryChannel,
	type InquiryPriority,
	useCreateInquiry,
	useGetCreateInquiryForm,
} from "@cocrepo/api/core/inquiries";
import { getUsers } from "@cocrepo/api/core/users";
import { ADMIN_PATHS } from "@cocrepo/constant";
import type { FormOptionItem } from "@cocrepo/type";
import {
	InquiryEditScreen,
	type InquiryEditScreenCustomerSearchResult,
	type InquiryEditScreenFormState,
	type InquiryEditScreenOption,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REQUIRED_MESSAGE = "필수 항목입니다.";

const normalizeFormOptionValue = (
	value: unknown,
): FormOptionItem["value"] => {
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return value;
	}

	return null;
};

const normalizeFormOptions = (
	options?: Record<string, Array<{ value: unknown; label: string }>>,
): Record<string, FormOptionItem[]> => {
	return Object.fromEntries(
		Object.entries(options ?? {}).map(([path, items]) => [
			path,
			items.map((item) => ({
				value: normalizeFormOptionValue(item.value),
				label: item.label,
			})),
		]),
	);
};

const mapSelectOptions = (
	items?: FormOptionItem[],
): InquiryEditScreenOption[] =>
	(items ?? []).map((item) => ({
		value: String(item.value ?? ""),
		text: item.label,
	}));

export default observer(function InquiriesNewPageRoute() {
	const router = useRouter();
	const { data: bootstrapResponse, isLoading } = useGetCreateInquiryForm();
	const createInquiryMutation = useCreateInquiry();
	const bootstrap = bootstrapResponse?.data;
	const bootstrapOptions = normalizeFormOptions(bootstrap?.options);

	const state = useLocalObservable<
		InquiryEditScreenFormState & {
			initialized: boolean;
			isSubmitting: boolean;
			initFromBootstrap: () => void;
			validate: () => boolean;
		}
	>(() => ({
		initialized: false,
		isSubmitting: false,
		customerId: "",
		customerKeyword: "",
		title: "",
		content: "",
		category: "GENERAL" as InquiryCategory,
		channel: "WEB" as InquiryChannel,
		priority: "NORMAL" as InquiryPriority,
		searchResults: [] as InquiryEditScreenCustomerSearchResult[],
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
					: ("GENERAL" as InquiryCategory);
			this.channel =
				typeof bootstrap.defaultObject.channel === "string"
					? (bootstrap.defaultObject.channel as InquiryChannel)
					: ("WEB" as InquiryChannel);
			this.priority =
				typeof bootstrap.defaultObject.priority === "string"
					? (bootstrap.defaultObject.priority as InquiryPriority)
					: ("NORMAL" as InquiryPriority);
			this.initialized = true;
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

	const onClickSubmitButton = async () => {
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
					ADMIN_PATHS.INQUIRIES_DETAIL.replace(
						"[inquiryId]",
						inquiryId,
					) as Route,
				);
				return;
			}

			router.push(ADMIN_PATHS.INQUIRIES as Route);
		} finally {
			state.isSubmitting = false;
		}
	};

	return (
		<>
			<InquiryEditScreen
				title="문의 접수"
				description="문의 생성 bootstrap을 이용해 문의를 등록합니다."
				formState={state}
				bootstrap={
					bootstrap
						? {
								fieldMeta: bootstrap.fieldMeta,
								ui: bootstrap.ui,
								options: bootstrapOptions,
							}
						: undefined
				}
				categoryOptions={mapSelectOptions(bootstrapOptions.category)}
				channelOptions={mapSelectOptions(bootstrapOptions.channel)}
				priorityOptions={mapSelectOptions(bootstrapOptions.priority)}
				isLoading={isLoading}
				isSubmitting={state.isSubmitting || createInquiryMutation.isPending}
				showCustomerField
				showContentField
				showChannelField
				submitLabel="등록"
				onClickBackButton={() => {
					router.push(ADMIN_PATHS.INQUIRIES as Route);
				}}
				onSearchCustomer={(keyword) => {
					void onSearchCustomer(keyword);
				}}
				onSelectCustomer={(customer) => {
					state.customerId = customer.id;
					state.customerKeyword = customer.label;
					state.searchResults = [];
				}}
				onClickCancelButton={() => {
					router.push(ADMIN_PATHS.INQUIRIES as Route);
				}}
				onClickSubmitButton={() => {
					void onClickSubmitButton();
				}}
			/>
		</>
	);
});
