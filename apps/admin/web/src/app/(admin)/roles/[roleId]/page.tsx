"use client";

import {
	type AbilityResponseDto,
	getGetAbilitiesByRoleIdQueryKey,
	useGetAbilities,
	useGetAbilitiesByRoleId,
} from "@cocrepo/api/core/abilities";
import { useBatchAssignGrantsToRole } from "@cocrepo/api/core/grants";
import { useDeleteRole, useGetRoleById } from "@cocrepo/api/core/roles";
import {
	AdminRolesRoleIdPage,
	type AdminRolesRoleIdPageAbility,
	type AdminRolesRoleIdPageGrantItem,
	type AdminRolesRoleIdPageRole,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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
	const grantedAbilities = (abilitiesResponse?.data ?? []).map(mapAbilityItem);

	const { data: allAbilitiesResponse, isLoading: isLoadingAllAbilities } =
		useGetAbilities({
			query: {
				enabled: isEditingGrants,
			},
		});
	const allAbilities = (allAbilitiesResponse?.data ?? []).map(mapAbilityItem);

	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				router.push("/roles" as Route);
			},
		},
	});

	const { mutate: saveBatchGrants, isPending: isSavingGrants } =
		useBatchAssignGrantsToRole({
			mutation: {
				onSuccess: () => {
					setIsSaveModalOpen(false);
					setIsEditingGrants(false);
					setHasChanges(false);
					queryClient.invalidateQueries({
						queryKey: getGetAbilitiesByRoleIdQueryKey(roleId),
					});
				},
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
			allAbilities={allAbilities}
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
				saveBatchGrants({
					roleId,
					data: {
						grants: Object.values(selectedGrantItems),
					},
				});
			}}
		/>
	);
});

function mapAbilityItem(
	ability: AbilityResponseDto,
): AdminRolesRoleIdPageAbility {
	return {
		id: ability.id,
		name: ability.name,
		description: ability.description ?? undefined,
		subjectId: ability.subjectId,
		actionId: ability.actionId,
		fields: ability.fields,
		inverted: ability.inverted,
		reason: ability.reason ?? undefined,
		subject: ability.subject
			? {
					id: ability.subjectId,
					name: ability.subject.name,
					displayName: ability.subject.displayName ?? undefined,
				}
			: undefined,
		action: ability.action
			? {
					id: ability.actionId,
					name: ability.action.name,
					displayName: ability.action.displayName ?? undefined,
				}
			: undefined,
	};
}

export default AdminRolesRoleDetailRoute;
