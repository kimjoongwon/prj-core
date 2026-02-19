"use client";

import {
	type ExerciseDto,
	getGetExercisesQueryKey,
	useDeleteExercise,
	useGetExercises,
} from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageSurface,
	SectionSurface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 초 단위를 "분:초" 형식으로 변환합니다.
 * 예: 90초 → "1분 30초", 60초 → "1분 0초", 30초 → "30초"
 */
const formatDuration = (seconds: number) => {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

/**
 * 좌측 입력 정의 (검색 + Space 범위 필터)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "운동명으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
	{
		type: "select",
		id: "spaceScope",
		placeholder: "Space 범위",
		props: {
			options: [
				{ label: "현재 Space만", value: "CURRENT" },
				{ label: "상위 Space 포함", value: "INCLUDE_ANCESTORS" },
			],
		},
	},
];

/**
 * 운동 종목 목록 페이지 - 클라이언트 컴포넌트
 */
function ExercisesPageClient() {
	const router = useRouter();
	const queryClient = useQueryClient();

	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	// 삭제 대상 상태
	const state = useLocalObservable(() => ({
		deleteTarget: null as ExerciseDto | null,
	}));
	const deleteModal = useDisclosure();

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetExercises({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	});

	const exercises = (response?.data ?? []) as ExerciseDto[];
	const meta = response?.meta;
	const totalCount = meta?.total ?? 0;

	// 삭제 뮤테이션
	const deleteMutation = useDeleteExercise();

	/** 운동명 클릭 시 상세 페이지 이동 */
	const onClickExerciseName = (exercise: ExerciseDto) => {
		router.push(`/exercises/${exercise.id}`);
	};

	/** 삭제 버튼 클릭 시 모달 열기 */
	const onClickDeleteButton = (exercise: ExerciseDto) => {
		state.deleteTarget = exercise;
		deleteModal.onOpen();
	};

	/** 삭제 확인 핸들러 */
	const onClickDeleteConfirm = () => {
		const target = state.deleteTarget;
		if (!target) return;

		deleteMutation.mutate(
			{ exerciseId: target.id },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "운동 종목이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					state.deleteTarget = null;
					queryClient.invalidateQueries({
						queryKey: getGetExercisesQueryKey(),
					});
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

	/**
	 * 컬럼 정의
	 */
	const columns: MetaDataGridColumnConfig<ExerciseDto>[] = [
		{
			field: "name",
			label: "운동명",
			size: 200,
			isRequired: true,
			cell: ({ getValue, row }) => (
				<button
					type="button"
					className="text-primary hover:underline cursor-pointer text-left"
					onClick={() => onClickExerciseName(row.original as ExerciseDto)}
				>
					{getValue() as string}
				</button>
			),
		},
		{
			field: "duration",
			label: "지속시간",
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<span>{formatDuration(getValue() as number)}</span>
			),
		},
		{
			field: "count",
			label: "반복횟수",
			size: 80,
			align: "center",
			cell: ({ getValue }) => <span>{getValue() as number}회</span>,
		},
		{
			field: "description",
			label: "설명",
			size: 250,
			cell: ({ getValue }) => (
				<span className="text-default-500 text-sm line-clamp-2">
					{(getValue() as string | undefined) || "-"}
				</span>
			),
		},
		{
			field: "createdAt",
			label: "등록일",
			size: 150,
			cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
		},
		{
			field: "id",
			label: "액션",
			size: 80,
			align: "center",
			cell: ({ row }) => (
				<button
					type="button"
					className="text-danger hover:text-danger-600 cursor-pointer text-sm"
					onClick={() => onClickDeleteButton(row.original as ExerciseDto)}
				>
					삭제
				</button>
			),
		},
	];

	return (
		<PageSurface
			title="운동 종목"
			description="루틴에서 사용할 운동 콘텐츠를 관리합니다."
			actions={
				<Button
					as={Link}
					href="/exercises/new"
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
				>
					운동 등록
				</Button>
			}
		>
			<SectionSurface>
				<MetaDataGrid
					config={{
						entity: "Exercise",
						data: exercises,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 운동 종목이 없습니다.",
					}}
				/>
			</SectionSurface>

			{/* 삭제 확인 모달 */}
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>운동 종목 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{state.deleteTarget?.name}</strong> 운동을
							삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							루틴에서 사용 중인 운동은 삭제할 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={deleteMutation.isPending}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={deleteMutation.isPending}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</PageSurface>
	);
}

export default observer(ExercisesPageClient);
