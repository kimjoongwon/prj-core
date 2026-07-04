"use client";

import {
	type CreateTemplateVariableItemDto,
	type TemplateDto,
	useGetTemplate,
	useUpdateTemplate,
} from "@cocrepo/api/core/templates";
import {
	Button,
	TemplateEditScreen,
	type TemplateFormState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
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

type TemplateEditScreenParams = {
	templateId: string;
};

type TemplateRouteFormState = TemplateFormState & {
	isInitialized: boolean;
};

const AdminTemplatesTemplateIdEditRoute = observer(() => {
	const { templateId } = useParams<TemplateEditScreenParams>();
	const router = useRouter();
	const state = useLocalObservable<TemplateRouteFormState>(() => ({
		formData: {
			type: "EMAIL",
			code: "",
			name: "",
			description: "",
			subject: "",
			content: "",
		},
		variables: [],
		errors: {},
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetTemplate(templateId);
	const template = response?.data as TemplateWithVariables | undefined;

	useEffect(() => {
		if (!template || state.isInitialized) {
			return;
		}
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
	}, [state, template]);

	const { mutate: updateTemplate, isPending } = useUpdateTemplate({
		mutation: {
			onSuccess: () => {
				toast.success("템플릿 수정 성공", {
					description: "템플릿이 성공적으로 수정되었습니다.",
				});
				router.push(`/templates/${templateId}` as Route);
			},
			onError: (error) => {
				toast.danger("템플릿 수정 실패", {
					description: error.message || "템플릿 수정 중 오류가 발생했습니다.",
				});
			},
		},
	});

	const onSubmit = () => {
		if (!validateUpdateTemplate(state)) {
			return;
		}
		const { formData } = state;

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
		<TemplateEditScreen
			title="Template 수정"
			description={
				template
					? `${template.name} Template을 수정합니다.`
					: "Template을 찾을 수 없습니다."
			}
			state={template ? state : undefined}
			isLoading={isLoading}
			notFound={!isLoading && !template}
			notFoundAction={
				<Button
					variant="flat"
					onPress={() => {
						router.push("/templates" as Route);
					}}
				>
					목록으로
				</Button>
			}
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/templates/${templateId}` as Route);
						}}
					>
						상세로 돌아가기
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						저장
					</Button>
				</div>
			}
		/>
	);
});

function validateUpdateTemplate(state: TemplateFormState) {
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

	state.errors = errors;
	return Object.keys(errors).length === 0;
}

export default AdminTemplatesTemplateIdEditRoute;
