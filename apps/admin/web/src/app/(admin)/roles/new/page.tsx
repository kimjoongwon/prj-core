"use client";

import { type CreateRoleDto, useCreateRole } from "@cocrepo/api/core/roles";
import { RoleCreatePage } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface RoleFormState {
	name: string;
	displayName: string;
	description: string;
	errors: {
		name: string;
		displayName: string;
	};
}

const AdminRolesNewRoute = observer(() => {
	const router = useRouter();
	const state = useLocalObservable<RoleFormState>(() => ({
		name: "",
		displayName: "",
		description: "",
		errors: {
			name: "",
			displayName: "",
		},
	}));

	const { mutate: createRole, isPending } = useCreateRole({
		mutation: {
			onSuccess: () => {
				router.push("/roles" as Route);
			},
		},
	});

	const validate = () => {
		let isValid = true;

		if (!state.name.trim()) {
			state.errors.name = "역할 식별자를 입력해주세요.";
			isValid = false;
		} else if (!/^[A-Z][A-Z0-9_]*$/.test(state.name)) {
			state.errors.name =
				"대문자로 시작하고, 대문자/숫자/밑줄만 사용 가능합니다. (예: CUSTOM_ROLE)";
			isValid = false;
		} else if (state.name.length > 50) {
			state.errors.name = "50자 이하로 입력해주세요.";
			isValid = false;
		} else {
			state.errors.name = "";
		}

		if (state.displayName && state.displayName.length > 50) {
			state.errors.displayName = "50자 이하로 입력해주세요.";
			isValid = false;
		} else {
			state.errors.displayName = "";
		}

		return isValid;
	};

	const onChangeNameInput = (value: string) => {
		state.name = value.toUpperCase();
		state.errors.name = "";
	};

	const onChangeDisplayNameInput = (value: string) => {
		state.displayName = value;
		state.errors.displayName = "";
	};

	const onChangeDescriptionTextArea = (value: string) => {
		state.description = value;
	};

	const onClickBackButton = () => {
		router.push("/roles" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) {
			return;
		}

		const data: CreateRoleDto = {
			name: state.name,
			displayName: state.displayName || undefined,
			description: state.description || undefined,
		};

		createRole({ data });
	};

	return (
		<RoleCreatePage
			name={state.name}
			displayName={state.displayName}
			description={state.description}
			nameError={state.errors.name}
			displayNameError={state.errors.displayName}
			isSubmitPending={isPending}
			onChangeNameInput={onChangeNameInput}
			onChangeDisplayNameInput={onChangeDisplayNameInput}
			onChangeDescriptionTextArea={onChangeDescriptionTextArea}
			onClickBackButton={onClickBackButton}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

export default AdminRolesNewRoute;
