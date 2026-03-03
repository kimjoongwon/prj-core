"use client";

import {
	type CreateTemplateVariableItemDto,
	useCreateTemplate,
} from "@cocrepo/api";
import {
	Page,
	PageHeader,
	TemplateForm,
	type TemplateFormData,
	type VariableEditItem,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 템플릿 등록 페이지 - 클라이언트 컴포넌트
 */
function TemplateNewPageClient() {
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
	}));

	// 등록 Mutation
	const { mutate: createTemplate, isPending } = useCreateTemplate({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "템플릿 등록 성공",
					description: "템플릿이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const templateId = response?.data?.id;
				if (templateId) {
					router.push(`/templates/${templateId}` as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "템플릿 등록 실패",
					description: error.message || "템플릿 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/**
	 * 취소 버튼 클릭 핸들러 - 목록으로 이동
	 */
	const onClickCancelButton = () => {
		router.push("/templates" as Route);
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
	 * 등록 폼 제출 핸들러 - 유효성 검증 후 API 호출
	 */
	const onSubmitForm = () => {
		const errors: Record<string, string> = {};
		const { formData } = state;

		// 코드 검증
		if (!formData.code.trim()) {
			errors.code = "코드를 입력해주세요.";
		} else if (!/^[A-Z][A-Z0-9_]*$/.test(formData.code)) {
			errors.code = "영문 대문자와 언더스코어(_)만 사용 가능합니다.";
		}

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

		// API 호출
		createTemplate({
			data: {
				type: formData.type,
				code: formData.code.trim(),
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

	return (
		<Page
			top={
				<PageHeader
					title="템플릿 등록"
					description="새로운 메시지 템플릿을 등록합니다."
				/>
			}
		>
			<TemplateForm
				mode="create"
				formData={state.formData}
				variables={state.variables}
				onFormDataChange={onFormDataChange}
				onVariablesChange={onVariablesChange}
				onSubmit={onSubmitForm}
				onCancel={onClickCancelButton}
				isSubmitting={isPending}
				errors={state.errors}
			/>
		</Page>
	);
}

export default observer(TemplateNewPageClient);
