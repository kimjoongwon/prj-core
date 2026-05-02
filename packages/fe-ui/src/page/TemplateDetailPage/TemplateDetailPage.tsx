"use client";

import type { PreviewResult, TemplateVariable } from "@cocrepo/ui";
import {
	DateTimeCell,
	DetailPage,
	DetailPageSurface,
	PageTitleBar,
	PreviewModal,
	DetailSection,
	DetailSectionCard,
	SendTestModal,
	TemplateActions,
	TemplateContentViewer,
	TemplateTypeBadge,
	VariableReadTable,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Switch,
} from "@cocrepo/ui/heroui";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface TemplateDetailPageTemplate {
	id: string;
	code: string;
	name: string;
	type: "EMAIL" | "SMS" | "PUSH";
	description?: string | null;
	isActive: boolean;
	subject?: string | null;
	content: string;
	variables: TemplateVariable[];
	createdAt: string;
	updatedAt?: string | null;
}

export interface TemplateDetailPageSendTestResult {
	success: boolean;
	sentAt: string;
	errorMessage: string | null;
}

export interface TemplateDetailPageProps {
	templateId: string;
	template?: TemplateDetailPageTemplate;
	isLoading: boolean;
	isNotFound: boolean;
	isDeleteModalOpen: boolean;
	isPreviewModalOpen: boolean;
	isSendTestModalOpen: boolean;
	isDeletePending: boolean;
	isTogglePending: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickDeleteButton: () => void;
	onClickDeleteConfirmButton: () => void;
	onClickDeleteCancelButton: () => void;
	onClickToggleButton: () => void;
	onClickPreviewButton: () => void;
	onClickPreviewCloseButton: () => void;
	onClickSendTestButton: () => void;
	onClickSendTestCloseButton: () => void;
	onSubmitPreviewTemplate: (
		templateId: string,
		variables: Record<string, string>,
	) => Promise<PreviewResult>;
	onSubmitSendTestTemplate: (
		templateId: string,
		recipient: string,
		variables: Record<string, string>,
	) => Promise<TemplateDetailPageSendTestResult>;
}

export const TemplateDetailPage = observer(
	({
		templateId,
		template,
		isLoading,
		isNotFound,
		isDeleteModalOpen,
		isPreviewModalOpen,
		isSendTestModalOpen,
		isDeletePending,
		isTogglePending,
		onClickBackButton,
		onClickEditButton,
		onClickDeleteButton,
		onClickDeleteConfirmButton,
		onClickDeleteCancelButton,
		onClickToggleButton,
		onClickPreviewButton,
		onClickPreviewCloseButton,
		onClickSendTestButton,
		onClickSendTestCloseButton,
		onSubmitPreviewTemplate,
		onSubmitSendTestTemplate,
	}: TemplateDetailPageProps) => {
		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="템플릿 상세" description="로딩 중..." />}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<Spinner size="lg" />
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (isNotFound || !template) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="템플릿 상세"
							description="템플릿을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
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
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		return (
			<DetailPage
				top={
					<PageTitleBar
						title="템플릿 상세"
						description={`${template.name} 템플릿의 상세 정보입니다.`}
						actions={
							<TemplateActions
								templateId={templateId}
								isActive={template.isActive}
								onEdit={onClickEditButton}
								onDelete={onClickDeleteButton}
								onToggle={onClickToggleButton}
								onPreview={onClickPreviewButton}
								onSendTest={onClickSendTestButton}
							/>
						}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
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
										<label className="text-sm text-default-500">
											활성 상태
										</label>
										<div className="mt-1">
											<Switch
												isSelected={template.isActive}
												onValueChange={onClickToggleButton}
												isDisabled={isTogglePending}
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
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="콘텐츠" />}>
								<TemplateContentViewer
									type={template.type}
									subject={template.subject ?? null}
									content={template.content}
								/>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="변수 목록" />}>
								{template.variables.length > 0 ? (
									<VariableReadTable variables={template.variables} />
								) : (
									<div className="p-6 text-center">
										<p className="text-default-500">등록된 변수가 없습니다.</p>
									</div>
								)}
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				<Modal isOpen={isDeleteModalOpen} onClose={onClickDeleteCancelButton}>
					<ModalContent>
						<ModalHeader>템플릿 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{template.name}</strong>템플릿을 삭제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-danger">
								이 작업은 되돌릴 수 없습니다.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="flat"
								onPress={onClickDeleteCancelButton}
								isDisabled={isDeletePending}
							>
								취소
							</Button>
							<Button
								color="danger"
								onPress={onClickDeleteConfirmButton}
								isLoading={isDeletePending}
							>
								삭제
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<PreviewModal
					isOpen={isPreviewModalOpen}
					onClose={onClickPreviewCloseButton}
					templateId={templateId}
					type={template.type}
					variables={template.variables}
					onPreview={onSubmitPreviewTemplate}
				/>
				<SendTestModal
					isOpen={isSendTestModalOpen}
					onClose={onClickSendTestCloseButton}
					templateId={templateId}
					type={template.type}
					variables={template.variables}
					onSendTest={onSubmitSendTestTemplate}
				/>
			</DetailPage>
		);
	},
);
