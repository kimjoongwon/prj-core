"use client";

import {
	type UpdateAbilityDto,
	useGetAbilityById,
	useUpdateAbility,
} from "@cocrepo/api/core/abilities";
import { useGetActions } from "@cocrepo/api/core/actions";
import { useGetSubjects } from "@cocrepo/api/core/subjects";
import { AbilityFormPage } from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function AbilityEditPage() {
	const abilityId = useParams().abilityId as string;
	const router = useRouter();
	const state = useLocalObservable(() => ({
		name: "",
		description: "",
		subjectId: "",
		actionId: "",
		fields: "",
		conditions: "",
		inverted: false,
		reason: "",
		isInitialized: false,
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
				addToast({
					title: "권한 수정 성공",
					description: "권한이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/abilities/${abilityId}` as Route);
			},
			onError: (error) => {
				addToast({
					title: "권한 수정 실패",
					description: error.message || "권한 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	useEffect(() => {
		if (ability && !state.isInitialized) {
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
			state.isInitialized = true;
		}
	}, [ability, state]);

	const onClickSaveButton = () => {
		if (!state.description.trim() && !state.subjectId && !state.actionId) {
			addToast({
				title: "입력 오류",
				description: "최소 하나 이상의 필드를 수정해주세요.",
				color: "danger",
			});
			return;
		}

		const fieldsArray = state.fields
			.split(",")
			.map((field) => field.trim())
			.filter((field) => field.length > 0);

		let conditionsObject: Record<string, string | number | boolean> | undefined;
		if (state.conditions.trim()) {
			try {
				conditionsObject = JSON.parse(state.conditions);
			} catch {
				addToast({
					title: "입력 오류",
					description: "Conditions는 유효한 JSON 형식이어야 합니다.",
					color: "danger",
				});
				return;
			}
		}

		const dto: UpdateAbilityDto = {
			description: state.description.trim() || undefined,
			subjectId: state.subjectId || undefined,
			actionId: state.actionId || undefined,
			fields: fieldsArray,
			conditions: conditionsObject,
			inverted: state.inverted,
			reason: state.inverted ? state.reason.trim() || undefined : undefined,
		};

		updateAbility({ id: abilityId, data: dto });
	};

	if (isLoading || isSubjectsLoading || isActionsLoading) {
		return (
			<AbilityFormPage
				status="loading"
				mode="edit"
				title="권한 수정"
				description="권한 정보를 수정합니다."
			/>
		);
	}

	if (!ability) {
		return (
			<AbilityFormPage
				status="not_found"
				mode="edit"
				title="권한 수정"
				description="권한 정보를 수정합니다."
				onClickNotFoundBackButton={() => {
					router.push("/abilities" as Route);
				}}
			/>
		);
	}

	return (
		<AbilityFormPage
			status="ready"
			mode="edit"
			title="권한 수정"
			description="권한 정보를 수정합니다."
			backButtonLabel="취소"
			submitButtonLabel="저장"
			isSubmitting={isPending}
			form={{
				name: state.name,
				description: state.description,
				subjectId: state.subjectId,
				actionId: state.actionId,
				fields: state.fields,
				conditions: state.conditions,
				inverted: state.inverted,
				reason: state.reason,
			}}
			subjects={(subjectsResponse?.data ?? []).map((subject) => ({
				id: subject.id,
				label: `${subject.displayName || subject.name}${subject.group ? ` (${subject.group})` : ""}`,
			}))}
			actions={(actionsResponse?.data ?? []).map((action) => ({
				id: action.id,
				label: `${action.displayName || action.name}${action.group ? ` (${action.group})` : ""}`,
			}))}
			onClickBackButton={() => {
				router.push(`/abilities/${abilityId}` as Route);
			}}
			onClickSubmitButton={onClickSaveButton}
			onChange={{
				onChangeName: (value) => {
					state.name = value;
				},
				onChangeDescription: (value) => {
					state.description = value;
				},
				onChangeSubjectId: (value) => {
					state.subjectId = value;
				},
				onChangeActionId: (value) => {
					state.actionId = value;
				},
				onChangeFields: (value) => {
					state.fields = value;
				},
				onChangeConditions: (value) => {
					state.conditions = value;
				},
				onChangeInverted: (value) => {
					state.inverted = value;
				},
				onChangeReason: (value) => {
					state.reason = value;
				},
			}}
		/>
	);
});
