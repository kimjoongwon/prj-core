"use client";

import { customInstance } from "@cocrepo/api/core/client";
import { AdminRolesGroupsNewPage } from "@cocrepo/ui";
import { useMutation } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminRolesGroupsNewRoute = observer(() => {
	const router = useRouter();
	const [name, setName] = useState("");
	const [label, setLabel] = useState("");
	const [nameError, setNameError] = useState("");

	const { mutate: createGroup, isPending } = useMutation({
		mutationFn: (data: { name: string; label?: string; type: string }) =>
			customInstance({ url: "/api/v1/groups", method: "POST", data }),
		onSuccess: () => {
			router.push("/roles/groups" as Route);
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
			name,
			label: label || undefined,
			type: "Role",
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
