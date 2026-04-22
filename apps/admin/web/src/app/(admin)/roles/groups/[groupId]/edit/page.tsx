"use client";

import {
	getGetGroupByIdQueryKey,
	useGetGroupById,
	useUpdateGroup,
} from "@cocrepo/api/core/groups";
import { RoleGroupEditPage } from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GroupDetail {
	id: string;
	name: string;
	label?: string | null;
	type: string;
}

const AdminRolesGroupsEditRoute = observer(() => {
	const { groupId } = useParams<{ groupId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [label, setLabel] = useState("");
	const [nameError, setNameError] = useState("");
	const [isInitialized, setIsInitialized] = useState(false);

	const { data: response, isLoading } = useGetGroupById(groupId);
	const group = response?.data;

	useEffect(() => {
		if (!group || isInitialized) {
			return;
		}
		setName(group.name);
		setLabel(group.label || "");
		setIsInitialized(true);
	}, [group, isInitialized]);

	const { mutate: updateGroup, isPending } = useUpdateGroup({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetGroupByIdQueryKey(groupId),
				});
				router.push(`/roles/groups/${groupId}` as Route);
			},
		},
	});

	const onClickSubmitButton = () => {
		if (!name.trim()) {
			setNameError("그룹명을 입력해주세요.");
			return;
		}

		setNameError("");
		updateGroup({
			id: groupId,
			data: {
				name,
				label: label || undefined,
			},
		});
	};

	return (
		<RoleGroupEditPage
			groupName={group?.label || group?.name}
			name={name}
			label={label}
			nameError={nameError}
			isLoading={isLoading}
			isSubmitting={isPending}
			isNotFound={!isLoading && !group}
			onChangeNameInput={(value) => {
				setName(value.toUpperCase());
				if (nameError) {
					setNameError("");
				}
			}}
			onChangeLabelInput={setLabel}
			onClickBackButton={() => {
				router.push(`/roles/groups/${groupId}` as Route);
			}}
			onClickListButton={() => {
				router.push("/roles/groups" as Route);
			}}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

export default AdminRolesGroupsEditRoute;
