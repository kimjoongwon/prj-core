"use client";

import {
	type CreateAbilityDto,
	useCreateAbility,
} from "@cocrepo/api/core/abilities";
import { useGetActions } from "@cocrepo/api/core/actions";
import { useGetSubjects } from "@cocrepo/api/core/subjects";
import { AbilityFormPage } from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function AbilityNewPage() {
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
	}));

	const { data: subjectsResponse, isLoading: isSubjectsLoading } =
		useGetSubjects();
	const { data: actionsResponse, isLoading: isActionsLoading } =
		useGetActions();

	const { mutate: createAbility, isPending } = useCreateAbility({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "권한 등록 성공",
					description: "권한이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const abilityId = response?.data?.id;
				if (abilityId) {
					router.push(`/abilities/${abilityId}` as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "권한 등록 실패",
					description: error.message || "권한 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const onClickCreateButton = () => {
		if (!state.name.trim()) {
			addToast({
				title: "입력 오류",
				description: "권한 이름을 입력해주세요.",
				color: "danger",
			});
			return;
		}

		if (!state.subjectId) {
			addToast({
				title: "입력 오류",
				description: "Subject를 선택해주세요.",
				color: "danger",
			});
			return;
		}

		if (!state.actionId) {
			addToast({
				title: "입력 오류",
				description: "Action을 선택해주세요.",
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

		const dto: CreateAbilityDto = {
			name: state.name.trim(),
			description: state.description.trim() || undefined,
			subjectId: state.subjectId,
			actionId: state.actionId,
			fields: fieldsArray,
			conditions: conditionsObject,
			inverted: state.inverted,
			reason: state.inverted ? state.reason.trim() || undefined : undefined,
			isActive: true,
			priority: 0,
		};

		createAbility({ data: dto });
	};

	return (
		<AbilityFormPage
			status={isSubjectsLoading || isActionsLoading ? "loading" : "ready"}
			mode="create"
			title="권한 등록"
			description="새로운 CASL 권한을 등록합니다."
			backButtonLabel="목록으로"
			submitButtonLabel="등록"
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
				router.push("/abilities" as Route);
			}}
			onClickSubmitButton={onClickCreateButton}
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
