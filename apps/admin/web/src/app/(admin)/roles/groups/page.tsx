"use client";

import { useGetGroups } from "@cocrepo/api/core/groups";
import {
	AdminRolesGroupsPage,
	type AdminRolesGroupsPageGroup,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface GroupData {
	id: string;
	name: string;
	label?: string | null;
	createdAt: string;
}

const AdminRolesGroupsRoute = observer(() => {
	const router = useRouter();
	const { data: response, isLoading } = useGetGroups({ type: "Role" });

	return (
		<AdminRolesGroupsPage
			groups={(response?.data ?? []).map(mapGroupRow)}
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

function mapGroupRow(group: GroupData): AdminRolesGroupsPageGroup {
	return group;
}

export default AdminRolesGroupsRoute;
