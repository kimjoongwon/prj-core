"use client";

import {
	type AbilityResponseDto,
	useGetAbilities,
} from "@cocrepo/api/core/abilities";
import {
	getGetPolicyByIdQueryKey,
	type PolicyResponseDto,
	useDeletePolicy,
	useGetPolicyById,
	useSyncPolicyAbilities,
} from "@cocrepo/api/core/policies";
import {
	PolicyDetailPage,
	type PolicyDetailPageAbility,
	type PolicyDetailPagePolicy,
} from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui/heroui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default observer(function PolicyDetailPageRoute() {
	const { policyId } = useParams<{ policyId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditingAbilities, setIsEditingAbilities] = useState(false);
	const [selectedAbilityIds, setSelectedAbilityIds] = useState<string[]>([]);
	const [hasChanges, setHasChanges] = useState(false);
	const { data: response, isLoading } = useGetPolicyById(policyId);
	const policy = response?.data;
	const { data: abilitiesResponse, isLoading: isLoadingAbilities } =
		useGetAbilities();
	const abilities = (abilitiesResponse?.data ?? []).map(mapAbility);
	const activeSelectedAbilityIds = isEditingAbilities
		? selectedAbilityIds
		: getPolicyAbilityIds(policy);
	const { mutate: deletePolicy, isPending: isDeleting } = useDeletePolicy({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "정책 삭제 성공",
					description: "정책이 삭제되었습니다.",
					color: "success",
				});
				router.push("/policies" as Route);
			},
		},
	});
	const { mutate: syncPolicyAbilities, isPending: isSavingAbilities } =
		useSyncPolicyAbilities({
			mutation: {
				onSuccess: () => {
					addToast({
						title: "Ability 저장 성공",
						description: "정책 Ability 할당이 저장되었습니다.",
						color: "success",
					});
					setIsEditingAbilities(false);
					setHasChanges(false);
					queryClient.invalidateQueries({
						queryKey: getGetPolicyByIdQueryKey(policyId),
					});
				},
			},
		});

	const onClickBackButton = () => {
		router.push("/policies" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/policies/${policyId}/edit` as Route);
	};

	const onClickEditAbilitiesButton = () => {
		setSelectedAbilityIds(getPolicyAbilityIds(policy));
		setIsEditingAbilities(true);
		setHasChanges(false);
	};

	const onClickCancelEditAbilitiesButton = () => {
		setIsEditingAbilities(false);
		setHasChanges(false);
	};

	const onToggleAbility = (abilityId: string) => {
		setSelectedAbilityIds((current) =>
			current.includes(abilityId)
				? current.filter((id) => id !== abilityId)
				: [...current, abilityId],
		);
		setHasChanges(true);
	};

	const onClickSaveAbilitiesButton = () => {
		syncPolicyAbilities({
			policyId,
			data: { abilityIds: selectedAbilityIds },
		});
	};

	return (
		<PolicyDetailPage
			policy={policy ? mapPolicy(policy) : undefined}
			abilities={abilities}
			selectedAbilityIds={activeSelectedAbilityIds}
			isLoading={isLoading}
			isLoadingAbilities={isLoadingAbilities}
			isEditingAbilities={isEditingAbilities}
			hasChanges={hasChanges}
			isDeleteModalOpen={isDeleteModalOpen}
			isDeleting={isDeleting}
			isSavingAbilities={isSavingAbilities}
			onClickBackButton={onClickBackButton}
			onClickEditButton={onClickEditButton}
			onClickOpenDeleteModal={() => {
				setIsDeleteModalOpen(true);
			}}
			onCloseDeleteModal={() => {
				setIsDeleteModalOpen(false);
			}}
			onClickDeleteConfirm={() => {
				deletePolicy({ policyId });
			}}
			onClickEditAbilitiesButton={onClickEditAbilitiesButton}
			onClickCancelEditAbilitiesButton={onClickCancelEditAbilitiesButton}
			onToggleAbility={onToggleAbility}
			onClickSaveAbilitiesButton={onClickSaveAbilitiesButton}
		/>
	);
});

function mapAbility(ability: AbilityResponseDto): PolicyDetailPageAbility {
	return {
		id: ability.id,
		name: ability.name,
		description: ability.description,
		subject: ability.subject,
		action: ability.action,
	};
}

function mapPolicy(policy: PolicyResponseDto): PolicyDetailPagePolicy {
	return {
		id: policy.id,
		spaceId: policy.spaceId,
		name: policy.name,
		displayName: policy.displayName,
		description: policy.description,
		isSystem: policy.isSystem,
		abilityIds: getPolicyAbilityIds(policy),
		createdAt: policy.createdAt,
		updatedAt: policy.updatedAt,
	};
}

function getPolicyAbilityIds(policy?: PolicyResponseDto): string[] {
	return (
		policy?.policyAbilities?.map((policyAbility) => policyAbility.abilityId) ??
		[]
	);
}
