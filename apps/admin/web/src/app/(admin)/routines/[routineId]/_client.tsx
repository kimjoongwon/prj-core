"use client";
import {
	type ActivityDto,
	getGetRoutinesQueryKey,
	type RoutineDto,
	useDeleteRoutine,
	useGetRoutine,
} from "@cocrepo/api/core/routines";

import {
	DateTimeCell,
	Page,
	PageSurface,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface RoutineDetailPageClientProps {
	routineId: string;
}

/**
 * 루틴 상세 페이지 - 클라이언트 컴포넌트
 */
function RoutineDetailPageClient({ routineId }: RoutineDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const deleteModal = useDisclosure();

	const { data: response } = useGetRoutine(routineId);
	const routine = response?.data as RoutineDto | undefined;

	const { mutate: deleteRoutine, isPending: isDeleting } = useDeleteRoutine();

	const onClickBackButton = () => {
		router.push("/routines" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/routines/${routineId}/edit` as Route);
	};

	const onClickDeleteConfirm = () => {
		deleteRoutine(
			{ routineId },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "루틴이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					queryClient.invalidateQueries({
						queryKey: getGetRoutinesQueryKey(),
					});
					router.push("/routines" as Route);
				},
				onError: (error) => {
					addToast({
						title: "삭제 실패",
						description:
							error.message ||
							"삭제 중 오류가 발생했습니다. 프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	if (!response) {
		return (
			<Page top={<PageTitleBar title="루틴 상세" description="로딩 중..." />}>
				<PageSurface>
					<SectionSurface>
						<div className="flex items-center justify-center p-8">
							<Spinner size="lg" />
						</div>
					</SectionSurface>
				</PageSurface>
			</Page>
		);
	}

	if (!routine) {
		return (
			<Page
				top={
					<PageTitleBar
						title="루틴 상세"
						description="루틴을 찾을 수 없습니다."
					/>
				}
			>
				<PageSurface>
					<SectionSurface>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">루틴을 찾을 수 없습니다.</p>
							<Button
								variant="flat"
								startContent={<ArrowLeft className="size-4" />}
								onPress={onClickBackButton}
							>
								목록으로
							</Button>
						</div>
					</SectionSurface>
				</PageSurface>
			</Page>
		);
	}

	const activities = (routine.activities ?? []) as ActivityDto[];
	const programs = routine.programs ?? [];
	const resolvedActivities = activities.filter((activity) =>
		Boolean(activity.task?.exercise?.name),
	).length;
	const unresolvedActivities = activities.length - resolvedActivities;

	const pageActions = (
		<div className="flex gap-2">
			<Button
				variant="flat"
				startContent={<ArrowLeft className="size-4" />}
				onPress={onClickBackButton}
			>
				목록으로
			</Button>
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
			>
				삭제
			</Button>
		</div>
	);

	return (
		<Page
			top={
				<PageTitleBar
					title={routine.name || "루틴 상세"}
					description="루틴의 상세 정보입니다."
					actions={pageActions}
				/>
			}
		>
			<PageSurface>
				<VStack gap={4}>
					<SectionSurface>
						<Section top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="text-sm text-default-500">루틴명</label>
									<p className="mt-1 font-medium">{routine.name}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">라벨</label>
									<p className="mt-1">{routine.label}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">운동 수</label>
									<p className="mt-1">{activities.length}개</p>
								</div>
								<div>
									<label className="text-sm text-default-500">연결 상태</label>
									<div className="mt-1">
										{activities.length === 0 ? (
											<Chip size="sm" variant="flat" color="warning">
												활동 없음
											</Chip>
										) : unresolvedActivities > 0 ? (
											<Chip size="sm" variant="flat" color="warning">
												확인 필요
											</Chip>
										) : (
											<Chip size="sm" variant="flat" color="success">
												정상
											</Chip>
										)}
									</div>
								</div>
								<div>
									<label className="text-sm text-default-500">등록일</label>
									<div className="mt-1">
										<DateTimeCell value={routine.createdAt} />
									</div>
								</div>
								<div>
									<label className="text-sm text-default-500">수정일</label>
									<div className="mt-1">
										<DateTimeCell value={routine.updatedAt} />
									</div>
								</div>
							</div>
						</Section>
					</SectionSurface>

					<SectionSurface>
						<Section top={<PageTitleBar level={2} title="연결 요약" />}>
							<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
								<div className="rounded-lg bg-content2 p-3">
									<p className="text-xs text-default-500">전체 활동</p>
									<p className="mt-1 text-lg font-semibold">
										{activities.length}개
									</p>
								</div>
								<div className="rounded-lg bg-content2 p-3">
									<p className="text-xs text-default-500">연결 정상</p>
									<p className="mt-1 text-lg font-semibold text-success">
										{resolvedActivities}개
									</p>
								</div>
								<div className="rounded-lg bg-content2 p-3">
									<p className="text-xs text-default-500">사용 중 프로그램</p>
									<p className="mt-1 text-lg font-semibold">
										{programs.length}개
									</p>
								</div>
							</div>
						</Section>
					</SectionSurface>

					<SectionSurface>
						<Section top={<PageTitleBar level={2} title="운동 구성" />}>
							{activities.length === 0 ? (
								<p className="text-sm text-default-500">
									등록된 활동이 없습니다.
								</p>
							) : (
								<div className="flex flex-col gap-3">
									{activities.map((activity, index) => {
										const isResolved = Boolean(activity.task?.exercise?.name);
										return (
											<div
												key={activity.id}
												className="flex flex-col gap-1 rounded-lg bg-content2 p-4"
											>
												<div className="flex items-center justify-between">
													<p className="font-medium">
														{index + 1}.{" "}
														{activity.task?.exercise?.name ?? "알 수 없는 운동"}
													</p>
													<Chip
														size="sm"
														variant="flat"
														color={isResolved ? "success" : "warning"}
													>
														{isResolved ? "정상" : "확인필요"}
													</Chip>
												</div>
												<div className="flex gap-4 text-sm text-default-500">
													<span>반복 횟수: {activity.repetitions}회</span>
													<span>
														휴식 시간:{" "}
														{activity.restTime > 0
															? `${activity.restTime}초`
															: "없음"}
													</span>
												</div>
												{activity.notes && (
													<p className="mt-1 text-sm text-default-400">
														메모: {activity.notes}
													</p>
												)}
											</div>
										);
									})}
								</div>
							)}
						</Section>
					</SectionSurface>

					<SectionSurface>
						<Section
							top={<PageTitleBar level={2} title="사용 중인 프로그램" />}
						>
							{programs.length === 0 ? (
								<p className="text-sm text-default-500">
									현재 이 루틴을 사용하는 프로그램이 없습니다.
								</p>
							) : (
								<div className="flex flex-col gap-2">
									{programs.map((program) => (
										<div
											key={program.id}
											className="flex items-center justify-between rounded-lg bg-content2 p-3"
										>
											<p className="font-medium">{program.name}</p>
										</div>
									))}
								</div>
							)}
						</Section>
					</SectionSurface>
				</VStack>
			</PageSurface>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>루틴 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{routine.name}</strong> 루틴을 삭제하시겠습니까?
						</p>
						{programs.length > 0 && (
							<p className="mt-2 text-sm text-warning">
								현재 {programs.length}개의 프로그램에서 사용 중입니다.
							</p>
						)}
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

export default observer(RoutineDetailPageClient);
