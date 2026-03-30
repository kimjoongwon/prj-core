"use client";

import { useGetAbilitiesByRoleId } from "@cocrepo/api/core/abilities";
import { customInstance } from "@cocrepo/api/core/client";
import { useDeleteRole, useGetRoleById } from "@cocrepo/api/core/roles";
import {
	AdminRolesRoleIdPage,
	type AdminRolesRoleIdPageAbility,
	type AdminRolesRoleIdPageGrantItem,
	type AdminRolesRoleIdPageRole,
} from "@cocrepo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface AbilityItem extends AdminRolesRoleIdPageAbility {}

function getAllAbilities() {
	return customInstance<{ data: AbilityItem[] }>({
		url: "/api/v1/abilities",
		method: "GET",
	});
}

function batchAssignGrantsToRole(
	roleId: string,
	grants: AdminRolesRoleIdPageGrantItem[],
) {
	return customInstance<{ data: unknown[] }>({
		url: `/api/v1/grants/roles/${roleId}`,
		method: "PUT",
		data: { grants },
	});
}

const AdminRolesRoleDetailRoute = observer(() => {
	const { roleId } = useParams<{ roleId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
	const [isEditingGrants, setIsEditingGrants] = useState(false);
	const [selectedGrantItems, setSelectedGrantItems] = useState<
		Record<string, AdminRolesRoleIdPageGrantItem>
	>({});
	const [hasChanges, setHasChanges] = useState(false);

	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data as AdminRolesRoleIdPageRole | undefined;

	const { data: abilitiesResponse, isLoading: isLoadingAbilities } =
		useGetAbilitiesByRoleId(roleId);
	const grantedAbilities =
		(abilitiesResponse?.data ?? []) as AdminRolesRoleIdPageAbility[];

	const { data: allAbilitiesResponse, isLoading: isLoadingAllAbilities } =
		useQuery({
			queryKey: ["abilities", "all"],
			queryFn: getAllAbilities,
			enabled: isEditingGrants,
		});

	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				router.push("/roles" as Route);
			},
		},
	});

	const { mutate: saveBatchGrants, isPending: isSavingGrants } = useMutation({
		mutationFn: (grants: AdminRolesRoleIdPageGrantItem[]) =>
			batchAssignGrantsToRole(roleId, grants),
		onSuccess: () => {
			setIsSaveModalOpen(false);
			setIsEditingGrants(false);
			setHasChanges(false);
			queryClient.invalidateQueries({
				queryKey: [`/api/v1/abilities/roles/${roleId}`],
			});
		},
	});

	const currentIds = new Set(grantedAbilities.map((ability) => ability.id));
	const nextIds = new Set(Object.keys(selectedGrantItems));
	const changeSummary = (() => {
		const added = [...nextIds].filter((id) => !currentIds.has(id));
		const removed = [...currentIds].filter((id) => !nextIds.has(id));
		const kept = [...nextIds].filter((id) => currentIds.has(id));
		return { added: added.length, removed: removed.length, kept: kept.length };
	})();

	const onClickEditGrantsButton = () => {
		const nextItems = Object.fromEntries(
			grantedAbilities.map((ability) => [
				ability.id,
				{
					abilityId: ability.id,
					isActive: true,
					priority: 0,
				} satisfies AdminRolesRoleIdPageGrantItem,
			]),
		);
		setSelectedGrantItems(nextItems);
		setIsEditingGrants(true);
		setHasChanges(false);
	};

	return (
		<AdminRolesRoleIdPage
			role={role}
			grantedAbilities={grantedAbilities}
			allAbilities={
				(allAbilitiesResponse?.data ?? []) as AdminRolesRoleIdPageAbility[]
			}
			selectedGrantItems={selectedGrantItems}
			changeSummary={changeSummary}
			isLoading={isLoading}
			isLoadingAbilities={isLoadingAbilities}
			isLoadingAllAbilities={isLoadingAllAbilities}
			isEditingGrants={isEditingGrants}
			hasChanges={hasChanges}
			isDeleteModalOpen={isDeleteModalOpen}
			isSaveModalOpen={isSaveModalOpen}
			isDeleting={isDeleting}
			isSavingGrants={isSavingGrants}
			onClickBackButton={() => {
				router.push("/roles" as Route);
			}}
			onClickEditButton={() => {
				router.push(`/roles/${roleId}/edit` as Route);
			}}
			onClickOpenDeleteModal={() => {
				setIsDeleteModalOpen(true);
			}}
			onCloseDeleteModal={() => {
				setIsDeleteModalOpen(false);
			}}
			onClickDeleteConfirm={() => {
				deleteRole({ id: roleId });
			}}
			onClickEditGrantsButton={onClickEditGrantsButton}
			onClickCancelEditGrantsButton={() => {
				setIsEditingGrants(false);
				setHasChanges(false);
			}}
			onToggleAbilityCheckbox={(abilityId) => {
				setSelectedGrantItems((current) => {
					const next = { ...current };
					if (next[abilityId]) {
						delete next[abilityId];
					} else {
						next[abilityId] = {
							abilityId,
							isActive: true,
							priority: 0,
						};
					}
					return next;
				});
				setHasChanges(true);
			}}
			onToggleGrantActiveSwitch={(abilityId, isActive) => {
				setSelectedGrantItems((current) => ({
					...current,
					[abilityId]: {
						...(current[abilityId] ?? {
							abilityId,
							isActive: true,
							priority: 0,
						}),
						isActive,
					},
				}));
				setHasChanges(true);
			}}
			onChangeGrantPriorityInput={(abilityId, priority) => {
				setSelectedGrantItems((current) => ({
					...current,
					[abilityId]: {
						...(current[abilityId] ?? {
							abilityId,
							isActive: true,
							priority: 0,
						}),
						priority,
					},
				}));
				setHasChanges(true);
			}}
			onClickOpenSaveGrantsModal={() => {
				setIsSaveModalOpen(true);
			}}
			onCloseSaveGrantsModal={() => {
				setIsSaveModalOpen(false);
			}}
			onClickConfirmSaveGrantsButton={() => {
				saveBatchGrants(Object.values(selectedGrantItems));
			}}
		/>
	);
});

export default AdminRolesRoleDetailRoute;
