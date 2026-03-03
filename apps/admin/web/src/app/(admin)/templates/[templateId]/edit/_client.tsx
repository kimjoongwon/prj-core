"use client";

import { type CreateTemplateVariableItemDto, type TemplateDto, useGetTemplate, useUpdateTemplate, } from "@cocrepo/api";
import {
	Page, PageTitleBar, Section, TemplateForm, type TemplateFormData, type VariableEditItem } from "@cocrepo/ui";
import { addToast, Button, Spinner } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TemplateEditPageClientProps {
	templateId: string;
}

interface TemplateVariableLike {
	id: string;
	name: string;
	description?: string | null;
	defaultValue?: string | null;
	isRequired?: boolean;
}

type TemplateWithVariables = TemplateDto & {
	variables?: TemplateVariableLike[];
};

/**
 * 템플릿 수정 페이지 - 클라이언트 컴포넌트
 */
function TemplateEditPageClient({ templateId }: TemplateEditPageClientProps) {
	const router = useRouter();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		formData: {
			type: "EMAIL" as "EMAIL" | "SMS" | "PUSH",
			code: "",
			name: "",
			description: "",
			subject: "",
			content: "",
		} as TemplateFormData,
		variables: [] as VariableEditItem[],
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetTemplate(templateId);
	const template = response?.data as TemplateWithVariables | undefined;

	// 초기 데이터 로딩
	useEffect(() => {
		if (template && !state.isInitialized) {
			state.formData = {
				type: template.type,
				code: template.code,
				name: template.name,
				description: template.description || "",
				subject: template.subject || "",
				content: template.content,
			};
			state.variables = (template.variables ?? []).map((v) => ({
				id: v.id,
				name: v.name,
				description: v.description || "",
				defaultValue: v.defaultValue || "",
				isRequired: v.isRequired ?? false,
			}));
			state.isInitialized = true;
		}
	}, [template, state]);

	// 수정 Mutation
	const { mutate: updateTemplate, isPending } = useUpdateTemplate({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "템플릿 수정 성공",
					description: "템플릿이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/templates/${templateId}` as Route);
			},
			onError: (error) => {
				addToast({
					title: "템플릿 수정 실패",
					description: error.message || "템플릿 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/**
	 * 취소 버튼 클릭 핸들러 - 상세 페이지로 이동
	 */
	const onClickCancelButton = () => {
		router.push(`/templates/${templateId}` as Route);
	};

	/**
	 * 폼 데이터 변경 핸들러
	 */
	const onFormDataChange = (data: Partial<TemplateFormData>) => {
		Object.assign(state.formData, data);
		// 변경된 필드의 에러 클리어
		for (const key of Object.keys(data)) {
			delete state.errors[key];
		}
	};

	/**
	 * 변수 목록 변경 핸들러
	 */
	const onVariablesChange = (variables: VariableEditItem[]) => {
		state.variables = variables;
	};

	/**
	 * 수정 폼 제출 핸들러 - 유효성 검증 후 API 호출
	 */
	const onSubmitForm = () => {
		const errors: Record<string, string> = {};
		const { formData } = state;

		// 이름 검증
		if (!formData.name.trim()) {
			errors.name = "이름을 입력해주세요.";
		}

		// 본문 검증
		if (!formData.content.trim()) {
			errors.content = "본문을 입력해주세요.";
		}

		// 제목 검증 (이메일, 푸시)
		if (
			(formData.type === "EMAIL" || formData.type === "PUSH") &&
			!formData.subject.trim()
		) {
			errors.subject = "제목을 입력해주세요.";
		}

		// 푸시 길이 제한 검증
		if (formData.type === "PUSH") {
			if (formData.subject.length > 50) {
				errors.subject = "제목은 50자 이하로 입력해주세요.";
			}
			if (formData.content.length > 200) {
				errors.content = "본문은 200자 이하로 입력해주세요.";
			}
		}

		// 에러가 있으면 상태에 반영하고 중단
		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		// 수정 시에는 code, type은 보내지 않음 (읽기전용)
		updateTemplate({
			templateId,
			data: {
				name: formData.name.trim(),
				description: formData.description.trim() || undefined,
				subject: formData.subject.trim() || undefined,
				content: formData.content,
				variables: state.variables.map((v) => ({
					name: v.name,
					description: v.description || undefined,
					defaultValue: v.defaultValue || undefined,
					isRequired: v.isRequired,
				})) as unknown as CreateTemplateVariableItemDto,
			},
		});
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<Page
				top={
					<PageTitleBar title="템플릿 수정" description="로딩 중..." />
				}
			>
				<Section>
					<div className="flex items-center justify-center gap-2 p-8">
						<Spinner size="sm" />
						<span className="text-default-500">로딩 중...</span>
					</div>
				</Section>
			</Page>
		);
	}

	// 데이터 없음
	if (!template) {
		return (
			<Page
				top={
					<PageTitleBar
						title="템플릿 수정"
						description="템플릿을 찾을 수 없습니다."
					/>
				}
			>
				<Section>
					<div className="flex flex-col items-center justify-center gap-4 p-8">
						<p className="text-default-500">템플릿을 찾을 수 없습니다.</p>
						<Button variant="flat" onPress={onClickCancelButton}>
							목록으로
						</Button>
					</div>
				</Section>
			</Page>
		);
	}

	return (
		<Page
			top={
				<PageTitleBar
					title="템플릿 수정"
					description={`${template.name} 템플릿을 수정합니다.`}
				/>
			}
		>
			<Section>
				<TemplateForm
					mode="edit"
					formData={state.formData}
					variables={state.variables}
					onFormDataChange={onFormDataChange}
					onVariablesChange={onVariablesChange}
					onSubmit={onSubmitForm}
					onCancel={onClickCancelButton}
					isSubmitting={isPending}
					errors={state.errors}
				/>
			</Section>
		</Page>
	);
}

export default observer(TemplateEditPageClient);
