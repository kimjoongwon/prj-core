"use client";

import {
	getGetTemplateQueryKey,
	type TemplateDto,
	useDeleteTemplate,
	useGetTemplate,
	useToggleTemplateStatus,
} from "@cocrepo/api/core/templates";
import { useApp } from "@cocrepo/store";
import {
	Button,
	TemplateActions,
	TemplateEditScreen,
	type TemplateFormState,
	TemplatePreviewModal,
	TemplatePreviewModalState,
	TemplateSendTestModal,
	TemplateSendTestModalState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";

type TemplateVariableLike = {
	id: string;
	name: string;
	description?: string | null;
	defaultValue?: string | null;
	isRequired?: boolean;
};

type TemplateWithVariables = TemplateDto & {
	variables?: TemplateVariableLike[];
};

type TemplateDetailRouteParams = {
	templateId: string;
};

const AdminTemplatesTemplateIdRoute = observer(() => {
	const { templateId } = useParams<TemplateDetailRouteParams>();
	const router = useRouter();
	const app = useApp();
	const queryClient = useQueryClient();
	const { data: response, isLoading } = useGetTemplate(templateId);
	const template = response?.data as TemplateWithVariables | undefined;
	const state = template ? mapTemplateFormState(template) : undefined;
	const variablesForModal = state
		? state.variables.map((variable) => ({
				id: variable.id ?? variable.name,
				name: variable.name,
				description: variable.description || null,
				defaultValue: variable.defaultValue || null,
				isRequired: variable.isRequired,
			}))
		: [];

	const { mutate: deleteTemplate } = useDeleteTemplate();
	const { mutate: toggleStatus, isPending: isToggling } =
		useToggleTemplateStatus();

	const onClickDeleteButton = () => {
		deleteTemplate(
			{ templateId },
			{
				onSuccess: () => {
					toast.success("삭제 성공", {
						description: "템플릿이 삭제되었습니다.",
					});
					router.push("/templates" as Route);
				},
				onError: (error) => {
					toast.danger("삭제 실패", {
						description: error.message || "삭제 중 오류가 발생했습니다.",
					});
				},
			},
		);
	};

	const onClickToggleButton = () => {
		toggleStatus(
			{ templateId },
			{
				onSuccess: () => {
					toast.success("상태 변경 성공", {
						description: "템플릿 상태가 변경되었습니다.",
					});
					queryClient.invalidateQueries({
						queryKey: getGetTemplateQueryKey(templateId),
					});
				},
				onError: (error) => {
					toast.danger("상태 변경 실패", {
						description: error.message || "상태 변경 중 오류가 발생했습니다.",
					});
				},
			},
		);
	};

	const openPreviewModal = () => {
		if (!template) {
			return;
		}

		app.modal.open({
			title: "템플릿 미리보기",
			state: new TemplatePreviewModalState({
				templateId,
				variables: variablesForModal,
			}),
			content: { kind: "component", component: TemplatePreviewModal },
		});
	};

	const openSendTestModal = () => {
		if (!template) {
			return;
		}

		app.modal.open({
			title: "테스트 발송",
			state: new TemplateSendTestModalState({
				templateId,
				type: template.type,
				variables: variablesForModal,
			}),
			content: { kind: "component", component: TemplateSendTestModal },
		});
	};

	return (
		<TemplateEditScreen
			title="Template 상세"
			description={
				template
					? `${template.name} Template의 상세 정보입니다.`
					: "Template을 찾을 수 없습니다."
			}
			state={state}
			readOnly
			isLoading={isLoading}
			notFound={!isLoading && !template}
			notFoundAction={
				<Button
					variant="tertiary"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={() => {
						router.push("/templates" as Route);
					}}
				>
					목록으로
				</Button>
			}
			actions={
				template ? (
					<div className="flex flex-wrap gap-2">
						<Button
							variant="ghost"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={() => {
								router.push("/templates" as Route);
							}}
						>
							목록으로
						</Button>
						<TemplateActions
							templateId={templateId}
							isActive={template.isActive}
							onEdit={() => {
								router.push(`/templates/${templateId}/edit` as Route);
							}}
							onDelete={onClickDeleteButton}
							onToggle={onClickToggleButton}
							onPreview={openPreviewModal}
							onSendTest={openSendTestModal}
						/>
					</div>
				) : null
			}
		>
			{template ? (
				<SectionLike title="상태 정보">
					<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="rounded-lg border border-border bg-background/60 p-3">
							<dt className="text-xs text-muted">활성 상태</dt>
							<dd className="mt-2">
								<Button
									size="sm"
									variant="tertiary"
									isDisabled={isToggling}
									onPress={onClickToggleButton}
								>
									{template.isActive ? "활성" : "비활성"}
								</Button>
							</dd>
						</div>
						<Info
							label="생성일"
							value={new Date(template.createdAt).toLocaleString("ko-KR")}
						/>
						<Info
							label="수정일"
							value={
								template.updatedAt
									? new Date(template.updatedAt).toLocaleString("ko-KR")
									: "-"
							}
						/>
					</dl>
				</SectionLike>
			) : null}
		</TemplateEditScreen>
	);
});

function mapTemplateFormState(
	template: TemplateWithVariables,
): TemplateFormState {
	return {
		formData: {
			type: template.type,
			code: template.code,
			name: template.name,
			description: template.description || "",
			subject: template.subject || "",
			content: template.content,
		},
		variables: (template.variables ?? []).map((variable) => ({
			id: variable.id,
			name: variable.name,
			description: variable.description || "",
			defaultValue: variable.defaultValue || "",
			isRequired: variable.isRequired ?? false,
		})),
		errors: {},
	};
}

function SectionLike({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section>
			<h3 className="mb-4 text-lg font-semibold">{title}</h3>
			{children}
		</section>
	);
}

function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-background/60 p-3">
			<dt className="text-xs text-muted">{label}</dt>
			<dd className="mt-1 break-all text-sm font-medium">{value}</dd>
		</div>
	);
}

export default AdminTemplatesTemplateIdRoute;
