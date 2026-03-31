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
	AdminTemplatesTemplateIdPage,
	type PreviewResult,
} from "@cocrepo/ui";
import { addToast, useDisclosure } from "@heroui/react";
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

type TemplateDetailPageParams = {
	templateId: string;
};

const AdminTemplatesTemplateIdRoute = observer(() => {
	const { templateId } = useParams<TemplateDetailPageParams>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const deleteModal = useDisclosure();
	const previewModal = useDisclosure();
	const sendTestModal = useDisclosure();

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
					addToast({
						title: "삭제 성공",
						description: "템플릿이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					router.push("/templates" as Route);
				},
				onError: (error) => {
					addToast({
						title: "삭제 실패",
						description: error.message || "삭제 중 오류가 발생했습니다.",
						color: "danger",
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
					addToast({
						title: "상태 변경 성공",
						description: "템플릿 상태가 변경되었습니다.",
						color: "success",
					});
					queryClient.invalidateQueries({
						queryKey: getGetTemplateQueryKey(templateId),
					});
				},
				onError: (error) => {
					addToast({
						title: "상태 변경 실패",
						description: error.message || "상태 변경 중 오류가 발생했습니다.",
						color: "danger",
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
		<AdminTemplatesTemplateIdPage
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
			onClickDeleteButton={deleteModal.onOpen}
			onClickDeleteConfirmButton={onClickDeleteConfirmButton}
			onClickDeleteCancelButton={deleteModal.onClose}
			onClickToggleButton={onClickToggleButton}
			onClickPreviewButton={previewModal.onOpen}
			onClickPreviewCloseButton={previewModal.onClose}
			onClickSendTestButton={sendTestModal.onOpen}
			onClickSendTestCloseButton={sendTestModal.onClose}
			onSubmitPreviewTemplate={onSubmitPreviewTemplate}
			onSubmitSendTestTemplate={onSubmitSendTestTemplate}
		/>
	);
});

export default AdminTemplatesTemplateIdRoute;
