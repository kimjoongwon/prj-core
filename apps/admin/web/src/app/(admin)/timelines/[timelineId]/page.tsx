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
import {
	Button,
	TimelineEditScreen,
	type TimelineFormState,
} from "@cocrepo/ui";
import { Modal, toast, useOverlayState } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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

type TimelineEditScreenParams = {
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
	const { timelineId } = useParams<TimelineEditScreenParams>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const state = useLocalObservable(() => ({
		deleteSessionTargetId: "",
		deleteSessionTargetName: "",
	}));
	const deleteTimelineModal = useOverlayState();
	const deleteSessionModal = useOverlayState();
	const { data: timelineResponse, isLoading: isTimelineLoading } =
		useGetTimelineById(timelineId);
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
	const timelineState: TimelineFormState | undefined = timeline
		? {
				name: timeline.name,
				description: timeline.description ?? "",
				errors: {},
			}
		: undefined;
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
		<>
			<TimelineEditScreen
				title={timeline?.name ?? "타임라인 상세"}
				description="타임라인 기본 정보와 연결된 세션을 확인합니다."
				state={timelineState}
				readOnly
				isLoading={isTimelineLoading}
				notFound={!isTimelineLoading && !timeline}
				metadata={{ createdAt: timeline?.createdAt }}
				sessions={sessions.map((session) => ({
					id: session.id,
					name: session.name,
					typeLabel: getSessionTypeLabel(session.type),
					typeColor: getSessionTypeColor(session.type),
					programCount: getProgramCount(session),
					isConnected: getProgramCount(session) > 0,
					startDateTime: session.startDateTime,
					recurringDayLabel: getDayLabel(
						session.recurringDayOfWeek ?? undefined,
					),
					repeatCycleLabel: getCycleLabel(session.repeatCycleType ?? undefined),
					createdAt: session.createdAt,
				}))}
				totalSessions={totalSessions}
				connectedSessions={connectedSessions}
				unconnectedSessions={unconnectedSessions}
				actions={
					<div className="flex flex-wrap gap-2">
						<Button
							variant="flat"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={() => {
								router.push("/timelines" as Route);
							}}
						>
							목록으로
						</Button>
						<Button
							variant="flat"
							startContent={<Edit className="h-4 w-4" />}
							onPress={onClickEditButton}
						>
							수정
						</Button>
						<Button
							color="danger"
							variant="flat"
							startContent={<Trash2 className="h-4 w-4" />}
							onPress={onClickDeleteTimelineButton}
						>
							삭제
						</Button>
					</div>
				}
				onClickCreateSessionButton={onClickCreateSessionButton}
				onClickSessionNameButton={onClickSessionNameButton}
				onClickCreateProgramButton={onClickCreateProgramButton}
				onClickDeleteSessionButton={onClickDeleteSessionButton}
			/>
			{timeline ? (
				<Modal state={deleteTimelineModal}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>타임라인 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{timeline.name}</strong> 타임라인을
										삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										세션이 있는 타임라인은 삭제할 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={deleteTimelineModal.close}
										isDisabled={isDeletingTimeline}
									>
										취소
									</Button>
									<Button
										color="danger"
										onPress={onClickDeleteTimelineConfirmButton}
										isLoading={isDeletingTimeline}
									>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			) : null}
			<Modal state={deleteSessionModal}>
				<Modal.Backdrop>
					<Modal.Container>
						<Modal.Dialog>
							<Modal.Header>세션 삭제</Modal.Header>
							<Modal.Body>
								<p>
									<strong>{state.deleteSessionTargetName}</strong> 세션을
									삭제하시겠습니까?
								</p>
								<p className="mt-2 text-sm text-danger">
									프로그램이 연결된 세션은 삭제할 수 없습니다.
								</p>
							</Modal.Body>
							<Modal.Footer>
								<Button
									variant="flat"
									onPress={deleteSessionModal.close}
									isDisabled={isDeletingSession}
								>
									취소
								</Button>
								<Button
									color="danger"
									onPress={onClickDeleteSessionConfirmButton}
									isLoading={isDeletingSession}
								>
									삭제
								</Button>
							</Modal.Footer>
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>
		</>
	);
});

export default dynamic(() => Promise.resolve(AdminTimelinesTimelineIdRoute), {
	ssr: false,
});
