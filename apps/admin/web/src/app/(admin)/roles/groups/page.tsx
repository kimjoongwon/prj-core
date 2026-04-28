"use client";

import { useGetGroups } from "@cocrepo/api/core/groups";
import { RoleGroupListPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

const AdminRolesGroupsRoute = observer(() => {
	const router = useRouter();
	const groupParams = { type: "Role" as const };
	const { data: response, isLoading } = useGetGroups(groupParams);

	return (
		<RoleGroupListPage
			groups={response?.data}
			isLoading={isLoading}
			onClickCreateButton={() => {
				router.push("/roles/groups/new" as Route);
			}}
			onClickDetailButton={(groupId) => {
				router.push(`/roles/groups/${groupId}` as Route);
			}}
		/>
	);
});

export default AdminRolesGroupsRoute;
