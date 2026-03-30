"use client";

import { customInstance } from "@cocrepo/api/core/client";
import {
	AdminRolesCategoriesPage,
	type AdminRolesCategoriesPageCategory,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface CategoryData {
	id: string;
	name: string;
	createdAt: string;
	parent?: {
		id: string;
		name: string;
	} | null;
	children?: {
		id: string;
		name: string;
	}[];
}

function getCategories() {
	return customInstance<{ data: CategoryData[] }>({
		url: "/api/v1/categories",
		method: "GET",
		params: { type: "Role" },
	});
}

const AdminRolesCategoriesRoute = observer(() => {
	const router = useRouter();
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/categories", { type: "Role" }],
		queryFn: getCategories,
	});

	return (
		<AdminRolesCategoriesPage
			categories={(response?.data ?? []).map(mapCategoryRow)}
			isLoading={isLoading}
			onClickCreateButton={() => {
				router.push("/roles/categories/new" as Route);
			}}
			onClickDetailButton={(categoryId) => {
				router.push(`/roles/categories/${categoryId}` as Route);
			}}
		/>
	);
});

function mapCategoryRow(
	category: CategoryData,
): AdminRolesCategoriesPageCategory {
	return {
		id: category.id,
		name: category.name,
		parentName: category.parent?.name,
		childrenCount: category.children?.length ?? 0,
		createdAt: category.createdAt,
	};
}

export default AdminRolesCategoriesRoute;
