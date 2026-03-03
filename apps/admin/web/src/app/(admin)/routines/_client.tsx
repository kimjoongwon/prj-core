"use client";

import { getGetRoutinesQueryKey, type RoutineDto, useDeleteRoutine, useGetRoutines, } from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell, MetaDataGrid, Page, PageTitleBar, Section, useMetaDataGridQueryStates } from "@cocrepo/ui";
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
import { Plus, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 좌측 입력 정의 (검색 + Space 범위 필터)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "루틴명으로 검색...",
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
 * 루틴 목록 페이지 - 클라이언트 컴포넌트
 */
function RoutinesPageClient() {
	const router = useRouter();
	const queryClient = useQueryClient();

	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	// 삭제 대상 상태
	const state = useLocalObservable(() => ({
		deleteTarget: null as RoutineDto | null,
	}));
	const deleteModal = useDisclosure();

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetRoutines({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	});

	const routines = (response?.data ?? []) as RoutineDto[];
	const meta = response?.meta;
	const totalCount = meta?.total ?? 0;

	// 삭제 뮤테이션
	const deleteMutation = useDeleteRoutine();

	/** 루틴명 클릭 시 상세 페이지 이동 */
	const onClickRoutineName = (routine: RoutineDto) => {
		router.push(`/routines/${routine.id}`);
	};

	/** 삭제 버튼 클릭 시 모달 열기 */
	const onClickDeleteButton = (routine: RoutineDto) => {
		state.deleteTarget = routine;
		deleteModal.onOpen();
	};

	/** 삭제 확인 핸들러 */
	const onClickDeleteConfirm = () => {
		const target = state.deleteTarget;
		if (!target) return;

		deleteMutation.mutate(
			{ routineId: target.id },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "루틴이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					state.deleteTarget = null;
					queryClient.invalidateQueries({
						queryKey: getGetRoutinesQueryKey(),
					});
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

	/**
	 * 컬럼 정의
	 */
	const columns: MetaDataGridColumnConfig<RoutineDto>[] = [
		{
			field: "name",
			label: "루틴명",
			size: 200,
			isRequired: true,
			cell: ({ getValue, row }) => (
				<button
					type="button"
					className="text-primary hover:underline cursor-pointer text-left"
					onClick={() => onClickRoutineName(row.original as RoutineDto)}
				>
					{getValue() as string}
				</button>
			),
		},
		{
			field: "label",
			label: "라벨",
			size: 150,
			cell: ({ getValue }) => (
				<span className="text-default-600">
					{(getValue() as string) || "-"}
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
					className="text-danger hover:text-danger-600 cursor-pointer flex items-center justify-center"
					onClick={() => onClickDeleteButton(row.original as RoutineDto)}
				>
					<Trash2 className="size-4" />
				</button>
			),
		},
	];

	return (
		<Page
			top={
				<PageTitleBar
					title="루틴"
					description="운동 루틴(커리큘럼)을 관리합니다."
					actions={
						<Button
							as={Link}
							href="/routines/new"
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
						>
							루틴 등록
						</Button>
					}
				/>
			}
		>
			<Section>
				<MetaDataGrid
					config={{
						entity: "Routine",
						data: routines,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 루틴이 없습니다.",
					}}
				/>
			</Section>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>루틴 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{state.deleteTarget?.name}</strong> 루틴을
							삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.
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
		</Page>
	);
}

export default observer(RoutinesPageClient);
