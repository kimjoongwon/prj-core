"use client";

import {
	getGetTemplateQueryKey,
	useDeleteTemplate,
	useGetTemplate,
	usePreviewTemplate,
	useSendTestTemplate,
	useToggleTemplateStatus,
} from "@cocrepo/api";
import type { PreviewResult } from "@cocrepo/ui";
import {
	DateTimeCell,
	PageSurface,
	PreviewModal,
	SectionSurface,
	SendTestModal,
	TemplateActions,
	TemplateContentViewer,
	TemplateTypeBadge,
	VariableReadTable,
	VStack,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Switch,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface TemplateDetailPageClientProps {
	templateId: string;
}

/**
 * 메시지 템플릿 상세 페이지 - 클라이언트 컴포넌트
 */
function TemplateDetailPageClient({
	templateId,
}: TemplateDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	// 모달 상태
	const deleteModal = useDisclosure();
	const previewModal = useDisclosure();
	const sendTestModal = useDisclosure();

	// 템플릿 상세 조회 (prefetch로 초기 데이터 보장)
	const { data: response } = useGetTemplate(templateId);
	const template = response?.data;

	// Mutation
	const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate();
	const { mutate: toggleStatus, isPending: isToggling } =
		useToggleTemplateStatus();
	const { mutateAsync: previewTemplate } = usePreviewTemplate();
	const { mutateAsync: sendTestTemplate } = useSendTestTemplate();

	/**
	 * 목록으로 이동 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/templates" as Route);
	};

	/**
	 * 수정 페이지 이동 핸들러
	 */
	const onClickEditButton = () => {
		router.push(`/templates/${templateId}/edit` as Route);
	};

	/**
	 * 삭제 확인 핸들러
	 */
	const onClickDeleteConfirm = () => {
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

	/**
	 * 활성/비활성 토글 핸들러
	 */
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

	/**
	 * 미리보기 실행 핸들러
	 */
	const handlePreview = async (
		tplId: string,
		variables: Record<string, string>,
	): Promise<PreviewResult> => {
		const result = await previewTemplate({
			templateId: tplId,
			data: { variables },
		});
		return (result as Record<string, unknown>).data as PreviewResult;
	};

	/**
	 * 발송 테스트 실행 핸들러
	 */
	const handleSendTest = async (
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

	// 로딩 상태
	if (!response) {
		return (
			<div className="flex items-center justify-center p-8">
				<Spinner size="lg" />
			</div>
		);
	}

	// 데이터 없음
	if (!template) {
		return (
			<PageSurface title="템플릿 상세" description="템플릿을 찾을 수 없습니다.">
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">템플릿을 찾을 수 없습니다.</p>
					<Button
						variant="flat"
						startContent={<ArrowLeft className="size-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="템플릿 상세"
			description={`${template.name} 템플릿의 상세 정보입니다.`}
			actions={
				<TemplateActions
					templateId={templateId}
					isActive={template.isActive}
					onEdit={onClickEditButton}
					onDelete={deleteModal.onOpen}
					onToggle={onClickToggleButton}
					onPreview={previewModal.onOpen}
					onSendTest={sendTestModal.onOpen}
				/>
			}
		>
			<VStack gap={4}>
				{/* 기본 정보 */}
				<SectionSurface title="기본 정보">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="text-sm text-default-500">코드</label>
							<p className="mt-1 font-mono">{template.code}</p>
						</div>
						<div>
							<label className="text-sm text-default-500">이름</label>
							<p className="mt-1">{template.name}</p>
						</div>
						<div>
							<label className="text-sm text-default-500">유형</label>
							<div className="mt-1">
								<TemplateTypeBadge type={template.type} />
							</div>
						</div>
						<div>
							<label className="text-sm text-default-500">설명</label>
							<p className="mt-1">{template.description || "-"}</p>
						</div>
						<div>
							<label className="text-sm text-default-500">활성 상태</label>
							<div className="mt-1">
								<Switch
									isSelected={template.isActive}
									onValueChange={onClickToggleButton}
									isDisabled={isToggling}
									size="sm"
								>
									{template.isActive ? "활성" : "비활성"}
								</Switch>
							</div>
						</div>
						<div>
							<label className="text-sm text-default-500">생성일</label>
							<div className="mt-1">
								<DateTimeCell value={template.createdAt} />
							</div>
						</div>
						<div>
							<label className="text-sm text-default-500">수정일</label>
							<div className="mt-1">
								<DateTimeCell value={template.updatedAt || "-"} />
							</div>
						</div>
					</div>
				</SectionSurface>

				{/* 콘텐츠 */}
				<SectionSurface title="콘텐츠">
					<TemplateContentViewer
						type={template.type}
						subject={template.subject ?? null}
						content={template.content}
					/>
				</SectionSurface>

				{/* 변수 목록 */}
				<SectionSurface title="변수 목록" padding="none">
					{(template.variables ?? []).length > 0 ? (
						<VariableReadTable variables={template.variables ?? []} />
					) : (
						<div className="p-6 text-center">
							<p className="text-default-500">등록된 변수가 없습니다.</p>
						</div>
					)}
				</SectionSurface>
			</VStack>

			{/* 삭제 확인 모달 */}
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>템플릿 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{template.name}</strong> 템플릿을 삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							이 작업은 되돌릴 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* 미리보기 모달 */}
			<PreviewModal
				isOpen={previewModal.isOpen}
				onClose={previewModal.onClose}
				templateId={templateId}
				type={template.type}
				variables={template.variables ?? []}
				onPreview={handlePreview}
			/>

			{/* 발송 테스트 모달 */}
			<SendTestModal
				isOpen={sendTestModal.isOpen}
				onClose={sendTestModal.onClose}
				templateId={templateId}
				type={template.type}
				variables={template.variables ?? []}
				onSendTest={handleSendTest}
			/>
		</PageSurface>
	);
}

export default observer(TemplateDetailPageClient);
