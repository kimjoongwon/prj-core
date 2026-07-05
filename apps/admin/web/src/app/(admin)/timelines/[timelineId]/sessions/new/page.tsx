"use client";

import { toast } from "@heroui/react";
import {
	useCreateSession,
	useGetTimelineById,
} from "@cocrepo/api/core/timelines";
import {
	Button,
	TimelineSessionEditScreen,
	type TimelineSessionFormState,
	type TimelineSessionScreenCycleType,
	type TimelineSessionScreenDayOfWeek,
	type TimelineSessionScreenSessionType,
} from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/stores/AppProvider";

type SessionNewPageParams = {
	timelineId: string;
};

const AdminTimelinesTimelineIdSessionsNewRoute = observer(() => {
	const { timelineId } = useParams<SessionNewPageParams>();
	const router = useRouter();
	const app = useApp();
	const state = useLocalObservable<TimelineSessionFormState>(() => ({
		name: "",
		type: "ONE_TIME" as TimelineSessionScreenSessionType,
		description: "",
		startDateTime: "",
		endDateTime: "",
		recurringDayOfWeek: null as TimelineSessionScreenDayOfWeek | null,
		repeatCycleType: "" as TimelineSessionScreenCycleType | "",
		errors: {},
	}));

	const { data: timelineResponse } = useGetTimelineById(timelineId);
	const timeline = timelineResponse?.data;
	const { mutate: createSession, isPending } = useCreateSession();

	const onClickSubmitButton = () => {
		const errors: TimelineSessionFormState["errors"] = {};

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
					toast.success("등록 성공", { description: "세션이 등록되었습니다." });
					const newId = response.data?.id;
					router.push(
						(newId
							? `/timelines/${timelineId}/sessions/${newId}`
							: `/timelines/${timelineId}`) as Route,
					);
				},
				onError: () => {
					toast.danger("등록 실패", { description: "세션 등록 중 오류가 발생했습니다." });
				},
			},
		);
	};

	return (
		<TimelineSessionEditScreen
			title="세션 등록"
			description={
				timeline?.name ? `${timeline.name}에 세션을 등록합니다.` : undefined
			}
			state={state}
			contentLanguageCode={app.contentLanguageCode}
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/timelines/${timelineId}` as Route);
						}}
					>
						타임라인으로
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending}
						isDisabled={!state.name.trim()}
						onPress={onClickSubmitButton}
					>
						등록
					</Button>
				</div>
			}
		/>
	);
});

export default AdminTimelinesTimelineIdSessionsNewRoute;
