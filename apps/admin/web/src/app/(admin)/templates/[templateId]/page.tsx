"use client";

import {
	getGetTemplateQueryKey,
	type TemplateDto,
	useDeleteTemplate,
	useGetTemplate,
	usePreviewTemplate,
	useSendTestTemplate,
	useToggleTemplateStatus,
} from "@cocrepo/api/core/templates";
import {
	Button,
	TemplateActions,
	TemplateEditScreen,
	type TemplateFormState,
	TemplatePreviewModal,
	type TemplatePreviewResult,
	TemplateSendTestModal,
} from "@cocrepo/ui";
import { useOverlayState, toast } from "@heroui/react";
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
	const queryClient = useQueryClient();
	const previewModal = useOverlayState();
	const sendTestModal = useOverlayState();
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
	const { mutateAsync: previewTemplate } = usePreviewTemplate();
	const { mutateAsync: sendTestTemplate } = useSendTestTemplate();

	const onClickDeleteButton = () => {
		deleteTemplate(
			{ templateId },
			{
				onSuccess: () => {
					toast.success("삭제 성공", { description: "템플릿이 삭제되었습니다." });
					router.push("/templates" as Route);
				},
				onError: (error) => {
					toast.danger("삭제 실패", { description: error.message || "삭제 중 오류가 발생했습니다." });
				},
			},
		);
	};

	const onClickToggleButton = () => {
		toggleStatus(
			{ templateId },
			{
				onSuccess: () => {
					toast.success("상태 변경 성공", { description: "템플릿 상태가 변경되었습니다." });
					queryClient.invalidateQueries({
						queryKey: getGetTemplateQueryKey(templateId),
					});
				},
				onError: (error) => {
					toast.danger("상태 변경 실패", { description: error.message || "상태 변경 중 오류가 발생했습니다." });
				},
			},
		);
	};

	const onSubmitPreviewTemplate = async (
		tplId: string,
		variables: Record<string, string>,
	): Promise<TemplatePreviewResult> => {
		const result = await previewTemplate({
			templateId: tplId,
			data: { variables },
		});
		return (result as { data: TemplatePreviewResult }).data;
	};

	const onSubmitSendTestTemplate = async (
		tplId: string,
		recipient: string,
		variables: Record<string, string>,
	) => {
		const result = await sendTestTemplate({
			templateId: tplId,
			data: { recipient, variables },
		});
		return (result as Record<string, unknown>).data as {
			success: boolean;
			sentAt: string;
			errorMessage: string | null;
		};
	};

	return (
		<>
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
						variant="flat"
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
								variant="light"
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
								onPreview={previewModal.open}
								onSendTest={sendTestModal.open}
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
										variant="flat"
										color={template.isActive ? "success" : "default"}
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
			{template ? (
				<>
					<TemplatePreviewModal
						isOpen={previewModal.isOpen}
						onClose={previewModal.close}
						templateId={templateId}
						type={template.type}
						variables={variablesForModal}
						onPreview={onSubmitPreviewTemplate}
					/>
					<TemplateSendTestModal
						isOpen={sendTestModal.isOpen}
						onClose={sendTestModal.close}
						templateId={templateId}
						type={template.type}
						variables={variablesForModal}
						onSendTest={onSubmitSendTestTemplate}
					/>
				</>
			) : null}
		</>
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
