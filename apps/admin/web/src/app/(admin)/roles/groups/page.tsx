"use client";

import { customInstance } from "@cocrepo/api/core/client";
import {
	AdminRolesGroupsPage,
	type AdminRolesGroupsPageGroup,
} from "@cocrepo/ui";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface GroupData {
	id: string;
	name: string;
	label?: string | null;
	createdAt: string;
}

function getGroups() {
	return customInstance<{ data: GroupData[] }>({
		url: "/api/v1/groups",
		method: "GET",
		params: { type: "Role" },
	});
}

const AdminRolesGroupsRoute = observer(() => {
	const router = useRouter();
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/groups", { type: "Role" }],
		queryFn: getGroups,
	});

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
