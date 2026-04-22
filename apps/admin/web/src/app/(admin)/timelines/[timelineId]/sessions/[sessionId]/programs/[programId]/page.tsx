"use client";

import {
	getGetProgramsQueryKey,
	type ProgramDto,
	useDeleteProgram,
	useGetProgramById,
} from "@cocrepo/api/core/timelines";
import { TimelineSessionProgramDetailPage } from "@cocrepo/ui";
import { addToast, useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

type ProgramDetailPageParams = {
	timelineId: string;
	sessionId: string;
	programId: string;
};

const AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdRoute = observer(
	() => {
		const { timelineId, sessionId, programId } =
			useParams<ProgramDetailPageParams>();
		const router = useRouter();
		const queryClient = useQueryClient();
		const deleteModal = useDisclosure();

		const { data: response, isLoading } = useGetProgramById(
			timelineId,
			sessionId,
			programId,
		);
		const program = response?.data as ProgramDto | undefined;

		const { mutate: deleteProgram, isPending: isDeleting } = useDeleteProgram();

		const onClickEditButton = () => {
			router.push(
				`/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}/edit` as Route,
			);
		};

		const onClickDeleteConfirmButton = () => {
			deleteProgram(
				{ timelineId, sessionId, programId },
				{
					onSuccess: () => {
						addToast({
							title: "삭제 성공",
							description: "프로그램이 삭제되었습니다.",
							color: "success",
						});
						deleteModal.onClose();
						queryClient.invalidateQueries({
							queryKey: getGetProgramsQueryKey(timelineId, sessionId),
						});
						router.push(
							`/timelines/${timelineId}/sessions/${sessionId}` as Route,
						);
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

		const descriptionText = [program?.session?.name, program?.session?.timeline?.name]
			.filter(Boolean)
			.join(" · ");

		return (
			<TimelineSessionProgramDetailPage
				program={
					program
						? {
								name: program.name,
								descriptionText,
								routineName:
									program.routineNameSnapshot ?? program.routine?.name ?? null,
								routineHref: program.routine?.id
									? (`/routines/${program.routine.id}` as Route)
									: undefined,
								instructorLabel: program.instructorId ?? null,
								capacityLabel:
									program.capacity != null ? `${program.capacity}명` : "-",
								levelLabel: program.level ?? null,
								activityCountLabel: `${
									program.activityCount ?? program.executionPlan?.length ?? 0
								}개`,
								sessionName: program.session?.name ?? null,
								sessionHref: `/timelines/${timelineId}/sessions/${sessionId}` as Route,
								createdAt: program.createdAt,
								executionPlan: (program.executionPlan ?? []).map((activity) => ({
									id: activity.id,
									taskId: activity.taskId,
									order: activity.order,
									repetitions: activity.repetitions,
									restTime: activity.restTime,
									exerciseName: activity.exerciseName,
									exerciseDescription: activity.exerciseDescription,
									exerciseDuration: activity.exerciseDuration,
									exerciseCount: activity.exerciseCount,
									notes: activity.notes,
									imageFileId: activity.imageFileId,
									imageAssetHref: activity.imageFileId
										? (`/assets/${activity.imageFileId}` as Route)
										: undefined,
									videoFileId: activity.videoFileId,
									videoAssetHref: activity.videoFileId
										? (`/assets/${activity.videoFileId}` as Route)
										: undefined,
								})),
							}
						: undefined
				}
				isLoading={isLoading}
				isNotFound={!isLoading && !program}
				isDeleteModalOpen={deleteModal.isOpen}
				isDeletePending={isDeleting}
				onClickEditButton={onClickEditButton}
				onClickDeleteButton={deleteModal.onOpen}
				onClickDeleteConfirmButton={onClickDeleteConfirmButton}
				onClickDeleteCancelButton={deleteModal.onClose}
			/>
		);
	},
);

export default dynamic(
	() => Promise.resolve(AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdRoute),
	{
		ssr: false,
	},
);
