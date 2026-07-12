"use client";

import {
	type AbilityResponseDto,
	useGetAbilities,
} from "@cocrepo/api/core/abilities";
import {
	type PolicyResponseDto,
	useDeletePolicy,
	useGetPolicyById,
} from "@cocrepo/api/core/policies";
import {
	Button,
	type PolicyAbilityOption,
	PolicyEditScreen,
	type PolicyFormState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function PolicyDetailRoute() {
	const { policyId } = useParams<{ policyId: string }>();
	const router = useRouter();
	const { data: response, isLoading } = useGetPolicyById(policyId);
	const policy = response?.data;
	const { data: abilitiesResponse } = useGetAbilities();
	const abilities = (abilitiesResponse?.data ?? []).map(mapAbilityOption);
	const { mutate: deletePolicy, isPending: isDeleting } = useDeletePolicy({
		mutation: {
			onSuccess: () => {
				toast.success("정책 삭제 성공", {
					description: "정책이 삭제되었습니다.",
				});
				router.push("/policies" as Route);
			},
		},
	});
	const state = policy ? mapPolicyFormState(policy) : undefined;

	return (
		<PolicyEditScreen
			title={
				policy ? `정책 상세: ${policy.displayName || policy.name}` : "정책 상세"
			}
			description={
				policy?.description || "정책에 연결된 Ability와 공간 범위를 확인합니다."
			}
			state={state}
			abilities={abilities}
			readOnly
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
				<div className="flex flex-wrap gap-2">
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/policies" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="flat"
						startContent={<Edit className="h-4 w-4" />}
						onPress={() => {
							router.push(`/policies/${policyId}/edit` as Route);
						}}
					>
						수정
					</Button>
					<Button
						color="danger"
						variant="flat"
						startContent={<Trash2 className="h-4 w-4" />}
						isDisabled={!policy || isDeleting}
						isLoading={isDeleting}
						onPress={() => {
							deletePolicy({ policyId });
						}}
					>
						삭제
					</Button>
				</div>
			}
		/>
	);
});

function mapAbilityOption(ability: AbilityResponseDto): PolicyAbilityOption {
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

function mapPolicyFormState(policy: PolicyResponseDto): PolicyFormState {
	return {
		name: policy.name,
		displayName: policy.displayName ?? "",
		description: policy.description ?? "",
		isSystem: policy.isSystem,
		abilityIds: getPolicyAbilityIds(policy),
	};
}

function getPolicyAbilityIds(policy?: PolicyResponseDto): string[] {
	return (
		policy?.policyAbilities?.map((policyAbility) => policyAbility.abilityId) ??
		[]
	);
}
