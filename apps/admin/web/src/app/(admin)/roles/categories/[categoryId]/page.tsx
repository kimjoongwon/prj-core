"use client";

import { customInstance } from "@cocrepo/api/core/client";
import {
	AdminRolesCategoriesCategoryIdPage,
	type AdminRolesCategoriesCategoryIdPageCategory,
} from "@cocrepo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/categories", categoryId],
		queryFn: () =>
			customInstance<{ data: CategoryDetail }>({
				url: `/api/v1/categories/${categoryId}`,
				method: "GET",
			}),
	});

	const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
		mutationFn: () =>
			customInstance({
				url: `/api/v1/categories/${categoryId}`,
				method: "DELETE",
			}),
		onSuccess: () => {
			setIsDeleteModalOpen(false);
			queryClient.invalidateQueries({
				queryKey: ["/api/v1/categories"],
			});
			router.push("/roles/categories" as Route);
		},
	});

	return (
		<AdminRolesCategoriesCategoryIdPage
			category={response?.data ? mapCategoryDetail(response.data) : undefined}
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
				deleteCategory();
			}}
		/>
	);
});

function mapCategoryDetail(
	category: CategoryDetail,
): AdminRolesCategoriesCategoryIdPageCategory {
	return category;
}

export default AdminRolesCategoriesDetailRoute;
