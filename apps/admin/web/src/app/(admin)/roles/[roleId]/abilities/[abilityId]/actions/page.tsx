"use client";

import { RoleAbilityActionListScreen } from "@cocrepo/ui";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

type AbilityActionsPageParams = {
	roleId: string;
	abilityId: string;
};

export default function AdminRolesRoleIdAbilitiesAbilityIdActionsRoute() {
	const { roleId, abilityId } = useParams<AbilityActionsPageParams>();
	const router = useRouter();

	const onClickBackButton = () => {
		router.push(`/roles/${roleId}` as Route);
	};

	return (
		<>
			<RoleAbilityActionListScreen
				abilityId={abilityId}
				onClickBackButton={onClickBackButton}
			/>
		</>
	);
}
