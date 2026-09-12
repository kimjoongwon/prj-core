"use client";

import {
	type UpdateRoleDto,
	useGetRoleById,
	useUpdateRole,
} from "@cocrepo/api/core/roles";
import { Button, RoleEditScreen, type RoleFormState } from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type RoleEditScreenParams = {
	roleId: string;
};

const AdminRolesRoleIdEditRoute = observer(() => {
	const { roleId } = useParams<RoleEditScreenParams>();
	const router = useRouter();
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data;
	const state = useLocalObservable<RoleFormState>(() => ({
		name: "",
		displayName: "",
		description: "",
		errors: {
			displayName: "",
		},
	}));

	const { mutate: updateRole, isPending } = useUpdateRole({
		mutation: {
			onSuccess: () => {
				router.push(`/roles/${roleId}` as Route);
			},
		},
	});

	useEffect(() => {
		if (!role) {
			return;
		}
		state.name = role.name;
		state.displayName = role.displayName || "";
		state.description = role.description || "";
	}, [role, state]);

	const validate = () => {
		if (state.displayName && state.displayName.length > 50) {
			state.errors.displayName = "50자 이하로 입력해주세요.";
			return false;
		}

		state.errors.displayName = "";
		return true;
	};

	const onSubmit = () => {
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
		<RoleEditScreen
			title="Role 수정"
			description={
				role
					? `${role.displayName || role.name} Role을 수정합니다.`
					: "Role을 찾을 수 없습니다."
			}
			state={role ? state : undefined}
			isLoading={isLoading}
			notFound={!isLoading && !role}
			notFoundAction={
				<Button
					variant="tertiary"
					onPress={() => {
						router.push("/roles" as Route);
					}}
				>
					목록으로
				</Button>
			}
			actions={
				<div className="flex gap-2">
					<Button
						variant="ghost"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/roles/${roleId}` as Route);
						}}
					>
						상세로 돌아가기
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						저장
					</Button>
				</div>
			}
		/>
	);
});

export default AdminRolesRoleIdEditRoute;
