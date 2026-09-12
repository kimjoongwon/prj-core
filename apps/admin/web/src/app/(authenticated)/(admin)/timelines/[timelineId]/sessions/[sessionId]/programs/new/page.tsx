"use client";

import { type RoutineDto, useGetRoutines } from "@cocrepo/api/core/routines";
import {
	useCreateProgram,
	useGetSessionById,
} from "@cocrepo/api/core/timelines";
import { useApp } from "@cocrepo/store";
import {
	Button,
	TimelineSessionProgramEditScreen,
	type TimelineSessionProgramFormState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

type ProgramNewPageParams = {
	timelineId: string;
	sessionId: string;
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

const AdminTimelinesTimelineIdSessionsSessionIdProgramsNewRoute = observer(
	() => {
		const { timelineId, sessionId } = useParams<ProgramNewPageParams>();
		const router = useRouter();
		const app = useApp();
		const state = useLocalObservable<TimelineSessionProgramFormState>(() => ({
			name: "",
			routineId: "",
			routineName: "",
			instructorId: "",
			instructorName: "",
			capacity: "",
			level: "",
			errors: {},
		}));

		const { data: sessionResponse } = useGetSessionById(timelineId, sessionId);
		const session = sessionResponse?.data;
		const { data: routinesResponse } = useGetRoutines({
			take: 50,
			skip: 0,
			spaceScope: "INCLUDE_ANCESTORS",
		});
		const routines = routinesResponse?.data ?? [];
		const { mutate: createProgram, isPending } = useCreateProgram();

		const selectedRoutine = routines.find(
			(routine) => String(routine.id) === state.routineId,
		);
		const routinePreview = buildRoutinePreview(selectedRoutine);
		const hasUnschedulableRoutine = routinePreview.some(
			(activity) => !activity.isSchedulable,
		);

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
					"영상이 없는 운동이 포함된 루틴은 Program으로 생성할 수 없습니다.";
			}

			if (Object.keys(errors).length > 0) {
				state.errors = errors;
				return;
			}

			createProgram(
				{
					timelineId,
					sessionId,
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
						toast.success("등록 성공", {
							description: "프로그램이 등록되었습니다.",
						});
						router.push(
							`/timelines/${timelineId}/sessions/${sessionId}` as Route,
						);
					},
					onError: () => {
						toast.danger("등록 실패", {
							description:
								"프로그램 등록 중 오류가 발생했습니다. 같은 루틴이 이미 등록되어 있지 않은지 확인해주세요.",
						});
					},
				},
			);
		};

		return (
			<TimelineSessionProgramEditScreen
				title="프로그램 등록"
				description={[session?.name, session?.timeline?.name]
					.filter(Boolean)
					.join(" · ")}
				state={state}
				contentLanguageCode={app.contentLanguageCode}
				routinePreview={routinePreview}
				hasUnschedulableRoutine={hasUnschedulableRoutine}
				actions={
					<div className="flex gap-2">
						<Button
							variant="tertiary"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={() => {
								router.push(
									`/timelines/${timelineId}/sessions/${sessionId}` as Route,
								);
							}}
						>
							세션으로
						</Button>
						<Button
							variant="primary"
							startContent={<Save className="h-4 w-4" />}
							isLoading={isPending}
							isDisabled={
								!state.name.trim() ||
								!state.routineId.trim() ||
								!state.instructorId.trim() ||
								!state.capacity ||
								hasUnschedulableRoutine
							}
							onPress={onClickSubmitButton}
						>
							등록
						</Button>
					</div>
				}
			/>
		);
	},
);

export default AdminTimelinesTimelineIdSessionsSessionIdProgramsNewRoute;

function parsePositiveBigInt(value: string): bigint {
	const trimmedValue = value.trim();
	if (!/^[1-9]\d*$/.test(trimmedValue)) {
		throw new Error("ID must be a positive decimal integer");
	}
	return BigInt(trimmedValue);
}
