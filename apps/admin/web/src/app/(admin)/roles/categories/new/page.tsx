"use client";

import {
	useCreateCategory,
	useGetCategories,
} from "@cocrepo/api/core/categories";
import {
	RoleCategoryCreatePage,
	type RoleCategoryCreatePageOption,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

interface CategoryOption {
	id: string;
	name: string;
}

const AdminRolesCategoriesNewRoute = observer(() => {
	const router = useRouter();
	const persistStore = usePersistStore();
	const [name, setName] = useState("");
	const [parentId, setParentId] = useState("");
	const [nameError, setNameError] = useState("");

	const { data: categoriesResponse } = useGetCategories({ type: "Role" });
	const categories = (categoriesResponse?.data ??
		[]) as unknown as CategoryOption[];
	const spaceId = persistStore.spaceId ?? "";

	const { mutate: createCategory, isPending } = useCreateCategory({
		mutation: {
			onSuccess: () => {
				router.push("/roles/categories" as Route);
			},
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
			data: {
				tenantId: spaceId,
				spaceId,
				name,
				parentId: parentId || null,
				type: "Role",
			},
		});
	};

	return (
		<RoleCategoryCreatePage
			name={name}
			parentId={parentId}
			nameError={nameError}
			options={categories.map(mapCategoryOption)}
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
): RoleCategoryCreatePageOption {
	return {
		id: category.id,
		name: category.name,
	};
}

export default AdminRolesCategoriesNewRoute;
