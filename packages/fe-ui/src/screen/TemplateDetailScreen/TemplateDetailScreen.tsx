"use client";

import type { DataGridColumnConfig, DataGridState } from "@cocrepo/type";
import type { PreviewResult, TemplateVariable } from "@cocrepo/ui";
import {
	Chip,
	DataGrid,
	DataGridColumnsState,
	DateTimeCell,
	PageTitleBar,
	PreviewModal,
	Section,
	SectionSurface,
	SendTestModal,
	TemplateActions,
	TemplateContentViewer,
	TemplateTypeBadge,
	VStack,
} from "@cocrepo/ui";
import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
import { Switch } from "../../input/Switch/Switch";

const readonlyGridState: DataGridState = {
	columns: new DataGridColumnsState(),
	query: {
		values: { skip: 0, take: 100 },
		setValues: async () => new URLSearchParams(),
	},
};

const variableColumns: DataGridColumnConfig<TemplateVariable>[] = [
	{
		field: "name",
		label: "변수명",
		isRequired: true,
		cell: ({ row }) => (
			<span className="font-mono text-sm">{`{{${row.original.name}}}`}</span>
		),
	},
	{
		field: "description",
		label: "설명",
		cell: ({ row }) => row.original.description ?? "-",
	},
	{
		field: "defaultValue",
		label: "기본값",
		cell: ({ row }) => row.original.defaultValue ?? "-",
	},
	{
		field: "isRequired",
		label: "필수",
		cell: ({ row }) => (
			<Chip size="sm" color={row.original.isRequired ? "primary" : "default"}>
				{row.original.isRequired ? "필수" : "선택"}
			</Chip>
		),
	},
];

export interface TemplateDetailScreenTemplate {
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
export interface TemplateDetailScreenSendTestResult {
	success: boolean;
	sentAt: string;
	errorMessage: string | null;
}
export interface TemplateDetailScreenProps {
	templateId: string;
	template?: TemplateDetailScreenTemplate;
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
	) => Promise<TemplateDetailScreenSendTestResult>;
}
export const TemplateDetailScreen = observer(
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
	}: TemplateDetailScreenProps) => {
		const deleteModalState = useOverlayState({
			isOpen: isDeleteModalOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClickDeleteCancelButton();
				}
			},
		});
		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar title="템플릿 상세" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8">
									<Spinner size="lg" />
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound || !template) {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title="템플릿 상세"
						description="템플릿을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">템플릿을 찾을 수 없습니다.</p>
									<Button
										variant="flat"
										startContent={<ArrowLeft className="size-4" />}
										onPress={onClickBackButton}
									>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack fullWidth>
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
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="기본 정보" />
									</Section.Header>
									<Section.Body>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<label className="text-sm text-muted">코드</label>
												<p className="mt-1 font-mono">{template.code}</p>
											</div>
											<div>
												<label className="text-sm text-muted">이름</label>
												<p className="mt-1">{template.name}</p>
											</div>
											<div>
												<label className="text-sm text-muted">유형</label>
												<div className="mt-1">
													<TemplateTypeBadge type={template.type} />
												</div>
											</div>
											<div>
												<label className="text-sm text-muted">설명</label>
												<p className="mt-1">{template.description || "-"}</p>
											</div>
											<div>
												<label className="text-sm text-muted">활성 상태</label>
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
												<label className="text-sm text-muted">생성일</label>
												<div className="mt-1">
													<DateTimeCell value={template.createdAt} />
												</div>
											</div>
											<div>
												<label className="text-sm text-muted">수정일</label>
												<div className="mt-1">
													<DateTimeCell value={template.updatedAt || "-"} />
												</div>
											</div>
										</div>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="콘텐츠" />
									</Section.Header>
									<Section.Body>
										<TemplateContentViewer
											type={template.type}
											subject={template.subject ?? null}
											content={template.content}
										/>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="변수 목록" />
									</Section.Header>
									<Section.Body>
										<DataGrid
											config={{
												entity: "TemplateVariable",
												columns: variableColumns,
												emptyMessage: "등록된 변수가 없습니다.",
											}}
											rows={template.variables}
											totalCount={template.variables.length}
											state={readonlyGridState}
										/>
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
				<Modal state={deleteModalState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>템플릿 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{template.name}</strong>템플릿을 삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										이 작업은 되돌릴 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={onClickDeleteCancelButton}
										isDisabled={isDeletePending}
									>
										취소
									</Button>
									<Button color="danger" onPress={onClickDeleteConfirmButton}>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
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
			</VStack>
		);
	},
);
