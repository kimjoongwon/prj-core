"use client";

import { useCreateRoutine } from "@cocrepo/api";
import { PageSurface, SectionSurface } from "@cocrepo/ui";
import { addToast, Button, Input } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 루틴 등록 페이지 - 클라이언트 컴포넌트
 */
function RoutineNewPageClient() {
	const router = useRouter();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		errors: {} as Record<string, string>,
	}));

	// 등록 Mutation
	const { mutate: createRoutine, isPending } = useCreateRoutine({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "루틴 등록 성공",
					description: "루틴이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const routineId = response?.data?.id;
				if (routineId) {
					router.push(`/routines/${routineId}` as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "루틴 등록 실패",
					description: error.message || "루틴 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/** 취소 버튼 클릭 핸들러 - 목록으로 이동 */
	const onClickCancelButton = () => {
		router.push("/routines" as Route);
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

		createRoutine({
			data: {
				name: state.name.trim(),
				label: state.label.trim(),
				spaceId: "",
			},
		});
	};

	return (
		<PageSurface
			title="루틴 등록"
			description="새로운 운동 루틴을 등록합니다."
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

export default observer(RoutineNewPageClient);
