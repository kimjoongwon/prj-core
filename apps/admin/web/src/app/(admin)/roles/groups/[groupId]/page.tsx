"use client";

import {
	getGetGroupsQueryKey,
	useDeleteGroup,
	useGetGroupById,
} from "@cocrepo/api/core/groups";
import {
	AdminRolesGroupsGroupIdPage,
	type AdminRolesGroupsGroupIdPageGroup,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
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

	const { data: response, isLoading } = useGetGroupById(groupId);

	const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup({
		mutation: {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				queryClient.invalidateQueries({
					queryKey: getGetGroupsQueryKey(),
				});
				router.push("/roles/groups" as Route);
			},
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
				deleteGroup({ id: groupId });
			}}
		/>
	);
});

function mapGroupDetail(group: GroupDetail): AdminRolesGroupsGroupIdPageGroup {
	return group;
}

export default AdminRolesGroupsDetailRoute;
