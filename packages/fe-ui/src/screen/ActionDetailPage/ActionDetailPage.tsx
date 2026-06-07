"use client";

import {
	DetailPage,
	DetailPageSurface,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Modal, useOverlayState } from "@heroui/react";

export interface ActionDetailPageAction {
	id: string;
	name: string;
	displayName?: string | null;
	group?: string | null;
	order: number;
	description?: string | null;
	config?: object | null;
	isSystem: boolean;
	createdAt: string;
	updatedAt?: string | null;
}

export interface ActionDetailPageProps {
	action?: ActionDetailPageAction;
	isLoading: boolean;
	isDeleting: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickDeleteConfirmButton: () => void;
}

/**
 * group 색상 매핑
 */
const getGroupColor = (
	group?: string,
): "primary" | "secondary" | "success" | "warning" | "danger" | "default" => {
	switch (group) {
		case "crud":
			return "primary";
		case "visibility":
			return "secondary";
		case "workflow":
			return "success";
		case "bulk":
			return "warning";
		default:
			return "default";
	}
};

export const ActionDetailPage = observer(
	({
		action,
		isLoading,
		isDeleting,
		onClickBackButton,
		onClickEditButton,
		onClickDeleteConfirmButton,
	}: ActionDetailPageProps) => {
		const deleteModal = useOverlayState();

		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="Action 상세" description="로딩 중..." />}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<span className="text-muted">로딩 중...</span>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (!action) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="Action 상세"
							description="Action을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-muted">Action을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickBackButton}>
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
						title="Action 상세"
						description={`${action.displayName || action.name} Action의 상세 정보입니다.`}
						actions={
							<div className="flex gap-2">
								<Button
									variant="light"
									startContent={<ArrowLeft className="h-4 w-4" />}
									onPress={onClickBackButton}
								>
									목록으로
								</Button>
								{!action.isSystem && (
									<>
										<Button
											variant="flat"
											color="primary"
											startContent={<Edit className="h-4 w-4" />}
											onPress={onClickEditButton}
										>
											수정
										</Button>
										<Button
											variant="flat"
											color="danger"
											startContent={<Trash2 className="h-4 w-4" />}
											onPress={deleteModal.open}
										>
											삭제
										</Button>
									</>
								)}
							</div>
						}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						{action.isSystem && (
							<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
								<p className="text-sm text-warning-700 dark:text-warning-400">
									<strong>시스템 Action:</strong>이 Action은 시스템에서 기본
									제공하는 Action으로, 수정하거나 삭제할 수 없습니다.
								</p>
							</div>
						)}
						<DetailSectionCard>
							<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
							<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<dt className="text-sm text-muted mb-1">행위 식별자</dt>
									<dd className="flex items-center gap-2">
										<span className="font-mono">{action.name}</span>
										{action.isSystem && (
											<Chip size="sm" color="warning" variant="flat">
												시스템
											</Chip>
										)}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-muted mb-1">표시명</dt>
									<dd>{action.displayName || "-"}</dd>
								</div>
								<div>
									<dt className="text-sm text-muted mb-1">분류</dt>
									<dd>
										{action.group ? (
											<Chip
												size="sm"
												color={getGroupColor(action.group)}
												variant="flat"
											>
												{action.group}
											</Chip>
										) : (
											"-"
										)}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-muted mb-1">정렬 순서</dt>
									<dd>{action.order}</dd>
								</div>
								<div className="md:col-span-2">
									<dt className="text-sm text-muted mb-1">설명</dt>
									<dd className="text-muted">
										{action.description || "-"}
									</dd>
								</div>
							</dl>
						</DetailSectionCard>
						{action.config !== null && action.config !== undefined && (
							<DetailSectionCard>
								<h3 className="text-lg font-semibold mb-4">설정 (Config)</h3>
								<pre className="bg-default dark:bg-default/5 rounded-lg p-4 overflow-x-auto text-sm">
									{JSON.stringify(action.config, null, 2)}
								</pre>
							</DetailSectionCard>
						)}
						<DetailSectionCard>
							<h3 className="text-lg font-semibold mb-4">추가 정보</h3>
							<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<dt className="text-sm text-muted mb-1">생성일</dt>
									<dd>{new Date(action.createdAt).toLocaleString("ko-KR")}</dd>
								</div>
								{action.updatedAt && (
									<div>
										<dt className="text-sm text-muted mb-1">수정일</dt>
										<dd>
											{new Date(action.updatedAt).toLocaleString("ko-KR")}
										</dd>
									</div>
								)}
							</dl>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
			<Modal state={deleteModal}>
					<Modal.Backdrop><Modal.Container><Modal.Dialog>
						<Modal.Header>Action 삭제</Modal.Header>
						<Modal.Body>
							<p>
								<strong>{action.displayName || action.name}</strong>Action을
								삭제하시겠습니까?
							</p>
							<p className="text-sm text-danger mt-2">
								이 작업은 되돌릴 수 없습니다.
							</p>
						</Modal.Body>
						<Modal.Footer>
							<Button
								variant="flat"
								onPress={deleteModal.close}
								isDisabled={isDeleting}
							>
								취소
							</Button>
							<Button
								color="danger"
								onPress={onClickDeleteConfirmButton}
								isLoading={isDeleting}
							>
								삭제
							</Button>
						</Modal.Footer>
					</Modal.Dialog></Modal.Container></Modal.Backdrop>
				</Modal>
			</DetailPage>
		);
	},
);
