"use client";

import {
	type CreateTemplateVariableItemDto,
	useCreateTemplate,
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
import { useRouter } from "next/navigation";

const AdminTemplatesNewRoute = observer(() => {
	const router = useRouter();
	const state = useLocalObservable<TemplateFormState>(() => ({
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
	}));

	const { mutate: createTemplate, isPending } = useCreateTemplate({
		mutation: {
			onSuccess: (response) => {
				toast.success("템플릿 등록 성공", {
					description: "템플릿이 성공적으로 등록되었습니다.",
				});
				const templateId = response?.data?.id;
				if (templateId) {
					router.push(`/templates/${templateId}` as Route);
				}
			},
			onError: (error) => {
				toast.danger("템플릿 등록 실패", {
					description: error.message || "템플릿 등록 중 오류가 발생했습니다.",
				});
			},
		},
	});

	const onSubmit = () => {
		if (!validateCreateTemplate(state)) {
			return;
		}
		const { formData } = state;

		createTemplate({
			data: {
				type: formData.type,
				code: formData.code.trim(),
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
			title="Template 등록"
			description="새로운 메시지 Template을 등록합니다."
			state={state}
			actions={
				<div className="flex gap-2">
					<Button
						variant="tertiary"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/templates" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						등록
					</Button>
				</div>
			}
		/>
	);
});

function validateCreateTemplate(state: TemplateFormState) {
	const errors: Record<string, string> = {};
	const { formData } = state;

	if (!formData.code.trim()) {
		errors.code = "코드를 입력해주세요.";
	} else if (!/^[A-Z][A-Z0-9_]*$/.test(formData.code)) {
		errors.code = "영문 대문자와 언더스코어(_)만 사용 가능합니다.";
	}

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

export default AdminTemplatesNewRoute;
