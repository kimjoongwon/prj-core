"use client";

import { type CreateRoleDto, useCreateRole } from "@cocrepo/api/core/roles";
import {
	Button,
	HStack,
	RoleEditScreen,
	type RoleFormState,
} from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

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

	const onSubmit = () => {
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
		<RoleEditScreen
			title="Role 등록"
			description="새로운 Role을 등록합니다."
			state={state}
			actions={
				<HStack>
					<Button
						variant="ghost"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/roles" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						Role 등록
					</Button>
				</HStack>
			}
		/>
	);
});

export default AdminRolesNewRoute;
