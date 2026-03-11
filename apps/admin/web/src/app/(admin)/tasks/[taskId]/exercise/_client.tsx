"use client";

import {
	type ExerciseDto,
	useDeleteTask,
	useGetTaskExercise,
	useGetTaskRoutines,
} from "@cocrepo/api";
import { DateTimeCell, Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
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

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainSeconds = seconds % 60;
	return minutes > 0 ? `${minutes}분 ${remainSeconds}초` : `${remainSeconds}초`;
};

interface TaskExerciseDetailPageClientProps {
	taskId: string;
}

/**
 * 태스크의 운동 detail 페이지 - 클라이언트 컴포넌트
 */
function TaskExerciseDetailPageClient({
	taskId,
}: TaskExerciseDetailPageClientProps) {
	const router = useRouter();
	const deleteModal = useDisclosure();

	const { data: response, isLoading } = useGetTaskExercise(taskId);
	const exercise = response?.data as ExerciseDto | undefined;
	const { data: routinesResponse } = useGetTaskRoutines(taskId);
	const routines = routinesResponse?.data ?? [];
	const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

	const onClickBackButton = () => {
		router.push("/tasks" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/tasks/${taskId}/exercise/edit` as Route);
	};

	const onClickDeleteConfirm = () => {
		deleteTask(
			{ taskId },
			{
				onSuccess: () => {
					addToast({
						title: "태스크 삭제 성공",
						description: "태스크와 운동 detail이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					router.push("/tasks" as Route);
				},
				onError: (error) => {
					addToast({
						title: "태스크 삭제 실패",
						description:
							error.message ||
							"삭제 중 오류가 발생했습니다. 루틴에서 사용 중인 태스크는 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	if (isLoading && !response) {
		return (
			<Page top={<PageTitleBar title="운동 정보" description="로딩 중..." />}>
				<Section>
					<div className="flex items-center justify-center p-8">
						<Spinner size="lg" />
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
						title="운동 정보"
						description="운동 detail을 찾을 수 없습니다."
					/>
				}
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">운동 detail을 찾을 수 없습니다.</p>
					<Button
						variant="flat"
						startContent={<ArrowLeft className="size-4" />}
						onPress={onClickBackButton}
					>
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
					title={exercise.name ?? "운동 정보"}
					description="태스크에 연결된 운동 detail입니다."
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<Pencil className="size-4" />}
								onPress={onClickEditButton}
							>
								수정
							</Button>
							<Button
								color="danger"
								variant="flat"
								startContent={<Trash2 className="size-4" />}
								onPress={deleteModal.onOpen}
								isDisabled={routines.length > 0}
							>
								삭제
							</Button>
						</div>
					}
				/>
			}
		>
			<VStack gap={4}>
				<Section top={<PageTitleBar level={2} title="기본 정보" />}>
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
				</Section>
				<Section top={<PageTitleBar level={2} title="태스크 정보" />}>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="text-sm text-default-500">Task ID</label>
							<p className="mt-1 font-mono text-sm">{taskId}</p>
						</div>
						<div>
							<label className="text-sm text-default-500">Space ID</label>
							<p className="mt-1 font-mono text-sm">
								{exercise.task?.spaceId ?? "-"}
							</p>
						</div>
					</div>
				</Section>
				{routines.length > 0 && (
					<Section top={<PageTitleBar level={2} title="연관 루틴" />}>
						<div className="flex flex-col gap-2">
							{routines.map((routine) => (
								<div
									key={routine.id}
									className="flex items-center justify-between rounded-lg bg-content2 p-3"
								>
									<div>
										<p className="font-medium">{routine.name}</p>
										<p className="text-sm text-default-500">
											{routine.label || "-"}
										</p>
									</div>
									<div className="text-sm text-default-400">
										<DateTimeCell value={routine.createdAt} />
									</div>
								</div>
							))}
						</div>
					</Section>
				)}
			</VStack>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>태스크 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{exercise.name}</strong> 운동 detail이 포함된 태스크를
							삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							이 작업은 되돌릴 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Page>
	);
}

export default observer(TaskExerciseDetailPageClient);
