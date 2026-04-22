"use client";

import {
	getGetCategoriesQueryKey,
	useDeleteCategory,
	useGetCategoryById,
} from "@cocrepo/api/core/categories";
import {
	RoleCategoryDetailPage,
	type RoleCategoryDetailPageCategory,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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

const AdminRolesCategoriesDetailRoute = observer(() => {
	const { categoryId } = useParams<{ categoryId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { data: response, isLoading } = useGetCategoryById(categoryId);
	const category = (response?.data as unknown) as CategoryDetail | undefined;

	const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory({
		mutation: {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				queryClient.invalidateQueries({
					queryKey: getGetCategoriesQueryKey(),
				});
				router.push("/roles/categories" as Route);
			},
		},
	});

	return (
		<RoleCategoryDetailPage
			category={category ? mapCategoryDetail(category) : undefined}
			isLoading={isLoading}
			isDeleteModalOpen={isDeleteModalOpen}
			isDeleting={isDeleting}
			onClickBackButton={() => {
				router.push("/roles/categories" as Route);
			}}
			onClickEditButton={() => {
				router.push(`/roles/categories/${categoryId}/edit` as Route);
			}}
			onClickDeleteButton={() => {
				setIsDeleteModalOpen(true);
			}}
			onCloseDeleteModal={() => {
				setIsDeleteModalOpen(false);
			}}
			onClickDeleteConfirm={() => {
				deleteCategory({ id: categoryId });
			}}
		/>
	);
});

function mapCategoryDetail(
	category: CategoryDetail,
): RoleCategoryDetailPageCategory {
	return category;
}

export default AdminRolesCategoriesDetailRoute;
