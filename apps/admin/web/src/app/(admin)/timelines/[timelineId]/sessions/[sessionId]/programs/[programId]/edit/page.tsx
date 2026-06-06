"use client";

import { type RoutineDto, useGetRoutines } from "@cocrepo/api/core/routines";
import {
	getGetProgramByIdQueryKey,
	useGetProgramById,
	useUpdateProgram,
} from "@cocrepo/api/core/timelines";
import {
	type UserDto,
	useGetUserById,
	useGetUsers,
} from "@cocrepo/api/core/users";
import { TimelineSessionProgramEditPage } from "@cocrepo/ui";
import { toast, useOverlayState } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

type ProgramEditPageParams = {
	timelineId: string;
	sessionId: string;
	programId: string;
};

const buildRoutinePreview = (routine?: RoutineDto) =>
	[...(routine?.activities ?? [])]
		.sort((left, right) => left.order - right.order)
		.map((activity) => ({
			id: activity.id,
			order: activity.order,
			exerciseName:
				activity.task?.exercise?.name ?? `Task ${activity.taskId.slice(-6)}`,
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
		const persistStore = usePersistStore();
		const queryClient = useQueryClient();
		const routinePickerModal = useOverlayState();
		const instructorPickerModal = useOverlayState();
		const state = useLocalObservable(() => ({
			name: "",
			routineId: "",
			routineQuery: "",
			instructorId: "",
			instructorQuery: "",
			capacity: "",
			level: "",
			errors: {} as Record<string, string>,
			isInitialized: false,
		}));

		const { data: response } = useGetProgramById(
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
		const { data: instructorsResponse } = useGetUsers({
			take: 50,
			skip: 0,
			roles: ["MANAGE", "FULL_ACCESS"],
			status: "active",
		});
		const { data: currentInstructorResponse } = useGetUserById(
			program?.instructorId ?? "",
			{ query: { enabled: !!program?.instructorId } },
		);

		let routines = (routinesResponse?.data ?? []) as RoutineDto[];
		if (
			program?.routine &&
			!routines.some((item) => item.id === program.routine.id)
		) {
			routines = [program.routine as RoutineDto, ...routines];
		}

		let instructors = (instructorsResponse?.data ?? []) as UserDto[];
		const currentInstructor = currentInstructorResponse?.data as
			| UserDto
			| undefined;
		if (
			currentInstructor &&
			!instructors.some((item) => item.id === currentInstructor.id)
		) {
			instructors = [currentInstructor, ...instructors];
		}

		useEffect(() => {
			if (program && !state.isInitialized) {
				state.name = program.name;
				state.routineId = program.routineId;
				state.instructorId = program.instructorId;
				state.capacity = String(program.capacity);
				state.level = program.level ?? "";
				state.isInitialized = true;
			}
		}, [program, state]);

		const { mutate: updateProgram, isPending } = useUpdateProgram();

		const onClickCancelButton = () => {
			router.push(
				`/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}` as Route,
			);
		};

		const onChangeNameInput = (value: string) => {
			state.name = value;
			delete state.errors.name;
		};
		const onSelectRoutineOption = (value: string) => {
			state.routineId = value;
			delete state.errors.routineId;
		};
		const onSelectInstructorOption = (value: string) => {
			state.instructorId = value;
			delete state.errors.instructorId;
		};
		const onChangeCapacityInput = (value: string) => {
			state.capacity = value;
			delete state.errors.capacity;
		};
		const onChangeRoutineQueryInput = (value: string) => {
			state.routineQuery = value;
		};
		const onChangeInstructorQueryInput = (value: string) => {
			state.instructorQuery = value;
		};
		const onChangeLevelSelect = (value: string) => {
			state.level = value;
		};

		const selectedRoutine = routines.find(
			(routine) => routine.id === state.routineId,
		);
		const selectedInstructor = instructors.find(
			(instructor) => instructor.id === state.instructorId,
		);
		const routineQuery = state.routineQuery.trim().toLowerCase();
		const instructorQuery = state.instructorQuery.trim().toLowerCase();
		const filteredRoutines = routineQuery
			? routines.filter((routine) =>
					routine.name.toLowerCase().includes(routineQuery),
				)
			: routines;
		const filteredInstructors = instructorQuery
			? instructors.filter((instructor) =>
					instructor.name.toLowerCase().includes(instructorQuery),
				)
			: instructors;
		const routineOptions =
			selectedRoutine &&
			!filteredRoutines.some((routine) => routine.id === selectedRoutine.id)
				? [selectedRoutine, ...filteredRoutines]
				: filteredRoutines;
		const instructorOptions =
			selectedInstructor &&
			!filteredInstructors.some(
				(instructor) => instructor.id === selectedInstructor.id,
			)
				? [selectedInstructor, ...filteredInstructors]
				: filteredInstructors;
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
			const errors: Record<string, string> = {};

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
						routineId: state.routineId.trim(),
						instructorId: state.instructorId.trim(),
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
			<TimelineSessionProgramEditPage
				descriptionText={[program?.name, program?.session?.name]
					.filter(Boolean)
					.join(" · ")}
				contentLanguageCode={persistStore.contentLanguageCode}
				name={state.name}
				routineName={selectedRoutine?.name ?? ""}
				instructorName={selectedInstructor?.name ?? program?.instructorId ?? ""}
				capacity={state.capacity}
				level={state.level}
				errors={state.errors}
				routineQuery={state.routineQuery}
				instructorQuery={state.instructorQuery}
				routineOptions={routineOptions.map((routine) => ({
					id: routine.id,
					name: routine.name,
					subtitle: `라벨: ${routine.label ?? "-"} · 활동 ${
						routine.activities?.length ?? 0
					}개 · ${
						routine.activities?.some(
							(activity) => !activity.task?.exercise?.videoFileId,
						)
							? "영상 누락"
							: "스케줄 가능"
					}`,
				}))}
				instructorOptions={instructorOptions.map((instructor) => ({
					id: instructor.id,
					name: instructor.name,
					subtitle: `이메일: ${instructor.email ?? "-"}`,
				}))}
				routinePreview={routinePreview}
				hasUnschedulableRoutine={hasUnschedulableRoutine}
				isRoutinePickerOpen={routinePickerModal.isOpen}
				isInstructorPickerOpen={instructorPickerModal.isOpen}
				isSubmitPending={isPending}
				isSubmitDisabled={
					!hasChanged ||
					!state.name.trim() ||
					!state.routineId.trim() ||
					!state.instructorId.trim() ||
					!state.capacity ||
					hasUnschedulableRoutine
				}
				onChangeNameInput={onChangeNameInput}
				onChangeCapacityInput={onChangeCapacityInput}
				onChangeLevelSelect={onChangeLevelSelect}
				onChangeRoutineQueryInput={onChangeRoutineQueryInput}
				onChangeInstructorQueryInput={onChangeInstructorQueryInput}
				onSelectRoutineOption={onSelectRoutineOption}
				onSelectInstructorOption={onSelectInstructorOption}
				onClickOpenRoutinePickerButton={routinePickerModal.open}
				onClickCloseRoutinePickerButton={routinePickerModal.close}
				onClickOpenInstructorPickerButton={instructorPickerModal.open}
				onClickCloseInstructorPickerButton={instructorPickerModal.close}
				onClickCancelButton={onClickCancelButton}
				onClickSubmitButton={onClickSubmitButton}
			/>
		);
	});

export default AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdEditRoute;
