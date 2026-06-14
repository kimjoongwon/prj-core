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
import { type PreviewResult, TemplateDetailScreen } from "@cocrepo/ui";
import { toast, useOverlayState } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

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

type TemplateDetailScreenParams = {
	templateId: string;
};

const AdminTemplatesTemplateIdRoute = observer(() => {
	const { templateId } = useParams<TemplateDetailScreenParams>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const deleteModal = useOverlayState();
	const previewModal = useOverlayState();
	const sendTestModal = useOverlayState();

	const { data: response, isLoading } = useGetTemplate(templateId);
	const template = response?.data as TemplateWithVariables | undefined;

	const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate();
	const { mutate: toggleStatus, isPending: isToggling } =
		useToggleTemplateStatus();
	const { mutateAsync: previewTemplate } = usePreviewTemplate();
	const { mutateAsync: sendTestTemplate } = useSendTestTemplate();

	const onClickBackButton = () => {
		router.push("/templates" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/templates/${templateId}/edit` as Route);
	};

	const onClickDeleteConfirmButton = () => {
		deleteTemplate(
			{ templateId },
			{
				onSuccess: () => {
					toast.success("삭제 성공", {
						description: "템플릿이 삭제되었습니다.",
					});
					deleteModal.close();
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

	const onSubmitPreviewTemplate = async (
		tplId: string,
		variables: Record<string, string>,
	): Promise<PreviewResult> => {
		const result = await previewTemplate({
			templateId: tplId,
			data: { variables },
		});
		return (result as { data: PreviewResult }).data;
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
			<TemplateDetailScreen
				templateId={templateId}
				template={
					template
						? {
								id: template.id,
								code: template.code,
								name: template.name,
								type: template.type,
								description: template.description,
								isActive: template.isActive,
								subject: template.subject,
								content: template.content,
								variables: (template.variables ?? []).map((variable) => ({
									id: variable.id,
									name: variable.name,
									description: variable.description ?? null,
									defaultValue: variable.defaultValue ?? null,
									isRequired: variable.isRequired ?? false,
								})),
								createdAt: template.createdAt,
								updatedAt: template.updatedAt,
							}
						: undefined
				}
				isLoading={isLoading}
				isNotFound={!isLoading && !template}
				isDeleteModalOpen={deleteModal.isOpen}
				isPreviewModalOpen={previewModal.isOpen}
				isSendTestModalOpen={sendTestModal.isOpen}
				isDeletePending={isDeleting}
				isTogglePending={isToggling}
				onClickBackButton={onClickBackButton}
				onClickEditButton={onClickEditButton}
				onClickDeleteButton={deleteModal.open}
				onClickDeleteConfirmButton={onClickDeleteConfirmButton}
				onClickDeleteCancelButton={deleteModal.close}
				onClickToggleButton={onClickToggleButton}
				onClickPreviewButton={previewModal.open}
				onClickPreviewCloseButton={previewModal.close}
				onClickSendTestButton={sendTestModal.open}
				onClickSendTestCloseButton={sendTestModal.close}
				onSubmitPreviewTemplate={onSubmitPreviewTemplate}
				onSubmitSendTestTemplate={onSubmitSendTestTemplate}
			/>
		</>
	);
});

export default AdminTemplatesTemplateIdRoute;
