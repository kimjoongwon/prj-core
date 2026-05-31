"use client";

import {
	type AbilityResponseDto,
	useGetAbilities,
} from "@cocrepo/api/core/abilities";
import {
	getGetPolicyByIdQueryKey,
	type PolicyResponseDto,
	useGetPolicyById,
	useSyncPolicyAbilities,
	useUpdatePolicy,
} from "@cocrepo/api/core/policies";
import {
	type PolicyCreatePageAbilityOption,
	PolicyEditPage,
} from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function PolicyEditPageRoute() {
	const { policyId } = useParams<{ policyId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const state = useLocalObservable(() => ({
		name: "",
		displayName: "",
		description: "",
		isSystem: false,
		abilityIds: [] as string[],
		isHydrated: false,
	}));
	const { data: response, isLoading } = useGetPolicyById(policyId);
	const policy = response?.data;
	const { data: abilitiesResponse } = useGetAbilities();
	const abilities = (abilitiesResponse?.data ?? []).map(mapAbilityOption);
	const { mutate: syncPolicyAbilities, isPending: isSyncingAbilities } =
		useSyncPolicyAbilities();
	const { mutate: updatePolicy, isPending } = useUpdatePolicy({
		mutation: {
			onSuccess: () => {
				syncPolicyAbilities(
					{
						policyId,
						data: { abilityIds: state.abilityIds },
					},
					{
						onSuccess: () => {
							queryClient.invalidateQueries({
								queryKey: getGetPolicyByIdQueryKey(policyId),
							});
							addToast({
								title: "정책 수정 성공",
								description: "정책이 수정되었습니다.",
								color: "success",
							});
							router.push(`/policies/${policyId}` as Route);
						},
					},
				);
			},
			onError: (error) => {
				addToast({
					title: "정책 수정 실패",
					description: error.message,
					color: "danger",
				});
			},
		},
	});

	useEffect(() => {
		if (!policy || state.isHydrated) {
			return;
		}
		state.name = policy.name;
		state.displayName = policy.displayName || "";
		state.description = policy.description || "";
		state.isSystem = policy.isSystem;
		state.abilityIds = getPolicyAbilityIds(policy);
		state.isHydrated = true;
	}, [policy, state]);

	const onClickBackButton = () => {
		router.push(`/policies/${policyId}` as Route);
	};

	const onClickSubmitButton = () => {
		updatePolicy({
			policyId,
			data: {
				name: state.name.trim(),
				displayName: state.displayName.trim() || undefined,
				description: state.description.trim() || undefined,
				isSystem: state.isSystem,
			},
		});
	};

	const onToggleAbility = (abilityId: string) => {
		state.abilityIds = state.abilityIds.includes(abilityId)
			? state.abilityIds.filter((id) => id !== abilityId)
			: [...state.abilityIds, abilityId];
	};

	return (
		<PolicyEditPage
			status={isLoading ? "loading" : policy ? "ready" : "not_found"}
			form={state}
			abilities={abilities}
			isSubmitting={isPending || isSyncingAbilities}
			onClickBackButton={onClickBackButton}
			onClickSubmitButton={onClickSubmitButton}
			onChange={{
				onChangeName: (value) => {
					state.name = value;
				},
				onChangeDisplayName: (value) => {
					state.displayName = value;
				},
				onChangeDescription: (value) => {
					state.description = value;
				},
				onChangeIsSystem: (value) => {
					state.isSystem = value;
				},
				onToggleAbility,
			}}
		/>
	);
});

function mapAbilityOption(
	ability: AbilityResponseDto,
): PolicyCreatePageAbilityOption {
	const subject =
		ability.subject?.displayName || ability.subject?.name || "Subject";
	const action =
		ability.action?.displayName || ability.action?.name || "Action";
	return {
		id: ability.id,
		label: `${subject} / ${action}`,
		description: ability.description,
	};
}

function getPolicyAbilityIds(policy?: PolicyResponseDto): string[] {
	return (
		policy?.policyAbilities?.map((policyAbility) => policyAbility.abilityId) ??
		[]
	);
}
