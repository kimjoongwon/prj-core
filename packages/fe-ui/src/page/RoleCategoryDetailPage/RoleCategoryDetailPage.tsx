"use client";

import {
	CategoryChildrenSection,
	CategoryInfoSection,
	CategoryRoleListSection,
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

export interface RoleCategoryDetailPageCategory {
	id: string;
	name: string;
	type: string;
	parentId?: string | null;
	parent?: { id: string; name: string } | null;
	children?: Array<{
		id: string;
		name: string;
		_count?: { roleClassifications?: number };
	}>;
	roleClassifications?: Array<{
		id: string;
		roleId: string;
		role?: {
			id: string;
			name: string;
			displayName?: string | null;
			isSystem: boolean;
		};
	}>;
	createdAt: string;
	updatedAt: string;
}

export interface RoleCategoryDetailPageProps {
	category?: RoleCategoryDetailPageCategory;
	isLoading: boolean;
	isDeleteModalOpen: boolean;
	isDeleting: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickDeleteButton: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
}

export const RoleCategoryDetailPage = observer(
	({
		category,
		isLoading,
		isDeleteModalOpen,
		isDeleting,
		onClickBackButton,
		onClickEditButton,
		onClickDeleteButton,
		onCloseDeleteModal,
		onClickDeleteConfirm,
	}: RoleCategoryDetailPageProps) => {
		if (isLoading) {
			return (
				<DetailPage
					top={
						<PageTitleBar title="역할 카테고리 상세" description="로딩 중..." />
					}
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

		if (!category) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="역할 카테고리 상세"
							description="카테고리를 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">카테고리를 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickBackButton}>
									목록으로
								</Button>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		const hasChildren = (category.children?.length ?? 0) > 0;

		return (
			<DetailPage
				top={
					<PageTitleBar
						title="역할 카테고리 상세"
						description={`${category.name} 카테고리의 상세 정보입니다.`}
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
									isDisabled={hasChildren}
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
						{hasChildren ? (
							<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
								<p className="text-sm text-warning-700 dark:text-warning-400">
									<strong>참고:</strong> 하위 카테고리가 있어 삭제할 수
									없습니다. 하위 카테고리를 먼저 삭제해주세요.
								</p>
							</div>
						) : null}
						<DetailSectionCard>
							<h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
							<CategoryInfoSection
								category={{
									name: category.name,
									type: category.type,
									parent: category.parent,
									parentId: category.parent?.id,
									createdAt: category.createdAt,
									updatedAt: category.updatedAt,
								}}
								categoriesBasePath="/roles/categories"
							/>
						</DetailSectionCard>
						<DetailSectionCard>
							<h3 className="mb-4 text-lg font-semibold">하위 카테고리</h3>
							<CategoryChildrenSection
								items={category.children ?? []}
								categoriesBasePath="/roles/categories"
							/>
						</DetailSectionCard>
						<DetailSectionCard>
							<h3 className="mb-4 text-lg font-semibold">분류된 역할</h3>
							<CategoryRoleListSection
								roleClassifications={category.roleClassifications ?? []}
							/>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				<Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
					<ModalContent>
						<ModalHeader>역할 카테고리 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{category.name}</strong> 카테고리를 삭제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-danger">
								이 작업은 되돌릴 수 없습니다. 연결된 역할 분류도 함께
								삭제됩니다.
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
