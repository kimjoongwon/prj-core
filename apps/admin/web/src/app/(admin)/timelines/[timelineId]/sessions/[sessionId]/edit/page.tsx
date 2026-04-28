"use client";

import {
	getGetSessionByIdQueryKey,
	UpdateSessionDtoRecurringDayOfWeek,
	useGetSessionById,
	useUpdateSession,
} from "@cocrepo/api/core/timelines";
import {
	TimelineSessionEditPage,
	type TimelineSessionPageCycleType,
	type TimelineSessionPageDayOfWeek,
	type TimelineSessionPageSessionType,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type SessionEditPageParams = {
	timelineId: string;
	sessionId: string;
};

const AdminTimelinesTimelineIdSessionsSessionIdEditRoute = observer(() => {
	const { timelineId, sessionId } = useParams<SessionEditPageParams>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const state = useLocalObservable(() => ({
		name: "",
		type: "ONE_TIME" as TimelineSessionPageSessionType,
		originalType: "ONE_TIME" as TimelineSessionPageSessionType,
		description: "",
		startDateTime: "",
		endDateTime: "",
		recurringDayOfWeek: null as TimelineSessionPageDayOfWeek | null,
		repeatCycleType: "" as TimelineSessionPageCycleType | "",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	const { data: response } = useGetSessionById(timelineId, sessionId);
	const session = response?.data;

	useEffect(() => {
		if (session && !state.isInitialized) {
			state.name = session.name;
			state.type = session.type as TimelineSessionPageSessionType;
			state.originalType = session.type as TimelineSessionPageSessionType;
			state.description = session.description ?? "";
			state.startDateTime = session.startDateTime ?? "";
			state.endDateTime = session.endDateTime ?? "";
			state.recurringDayOfWeek =
				(session.recurringDayOfWeek as TimelineSessionPageDayOfWeek) ?? null;
			state.repeatCycleType =
				(session.repeatCycleType as TimelineSessionPageCycleType) ?? "";
			state.isInitialized = true;
		}
	}, [session, state]);

	const { mutate: updateSession, isPending } = useUpdateSession();

	const onClickCancelButton = () => {
		router.push(`/timelines/${timelineId}/sessions/${sessionId}` as Route);
	};

	const onChangeNameInput = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeTypeSelect = (value: string) => {
		const newType = value as TimelineSessionPageSessionType;
		const previousType = state.type;
		state.type = newType;
		if (newType !== previousType) {
			state.startDateTime = "";
			state.endDateTime = "";
			state.recurringDayOfWeek = null;
			state.repeatCycleType = "";
		} else if (newType === state.originalType) {
			state.startDateTime = session?.startDateTime ?? "";
			state.endDateTime = session?.endDateTime ?? "";
			state.recurringDayOfWeek =
				(session?.recurringDayOfWeek as UpdateSessionDtoRecurringDayOfWeek) ??
				null;
			state.repeatCycleType =
				(session?.repeatCycleType as TimelineSessionPageCycleType) ?? "";
		}
		state.errors = {};
	};

	const onChangeDescriptionTextarea = (value: string) => {
		state.description = value;
	};

	const onChangeStartDateTimeInput = (value: string) => {
		state.startDateTime = value;
		delete state.errors.startDateTime;
	};

	const onChangeEndDateTimeInput = (value: string) => {
		state.endDateTime = value;
		delete state.errors.endDateTime;
	};

	const onChangeDayOfWeekSelect = (value: string) => {
		state.recurringDayOfWeek = value as UpdateSessionDtoRecurringDayOfWeek;
		delete state.errors.recurringDayOfWeek;
	};

	const onChangeCycleTypeSelect = (value: string) => {
		state.repeatCycleType = value as TimelineSessionPageCycleType;
		delete state.errors.repeatCycleType;
	};

	const onClickSubmitButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "세션명을 입력해주세요.";
		} else if (state.name.trim().length > 100) {
			errors.name = "세션명은 100자 이하로 입력해주세요.";
		}
		if (state.type === "ONE_TIME" && !state.startDateTime) {
			errors.startDateTime = "일시를 입력해주세요.";
		}
		if (state.type === "ONE_TIME_RANGE") {
			if (!state.startDateTime)
				errors.startDateTime = "시작 일시를 입력해주세요.";
			if (!state.endDateTime) errors.endDateTime = "종료 일시를 입력해주세요.";
			if (
				state.startDateTime &&
				state.endDateTime &&
				state.startDateTime >= state.endDateTime
			) {
				errors.endDateTime = "종료 일시는 시작 일시 이후여야 합니다.";
			}
		}
		if (state.type === "RECURRING") {
			if (!state.recurringDayOfWeek) {
				errors.recurringDayOfWeek = "반복 요일을 선택해주세요.";
			}
			if (!state.repeatCycleType) {
				errors.repeatCycleType = "반복 주기를 선택해주세요.";
			}
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateSession(
			{
				timelineId,
				sessionId,
				data: {
					name: state.name.trim(),
					type: state.type,
					description: state.description.trim() || undefined,
					startDateTime: state.startDateTime || undefined,
					endDateTime: state.endDateTime || undefined,
					recurringDayOfWeek: state.recurringDayOfWeek || undefined,
					repeatCycleType: state.repeatCycleType || undefined,
				},
			},
			{
				onSuccess: () => {
					addToast({
						title: "수정 성공",
						description: "세션이 수정되었습니다.",
						color: "success",
					});
					queryClient.invalidateQueries({
						queryKey: getGetSessionByIdQueryKey(timelineId, sessionId),
					});
					router.push(
						`/timelines/${timelineId}/sessions/${sessionId}` as Route,
					);
				},
				onError: () => {
					addToast({
						title: "수정 실패",
						description: "세션 수정 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	const hasChanged =
		state.isInitialized &&
		(state.name !== (session?.name ?? "") ||
			state.type !== (session?.type ?? "") ||
			state.description !== (session?.description ?? "") ||
			state.startDateTime !== (session?.startDateTime ?? "") ||
			state.endDateTime !== (session?.endDateTime ?? "") ||
			state.recurringDayOfWeek !== (session?.recurringDayOfWeek ?? null) ||
			state.repeatCycleType !== (session?.repeatCycleType ?? ""));

	return (
		<TimelineSessionEditPage
			descriptionText={session?.name}
			name={state.name}
			type={state.type}
			description={state.description}
			startDateTime={state.startDateTime}
			endDateTime={state.endDateTime}
			recurringDayOfWeek={state.recurringDayOfWeek}
			repeatCycleType={state.repeatCycleType}
			errors={state.errors}
			isSubmitPending={isPending}
			isSubmitDisabled={!hasChanged || !state.name.trim()}
			onChangeNameInput={onChangeNameInput}
			onChangeTypeSelect={onChangeTypeSelect}
			onChangeDescriptionTextarea={onChangeDescriptionTextarea}
			onChangeStartDateTimeInput={onChangeStartDateTimeInput}
			onChangeEndDateTimeInput={onChangeEndDateTimeInput}
			onChangeDayOfWeekSelect={onChangeDayOfWeekSelect}
			onChangeCycleTypeSelect={onChangeCycleTypeSelect}
			onClickCancelButton={onClickCancelButton}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

export default AdminTimelinesTimelineIdSessionsSessionIdEditRoute;
