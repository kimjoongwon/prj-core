"use client";

import { RoleAbilitySubjectListScreen } from "@cocrepo/ui";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

type AbilitySubjectsPageParams = {
	roleId: string;
	abilityId: string;
};

export default function AdminRolesRoleIdAbilitiesAbilityIdSubjectsRoute() {
	const { roleId, abilityId } = useParams<AbilitySubjectsPageParams>();
	const router = useRouter();

	const onClickBackButton = () => {
		router.push(`/roles/${roleId}` as Route);
	};

	return (
		<>
			<RoleAbilitySubjectListScreen
				abilityId={abilityId}
				onClickBackButton={onClickBackButton}
			/>
		</>
	);
}
