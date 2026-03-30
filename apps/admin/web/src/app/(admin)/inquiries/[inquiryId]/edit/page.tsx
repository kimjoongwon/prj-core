"use client";

import {
	type InquiryCategory,
	type InquiryPriority,
	useFillInquiryFormWithAi,
	useGetUpdateInquiryForm,
	useUpdateInquiry,
} from "@cocrepo/api/core/inquiries";
import { ADMIN_PATHS } from "@cocrepo/constant";
import type { AiFormOptionItem, AiFormPatch } from "@cocrepo/type";
import {
	type AdminInquiriesInquiryIdEditPageFormState,
	AdminInquiriesInquiryIdEditPage,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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

export default observer(function InquiryEditPageRoute() {
	const inquiryId = useParams<{ inquiryId: string }>().inquiryId;
	const router = useRouter();
	const { data: bootstrapResponse } = useGetUpdateInquiryForm(inquiryId);
	const updateMutation = useUpdateInquiry();
	const fillMutation = useFillInquiryFormWithAi();
	const bootstrap = bootstrapResponse?.data;
	const bootstrapOptions = normalizeAiFormOptions(bootstrap?.options);
	const categoryOptions = (bootstrapOptions.category ?? []).map((item) => ({
		value: String(item.value ?? ""),
		label: item.label,
	}));
	const priorityOptions = (bootstrapOptions.priority ?? []).map((item) => ({
		value: String(item.value ?? ""),
		label: item.label,
	}));

	const state = useLocalObservable<
		AdminInquiriesInquiryIdEditPageFormState & {
			initialized: boolean;
			initFromBootstrap: () => void;
		}
		>(() => ({
			initialized: false,
			title: "",
			category: "GENERAL" as InquiryCategory,
			priority: "NORMAL" as InquiryPriority,
			error: "",
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

	const onApplyAiPatch = (patches: AiFormPatch[]) => {
		for (const patch of patches) {
			switch (patch.path) {
				case "title":
					if (typeof patch.value === "string") state.title = patch.value;
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
		if (!state.title.trim()) {
			state.error = "문의 제목을 입력해주세요.";
			return;
		}

		state.error = "";
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
		<AdminInquiriesInquiryIdEditPage
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
			categoryOptions={categoryOptions}
			priorityOptions={priorityOptions}
			isSubmitting={updateMutation.isPending}
			onClickBackButton={() => {
				router.push(
					ADMIN_PATHS.INQUIRIES_DETAIL.replace(
						"[inquiryId]",
						inquiryId,
					) as Route,
				);
			}}
			onFillAiForm={async (input) => {
				const result = await fillMutation.mutateAsync({
					data: {
						mode: "UPDATE",
						schemaKey: input.schemaKey,
						selectedPaths: input.selectedPaths,
						currentObject: input.currentObject,
						userPrompt: input.userPrompt,
					},
				});
				return result?.data ?? { patches: [] };
			}}
			onApplyAiPatch={onApplyAiPatch}
			onChangeTitleInput={(value) => {
				state.title = value;
				state.error = "";
			}}
			onChangeCategorySelection={(value) => {
				state.category = value;
			}}
			onChangePrioritySelection={(value) => {
				state.priority = value;
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
