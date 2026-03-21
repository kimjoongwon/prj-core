"use client";

import {
	getGetRoutinesQueryKey,
	type RoutineDto,
	useDeleteRoutine,
	useGetRoutinesSuspense,
} from "@cocrepo/api/core/routines";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageTitleBar,
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
import { Plus, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

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

type RoutinesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetRoutinesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

function getRoutineParams(queryStates: RoutinesQueryStates) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	};
}

function buildRoutineColumns({
	onClickRoutineName,
	onClickDeleteButton,
}: {
	onClickRoutineName: (routine: RoutineDto) => void;
	onClickDeleteButton: (routine: RoutineDto) => void;
}): MetaDataGridColumnConfig<RoutineDto>[] {
	return [
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
}

const RoutinesPageContent = observer(function RoutinesPageContent({
	queryStates,
	setQueryStates,
	columns,
}: {
	queryStates: RoutinesQueryStates;
	setQueryStates: SetRoutinesQueryStates;
	columns: MetaDataGridColumnConfig<RoutineDto>[];
}) {
	const { data: response } = useGetRoutinesSuspense(
		getRoutineParams(queryStates),
	);
	const routines = (response?.data ?? []) as RoutineDto[];
	const totalCount = response?.meta?.total ?? 0;

	return (
		<MetaDataGrid
			config={{
				entity: "Routine",
				data: routines,
				totalCount,
				isLoading: false,
				queryStates,
				setQueryStates,
				columns,
				leftInputs,
				emptyMessage: "등록된 루틴이 없습니다.",
			}}
		/>
	);
});

function RoutinesPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="루틴"
				description="운동 루틴(커리큘럼)을 관리합니다."
			/>
			<div className="h-32 rounded-2xl border border-divider/80 bg-content1/70" />
		</div>
	);
}

const RoutinesPageInner = observer(function RoutinesPageInner() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
	const state = useLocalObservable(() => ({
		deleteTarget: null as RoutineDto | null,
	}));
	const deleteModal = useDisclosure();
	const deleteMutation = useDeleteRoutine();

	const onClickRoutineName = (routine: RoutineDto) => {
		router.push(`/routines/${routine.id}`);
	};

	const onClickDeleteButton = (routine: RoutineDto) => {
		state.deleteTarget = routine;
		deleteModal.onOpen();
	};

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

	const columns = buildRoutineColumns({
		onClickRoutineName,
		onClickDeleteButton,
	});

	return (
		<div className="space-y-5">
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
			<div className="overflow-hidden rounded-2xl border border-divider/80 bg-content1/70">
				<Suspense
					fallback={
						<MetaDataGrid
							config={{
								entity: "Routine",
								data: [],
								totalCount: 0,
								isLoading: true,
								queryStates,
								setQueryStates,
								columns,
								leftInputs,
								emptyMessage: "등록된 루틴이 없습니다.",
							}}
						/>
					}
				>
					<RoutinesPageContent
						queryStates={queryStates}
						setQueryStates={setQueryStates}
						columns={columns}
					/>
				</Suspense>
			</div>
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
		</div>
	);
});

export default observer(function RoutinesPage() {
	return (
		<Suspense fallback={<RoutinesPageFallback />}>
			<RoutinesPageInner />
		</Suspense>
	);
});
