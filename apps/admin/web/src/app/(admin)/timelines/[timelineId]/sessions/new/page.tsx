"use client";

import {
	CreateSessionDtoRecurringDayOfWeek,
	useCreateSession,
	useGetTimelineById,
} from "@cocrepo/api/core/timelines";
import {
	TimelineSessionCreatePage,
	type TimelineSessionPageCycleType,
	type TimelineSessionPageDayOfWeek,
	type TimelineSessionPageSessionType,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

type SessionNewPageParams = {
	timelineId: string;
};

const AdminTimelinesTimelineIdSessionsNewRoute = observer(() => {
	const { timelineId } = useParams<SessionNewPageParams>();
	const router = useRouter();
	const state = useLocalObservable(() => ({
		name: "",
		type: "ONE_TIME" as TimelineSessionPageSessionType,
		description: "",
		startDateTime: "",
		endDateTime: "",
		recurringDayOfWeek: null as TimelineSessionPageDayOfWeek | null,
		repeatCycleType: "" as TimelineSessionPageCycleType | "",
		errors: {} as Record<string, string>,
	}));

	const { data: timelineResponse } = useGetTimelineById(timelineId);
	const timeline = timelineResponse?.data;
	const { mutate: createSession, isPending } = useCreateSession();

	const onClickCancelButton = () => {
		router.push(`/timelines/${timelineId}` as Route);
	};

	const onChangeNameInput = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeTypeSelect = (value: string) => {
		state.type = value as TimelineSessionPageSessionType;
		state.startDateTime = "";
		state.endDateTime = "";
		state.recurringDayOfWeek = null;
		state.repeatCycleType = "";
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
		state.recurringDayOfWeek = value as CreateSessionDtoRecurringDayOfWeek;
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

		createSession(
			{
				timelineId,
				data: {
					name: state.name.trim(),
					type: state.type,
					timelineId,
					description: state.description.trim() || undefined,
					startDateTime: state.startDateTime || undefined,
					endDateTime: state.endDateTime || undefined,
					recurringDayOfWeek: state.recurringDayOfWeek || undefined,
					repeatCycleType: state.repeatCycleType || undefined,
				},
			},
			{
				onSuccess: (response) => {
					addToast({
						title: "등록 성공",
						description: "세션이 등록되었습니다.",
						color: "success",
					});
					const newId = response.data?.id;
					router.push(
						(newId
							? `/timelines/${timelineId}/sessions/${newId}`
							: `/timelines/${timelineId}`) as Route,
					);
				},
				onError: () => {
					addToast({
						title: "등록 실패",
						description: "세션 등록 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	return (
		<TimelineSessionCreatePage
			descriptionText={
				timeline?.name ? `${timeline.name}에 세션을 등록합니다.` : undefined
			}
			name={state.name}
			type={state.type}
			description={state.description}
			startDateTime={state.startDateTime}
			endDateTime={state.endDateTime}
			recurringDayOfWeek={state.recurringDayOfWeek}
			repeatCycleType={state.repeatCycleType}
			errors={state.errors}
			isSubmitPending={isPending}
			isSubmitDisabled={!state.name.trim()}
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

export default AdminTimelinesTimelineIdSessionsNewRoute;
