"use client";

import { useCreateGroup } from "@cocrepo/api/core/groups";
import { AdminRolesGroupsNewPage } from "@cocrepo/ui";
import { usePersistStore } from "@/stores/AppStoreProvider";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminRolesGroupsNewRoute = observer(() => {
	const router = useRouter();
	const persistStore = usePersistStore();
	const [name, setName] = useState("");
	const [label, setLabel] = useState("");
	const [nameError, setNameError] = useState("");
	const spaceId = persistStore.spaceId ?? "";

	const { mutate: createGroup, isPending } = useCreateGroup({
		mutation: {
			onSuccess: () => {
				router.push("/roles/groups" as Route);
			},
		},
	});

	const onClickSubmitButton = () => {
		if (!name.trim()) {
			setNameError("그룹명을 입력해주세요.");
			return;
		}
		if (name.length > 50) {
			setNameError("50자 이하로 입력해주세요.");
			return;
		}

		setNameError("");
		createGroup({
			data: {
				tenantId: spaceId,
				name,
				label: label || undefined,
				type: "Role",
				spaceId,
			},
		});
	};

	return (
		<AdminRolesGroupsNewPage
			name={name}
			label={label}
			nameError={nameError}
			isSubmitting={isPending}
			onChangeNameInput={(value) => {
				setName(value.toUpperCase());
				if (nameError) {
					setNameError("");
				}
			}}
			onChangeLabelInput={setLabel}
			onClickBackButton={() => {
				router.push("/roles/groups" as Route);
			}}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

export default AdminRolesGroupsNewRoute;
