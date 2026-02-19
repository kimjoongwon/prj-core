"use client";

import {
	type RoutineDto,
	getGetRoutineQueryKey,
	useGetRoutine,
	useUpdateRoutine,
} from "@cocrepo/api";
import { PageSurface, SectionSurface } from "@cocrepo/ui";
import { addToast, Button, Input, Spinner } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface RoutineEditPageClientProps {
	routineId: string;
}

/**
 * 루틴 수정 페이지 - 클라이언트 컴포넌트
 */
function RoutineEditPageClient({ routineId }: RoutineEditPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetRoutine(routineId);
	const routine = response?.data as RoutineDto | undefined;

	// 초기 데이터 로딩
	useEffect(() => {
		if (routine && !state.isInitialized) {
			state.name = routine.name;
			state.label = routine.label;
			state.isInitialized = true;
		}
	}, [routine, state]);

	// 수정 Mutation
	const { mutate: updateRoutine, isPending } = useUpdateRoutine({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "루틴 수정 성공",
					description: "루틴이 성공적으로 수정되었습니다.",
					color: "success",
				});
				queryClient.invalidateQueries({
					queryKey: getGetRoutineQueryKey(routineId),
				});
				router.push(`/routines/${routineId}` as Route);
			},
			onError: (error) => {
				addToast({
					title: "루틴 수정 실패",
					description: error.message || "루틴 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/** 취소 버튼 클릭 핸들러 - 상세 페이지로 이동 */
	const onClickCancelButton = () => {
		router.push(`/routines/${routineId}` as Route);
	};

	/** 루틴명 변경 핸들러 */
	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	/** 라벨 변경 핸들러 */
	const onChangeLabel = (value: string) => {
		state.label = value;
		delete state.errors.label;
	};

	/** 저장 버튼 클릭 핸들러 - 유효성 검증 후 API 호출 */
	const onClickSaveButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "루틴 이름을 입력해주세요.";
		}

		if (!state.label.trim()) {
			errors.label = "단축 라벨을 입력해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateRoutine({
			routineId,
			data: {
				name: state.name.trim(),
				label: state.label.trim(),
			},
		});
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<PageSurface title="루틴 수정" description="로딩 중...">
				<div className="flex items-center justify-center p-8 gap-2">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	// 데이터 없음
	if (!routine) {
		return (
			<PageSurface
				title="루틴 수정"
				description="루틴을 찾을 수 없습니다."
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">루틴을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickCancelButton}>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="루틴 수정"
			description={`${routine.name} 루틴을 수정합니다.`}
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
		>
			<SectionSurface title="기본 정보">
				<div className="flex flex-col gap-4">
					<Input
						label="루틴 이름"
						placeholder="예: 풀바디 루틴 A"
						value={state.name}
						onValueChange={onChangeName}
						isRequired
						isInvalid={!!state.errors.name}
						errorMessage={state.errors.name}
						maxLength={100}
					/>

					<Input
						label="단축 라벨"
						placeholder="예: FULL-A"
						value={state.label}
						onValueChange={onChangeLabel}
						isRequired
						isInvalid={!!state.errors.label}
						errorMessage={state.errors.label}
						maxLength={50}
					/>
				</div>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(RoutineEditPageClient);
