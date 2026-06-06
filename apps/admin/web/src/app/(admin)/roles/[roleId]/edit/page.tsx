"use client";

import {
	type UpdateRoleDto,
	useGetRoleById,
	useUpdateRole,
} from "@cocrepo/api/core/roles";
import { RoleEditPage } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleEditFormState {
	displayName: string;
	description: string;
	errors: {
		displayName: string;
	};
	isInitialized: boolean;
}

type RoleEditPageParams = {
	roleId: string;
};

const AdminRolesRoleIdEditRoute = observer(() => {
	const { roleId } = useParams<RoleEditPageParams>();
	const router = useRouter();
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data;

	const { mutate: updateRole, isPending } = useUpdateRole({
		mutation: {
			onSuccess: () => {
				router.push(`/roles/${roleId}` as Route);
			},
		},
	});

	const state = useLocalObservable<RoleEditFormState>(() => ({
		displayName: "",
		description: "",
		errors: {
			displayName: "",
		},
		isInitialized: false,
	}));

	useEffect(() => {
		if (role && !state.isInitialized) {
			state.displayName = role.displayName || "";
			state.description = role.description || "";
			state.isInitialized = true;
		}
	}, [role, state]);

	const validate = () => {
		let isValid = true;
		if (state.displayName && state.displayName.length > 50) {
			state.errors.displayName = "50자 이하로 입력해주세요.";
			isValid = false;
		} else {
			state.errors.displayName = "";
		}
		return isValid;
	};

	const onChangeDisplayNameInput = (value: string) => {
		state.displayName = value;
		state.errors.displayName = "";
	};

	const onChangeDescriptionTextArea = (value: string) => {
		state.description = value;
	};

	const onClickBackButton = () => {
		router.push(`/roles/${roleId}` as Route);
	};

	const onClickListButton = () => {
		router.push("/roles" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) {
			return;
		}

		const data: UpdateRoleDto = {
			displayName: state.displayName || undefined,
			description: state.description || undefined,
		};

		updateRole({ id: roleId, data });
	};

	return (
		<RoleEditPage
			roleName={role?.name}
			roleDisplayName={role?.displayName}
			isSystemRole={Boolean(role?.isSystem)}
			displayName={state.displayName}
			description={state.description}
			displayNameError={state.errors.displayName}
			isLoading={isLoading}
			isNotFound={!isLoading && !role}
			isSubmitPending={isPending}
			onChangeDisplayNameInput={onChangeDisplayNameInput}
			onChangeDescriptionTextArea={onChangeDescriptionTextArea}
			onClickBackButton={onClickBackButton}
			onClickListButton={onClickListButton}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

export default AdminRolesRoleIdEditRoute;
