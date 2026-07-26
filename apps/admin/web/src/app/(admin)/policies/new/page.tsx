"use client";

import {
	type AbilityResponseDto,
	useGetAbilities,
} from "@cocrepo/api/core/abilities";
import {
	useCreatePolicy,
	useSyncPolicyEntries,
} from "@cocrepo/api/core/policies";
import { Button, PolicyEditScreen, type PolicyEntryOption } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function PolicyCreateRoute() {
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
	const showCreateSuccessToast = () => {
		toast.success("정책 등록 성공", { description: "정책이 생성되었습니다." });
	};
	const { mutate: syncPolicyEntries, isPending: isSyncingAbilities } =
		useSyncPolicyEntries();
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
				syncPolicyEntries(
					{
						policyId: createdPolicy.id,
						data: {
							entries: state.abilityIds.map((abilityId) => ({
								abilityId,
							})),
						},
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

	return (
		<PolicyEditScreen
			title="정책 등록"
			description="역할과 사용자에게 할당할 정책을 생성합니다."
			state={state}
			abilities={abilities}
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/policies" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending || isSyncingAbilities}
						onPress={onClickSubmitButton}
					>
						등록
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
