"use client";

import {
	GroupInfoSection,
	GroupRoleListSection,
	DetailPage,
	DetailPageSurface,
	PageTitleBar,
	DetailSectionCard,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoleGroupDetailPageGroup {
	id: string;
	name: string;
	label?: string | null;
	type: string;
	createdAt: string;
	updatedAt: string;
	roleAssociations?: Array<{
		id: string;
		roleId: string;
		role?: {
			id: string;
			name: string;
			displayName?: string | null;
			isSystem: boolean;
		};
	}>;
}

export interface RoleGroupDetailPageProps {
	group?: RoleGroupDetailPageGroup;
	isLoading: boolean;
	isDeleteModalOpen: boolean;
	isDeleting: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickDeleteButton: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
}

export const RoleGroupDetailPage = observer(
	({
		group,
		isLoading,
		isDeleteModalOpen,
		isDeleting,
		onClickBackButton,
		onClickEditButton,
		onClickDeleteButton,
		onCloseDeleteModal,
		onClickDeleteConfirm,
	}: RoleGroupDetailPageProps) => {
		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="역할 그룹 상세" description="로딩 중..." />}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<span className="text-default-500">로딩 중...</span>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (!group) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="역할 그룹 상세"
							description="그룹을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">그룹을 찾을 수 없습니다.</p>
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
						title="역할 그룹 상세"
						description={`${group.label || group.name} 그룹의 상세 정보입니다.`}
						actions={
							<div className="flex gap-2">
								<Button
									variant="light"
									startContent={<ArrowLeft className="h-4 w-4" />}
									onPress={onClickBackButton}
								>
									목록으로
								</Button>
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
									onPress={onClickDeleteButton}
								>
									삭제
								</Button>
							</div>
						}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
							<GroupInfoSection
								group={{
									name: group.name,
									label: group.label,
									type: group.type,
									createdAt: group.createdAt,
									updatedAt: group.updatedAt,
								}}
							/>
						</DetailSectionCard>
						<DetailSectionCard>
							<h3 className="mb-4 text-lg font-semibold">연결된 역할</h3>
							<GroupRoleListSection
								roleAssociations={group.roleAssociations ?? []}
							/>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				<Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
					<ModalContent>
						<ModalHeader>역할 그룹 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{group.label || group.name}</strong> 그룹을 삭제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-danger">
								이 작업은 되돌릴 수 없습니다. 연결된 역할 연관도 함께 삭제됩니다.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="flat"
								onPress={onCloseDeleteModal}
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
			</DetailPage>
		);
	},
);
