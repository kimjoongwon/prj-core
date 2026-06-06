"use client";

import {
	getGetSessionsQueryKey,
	getGetTimelinesQueryKey,
	type SessionDto,
	type TimelineDto,
	useDeleteSession,
	useDeleteTimeline,
	useGetSessions,
	useGetTimelineById,
} from "@cocrepo/api/core/timelines";
import { TimelineDetailPage } from "@cocrepo/ui";
import { toast, useOverlayState } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

const getSessionTypeLabel = (type: string) => {
	switch (type) {
		case "ONE_TIME":
			return "일회성";
		case "ONE_TIME_RANGE":
			return "기간형";
		case "RECURRING":
			return "정기반복";
		default:
			return type;
	}
};

const getSessionTypeColor = (
	type: string,
): "primary" | "secondary" | "success" => {
	switch (type) {
		case "ONE_TIME":
			return "primary";
		case "ONE_TIME_RANGE":
			return "secondary";
		case "RECURRING":
			return "success";
		default:
			return "primary";
	}
};

const getDayLabel = (day?: string | null) => {
	if (!day) return "-";
	const map: Record<string, string> = {
		MON: "월",
		TUE: "화",
		WED: "수",
		THU: "목",
		FRI: "금",
		SAT: "토",
		SUN: "일",
	};
	return map[day] ?? day;
};

const getCycleLabel = (cycle?: string | null) => {
	if (!cycle) return "-";
	switch (cycle) {
		case "WEEKLY":
			return "주간";
		case "MONTHLY":
			return "월간";
		default:
			return cycle;
	}
};

type TimelineDetailPageParams = {
	timelineId: string;
};

type SessionCountable = SessionDto & {
	_count?: { programs?: number };
};

const getProgramCount = (session: SessionDto) => {
	const countableSession = session as SessionCountable;
	if (Array.isArray(countableSession.programs))
		return countableSession.programs.length;
	if (typeof countableSession._count?.programs === "number") {
		return countableSession._count.programs;
	}
	return 0;
};

const AdminTimelinesTimelineIdRoute = observer(() => {
	const { timelineId } = useParams<TimelineDetailPageParams>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const state = useLocalObservable(() => ({
		deleteSessionTargetId: "",
		deleteSessionTargetName: "",
	}));
	const deleteTimelineModal = useOverlayState();
	const deleteSessionModal = useOverlayState();
	const { data: timelineResponse } = useGetTimelineById(timelineId);
	const timeline = timelineResponse?.data as TimelineDto | undefined;
	const { data: sessionsResponse, refetch: refetchSessions } = useGetSessions(
		timelineId,
		{ take: 20, skip: 0 },
	);
	const sessions = (sessionsResponse?.data ?? []) as SessionDto[];
	const totalSessions = sessions.length;
	const connectedSessions = sessions.filter(
		(session) => getProgramCount(session) > 0,
	).length;
	const unconnectedSessions = totalSessions - connectedSessions;
	const { mutate: deleteTimeline, isPending: isDeletingTimeline } =
		useDeleteTimeline();
	const { mutate: deleteSession, isPending: isDeletingSession } =
		useDeleteSession();

	const onClickEditButton = () => {
		router.push(`/timelines/${timelineId}/edit` as Route);
	};
	const onClickDeleteTimelineButton = () => deleteTimelineModal.open();
	const onClickDeleteTimelineConfirmButton = () => {
		deleteTimeline(
			{ timelineId },
			{
				onSuccess: () => {
					toast.success("삭제 성공", {
						description: "타임라인이 삭제되었습니다.",
					});
					deleteTimelineModal.close();
					queryClient.invalidateQueries({
						queryKey: getGetTimelinesQueryKey(),
					});
					router.push("/timelines" as Route);
				},
				onError: () => {
					toast.danger("삭제 실패", {
						description:
							"타임라인 삭제 중 오류가 발생했습니다. 세션이 있는 타임라인은 삭제할 수 없습니다.",
					});
				},
			},
		);
	};
	const onClickCreateSessionButton = () => {
		router.push(`/timelines/${timelineId}/sessions/new` as Route);
	};
	const onClickSessionNameButton = (sessionId: string) => {
		router.push(`/timelines/${timelineId}/sessions/${sessionId}` as Route);
	};
	const onClickCreateProgramButton = (sessionId: string) => {
		router.push(
			`/timelines/${timelineId}/sessions/${sessionId}/programs/new` as Route,
		);
	};
	const onClickDeleteSessionButton = (sessionId: string) => {
		const session = sessions.find((item) => item.id === sessionId);
		state.deleteSessionTargetId = sessionId;
		state.deleteSessionTargetName = session?.name ?? "";
		deleteSessionModal.open();
	};
	const onClickDeleteSessionConfirmButton = () => {
		if (!state.deleteSessionTargetId) return;
		deleteSession(
			{ timelineId, sessionId: state.deleteSessionTargetId },
			{
				onSuccess: () => {
					toast.success("삭제 성공", { description: "세션이 삭제되었습니다." });
					deleteSessionModal.close();
					state.deleteSessionTargetId = "";
					state.deleteSessionTargetName = "";
					queryClient.invalidateQueries({
						queryKey: getGetSessionsQueryKey(timelineId),
					});
					refetchSessions();
				},
				onError: () => {
					toast.danger("삭제 실패", {
						description:
							"세션 삭제 중 오류가 발생했습니다. 프로그램이 연결된 세션은 삭제할 수 없습니다.",
					});
				},
			},
		);
	};

	return (
		<TimelineDetailPage
			title={timeline?.name ?? "타임라인 상세"}
			timeline={
				timeline
					? {
							name: timeline.name,
							description: timeline.description,
							createdAt: timeline.createdAt,
						}
					: undefined
			}
			sessions={sessions.map((session) => ({
				id: session.id,
				name: session.name,
				typeLabel: getSessionTypeLabel(session.type),
				typeColor: getSessionTypeColor(session.type),
				programCount: getProgramCount(session),
				isConnected: getProgramCount(session) > 0,
				startDateTime: session.startDateTime,
				recurringDayLabel: getDayLabel(session.recurringDayOfWeek ?? undefined),
				repeatCycleLabel: getCycleLabel(session.repeatCycleType ?? undefined),
				createdAt: session.createdAt,
			}))}
			totalSessions={totalSessions}
			connectedSessions={connectedSessions}
			unconnectedSessions={unconnectedSessions}
			isDeleteTimelineModalOpen={deleteTimelineModal.isOpen}
			isDeleteSessionModalOpen={deleteSessionModal.isOpen}
			deleteSessionTargetName={state.deleteSessionTargetName}
			isDeleteTimelinePending={isDeletingTimeline}
			isDeleteSessionPending={isDeletingSession}
			onClickEditButton={onClickEditButton}
			onClickDeleteTimelineButton={onClickDeleteTimelineButton}
			onClickDeleteTimelineConfirmButton={onClickDeleteTimelineConfirmButton}
			onClickDeleteTimelineCancelButton={deleteTimelineModal.close}
			onClickCreateSessionButton={onClickCreateSessionButton}
			onClickSessionNameButton={onClickSessionNameButton}
			onClickCreateProgramButton={onClickCreateProgramButton}
			onClickDeleteSessionButton={onClickDeleteSessionButton}
			onClickDeleteSessionConfirmButton={onClickDeleteSessionConfirmButton}
			onClickDeleteSessionCancelButton={deleteSessionModal.close}
		/>
	);
});

export default dynamic(() => Promise.resolve(AdminTimelinesTimelineIdRoute), {
	ssr: false,
});
