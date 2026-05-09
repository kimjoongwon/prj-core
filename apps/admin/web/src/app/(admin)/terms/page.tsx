"use client";

import {
	type CreateServiceDocumentDto,
	type GetServiceDocumentsParams,
	getGetServiceDocumentsQueryKey,
	type ServiceDocumentDto,
	type UpdateServiceDocumentDto,
	useArchiveServiceDocument,
	useCreateServiceDocument,
	useDeleteServiceDocument,
	useGetServiceDocuments,
	usePublishServiceDocument,
	useUpdateServiceDocument,
} from "@cocrepo/api/core/service-documents";
import {
	type ServiceDocumentFormDraft,
	type ServiceDocumentFormMode,
	ServiceDocumentListPage,
	type ServiceDocumentListPageQueryStates,
} from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui/heroui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";

const EMPTY_DRAFT: ServiceDocumentFormDraft = {
	kind: "TERMS_OF_SERVICE" as ServiceDocumentFormDraft["kind"],
	platform: "ALL" as ServiceDocumentFormDraft["platform"],
	locale: "ko-KR",
	title: "",
	summary: "",
	content: "",
	format: "MARKDOWN" as ServiceDocumentFormDraft["format"],
	version: "",
	isRequired: true,
	displayOrder: 0,
	effectiveAt: "",
};

export default observer(function TermsPageRoute() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		kind: parseAsString.withDefault(""),
		platform: parseAsString.withDefault(""),
		status: parseAsString.withDefault(""),
		locale: parseAsString.withDefault("ko-KR"),
	});
	const [formMode, setFormMode] = useState<ServiceDocumentFormMode>("create");
	const [draft, setDraft] = useState<ServiceDocumentFormDraft>(EMPTY_DRAFT);
	const [editingDocumentId, setEditingDocumentId] = useState<string | null>(
		null,
	);
	const params = getServiceDocumentsParams(queryStates);
	const { data: response, isLoading } = useGetServiceDocuments(params);
	const createMutation = useCreateServiceDocument();
	const updateMutation = useUpdateServiceDocument();
	const publishMutation = usePublishServiceDocument();
	const archiveMutation = useArchiveServiceDocument();
	const deleteMutation = useDeleteServiceDocument();
	const isSubmitting =
		createMutation.isPending ||
		updateMutation.isPending ||
		publishMutation.isPending ||
		archiveMutation.isPending ||
		deleteMutation.isPending;

	const onChangeSearchInput = (value: string) => {
		setQueryStates({ search: value, skip: 0 });
	};

	const onChangeKindFilter = (value: string) => {
		setQueryStates({ kind: value, skip: 0 });
	};

	const onChangePlatformFilter = (value: string) => {
		setQueryStates({ platform: value, skip: 0 });
	};

	const onChangeStatusFilter = (value: string) => {
		setQueryStates({ status: value, skip: 0 });
	};

	const onChangeLocaleFilter = (value: string) => {
		setQueryStates({ locale: value, skip: 0 });
	};

	const onChangeDraftField = <TField extends keyof ServiceDocumentFormDraft>(
		field: TField,
		value: ServiceDocumentFormDraft[TField],
	) => {
		setDraft((current) => ({
			...current,
			[field]: value,
		}));
	};

	const onClickNewButton = () => {
		setFormMode("create");
		setEditingDocumentId(null);
		setDraft(EMPTY_DRAFT);
	};

	const onClickCancelFormButton = () => {
		setFormMode("create");
		setEditingDocumentId(null);
		setDraft(EMPTY_DRAFT);
	};

	const onClickEditButton = (serviceDocumentId: string) => {
		const document = response?.data?.find(
			(item: ServiceDocumentDto) => item.id === serviceDocumentId,
		);
		if (!document) return;
		setFormMode("edit");
		setEditingDocumentId(serviceDocumentId);
		setDraft(toDraft(document));
	};

	const onClickSubmitButton = async () => {
		if (!draft.title.trim() || !draft.content.trim() || !draft.version.trim()) {
			addToast({
				title: "입력 확인",
				description: "제목, 본문, 버전을 입력해 주세요.",
				color: "warning",
			});
			return;
		}

		try {
			if (formMode === "edit" && editingDocumentId) {
				await updateMutation.mutateAsync({
					serviceDocumentId: editingDocumentId,
					data: toUpdatePayload(draft),
				});
				addToast({
					title: "문서 수정 완료",
					description: "초안 문서가 수정되었습니다.",
					color: "success",
				});
			} else {
				await createMutation.mutateAsync({ data: toCreatePayload(draft) });
				addToast({
					title: "문서 등록 완료",
					description: "새 서비스 문서 초안이 생성되었습니다.",
					color: "success",
				});
			}

			await invalidateServiceDocuments(queryClient);
			onClickCancelFormButton();
		} catch (error) {
			addToast({
				title: "저장 실패",
				description: "서비스 문서 저장 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	};

	const onClickPublishButton = async (serviceDocumentId: string) => {
		try {
			await publishMutation.mutateAsync({ serviceDocumentId });
			await invalidateServiceDocuments(queryClient);
			addToast({
				title: "게시 완료",
				description: "선택한 서비스 문서가 게시되었습니다.",
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "게시 실패",
				description: "서비스 문서 게시 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	};

	const onClickArchiveButton = async (serviceDocumentId: string) => {
		try {
			await archiveMutation.mutateAsync({ serviceDocumentId });
			await invalidateServiceDocuments(queryClient);
			addToast({
				title: "보관 완료",
				description: "선택한 서비스 문서가 보관되었습니다.",
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "보관 실패",
				description: "서비스 문서 보관 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	};

	const onClickDeleteButton = async (serviceDocumentId: string) => {
		if (!window.confirm("서비스 문서를 삭제하시겠습니까?")) {
			return;
		}

		try {
			await deleteMutation.mutateAsync({ serviceDocumentId });
			await invalidateServiceDocuments(queryClient);
			addToast({
				title: "삭제 완료",
				description: "선택한 서비스 문서가 삭제되었습니다.",
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "삭제 실패",
				description: "서비스 문서 삭제 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	};

	return (
		<ServiceDocumentListPage
			documents={response?.data}
			totalCount={response?.meta?.total ?? 0}
			isLoading={isLoading}
			isSubmitting={isSubmitting}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			formMode={formMode}
			draft={draft}
			editingDocumentId={editingDocumentId}
			onChangeSearchInput={onChangeSearchInput}
			onChangeKindFilter={onChangeKindFilter}
			onChangePlatformFilter={onChangePlatformFilter}
			onChangeStatusFilter={onChangeStatusFilter}
			onChangeLocaleFilter={onChangeLocaleFilter}
			onChangeDraftField={onChangeDraftField}
			onClickNewButton={onClickNewButton}
			onClickCancelFormButton={onClickCancelFormButton}
			onClickSubmitButton={onClickSubmitButton}
			onClickEditButton={onClickEditButton}
			onClickPublishButton={onClickPublishButton}
			onClickArchiveButton={onClickArchiveButton}
			onClickDeleteButton={onClickDeleteButton}
		/>
	);
});

function getServiceDocumentsParams(
	queryStates: ServiceDocumentListPageQueryStates,
): GetServiceDocumentsParams {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		kind: queryStates.kind
			? (queryStates.kind as GetServiceDocumentsParams["kind"])
			: undefined,
		platform: queryStates.platform
			? (queryStates.platform as GetServiceDocumentsParams["platform"])
			: undefined,
		status: queryStates.status
			? (queryStates.status as GetServiceDocumentsParams["status"])
			: undefined,
		locale: queryStates.locale || undefined,
	};
}

function toDraft(document: ServiceDocumentDto): ServiceDocumentFormDraft {
	return {
		kind: document.kind,
		platform: document.platform,
		locale: document.locale,
		title: document.title,
		summary: document.summary ?? "",
		content: document.content,
		format: document.format,
		version: document.version,
		isRequired: document.isRequired,
		displayOrder: document.displayOrder,
		effectiveAt: toDateTimeLocalValue(document.effectiveAt),
	};
}

function toCreatePayload(
	draft: ServiceDocumentFormDraft,
): CreateServiceDocumentDto {
	return {
		kind: draft.kind as CreateServiceDocumentDto["kind"],
		platform: draft.platform as CreateServiceDocumentDto["platform"],
		locale: draft.locale,
		title: draft.title,
		summary: draft.summary || undefined,
		content: draft.content,
		format: draft.format as CreateServiceDocumentDto["format"],
		version: draft.version,
		isRequired: draft.isRequired,
		displayOrder: draft.displayOrder,
		effectiveAt: draft.effectiveAt
			? new Date(draft.effectiveAt).toISOString()
			: undefined,
	};
}

function toUpdatePayload(
	draft: ServiceDocumentFormDraft,
): UpdateServiceDocumentDto {
	return {
		title: draft.title,
		summary: draft.summary || undefined,
		content: draft.content,
		format: draft.format as UpdateServiceDocumentDto["format"],
		isRequired: draft.isRequired,
		displayOrder: draft.displayOrder,
		effectiveAt: draft.effectiveAt
			? new Date(draft.effectiveAt).toISOString()
			: undefined,
	};
}

async function invalidateServiceDocuments(
	queryClient: ReturnType<typeof useQueryClient>,
) {
	await queryClient.invalidateQueries({
		queryKey: getGetServiceDocumentsQueryKey(),
	});
}

function toDateTimeLocalValue(value?: string | null): string {
	if (!value) return "";
	return value.slice(0, 16);
}
