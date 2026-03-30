"use client";

import { customInstance } from "@cocrepo/api/core/client";
import {
	AdminRolesCategoriesNewPage,
	type AdminRolesCategoriesNewPageOption,
} from "@cocrepo/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryOption {
	id: string;
	name: string;
}

function getCategories() {
	return customInstance<{ data: CategoryOption[] }>({
		url: "/api/v1/categories",
		method: "GET",
		params: { type: "Role" },
	});
}

const AdminRolesCategoriesNewRoute = observer(() => {
	const router = useRouter();
	const [name, setName] = useState("");
	const [parentId, setParentId] = useState("");
	const [nameError, setNameError] = useState("");

	const { data: categoriesResponse } = useQuery({
		queryKey: ["/api/v1/categories", { type: "Role" }],
		queryFn: getCategories,
	});

	const { mutate: createCategory, isPending } = useMutation({
		mutationFn: (data: {
			name: string;
			parentId?: string | null;
			type: string;
		}) => customInstance({ url: "/api/v1/categories", method: "POST", data }),
		onSuccess: () => {
			router.push("/roles/categories" as Route);
		},
	});

	const onClickSubmitButton = () => {
		if (!name.trim()) {
			setNameError("카테고리명을 입력해주세요.");
			return;
		}
		if (name.length > 50) {
			setNameError("50자 이하로 입력해주세요.");
			return;
		}

		setNameError("");
		createCategory({
			name,
			parentId: parentId || null,
			type: "Role",
		});
	};

	return (
		<AdminRolesCategoriesNewPage
			name={name}
			parentId={parentId}
			nameError={nameError}
			options={(categoriesResponse?.data ?? []).map(mapCategoryOption)}
			isSubmitting={isPending}
			onChangeNameInput={(value) => {
				setName(value.toUpperCase());
				if (nameError) {
					setNameError("");
				}
			}}
			onChangeParentSelection={setParentId}
			onClickBackButton={() => {
				router.push("/roles/categories" as Route);
			}}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

function mapCategoryOption(
	category: CategoryOption,
): AdminRolesCategoriesNewPageOption {
	return {
		id: category.id,
		name: category.name,
	};
}

export default AdminRolesCategoriesNewRoute;
