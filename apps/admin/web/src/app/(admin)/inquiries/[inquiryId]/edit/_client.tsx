"use client";
import {
	type InquiryCategory,
	type InquiryPriority,
	useFillInquiryFormWithAi,
	useGetUpdateInquiryForm,
	useUpdateInquiry,
} from "@cocrepo/api/core/inquiries";

import { ADMIN_PATHS } from "@cocrepo/constant";
import type { AiFormOptionItem } from "@cocrepo/type";
import {
	AiForm,
	Button,
	Page,
	PageSurface,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Input, Select, SelectItem, type Selection } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
	inquiryId: string;
}

const getSelectedValue = (keys: Selection): string => {
	if (keys === "all") {
		return "";
	}
	const selectedKey = keys.values().next().value;
	return selectedKey ? String(selectedKey) : "";
};

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

function InquiryEditPageClient({ inquiryId }: Props) {
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

	const state = useLocalObservable(() => ({
		initialized: false,
		isSubmitting: false,
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
					: "GENERAL";
			this.priority =
				typeof bootstrap.defaultObject.priority === "string"
					? (bootstrap.defaultObject.priority as InquiryPriority)
					: "NORMAL";
			this.initialized = true;
		},
		toFormObject() {
			return {
				title: this.title,
				category: this.category,
				priority: this.priority,
			} satisfies Record<string, unknown>;
		},
		applyPatch(patches: Array<{ path: string; value: unknown }>) {
			for (const patch of patches) {
				switch (patch.path) {
					case "title":
						if (typeof patch.value === "string") this.title = patch.value;
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
	}));

	useEffect(() => {
		state.initFromBootstrap();
	}, [bootstrap, state]);

	const onSubmit = async () => {
		if (!state.title.trim()) {
			state.error = "문의 제목을 입력해주세요.";
			return;
		}

		state.error = "";
		state.isSubmitting = true;
		try {
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
		} finally {
			state.isSubmitting = false;
		}
	};

	return (
		<Page
			top={
				<PageTitleBar
					title="문의 수정"
					description="문의 메타 정보를 수정하고 AiForm으로 추천 값을 반영합니다."
					actions={
						<Button
							variant="flat"
							startContent={<ArrowLeft className="size-4" />}
							onPress={() => {
								router.push(
									ADMIN_PATHS.INQUIRIES_DETAIL.replace(
										"[inquiryId]",
										inquiryId,
									) as Route,
								);
							}}
							isDisabled={state.isSubmitting}
						>
							상세로
						</Button>
					}
				/>
			}
		>
			<PageSurface>
				<VStack gap={4}>
					{bootstrap && (
						<SectionSurface>
							<Section top={<PageTitleBar level={2} title="AI 폼 추천" />}>
								<AiForm
									formState={state.toFormObject()}
									fieldMeta={bootstrap.fieldMeta}
									aiSchemas={bootstrap.aiSchemas}
									ui={bootstrap.ui}
									options={bootstrapOptions}
									onFill={async (input) => {
										const result = await fillMutation.mutateAsync({
											data: {
												mode: "UPDATE",
												schemaKey: input.schemaKey,
												selectedPaths: input.selectedPaths,
												currentObject: input.currentObject,
												userPrompt: input.userPrompt,
											},
										});
										return (
											result?.data ?? {
												patches: [],
											}
										);
									}}
									applyPatch={(patches) => {
										state.applyPatch(patches);
									}}
									disabled={state.isSubmitting}
								/>
							</Section>
						</SectionSurface>
					)}
					<SectionSurface>
						<Section top={<PageTitleBar level={2} title="문의 입력" />}>
							<VStack gap={4}>
								<Input
									label="문의 제목"
									labelPlacement="outside"
									value={state.title}
									onValueChange={(value) => {
										state.title = value;
									}}
									isInvalid={Boolean(state.error)}
									errorMessage={state.error}
								/>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
									>
										{categoryOptions.map((option) => (
											<SelectItem key={option.value}>{option.label}</SelectItem>
										))}
									</Select>
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
									>
										{priorityOptions.map((option) => (
											<SelectItem key={option.value}>{option.label}</SelectItem>
										))}
									</Select>
								</div>
								<div className="flex justify-end gap-2">
									<Button
										variant="light"
										onPress={() => {
											router.push(
												ADMIN_PATHS.INQUIRIES_DETAIL.replace(
													"[inquiryId]",
													inquiryId,
												) as Route,
											);
										}}
										isDisabled={state.isSubmitting}
									>
										취소
									</Button>
									<Button
										color="primary"
										onPress={onSubmit}
										isLoading={state.isSubmitting || updateMutation.isPending}
									>
										저장
									</Button>
								</div>
							</VStack>
						</Section>
					</SectionSurface>
				</VStack>
			</PageSurface>
		</Page>
	);
}

export default observer(InquiryEditPageClient);
