"use client";

import { useGetCategories } from "@cocrepo/api/core/categories";
import {
	RoleCategoryListPage,
	type RoleCategoryListPageCategory,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

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

const AdminRolesCategoriesRoute = observer(() => {
	const router = useRouter();
	const categoryParams = { type: "Role" as const };
	const { data: response, isLoading } = useGetCategories(categoryParams);
	const categories = (response?.data ?? []) as unknown as CategoryData[];

	return (
		<RoleCategoryListPage
			categories={categories.map(mapCategoryRow)}
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

function mapCategoryRow(category: CategoryData): RoleCategoryListPageCategory {
	return {
		id: category.id,
		name: category.name,
		parentName: category.parent?.name,
		childrenCount: category.children?.length ?? 0,
		createdAt: category.createdAt,
	};
}

export default AdminRolesCategoriesRoute;
