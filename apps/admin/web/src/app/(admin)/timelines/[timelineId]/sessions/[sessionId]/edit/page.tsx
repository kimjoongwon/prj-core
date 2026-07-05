"use client";

import { toast } from "@heroui/react";
import {
	getGetSessionByIdQueryKey,
	useGetSessionById,
	useUpdateSession,
} from "@cocrepo/api/core/timelines";
import {
	Button,
	TimelineSessionEditScreen,
	type TimelineSessionFormState,
	type TimelineSessionScreenCycleType,
	type TimelineSessionScreenDayOfWeek,
	type TimelineSessionScreenSessionType,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/stores/AppProvider";

type SessionEditPageParams = {
	timelineId: string;
	sessionId: string;
};

const AdminTimelinesTimelineIdSessionsSessionIdEditRoute = observer(() => {
	const { timelineId, sessionId } = useParams<SessionEditPageParams>();
	const router = useRouter();
	const app = useApp();
	const queryClient = useQueryClient();
	const state = useLocalObservable<
		TimelineSessionFormState & { isInitialized: boolean }
	>(() => ({
		name: "",
		type: "ONE_TIME" as TimelineSessionScreenSessionType,
		originalType: "ONE_TIME" as TimelineSessionScreenSessionType,
		description: "",
		startDateTime: "",
		endDateTime: "",
		recurringDayOfWeek: null as TimelineSessionScreenDayOfWeek | null,
		repeatCycleType: "" as TimelineSessionScreenCycleType | "",
		originalStartDateTime: "",
		originalEndDateTime: "",
		originalRecurringDayOfWeek: null,
		originalRepeatCycleType: "",
		errors: {},
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetSessionById(
		timelineId,
		sessionId,
	);
	const session = response?.data;

	useEffect(() => {
		if (session && !state.isInitialized) {
			state.name = session.name;
			state.type = session.type as TimelineSessionScreenSessionType;
			state.originalType = session.type as TimelineSessionScreenSessionType;
			state.description = session.description ?? "";
			state.startDateTime = session.startDateTime ?? "";
			state.endDateTime = session.endDateTime ?? "";
			state.recurringDayOfWeek =
				(session.recurringDayOfWeek as TimelineSessionScreenDayOfWeek) ?? null;
			state.repeatCycleType =
				(session.repeatCycleType as TimelineSessionScreenCycleType) ?? "";
			state.originalStartDateTime = state.startDateTime;
			state.originalEndDateTime = state.endDateTime;
			state.originalRecurringDayOfWeek = state.recurringDayOfWeek;
			state.originalRepeatCycleType = state.repeatCycleType;
			state.isInitialized = true;
		}
	}, [session, state]);

	const { mutate: updateSession, isPending } = useUpdateSession();

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
					toast.success("수정 성공", { description: "세션이 수정되었습니다." });
					queryClient.invalidateQueries({
						queryKey: getGetSessionByIdQueryKey(timelineId, sessionId),
					});
					router.push(
						`/timelines/${timelineId}/sessions/${sessionId}` as Route,
					);
				},
				onError: () => {
					toast.danger("수정 실패", { description: "세션 수정 중 오류가 발생했습니다." });
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
		<TimelineSessionEditScreen
			title="세션 수정"
			description={session?.name}
			state={state}
			contentLanguageCode={app.contentLanguageCode}
			isLoading={isLoading && !state.isInitialized}
			notFound={!isLoading && !session}
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(
								`/timelines/${timelineId}/sessions/${sessionId}` as Route,
							);
						}}
					>
						상세로
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending}
						isDisabled={!hasChanged || !state.name.trim()}
						onPress={onClickSubmitButton}
					>
						저장
					</Button>
				</div>
			}
		/>
	);
});

export default AdminTimelinesTimelineIdSessionsSessionIdEditRoute;
