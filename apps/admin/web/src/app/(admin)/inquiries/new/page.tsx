"use client";

import {
	type InquiryCategory,
	type InquiryChannel,
	type InquiryPriority,
	useCreateInquiry,
	useFillInquiryFormWithAi,
	useGetCreateInquiryForm,
} from "@cocrepo/api/core/inquiries";
import { getUsers } from "@cocrepo/api/core/users";
import { ADMIN_PATHS } from "@cocrepo/constant";
import type { AiFormOptionItem, AiFormPatch } from "@cocrepo/type";
import {
	InquiryCreatePage,
	type InquiryCreatePageCustomerSearchResult,
	type InquiryCreatePageFormState,
	type InquiryCreatePageOption,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REQUIRED_MESSAGE = "필수 항목입니다.";

const normalizeAiFormOptionValue = (
	value: unknown,
): AiFormOptionItem["value"] => {
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return value;
	}

	return null;
};

const normalizeAiFormOptions = (
	options?: Record<string, Array<{ value: unknown; label: string }>>,
): Record<string, AiFormOptionItem[]> => {
	return Object.fromEntries(
		Object.entries(options ?? {}).map(([path, items]) => [
			path,
			items.map((item) => ({
				value: normalizeAiFormOptionValue(item.value),
				label: item.label,
			})),
		]),
	);
};

const mapSelectOptions = (
	items?: AiFormOptionItem[],
): InquiryCreatePageOption[] =>
	(items ?? []).map((item) => ({
		value: String(item.value ?? ""),
		text: item.label,
	}));

export default observer(function InquiriesNewPageRoute() {
	const router = useRouter();
	const { data: bootstrapResponse, isLoading } = useGetCreateInquiryForm();
	const createInquiryMutation = useCreateInquiry();
	const fillMutation = useFillInquiryFormWithAi();
	const bootstrap = bootstrapResponse?.data;
	const bootstrapOptions = normalizeAiFormOptions(bootstrap?.options);

	const state = useLocalObservable<
		InquiryCreatePageFormState & {
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
		searchResults: [] as InquiryCreatePageCustomerSearchResult[],
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

	const onApplyAiPatch = (patches: AiFormPatch[]) => {
		for (const patch of patches) {
			switch (patch.path) {
				case "title":
					if (typeof patch.value === "string") state.title = patch.value;
					break;
				case "content":
					if (typeof patch.value === "string") state.content = patch.value;
					break;
				case "category":
					if (typeof patch.value === "string") {
						state.category = patch.value as InquiryCategory;
					}
					break;
				case "priority":
					if (typeof patch.value === "string") {
						state.priority = patch.value as InquiryPriority;
					}
					break;
				default:
					break;
			}
		}
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
		<InquiryCreatePage
			formState={state}
			bootstrap={
				bootstrap
					? {
							fieldMeta: bootstrap.fieldMeta,
							aiSchemas: bootstrap.aiSchemas,
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
			onClickBackButton={() => {
				router.push(ADMIN_PATHS.INQUIRIES as Route);
			}}
			onChangeCustomerKeyword={(value) => {
				state.customerKeyword = value;
			}}
			onSearchCustomer={(keyword) => {
				void onSearchCustomer(keyword);
			}}
			onSelectCustomer={(customer) => {
				state.customerId = customer.id;
				state.customerKeyword = customer.label;
				state.searchResults = [];
			}}
			onChangeTitleInput={(value) => {
				state.title = value;
			}}
			onChangeContentTextarea={(value) => {
				state.content = value;
			}}
			onChangeCategorySelection={(value) => {
				state.category = value;
			}}
			onChangeChannelSelection={(value) => {
				state.channel = value;
			}}
			onChangePrioritySelection={(value) => {
				state.priority = value;
			}}
			onFillAiForm={async (input) => {
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
			onApplyAiPatch={onApplyAiPatch}
			onRevalidateAiForm={() => {
				state.validate();
			}}
			onClickCancelButton={() => {
				router.push(ADMIN_PATHS.INQUIRIES as Route);
			}}
			onClickSubmitButton={() => {
				void onClickSubmitButton();
			}}
		/>
	);
});
