"use client";

import {
	getGetSessionByIdQueryKey,
	useGetSessionById,
	useUpdateSession,
} from "@cocrepo/api/core/timelines";
import { useApp } from "@cocrepo/store";
import {
	Button,
	HStack,
	TimelineSessionEditScreen,
	type TimelineSessionFormState,
	type TimelineSessionScreenCycleType,
	type TimelineSessionScreenDayOfWeek,
	type TimelineSessionScreenSessionType,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type SessionEditPageParams = {
	timelineId: string;
	sessionId: string;
};

const parseLocalDateTime = (value: string) => {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

const toSessionDateTimeLocalValue = (value?: Date | null) => {
	if (!value) return "";
	const date = new Date(value);
	const pad = (part: number) => String(part).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
			const startDateTime = toSessionDateTimeLocalValue(session.startDateTime);
			const endDateTime = toSessionDateTimeLocalValue(session.endDateTime);
			state.name = session.name;
			state.type = session.type as TimelineSessionScreenSessionType;
			state.originalType = session.type as TimelineSessionScreenSessionType;
			state.description = session.description ?? "";
			state.startDateTime = startDateTime ?? "";
			state.endDateTime = endDateTime ?? "";
			state.recurringDayOfWeek =
				(session.recurringDayOfWeek as TimelineSessionScreenDayOfWeek) ?? null;
			state.repeatCycleType =
				(session.repeatCycleType as TimelineSessionScreenCycleType) ?? "";
			state.originalStartDateTime = state.startDateTime;
			state.originalEndDateTime = state.endDateTime;
			state.originalRecurringDayOfWeek = state.recurringDayOfWeek;
			state.originalRepeatCycleType = state.repeatCycleType;
			if (session.startDateTime && startDateTime === null) {
				state.errors.startDateTime =
					"서버에서 받은 시작 일시가 올바르지 않습니다.";
			}
			if (session.endDateTime && endDateTime === null) {
				state.errors.endDateTime =
					"서버에서 받은 종료 일시가 올바르지 않습니다.";
			}
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
		const startDateTime = parseLocalDateTime(state.startDateTime);
		const endDateTime = parseLocalDateTime(state.endDateTime);
		if (state.startDateTime && !startDateTime) {
			errors.startDateTime = "올바른 시작 일시를 입력해주세요.";
		}
		if (state.type === "ONE_TIME_RANGE") {
			if (!state.startDateTime)
				errors.startDateTime = "시작 일시를 입력해주세요.";
			if (!state.endDateTime) errors.endDateTime = "종료 일시를 입력해주세요.";
			if (state.endDateTime && !endDateTime) {
				errors.endDateTime = "올바른 종료 일시를 입력해주세요.";
			}
			if (
				state.startDateTime &&
				state.endDateTime &&
				startDateTime &&
				endDateTime &&
				startDateTime >= endDateTime
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
					startDateTime: startDateTime ?? undefined,
					endDateTime: state.endDateTime
						? (endDateTime ?? undefined)
						: undefined,
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
					toast.danger("수정 실패", {
						description: "세션 수정 중 오류가 발생했습니다.",
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
			state.startDateTime !== (state.originalStartDateTime ?? "") ||
			state.endDateTime !== (state.originalEndDateTime ?? "") ||
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
				<HStack>
					<Button
						variant="tertiary"
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
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending}
						isDisabled={!hasChanged || !state.name.trim()}
						onPress={onClickSubmitButton}
					>
						저장
					</Button>
				</HStack>
			}
		/>
	);
});

export default AdminTimelinesTimelineIdSessionsSessionIdEditRoute;
