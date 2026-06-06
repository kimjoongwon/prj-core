"use client";

import {
	type AbilityResponseDto,
	useGetAbilities,
} from "@cocrepo/api/core/abilities";
import {
	useCreatePolicy,
	useSyncPolicyAbilities,
} from "@cocrepo/api/core/policies";
import {
	PolicyCreatePage,
	type PolicyCreatePageAbilityOption,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function PolicyCreatePageRoute() {
	const router = useRouter();
	const state = useLocalObservable(() => ({
		name: "",
		displayName: "",
		description: "",
		isSystem: false,
		abilityIds: [] as string[],
	}));
	const { data: abilitiesResponse } = useGetAbilities();
	const abilities = (abilitiesResponse?.data ?? []).map(mapAbilityOption);
	const { mutate: syncPolicyAbilities, isPending: isSyncingAbilities } =
		useSyncPolicyAbilities();
	const { mutate: createPolicy, isPending } = useCreatePolicy({
		mutation: {
			onSuccess: (response) => {
				const createdPolicy = response.data;
				if (!createdPolicy) {
					toast.danger("정책 등록 실패", {
						description: "생성된 정책 정보를 확인할 수 없습니다.",
					});
					return;
				}
				if (state.abilityIds.length === 0) {
					showCreateSuccessToast();
					router.push(`/policies/${createdPolicy.id}` as Route);
					return;
				}
				syncPolicyAbilities(
					{
						policyId: createdPolicy.id,
						data: { abilityIds: state.abilityIds },
					},
					{
						onSuccess: () => {
							showCreateSuccessToast();
							router.push(`/policies/${createdPolicy.id}` as Route);
						},
					},
				);
			},
			onError: (error) => {
				toast.danger("정책 등록 실패", { description: error.message });
			},
		},
	});

	const onClickBackButton = () => {
		router.push("/policies" as Route);
	};

	const onClickSubmitButton = () => {
		if (!state.name.trim()) {
			toast.danger("입력 오류", { description: "정책 이름을 입력해주세요." });
			return;
		}
		createPolicy({
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
		<PolicyCreatePage
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

function showCreateSuccessToast() {
	toast.success("정책 등록 성공", { description: "정책이 생성되었습니다." });
}
