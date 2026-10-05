"use client";

import {
	getGetProgramsQueryKey,
	useDeleteProgram,
	useGetProgramById,
} from "@cocrepo/api/core/timelines";
import {
	Button,
	HStack,
	TimelineSessionProgramEditScreen,
	type TimelineSessionProgramFormState,
	type TimelineSessionProgramRoutinePreviewItem,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

type ProgramDetailPageParams = {
	timelineId: string;
	sessionId: string;
	programId: string;
};

const AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdRoute =
	observer(() => {
		const { timelineId, sessionId, programId } =
			useParams<ProgramDetailPageParams>();
		const router = useRouter();
		const queryClient = useQueryClient();

		const { data: response, isLoading } = useGetProgramById(
			timelineId,
			sessionId,
			programId,
		);
		const program = response?.data;

		const { mutate: deleteProgram, isPending: isDeleting } = useDeleteProgram();

		const onClickEditButton = () => {
			router.push(
				`/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}/edit` as Route,
			);
		};

		const onClickDeleteButton = () => {
			deleteProgram(
				{ timelineId, sessionId, programId },
				{
					onSuccess: () => {
						toast.success("삭제 성공", {
							description: "프로그램이 삭제되었습니다.",
						});
						queryClient.invalidateQueries({
							queryKey: getGetProgramsQueryKey(timelineId, sessionId),
						});
						router.push(
							`/timelines/${timelineId}/sessions/${sessionId}` as Route,
						);
					},
					onError: () => {
						toast.danger("삭제 실패", {
							description: "프로그램 삭제 중 오류가 발생했습니다.",
						});
					},
				},
			);
		};

		const descriptionText = [
			program?.session?.name,
			program?.session?.timeline?.name,
		]
			.filter(Boolean)
			.join(" · ");
		const routinePreview: TimelineSessionProgramRoutinePreviewItem[] = (
			program?.executionPlan ?? []
		).map((activity) => ({
			id: String(activity.id),
			order: activity.order,
			exerciseName: activity.exerciseName,
			repetitions: activity.repetitions,
			restTime: activity.restTime,
			notes: activity.notes,
			isSchedulable: Boolean(activity.videoFileId),
		}));
		const programState: TimelineSessionProgramFormState | undefined = program
			? {
					name: program.name,
					routineId: String(program.routineId),
					routineName:
						program.routineNameSnapshot ?? program.routine?.name ?? "",
					instructorId: String(program.instructorId),
					instructorName: String(program.instructorId),
					capacity: String(program.capacity ?? ""),
					level: program.level ?? "",
					errors: {},
				}
			: undefined;

		return (
			<TimelineSessionProgramEditScreen
				title={program?.name ?? "프로그램 상세"}
				description={descriptionText || undefined}
				state={programState}
				readOnly
				routinePreview={routinePreview}
				metadata={{
					routineHref: program?.routine?.id
						? (`/routines/${String(program.routine.id)}` as Route)
						: undefined,
					instructorLabel:
						program?.instructorId === undefined
							? null
							: String(program.instructorId),
					activityCountLabel: `${
						program?.activityCount ?? program?.executionPlan?.length ?? 0
					}개`,
					sessionName: program?.session?.name ?? null,
					sessionHref:
						`/timelines/${timelineId}/sessions/${sessionId}` as Route,
					createdAt: program?.createdAt,
				}}
				isLoading={isLoading}
				notFound={!isLoading && !program}
				actions={
					<HStack>
						<Button
							variant="tertiary"
							startContent={<Edit className="h-4 w-4" />}
							onPress={onClickEditButton}
						>
							수정
						</Button>
						<Button
							variant="tertiary"
							startContent={<Trash2 className="h-4 w-4" />}
							isLoading={isDeleting}
							onPress={onClickDeleteButton}
						>
							삭제
						</Button>
					</HStack>
				}
			/>
		);
	});

export default dynamic(
	() =>
		Promise.resolve(
			AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdRoute,
		),
	{
		ssr: false,
	},
);
