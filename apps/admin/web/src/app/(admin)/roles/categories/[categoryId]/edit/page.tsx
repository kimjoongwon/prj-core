"use client";

import { customInstance } from "@cocrepo/api/core/client";
import {
	AdminRolesCategoriesCategoryIdEditPage,
	type AdminRolesCategoriesCategoryIdEditPageOption,
} from "@cocrepo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/categories", categoryId],
		queryFn: () =>
			customInstance<{ data: CategoryDetail }>({
				url: `/api/v1/categories/${categoryId}`,
				method: "GET",
			}),
	});
	const category = response?.data;

	const { data: categoriesResponse } = useQuery({
		queryKey: ["/api/v1/categories", { type: "Role" }],
		queryFn: () =>
			customInstance<{ data: CategoryOption[] }>({
				url: "/api/v1/categories",
				method: "GET",
				params: { type: "Role" },
			}),
	});

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
	const categoryOptions = (categoriesResponse?.data ?? [])
		.filter((candidate) => !descendantIds.has(candidate.id))
		.map(mapEditOption);

	const { mutate: updateCategory, isPending } = useMutation({
		mutationFn: (data: { name?: string; parentId?: string | null }) =>
			customInstance({
				url: `/api/v1/categories/${categoryId}`,
				method: "PATCH",
				data,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["/api/v1/categories", categoryId],
			});
			router.push(`/roles/categories/${categoryId}` as Route);
		},
	});

	const onClickSubmitButton = () => {
		if (!name.trim()) {
			setNameError("카테고리명을 입력해주세요.");
			return;
		}

		setNameError("");
		updateCategory({
			name,
			parentId: parentId || null,
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
