"use client";
import {
	type ExerciseDto,
	useGetTaskExercise,
	useUpdateTaskExercise,
} from "@cocrepo/api/core/tasks";

import { Page, PageTitleBar, Section } from "@cocrepo/ui";
import { addToast, Button, Input, Spinner, Textarea } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TaskExerciseEditPageClientProps {
	taskId: string;
}

/**
 * 태스크의 운동 detail 수정 페이지 - 클라이언트 컴포넌트
 */
function TaskExerciseEditPageClient({
	taskId,
}: TaskExerciseEditPageClientProps) {
	const router = useRouter();
	const state = useLocalObservable(() => ({
		name: "",
		durationMin: 0,
		durationSec: 0,
		count: 1,
		description: "",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetTaskExercise(taskId);
	const exercise = response?.data as ExerciseDto | undefined;

	useEffect(() => {
		if (exercise && !state.isInitialized) {
			state.name = exercise.name;
			state.durationMin = Math.floor(exercise.duration / 60);
			state.durationSec = exercise.duration % 60;
			state.count = exercise.count;
			state.description = exercise.description || "";
			state.isInitialized = true;
		}
	}, [exercise, state]);

	const { mutate: updateTaskExercise, isPending } = useUpdateTaskExercise({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "운동 정보 수정 성공",
					description: "운동 detail이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/tasks/${taskId}/exercise` as Route);
			},
			onError: (error) => {
				addToast({
					title: "운동 정보 수정 실패",
					description:
						error.message || "운동 detail 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const onClickCancelButton = () => {
		router.push(`/tasks/${taskId}/exercise` as Route);
	};

	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeDurationMin = (value: string) => {
		state.durationMin = Number(value) || 0;
		delete state.errors.duration;
	};

	const onChangeDurationSec = (value: string) => {
		state.durationSec = Number(value) || 0;
		delete state.errors.duration;
	};

	const onChangeCount = (value: string) => {
		state.count = Number(value) || 1;
		delete state.errors.count;
	};

	const onChangeDescription = (value: string) => {
		state.description = value;
	};

	const onClickSaveButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "운동명을 입력해주세요.";
		}

		const duration = state.durationMin * 60 + state.durationSec;
		if (duration < 1) {
			errors.duration = "지속시간은 1초 이상이어야 합니다.";
		}

		if (state.count < 1) {
			errors.count = "반복횟수는 1회 이상이어야 합니다.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateTaskExercise({
			taskId,
			data: {
				name: state.name.trim(),
				duration,
				count: state.count,
				description: state.description.trim() || undefined,
			},
		});
	};

	if (isLoading) {
		return (
			<Page
				top={<PageTitleBar title="운동 정보 수정" description="로딩 중..." />}
			>
				<Section>
					<div className="flex items-center justify-center gap-2 p-8">
						<Spinner size="sm" />
						<span className="text-default-500">로딩 중...</span>
					</div>
				</Section>
			</Page>
		);
	}

	if (!exercise) {
		return (
			<Page
				top={
					<PageTitleBar
						title="운동 정보 수정"
						description="운동 detail을 찾을 수 없습니다."
					/>
				}
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">운동 detail을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickCancelButton}>
						목록으로
					</Button>
				</div>
			</Page>
		);
	}

	return (
		<Page
			top={
				<PageTitleBar
					title="운동 정보 수정"
					description={`${exercise.name} 운동 detail을 수정합니다.`}
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								onPress={onClickCancelButton}
								isDisabled={isPending}
							>
								취소
							</Button>
							<Button
								color="primary"
								onPress={onClickSaveButton}
								isLoading={isPending}
							>
								저장
							</Button>
						</div>
					}
				/>
			}
		>
			<Section top={<PageTitleBar level={2} title="기본 정보" />}>
				<div className="flex flex-col gap-4">
					<Input
						label="운동명"
						placeholder="운동 이름을 입력하세요"
						value={state.name}
						onValueChange={onChangeName}
						isRequired
						isInvalid={!!state.errors.name}
						errorMessage={state.errors.name}
					/>
					<div>
						<label className="mb-1 block text-sm font-medium text-default-700">
							지속시간 <span className="text-danger">*</span>
						</label>
						<div className="flex items-center gap-2">
							<Input
								type="number"
								placeholder="분"
								value={String(state.durationMin)}
								onValueChange={onChangeDurationMin}
								min={0}
								endContent={
									<span className="text-sm text-default-400">분</span>
								}
								className="max-w-32"
							/>
							<Input
								type="number"
								placeholder="초"
								value={String(state.durationSec)}
								onValueChange={onChangeDurationSec}
								min={0}
								max={59}
								endContent={
									<span className="text-sm text-default-400">초</span>
								}
								className="max-w-32"
							/>
						</div>
						{state.errors.duration && (
							<p className="mt-1 text-sm text-danger">
								{state.errors.duration}
							</p>
						)}
					</div>
					<Input
						label="반복횟수"
						type="number"
						placeholder="반복 횟수"
						value={String(state.count)}
						onValueChange={onChangeCount}
						isRequired
						min={1}
						isInvalid={!!state.errors.count}
						errorMessage={state.errors.count}
						endContent={<span className="text-sm text-default-400">회</span>}
					/>
					<Textarea
						label="설명"
						placeholder="운동 설명, 수행 방법 등을 입력하세요 (선택)"
						value={state.description}
						onValueChange={onChangeDescription}
						maxLength={500}
						minRows={3}
					/>
				</div>
			</Section>
		</Page>
	);
}

export default observer(TaskExerciseEditPageClient);
