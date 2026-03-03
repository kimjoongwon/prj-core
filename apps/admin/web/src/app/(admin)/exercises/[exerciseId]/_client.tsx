"use client";

import {
	type ExerciseDto,
	useDeleteExercise,
	useGetExercise,
	useGetExerciseRoutines,
} from "@cocrepo/api";
import { DateTimeCell, VStack } from "@cocrepo/ui";
import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
} from "@heroui/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 초 단위를 "분:초" 형식으로 변환합니다.
 */
const formatDuration = (seconds: number) => {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

interface ExerciseDetailPageClientProps {
	exerciseId: string;
}

/**
 * 운동 종목 상세 페이지 - 클라이언트 컴포넌트
 */
function ExerciseDetailPageClient({
	exerciseId,
}: ExerciseDetailPageClientProps) {
	const router = useRouter();
	const deleteModal = useDisclosure();

	// 운동 상세 조회 (prefetch로 초기 데이터 보장)
	const { data: response } = useGetExercise(exerciseId);
	const exercise = response?.data as ExerciseDto | undefined;

	// 사용 중인 루틴 조회
	const { data: routinesResponse } = useGetExerciseRoutines(exerciseId);
	const routines = routinesResponse?.data ?? [];

	// 삭제 Mutation
	const { mutate: deleteExercise, isPending: isDeleting } = useDeleteExercise();

	/** 목록으로 이동 핸들러 */
	const onClickBackButton = () => {
		router.push("/exercises" as Route);
	};

	/** 수정 페이지 이동 핸들러 */
	const onClickEditButton = () => {
		router.push(`/exercises/${exerciseId}/edit` as Route);
	};

	/** 삭제 확인 핸들러 */
	const onClickDeleteConfirm = () => {
		deleteExercise(
			{ exerciseId },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "운동 종목이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					router.push("/exercises" as Route);
				},
				onError: (error) => {
					addToast({
						title: "삭제 실패",
						description:
							error.message ||
							"삭제 중 오류가 발생했습니다. 루틴에서 사용 중인 운동은 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	// 데이터 없음 처리
	if (!response) {
		return (
			<div className="flex items-center justify-center p-8">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!exercise) {
		return (
            <section><div className="flex items-start justify-between gap-4"><div><h1>{"운동 종목 상세"}</h1><p>{"운동 종목을 찾을 수 없습니다."}</p></div></div>
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <p className="text-default-500">운동 종목을 찾을 수 없습니다.</p>
                    <Button
                        variant="flat"
                        startContent={<ArrowLeft className="size-4" />}
                        onPress={onClickBackButton}>목록으로
                                            </Button>
                </div>
            </section>
        );
	}

	return (
        <section>{(exercise.name || <div className="flex gap-2">
                            <Button
                                variant="flat"
                                startContent={<Pencil className="size-4" />}
                                onPress={onClickEditButton}>수정
                                                    </Button>
                            <Button
                                color="danger"
                                variant="flat"
                                startContent={<Trash2 className="size-4" />}
                                onPress={deleteModal.onOpen}
                                isDisabled={routines.length > 0}>삭제
                                                    </Button>
                        </div>) && <div className="flex items-start justify-between gap-4"><div>{exercise.name && <h1>{exercise.name}</h1>}<p>{"운동 종목의 상세 정보입니다."}</p></div><div><div className="flex gap-2">
                                    <Button
                                        variant="flat"
                                        startContent={<Pencil className="size-4" />}
                                        onPress={onClickEditButton}>수정
                                                            </Button>
                                    <Button
                                        color="danger"
                                        variant="flat"
                                        startContent={<Trash2 className="size-4" />}
                                        onPress={deleteModal.onOpen}
                                        isDisabled={routines.length > 0}>삭제
                                                            </Button>
                                </div></div></div>}
            <VStack gap={4}>
                <section><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2"><div><h2>{"기본 정보"}</h2></div></div></div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm text-default-500">운동명</label>
                            <p className="mt-1 font-medium">{exercise.name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-default-500">지속시간</label>
                            <p className="mt-1">{formatDuration(exercise.duration)}</p>
                        </div>
                        <div>
                            <label className="text-sm text-default-500">반복횟수</label>
                            <p className="mt-1">{exercise.count}회</p>
                        </div>
                        <div>
                            <label className="text-sm text-default-500">설명</label>
                            <p className="mt-1">{exercise.description || "-"}</p>
                        </div>
                        <div>
                            <label className="text-sm text-default-500">등록일</label>
                            <div className="mt-1">
                                <DateTimeCell value={exercise.createdAt} />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-default-500">수정일</label>
                            <div className="mt-1">
                                <DateTimeCell value={exercise.updatedAt} />
                            </div>
                        </div>
                    </div>
                </section>
                {routines.length > 0 && <section><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2"><div><h2>{"사용 중인 루틴"}</h2></div></div></div>
                    <div className="flex flex-col gap-2">
                        {routines.map(routine => (<div
                            key={routine.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-content2">
                            <div>
                                <p className="font-medium">{routine.name}</p>
                                <p className="text-sm text-default-500">{routine.label}</p>
                            </div>
                            <div className="text-sm text-default-400">
                                <DateTimeCell value={routine.createdAt} />
                            </div>
                        </div>))}
                    </div>
                </section>}
            </VStack>
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
                <ModalContent>
                    <ModalHeader>운동 종목 삭제</ModalHeader>
                    <ModalBody>
                        <p>
                            <strong>{exercise.name}</strong>운동을 삭제하시겠습니까?
                                                    </p>
                        <p className="mt-2 text-sm text-danger">이 작업은 되돌릴 수 없습니다.
                                                    </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={deleteModal.onClose} isDisabled={isDeleting}>취소
                                                    </Button>
                        <Button color="danger" onPress={onClickDeleteConfirm} isLoading={isDeleting}>삭제
                                                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </section>
    );
}

export default observer(ExerciseDetailPageClient);
