"use client";

import {
	type CreateTemplateVariableItemDto,
	type TemplateDto,
	useGetTemplate,
	useUpdateTemplate,
} from "@cocrepo/api/core/templates";
import {
	TemplateEditPage,
	type TemplateFormData,
	type VariableEditItem,
} from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui/heroui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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

type TemplateEditPageParams = {
	templateId: string;
};

const AdminTemplatesTemplateIdEditRoute = observer(() => {
	const { templateId } = useParams<TemplateEditPageParams>();
	const router = useRouter();
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

	const { data: response, isLoading } = useGetTemplate(templateId);
	const template = response?.data as TemplateWithVariables | undefined;

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
			state.variables = (template.variables ?? []).map((variable) => ({
				id: variable.id,
				name: variable.name,
				description: variable.description || "",
				defaultValue: variable.defaultValue || "",
				isRequired: variable.isRequired ?? false,
			}));
			state.isInitialized = true;
		}
	}, [state, template]);

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

	const onClickCancelButton = () => {
		router.push(`/templates/${templateId}` as Route);
	};

	const onFormDataChange = (data: Partial<TemplateFormData>) => {
		Object.assign(state.formData, data);
		for (const key of Object.keys(data)) {
			delete state.errors[key];
		}
	};

	const onVariablesChange = (variables: VariableEditItem[]) => {
		state.variables = variables;
	};

	const onSubmitForm = () => {
		const errors: Record<string, string> = {};
		const { formData } = state;

		if (!formData.name.trim()) {
			errors.name = "이름을 입력해주세요.";
		}
		if (!formData.content.trim()) {
			errors.content = "본문을 입력해주세요.";
		}
		if (
			(formData.type === "EMAIL" || formData.type === "PUSH") &&
			!formData.subject.trim()
		) {
			errors.subject = "제목을 입력해주세요.";
		}
		if (formData.type === "PUSH") {
			if (formData.subject.length > 50) {
				errors.subject = "제목은 50자 이하로 입력해주세요.";
			}
			if (formData.content.length > 200) {
				errors.content = "본문은 200자 이하로 입력해주세요.";
			}
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateTemplate({
			templateId,
			data: {
				name: formData.name.trim(),
				description: formData.description.trim() || undefined,
				subject: formData.subject.trim() || undefined,
				content: formData.content,
				variables: state.variables.map((variable) => ({
					name: variable.name,
					description: variable.description || undefined,
					defaultValue: variable.defaultValue || undefined,
					isRequired: variable.isRequired,
				})) as unknown as CreateTemplateVariableItemDto,
			},
		});
	};

	return (
		<TemplateEditPage
			templateName={template?.name}
			formData={state.formData}
			variables={state.variables}
			errors={state.errors}
			isLoading={isLoading}
			isNotFound={!isLoading && !template}
			isSubmitting={isPending}
			onFormDataChange={onFormDataChange}
			onVariablesChange={onVariablesChange}
			onSubmitForm={onSubmitForm}
			onClickCancelButton={onClickCancelButton}
		/>
	);
});

export default AdminTemplatesTemplateIdEditRoute;
