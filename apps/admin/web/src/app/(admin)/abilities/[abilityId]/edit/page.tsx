"use client";

import {
	type UpdateAbilityDto,
	useGetAbilityById,
	useUpdateAbility,
} from "@cocrepo/api/core/abilities";
import { useGetActions } from "@cocrepo/api/core/actions";
import { useGetSubjects } from "@cocrepo/api/core/subjects";
import { AbilityEditScreen, type AbilityFormState, Button } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function AbilityEditPage() {
	const abilityId = useParams().abilityId as string;
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

	const { data: response, isLoading } = useGetAbilityById(abilityId);
	const ability = response?.data;
	const { data: subjectsResponse, isLoading: isSubjectsLoading } =
		useGetSubjects();
	const { data: actionsResponse, isLoading: isActionsLoading } =
		useGetActions();

	const { mutate: updateAbility, isPending } = useUpdateAbility({
		mutation: {
			onSuccess: () => {
				toast.success("권한 수정 성공", {
					description: "권한이 성공적으로 수정되었습니다.",
				});
				router.push(`/abilities/${abilityId}` as Route);
			},
			onError: (error) => {
				toast.danger("권한 수정 실패", {
					description: error.message || "권한 수정 중 오류가 발생했습니다.",
				});
			},
		},
	});

	useEffect(() => {
		if (!ability) {
			return;
		}
		state.name = ability.name;
		state.description = ability.description || "";
		state.subjectId = ability.subjectId;
		state.actionId = ability.actionId;
		state.fields = ability.fields.join(", ");
		state.conditions = ability.conditions
			? JSON.stringify(ability.conditions, null, 2)
			: "";
		state.inverted = ability.inverted;
		state.reason = ability.reason || "";
	}, [ability, state]);

	const onSubmit = () => {
		if (!state.description.trim() && !state.subjectId && !state.actionId) {
			toast.danger("입력 오류", {
				description: "최소 하나 이상의 필드를 수정해주세요.",
			});
			return;
		}

		const dto = toUpdateAbilityDto(state);
		if (!dto) {
			return;
		}

		updateAbility({ id: abilityId, data: dto });
	};

	return (
		<AbilityEditScreen
			title="Ability 수정"
			description={
				ability
					? `${ability.name} Ability를 수정합니다.`
					: "Ability를 찾을 수 없습니다."
			}
			state={ability ? state : undefined}
			subjects={(subjectsResponse?.data ?? []).map((subject) => ({
				id: subject.id,
				label: `${subject.displayName || subject.name}${subject.group ? ` (${subject.group})` : ""}`,
			}))}
			actions={(actionsResponse?.data ?? []).map((action) => ({
				id: action.id,
				label: `${action.displayName || action.name}${action.group ? ` (${action.group})` : ""}`,
			}))}
			isLoading={isLoading || isSubjectsLoading || isActionsLoading}
			notFound={!isLoading && !ability}
			notFoundAction={
				<Button
					variant="flat"
					onPress={() => {
						router.push("/abilities" as Route);
					}}
				>
					목록으로
				</Button>
			}
			pageActions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/abilities/${abilityId}` as Route);
						}}
					>
						취소
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						저장
					</Button>
				</div>
			}
		/>
	);
});

function toUpdateAbilityDto(state: AbilityFormState): UpdateAbilityDto | null {
	const fieldsArray = state.fields
		.split(",")
		.map((field) => field.trim())
		.filter((field) => field.length > 0);

	let conditionsObject: Record<string, string | number | boolean> | undefined;
	if (state.conditions.trim()) {
		try {
			conditionsObject = JSON.parse(state.conditions);
		} catch {
			toast.danger("입력 오류", {
				description: "Conditions는 유효한 JSON 형식이어야 합니다.",
			});
			return null;
		}
	}

	return {
		description: state.description.trim() || undefined,
		subjectId: state.subjectId || undefined,
		actionId: state.actionId || undefined,
		fields: fieldsArray,
		conditions: conditionsObject,
		inverted: state.inverted,
		reason: state.inverted ? state.reason.trim() || undefined : undefined,
	};
}
