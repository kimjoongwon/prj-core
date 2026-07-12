"use client";

import {
	type InquiryCategory,
	type InquiryChannel,
	type InquiryPriority,
	useGetUpdateInquiryForm,
	useUpdateInquiry,
} from "@cocrepo/api/core/inquiries";
import { ADMIN_PATHS } from "@cocrepo/constant";
import type { FormOptionItem } from "@cocrepo/type";
import {
	InquiryEditScreen,
	type InquiryEditScreenFormState,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const normalizeFormOptionValue = (value: unknown): FormOptionItem["value"] => {
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

export default observer(function InquiryEditScreenRoute() {
	const inquiryId = useParams<{ inquiryId: string }>().inquiryId;
	const router = useRouter();
	const { data: bootstrapResponse } = useGetUpdateInquiryForm(inquiryId);
	const updateMutation = useUpdateInquiry();
	const bootstrap = bootstrapResponse?.data;
	const bootstrapOptions = normalizeFormOptions(bootstrap?.options);
	const categoryOptions = (bootstrapOptions.category ?? []).map((item) => ({
		value: String(item.value ?? ""),
		label: item.label,
	}));
	const priorityOptions = (bootstrapOptions.priority ?? []).map((item) => ({
		value: String(item.value ?? ""),
		label: item.label,
	}));

	const state = useLocalObservable<
		InquiryEditScreenFormState & {
			initialized: boolean;
			initFromBootstrap: () => void;
		}
	>(() => ({
		initialized: false,
		customerId: "",
		customerKeyword: "",
		title: "",
		content: "",
		category: "GENERAL" as InquiryCategory,
		channel: "WEB" as InquiryChannel,
		priority: "NORMAL" as InquiryPriority,
		searchResults: [],
		errors: {},
		initFromBootstrap() {
			if (!bootstrap || this.initialized) {
				return;
			}

			this.title =
				typeof bootstrap.defaultObject.title === "string"
					? bootstrap.defaultObject.title
					: "";
			this.category =
				typeof bootstrap.defaultObject.category === "string"
					? (bootstrap.defaultObject.category as InquiryCategory)
					: ("GENERAL" as InquiryCategory);
			this.priority =
				typeof bootstrap.defaultObject.priority === "string"
					? (bootstrap.defaultObject.priority as InquiryPriority)
					: ("NORMAL" as InquiryPriority);
			this.initialized = true;
		},
	}));

	useEffect(() => {
		state.initFromBootstrap();
	}, [bootstrap, state]);

	const onClickSubmitButton = async () => {
		if (!state.title.trim()) {
			state.errors.title = "문의 제목을 입력해주세요.";
			return;
		}

		state.errors = {};
		await updateMutation.mutateAsync({
			inquiryId,
			data: {
				title: state.title.trim(),
				category: state.category,
				priority: state.priority,
			},
		});
		router.push(
			ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", inquiryId) as Route,
		);
	};

	return (
		<InquiryEditScreen
			title="문의 수정"
			description="문의 메타 정보를 수정합니다."
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
			categoryOptions={categoryOptions}
			priorityOptions={priorityOptions}
			isSubmitting={updateMutation.isPending}
			submitLabel="저장"
			onClickBackButton={() => {
				router.push(
					ADMIN_PATHS.INQUIRIES_DETAIL.replace(
						"[inquiryId]",
						inquiryId,
					) as Route,
				);
			}}
			onClickCancelButton={() => {
				router.push(
					ADMIN_PATHS.INQUIRIES_DETAIL.replace(
						"[inquiryId]",
						inquiryId,
					) as Route,
				);
			}}
			onClickSubmitButton={() => {
				void onClickSubmitButton();
			}}
		/>
	);
});
