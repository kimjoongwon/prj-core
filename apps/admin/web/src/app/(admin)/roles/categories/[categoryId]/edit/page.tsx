"use client";

import {
	getGetCategoryByIdQueryKey,
	useGetCategories,
	useGetCategoryById,
	useUpdateCategory,
} from "@cocrepo/api/core/categories";
import {
	AdminRolesCategoriesCategoryIdEditPage,
	type AdminRolesCategoriesCategoryIdEditPageOption,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryDetail {
	id: string;
	name: string;
	type: string;
	parentId?: string | null;
	children?: Array<{ id: string; name: string }>;
}

interface CategoryOption {
	id: string;
	name: string;
}

const AdminRolesCategoriesEditRoute = observer(() => {
	const { categoryId } = useParams<{ categoryId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [parentId, setParentId] = useState("");
	const [nameError, setNameError] = useState("");
	const [isInitialized, setIsInitialized] = useState(false);

	const { data: response, isLoading } = useGetCategoryById(categoryId);
	const category = (response?.data as unknown) as CategoryDetail | undefined;

	const { data: categoriesResponse } = useGetCategories({ type: "Role" });
	const categories = ((categoriesResponse?.data ?? []) as unknown) as CategoryOption[];

	useEffect(() => {
		if (!category || isInitialized) {
			return;
		}
		setName(category.name);
		setParentId(category.parentId || "");
		setIsInitialized(true);
	}, [category, isInitialized]);

	const descendantIds = new Set<string>([categoryId]);
	for (const child of category?.children ?? []) {
		descendantIds.add(child.id);
	}
	const categoryOptions = categories
		.filter((candidate) => !descendantIds.has(candidate.id))
		.map(mapEditOption);

	const { mutate: updateCategory, isPending } = useUpdateCategory({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetCategoryByIdQueryKey(categoryId),
				});
				router.push(`/roles/categories/${categoryId}` as Route);
			},
		},
	});

	const onClickSubmitButton = () => {
		if (!name.trim()) {
			setNameError("카테고리명을 입력해주세요.");
			return;
		}

		setNameError("");
		updateCategory({
			id: categoryId,
			data: {
				name,
				parentId: parentId || null,
			},
		});
	};

	return (
		<AdminRolesCategoriesCategoryIdEditPage
			categoryName={category?.name}
			name={name}
			parentId={parentId}
			nameError={nameError}
			options={categoryOptions}
			isLoading={isLoading}
			isSubmitting={isPending}
			isNotFound={!isLoading && !category}
			onChangeNameInput={(value) => {
				setName(value.toUpperCase());
				if (nameError) {
					setNameError("");
				}
			}}
			onChangeParentSelection={setParentId}
			onClickBackButton={() => {
				router.push(`/roles/categories/${categoryId}` as Route);
			}}
			onClickListButton={() => {
				router.push("/roles/categories" as Route);
			}}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

function mapEditOption(
	category: CategoryOption,
): AdminRolesCategoriesCategoryIdEditPageOption {
	return {
		id: category.id,
		name: category.name,
	};
}

export default AdminRolesCategoriesEditRoute;
