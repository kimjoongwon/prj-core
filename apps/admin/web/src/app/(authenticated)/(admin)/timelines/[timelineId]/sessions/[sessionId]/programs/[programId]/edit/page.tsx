"use client";

import { type RoutineDto, useGetRoutines } from "@cocrepo/api/core/routines";
import {
	getGetProgramByIdQueryKey,
	useGetProgramById,
	useUpdateProgram,
} from "@cocrepo/api/core/timelines";
import { useGetUserById } from "@cocrepo/api/core/users";
import { useApp } from "@cocrepo/store";
import {
	Button,
	HStack,
	TimelineSessionProgramEditScreen,
	type TimelineSessionProgramFormState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type ProgramEditPageParams = {
	timelineId: string;
	sessionId: string;
	programId: string;
};

const buildRoutinePreview = (routine?: RoutineDto) =>
	[...(routine?.activities ?? [])]
		.sort((left, right) => left.order - right.order)
		.map((activity) => ({
			id: String(activity.id),
			order: activity.order,
			exerciseName:
				activity.task?.exercise?.name ??
				`Task ${String(activity.taskId).slice(-6)}`,
			repetitions: activity.repetitions,
			restTime: activity.restTime,
			notes: activity.notes,
			isSchedulable: Boolean(activity.task?.exercise?.videoFileId),
		}));

const AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdEditRoute =
	observer(() => {
		const { timelineId, sessionId, programId } =
			useParams<ProgramEditPageParams>();
		const router = useRouter();
		const app = useApp();
		const queryClient = useQueryClient();
		const state = useLocalObservable<
			TimelineSessionProgramFormState & { isInitialized: boolean }
		>(() => ({
			name: "",
			routineId: "",
			routineName: "",
			instructorId: "",
			instructorName: "",
			capacity: "",
			level: "",
			errors: {},
			isInitialized: false,
		}));

		const { data: response, isLoading } = useGetProgramById(
			timelineId,
			sessionId,
			programId,
		);
		const program = response?.data;
		const { data: routinesResponse } = useGetRoutines({
			take: 50,
			skip: 0,
			spaceScope: "INCLUDE_ANCESTORS",
		});
		const { data: currentInstructorResponse } = useGetUserById(
			program?.instructorId === undefined ? "" : String(program.instructorId),
			{ query: { enabled: !!program?.instructorId } },
		);

		let routines = routinesResponse?.data ?? [];
		if (
			program?.routine &&
			!routines.some((item) => String(item.id) === String(program.routine.id))
		) {
			routines = [program.routine, ...routines];
		}

		const currentInstructor = currentInstructorResponse?.data;

		useEffect(() => {
			if (program && !state.isInitialized) {
				state.name = program.name;
				state.routineId = String(program.routineId);
				state.instructorId = String(program.instructorId);
				state.routineName =
					program.routineNameSnapshot ?? program.routine?.name ?? "";
				state.instructorName =
					currentInstructor?.name ?? String(program.instructorId);
				state.capacity = String(program.capacity);
				state.level = program.level ?? "";
				state.isInitialized = true;
			}
			if (
				state.isInitialized &&
				currentInstructor &&
				state.instructorId === String(currentInstructor.id)
			) {
				state.instructorName = currentInstructor.name;
			}
		}, [currentInstructor, program, state]);

		const { mutate: updateProgram, isPending } = useUpdateProgram();

		const selectedRoutine = routines.find(
			(routine) => String(routine.id) === state.routineId,
		);
		const routinePreview = buildRoutinePreview(selectedRoutine);
		const hasUnschedulableRoutine = routinePreview.some(
			(activity) => !activity.isSchedulable,
		);
		const hasChanged =
			state.isInitialized &&
			(state.name !== (program?.name ?? "") ||
				state.routineId !== (program?.routineId ?? "") ||
				state.instructorId !== (program?.instructorId ?? "") ||
				state.capacity !== String(program?.capacity ?? "") ||
				state.level !== (program?.level ?? ""));

		const onClickSubmitButton = () => {
			const errors: TimelineSessionProgramFormState["errors"] = {};

			if (!state.name.trim()) {
				errors.name = "프로그램 이름을 입력해주세요.";
			} else if (state.name.trim().length > 100) {
				errors.name = "프로그램 이름은 100자 이하로 입력해주세요.";
			}
			if (!state.routineId.trim()) {
				errors.routineId = "루틴을 선택해주세요.";
			}
			if (!state.instructorId.trim()) {
				errors.instructorId = "강사를 선택해주세요.";
			}
			if (
				state.routineId.trim() &&
				!/^[1-9]\d*$/.test(state.routineId.trim())
			) {
				errors.routineId = "유효한 루틴을 선택해주세요.";
			}
			if (
				state.instructorId.trim() &&
				!/^[1-9]\d*$/.test(state.instructorId.trim())
			) {
				errors.instructorId = "유효한 강사를 선택해주세요.";
			}
			const capacityNumber = Number(state.capacity);
			if (
				!state.capacity ||
				Number.isNaN(capacityNumber) ||
				capacityNumber < 1
			) {
				errors.capacity = "정원은 1 이상의 숫자를 입력해주세요.";
			}
			if (hasUnschedulableRoutine) {
				errors.routineId =
					"영상이 없는 운동이 포함된 루틴은 Program으로 저장할 수 없습니다.";
			}
			if (Object.keys(errors).length > 0) {
				state.errors = errors;
				return;
			}

			updateProgram(
				{
					timelineId,
					sessionId,
					programId,
					data: {
						name: state.name.trim(),
						routineId: parsePositiveBigInt(state.routineId),
						instructorId: parsePositiveBigInt(state.instructorId),
						capacity: Number(state.capacity),
						level: state.level || undefined,
					},
				},
				{
					onSuccess: () => {
						toast.success("수정 성공", {
							description: "프로그램이 수정되었습니다.",
						});
						queryClient.invalidateQueries({
							queryKey: getGetProgramByIdQueryKey(
								timelineId,
								sessionId,
								programId,
							),
						});
						router.push(
							`/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}` as Route,
						);
					},
					onError: () => {
						toast.danger("수정 실패", {
							description: "프로그램 수정 중 오류가 발생했습니다.",
						});
					},
				},
			);
		};

		return (
			<TimelineSessionProgramEditScreen
				title="프로그램 수정"
				description={[program?.name, program?.session?.name]
					.filter(Boolean)
					.join(" · ")}
				state={state}
				contentLanguageCode={app.contentLanguageCode}
				routinePreview={routinePreview}
				hasUnschedulableRoutine={hasUnschedulableRoutine}
				isLoading={isLoading && !state.isInitialized}
				notFound={!isLoading && !program}
				actions={
					<HStack>
						<Button
							variant="tertiary"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={() => {
								router.push(
									`/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}` as Route,
								);
							}}
						>
							상세로
						</Button>
						<Button
							variant="primary"
							startContent={<Save className="h-4 w-4" />}
							isLoading={isPending}
							isDisabled={
								!hasChanged ||
								!state.name.trim() ||
								!state.routineId.trim() ||
								!state.instructorId.trim() ||
								!state.capacity ||
								hasUnschedulableRoutine
							}
							onPress={onClickSubmitButton}
						>
							저장
						</Button>
					</HStack>
				}
			/>
		);
	});

export default AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdEditRoute;

function parsePositiveBigInt(value: string): bigint {
	const trimmedValue = value.trim();
	if (!/^[1-9]\d*$/.test(trimmedValue)) {
		throw new Error("ID must be a positive decimal integer");
	}
	return BigInt(trimmedValue);
}
