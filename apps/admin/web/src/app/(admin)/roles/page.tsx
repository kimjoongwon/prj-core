"use client";

import { type RoleDto, useGetRoles } from "@cocrepo/api/core/roles";
import { RoleListPage, type RoleListPageRole } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryStates } from "nuqs";

export default observer(function RolesPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
	});
	const { data: response, isLoading } = useGetRoles();
	const roles = (response?.data ?? []).map(mapRoleRow);

	return (
		<RoleListPage
			roles={roles}
			totalCount={response?.meta?.total ?? roles.length}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/roles/new" as Route);
			}}
		/>
	);
});

function mapRoleRow(role: RoleDto): RoleListPageRole {
	return {
		id: role.id,
		name: role.name,
		displayName: role.displayName,
		description: role.description,
		isSystem: role.isSystem,
		createdAt: role.createdAt,
		removedAt: role.removedAt,
	};
}
