"use client";

import {
	getGetProgramsQueryKey,
	getGetSessionsQueryKey,
	type ProgramDto,
	type SessionDto,
	useDeleteProgram,
	useDeleteSession,
	useGetPrograms,
	useGetSessionById,
} from "@cocrepo/api/core/timelines";
import { type UserDto, useGetUsers } from "@cocrepo/api/core/users";
import { TimelineSessionDetailPage } from "@cocrepo/ui";
import { addToast, useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
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
		MON: "월요일",
		TUE: "화요일",
		WED: "수요일",
		THU: "목요일",
		FRI: "금요일",
		SAT: "토요일",
		SUN: "일요일",
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

type SessionDetailPageParams = {
	timelineId: string;
	sessionId: string;
};

const AdminTimelinesTimelineIdSessionsSessionIdRoute = observer(() => {
	const { timelineId, sessionId } = useParams<SessionDetailPageParams>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const state = useLocalObservable(() => ({
		deleteProgramTargetId: "",
		deleteProgramTargetName: "",
	}));
	const deleteSessionModal = useDisclosure();
	const deleteProgramModal = useDisclosure();
	const { data: sessionResponse } = useGetSessionById(timelineId, sessionId);
	const session = sessionResponse?.data as SessionDto | undefined;
	const { data: programsResponse, refetch: refetchPrograms } = useGetPrograms(
		timelineId,
		sessionId,
		{ take: 20, skip: 0 },
	);
	const programs = (programsResponse?.data ?? []) as ProgramDto[];
	const { data: usersResponse } = useGetUsers({
		take: 100,
		skip: 0,
		status: "active",
	});
	const users = (usersResponse?.data ?? []) as UserDto[];
	const instructorNameById = new Map(users.map((user) => [user.id, user.name]));
	const isConnectionResolved = (program: ProgramDto) =>
		Boolean(program.routine?.id) &&
		instructorNameById.has(program.instructorId);
	const totalPrograms = programs.length;
	const resolvedPrograms = programs.filter((program) =>
		isConnectionResolved(program),
	).length;
	const unresolvedPrograms = totalPrograms - resolvedPrograms;
	const { mutate: deleteSession, isPending: isDeletingSession } =
		useDeleteSession();
	const { mutate: deleteProgram, isPending: isDeletingProgram } =
		useDeleteProgram();

	const onClickEditButton = () => {
		router.push(`/timelines/${timelineId}/sessions/${sessionId}/edit` as Route);
	};
	const onClickDeleteSessionButton = () => deleteSessionModal.onOpen();
	const onClickDeleteSessionConfirmButton = () => {
		deleteSession(
			{ timelineId, sessionId },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "세션이 삭제되었습니다.",
						color: "success",
					});
					deleteSessionModal.onClose();
					queryClient.invalidateQueries({
						queryKey: getGetSessionsQueryKey(timelineId),
					});
					router.push(`/timelines/${timelineId}` as Route);
				},
				onError: () => {
					addToast({
						title: "삭제 실패",
						description:
							"세션 삭제 중 오류가 발생했습니다. 프로그램이 연결된 세션은 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};
	const onClickCreateProgramButton = () => {
		router.push(
			`/timelines/${timelineId}/sessions/${sessionId}/programs/new` as Route,
		);
	};
	const onClickEditProgramButton = (programId: string) => {
		router.push(
			`/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}/edit` as Route,
		);
	};
	const onClickDeleteProgramButton = (programId: string) => {
		const program = programs.find((item) => item.id === programId);
		state.deleteProgramTargetId = programId;
		state.deleteProgramTargetName = program?.name ?? "";
		deleteProgramModal.onOpen();
	};
	const onClickDeleteProgramConfirmButton = () => {
		if (!state.deleteProgramTargetId) return;
		deleteProgram(
			{ timelineId, sessionId, programId: state.deleteProgramTargetId },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "프로그램이 삭제되었습니다.",
						color: "success",
					});
					deleteProgramModal.onClose();
					state.deleteProgramTargetId = "";
					state.deleteProgramTargetName = "";
					queryClient.invalidateQueries({
						queryKey: getGetProgramsQueryKey(timelineId, sessionId),
					});
					refetchPrograms();
				},
				onError: () => {
					addToast({
						title: "삭제 실패",
						description: "프로그램 삭제 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	const getInstructorName = (instructorId: string) =>
		instructorNameById.get(instructorId) ?? "확인 필요";
	const getProgramPreviewText = (program: ProgramDto) =>
		program.previewExerciseNames && program.previewExerciseNames.length > 0
			? program.previewExerciseNames.join(", ")
			: "-";

	return (
		<TimelineSessionDetailPage
			title={session?.name ?? "세션 상세"}
			descriptionText={session?.timeline?.name}
			session={
				session
					? {
							name: session.name,
							type: session.type,
							typeLabel: getSessionTypeLabel(session.type),
							typeColor: getSessionTypeColor(session.type),
							recurringDayLabel: getDayLabel(
								session.recurringDayOfWeek ?? null,
							),
							repeatCycleLabel: getCycleLabel(session.repeatCycleType ?? null),
							startDateTime: session.startDateTime,
							endDateTime: session.endDateTime,
							description: session.description,
							timelineName: session.timeline?.name,
							timelineHref: `/timelines/${timelineId}` as Route,
							createdAt: session.createdAt,
						}
					: undefined
			}
			programs={programs.map((program) => ({
				id: program.id,
				href: `/timelines/${timelineId}/sessions/${sessionId}/programs/${program.id}` as Route,
				name: program.name,
				routineName:
					program.routineNameSnapshot ?? program.routine?.name ?? "-",
				activityCountLabel: `${program.activityCount ?? 0}개`,
				previewText: getProgramPreviewText(program),
				instructorName: getInstructorName(program.instructorId),
				isConnectionResolved: isConnectionResolved(program),
				capacityLabel: `${program.capacity}명`,
				levelLabel: program.level ?? "-",
			}))}
			totalPrograms={totalPrograms}
			resolvedPrograms={resolvedPrograms}
			unresolvedPrograms={unresolvedPrograms}
			isDeleteSessionModalOpen={deleteSessionModal.isOpen}
			isDeleteProgramModalOpen={deleteProgramModal.isOpen}
			deleteProgramTargetName={state.deleteProgramTargetName}
			isDeleteSessionPending={isDeletingSession}
			isDeleteProgramPending={isDeletingProgram}
			onClickEditButton={onClickEditButton}
			onClickDeleteSessionButton={onClickDeleteSessionButton}
			onClickDeleteSessionConfirmButton={onClickDeleteSessionConfirmButton}
			onClickDeleteSessionCancelButton={deleteSessionModal.onClose}
			onClickCreateProgramButton={onClickCreateProgramButton}
			onClickEditProgramButton={onClickEditProgramButton}
			onClickDeleteProgramButton={onClickDeleteProgramButton}
			onClickDeleteProgramConfirmButton={onClickDeleteProgramConfirmButton}
			onClickDeleteProgramCancelButton={deleteProgramModal.onClose}
		/>
	);
});

export default AdminTimelinesTimelineIdSessionsSessionIdRoute;
