"use client";

// TODO: Orval codegen 후 아래 import로 교체
// import { useGetCategoryById, useDeleteCategory } from "@cocrepo/api";
import { customInstance } from "@cocrepo/api";
import {
	CategoryChildrenSection,
	CategoryInfoSection,
	CategoryRoleListSection,
	PageSurface,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface RoleCategoryDetailPageClientProps {
	categoryId: string;
}

/** 카테고리 상세 응답 타입 */
interface CategoryDetail {
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

/**
 * 역할 카테고리 상세 페이지 - 클라이언트 컴포넌트
 */
function RoleCategoryDetailPageClient({
	categoryId,
}: RoleCategoryDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const deleteModal = useDisclosure();

	// TODO: Orval codegen 후 useGetCategoryById(categoryId) 로 교체
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/categories", categoryId],
		queryFn: () =>
			customInstance<{ data: CategoryDetail }>({
				url: `/api/v1/categories/${categoryId}`,
				method: "GET",
			}),
	});
	const category = response?.data;

	// TODO: Orval codegen 후 useDeleteCategory 으로 교체
	const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
		mutationFn: () =>
			customInstance({
				url: `/api/v1/categories/${categoryId}`,
				method: "DELETE",
			}),
		onSuccess: () => {
			deleteModal.onClose();
			queryClient.invalidateQueries({
				queryKey: ["/api/v1/categories"],
			});
			router.push("/roles/categories" as Route);
		},
	});

	const onClickBackButton = () => {
		router.push("/roles/categories" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/roles/categories/${categoryId}/edit` as Route);
	};

	const onClickDeleteConfirm = () => {
		deleteCategory();
	};

	if (isLoading) {
		return (
			<PageSurface title="역할 카테고리 상세" description="로딩 중...">
				<div className="flex items-center justify-center p-8">
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	if (!category) {
		return (
			<PageSurface
				title="역할 카테고리 상세"
				description="카테고리를 찾을 수 없습니다."
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">카테고리를 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	const hasChildren = (category.children?.length ?? 0) > 0;

	return (
		<PageSurface
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
						onPress={deleteModal.onOpen}
						isDisabled={hasChildren}
					>
						삭제
					</Button>
				</div>
			}
		>
			<VStack gap={4}>
				{/* 하위 카테고리가 있어 삭제 불가한 경우 안내 */}
				{hasChildren && (
					<div className="rounded-xl bg-warning-50 dark:bg-warning-900/20 p-4">
						<p className="text-sm text-warning-700 dark:text-warning-400">
							<strong>참고:</strong> 하위 카테고리가 있어 삭제할 수 없습니다.
							하위 카테고리를 먼저 삭제해주세요.
						</p>
					</div>
				)}

				{/* 기본 정보 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
						<CategoryInfoSection
							category={{
								name: category.name,
								type: category.type,
								parentName: category.parent?.name,
								parentId: category.parent?.id,
								createdAt: category.createdAt,
								updatedAt: category.updatedAt,
							}}
							categoriesBasePath="/roles/categories"
						/>
					</div>
				</SectionSurface>

				{/* 하위 카테고리 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">하위 카테고리</h3>
						<CategoryChildrenSection
							children={category.children ?? []}
							categoriesBasePath="/roles/categories"
						/>
					</div>
				</SectionSurface>

				{/* 분류된 역할 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">분류된 역할</h3>
						<CategoryRoleListSection
							roleClassifications={category.roleClassifications ?? []}
						/>
					</div>
				</SectionSurface>
			</VStack>

			{/* 삭제 확인 모달 */}
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>역할 카테고리 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{category.name}</strong> 카테고리를 삭제하시겠습니까?
						</p>
						<p className="text-sm text-danger mt-2">
							이 작업은 되돌릴 수 없습니다. 연결된 역할 분류도 함께 삭제됩니다.
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
		</PageSurface>
	);
}

export default observer(RoleCategoryDetailPageClient);
