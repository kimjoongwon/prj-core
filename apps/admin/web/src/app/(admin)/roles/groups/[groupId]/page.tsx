"use client";

import { customInstance } from "@cocrepo/api/core/client";
import {
	AdminRolesGroupsGroupIdPage,
	type AdminRolesGroupsGroupIdPageGroup,
} from "@cocrepo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface GroupDetail {
	id: string;
	name: string;
	label?: string | null;
	type: string;
	createdAt: string;
	updatedAt: string;
	roleAssociations?: Array<{
		id: string;
		roleId: string;
		role?: {
			id: string;
			name: string;
			displayName?: string | null;
			isSystem: boolean;
		};
	}>;
}

const AdminRolesGroupsDetailRoute = observer(() => {
	const { groupId } = useParams<{ groupId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/groups", groupId],
		queryFn: () =>
			customInstance<{ data: GroupDetail }>({
				url: `/api/v1/groups/${groupId}`,
				method: "GET",
			}),
	});

	const { mutate: deleteGroup, isPending: isDeleting } = useMutation({
		mutationFn: () =>
			customInstance({
				url: `/api/v1/groups/${groupId}`,
				method: "DELETE",
			}),
		onSuccess: () => {
			setIsDeleteModalOpen(false);
			queryClient.invalidateQueries({
				queryKey: ["/api/v1/groups"],
			});
			router.push("/roles/groups" as Route);
		},
	});

	return (
		<AdminRolesGroupsGroupIdPage
			group={response?.data ? mapGroupDetail(response.data) : undefined}
			isLoading={isLoading}
			isDeleteModalOpen={isDeleteModalOpen}
			isDeleting={isDeleting}
			onClickBackButton={() => {
				router.push("/roles/groups" as Route);
			}}
			onClickEditButton={() => {
				router.push(`/roles/groups/${groupId}/edit` as Route);
			}}
			onClickDeleteButton={() => {
				setIsDeleteModalOpen(true);
			}}
			onCloseDeleteModal={() => {
				setIsDeleteModalOpen(false);
			}}
			onClickDeleteConfirm={() => {
				deleteGroup();
			}}
		/>
	);
});

function mapGroupDetail(group: GroupDetail): AdminRolesGroupsGroupIdPageGroup {
	return group;
}

export default AdminRolesGroupsDetailRoute;
