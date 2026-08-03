"use client";

import {
	type AbilityResponseDto,
	useGetAbilities,
} from "@cocrepo/api/core/abilities";
import {
	getGetPolicyByIdQueryKey,
	type PolicyResponseDto,
	useGetPolicyById,
	useSyncPolicyEntries,
	useUpdatePolicy,
} from "@cocrepo/api/core/policies";
import { Button, PolicyEditScreen, type PolicyEntryOption } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function PolicyEditScreenRoute() {
	const { policyId } = useParams<{ policyId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const state = useLocalObservable(() => ({
		name: "",
		displayName: "",
		description: "",
		abilityIds: [] as string[],
		isHydrated: false,
	}));
	const { data: response, isLoading } = useGetPolicyById(policyId);
	const policy = response?.data;
	const { data: abilitiesResponse } = useGetAbilities();
	const abilities = (abilitiesResponse?.data ?? []).map(mapAbilityOption);
	const { mutate: syncPolicyEntries, isPending: isSyncingAbilities } =
		useSyncPolicyEntries();
	const { mutate: updatePolicy, isPending } = useUpdatePolicy({
		mutation: {
			onSuccess: () => {
				syncPolicyEntries(
					{
						policyId,
						data: {
							entries: state.abilityIds.map((abilityId) => ({
								abilityId,
							})),
						},
					},
					{
						onSuccess: () => {
							queryClient.invalidateQueries({
								queryKey: getGetPolicyByIdQueryKey(policyId),
							});
							queryClient.invalidateQueries({
								predicate: ({ queryKey }) => {
									const key = String(queryKey[0]);
									return (
										(key.includes("/api/v1/roles/") &&
											key.includes("/assignments")) ||
										(key.includes("/api/v1/users/") &&
											key.includes("/tenants/"))
									);
								},
							});
							toast.success("정책 수정 성공", {
								description: "정책이 수정되었습니다.",
							});
							router.push(`/policies/${policyId}` as Route);
						},
					},
				);
			},
			onError: (error) => {
				toast.danger("정책 수정 실패", { description: error.message });
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
		state.abilityIds = getPolicyEntryIds(policy);
		state.isHydrated = true;
	}, [policy, state]);

	const onClickSubmitButton = () => {
		updatePolicy({
			policyId,
			data: {
				name: state.name.trim(),
				displayName: state.displayName.trim() || undefined,
				description: state.description.trim() || undefined,
			},
		});
	};

	return (
		<PolicyEditScreen
			title="정책 수정"
			description="정책 기본 정보와 연결 Ability를 수정합니다."
			state={policy ? state : undefined}
			abilities={abilities}
			isLoading={isLoading}
			notFound={!isLoading && !policy}
			notFoundAction={
				<Button
					variant="flat"
					onPress={() => {
						router.push("/policies" as Route);
					}}
				>
					목록으로
				</Button>
			}
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/policies/${policyId}` as Route);
						}}
					>
						상세로 돌아가기
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending || isSyncingAbilities}
						onPress={onClickSubmitButton}
					>
						저장
					</Button>
				</div>
			}
		/>
	);
});

function mapAbilityOption(ability: AbilityResponseDto): PolicyEntryOption {
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

function getPolicyEntryIds(policy?: PolicyResponseDto): string[] {
	return policy?.entries?.map((policyEntry) => policyEntry.abilityId) ?? [];
}
