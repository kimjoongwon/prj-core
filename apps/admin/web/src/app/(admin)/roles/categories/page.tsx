"use client";

import { useGetCategories } from "@cocrepo/api/core/categories";
import { RoleCategoryListPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

const AdminRolesCategoriesRoute = observer(() => {
	const router = useRouter();
	const categoryParams = { type: "Role" as const };
	const { data: response, isLoading } = useGetCategories(categoryParams);

	return (
		<RoleCategoryListPage
			categories={response?.data}
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

export default AdminRolesCategoriesRoute;
