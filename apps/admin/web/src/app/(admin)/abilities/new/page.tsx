"use client";

import {
	type CreateAbilityDto,
	useCreateAbility,
} from "@cocrepo/api/core/abilities";
import { useGetActions } from "@cocrepo/api/core/actions";
import { useGetSubjects } from "@cocrepo/api/core/subjects";
import { AbilityEditScreen, type AbilityFormState, Button } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function AbilityNewPage() {
	const router = useRouter();
	const state = useLocalObservable<AbilityFormState>(() => ({
		name: "",
		description: "",
		subjectId: "",
		actionId: "",
		fields: "",
		conditions: "",
		inverted: false,
		reason: "",
	}));

	const { data: subjectsResponse, isLoading: isSubjectsLoading } =
		useGetSubjects();
	const { data: actionsResponse, isLoading: isActionsLoading } =
		useGetActions();

	const { mutate: createAbility, isPending } = useCreateAbility({
		mutation: {
			onSuccess: (response) => {
				toast.success("권한 등록 성공", {
					description: "권한이 성공적으로 등록되었습니다.",
				});
				const abilityId = response?.data?.id;
				if (abilityId) {
					router.push(`/abilities/${abilityId}` as Route);
				}
			},
			onError: (error) => {
				toast.danger("권한 등록 실패", {
					description: error.message || "권한 등록 중 오류가 발생했습니다.",
				});
			},
		},
	});

	const onSubmit = () => {
		if (!state.name.trim()) {
			toast.danger("입력 오류", { description: "권한 이름을 입력해주세요." });
			return;
		}

		if (!state.subjectId) {
			toast.danger("입력 오류", { description: "Subject를 선택해주세요." });
			return;
		}

		if (!state.actionId) {
			toast.danger("입력 오류", { description: "Action을 선택해주세요." });
			return;
		}

		const dto = toCreateAbilityDto(state, () => {
			toast.danger("입력 오류", {
				description: "Conditions는 유효한 JSON 형식이어야 합니다.",
			});
		});
		if (!dto) {
			return;
		}

		createAbility({ data: dto });
	};

	return (
		<AbilityEditScreen
			title="Ability 등록"
			description="새로운 CASL Ability를 등록합니다."
			state={state}
			subjects={(subjectsResponse?.data ?? []).map((subject) => ({
				id: String(subject.id),
				label: `${subject.displayName || subject.name}${subject.group ? ` (${subject.group})` : ""}`,
			}))}
			actions={(actionsResponse?.data ?? []).map((action) => ({
				id: String(action.id),
				label: `${action.displayName || action.name}${action.group ? ` (${action.group})` : ""}`,
			}))}
			isLoading={isSubjectsLoading || isActionsLoading}
			pageActions={
				<div className="flex gap-2">
					<Button
						variant="tertiary"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/abilities" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						등록
					</Button>
				</div>
			}
		/>
	);
});

function toCreateAbilityDto(
	state: AbilityFormState,
	onInvalidConditions: () => void,
): CreateAbilityDto | null {
	const fieldsArray = state.fields
		.split(",")
		.map((field) => field.trim())
		.filter((field) => field.length > 0);

	let conditionsObject: Record<string, string | number | boolean> | undefined;
	if (state.conditions.trim()) {
		try {
			conditionsObject = JSON.parse(state.conditions);
		} catch {
			onInvalidConditions();
			return null;
		}
	}

	const subjectId = parsePositiveBigInt(state.subjectId);
	const actionId = parsePositiveBigInt(state.actionId);
	if (subjectId === undefined || actionId === undefined) {
		onInvalidConditions();
		return null;
	}

	return {
		name: state.name.trim(),
		description: state.description.trim() || undefined,
		subjectId,
		actionId,
		fields: fieldsArray,
		conditions: conditionsObject,
		inverted: state.inverted,
		reason: state.inverted ? state.reason.trim() || undefined : undefined,
	};
}

function parsePositiveBigInt(value: string): bigint | undefined {
	const trimmedValue = value.trim();
	return /^[1-9]\d*$/.test(trimmedValue) ? BigInt(trimmedValue) : undefined;
}
