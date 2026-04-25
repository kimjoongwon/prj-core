"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildRoutineTableColumns,
	MetaDataGrid,
	MetaDataGridStateModel,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "루틴명으로 검색...",
		props: {
			placement: "column-header",
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

export const adminRoutinesPageQueryInputs = [...leftInputs];

export interface RoutineListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}
export type RoutineListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface RoutineListPageRoutine {
	id: string;
	name: string;
	label?: string | null;
	createdAt: string | Date | null;
}

export interface RoutineListPageProps {
	routines: RoutineListPageRoutine[];
	totalCount: number;
	isLoading: boolean;
	isDeleting: boolean;
	queryStates: RoutineListPageQueryStates;
	setQueryStates: RoutineListPageSetQueryStates;
	onClickCreateButton: () => void;
	onClickRoutineName: (routineId: string) => void;
	onDeleteRoutine: (routineId: string) => Promise<void>;
}

function RoutinesPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="루틴"
				description="운동 루틴(커리큘럼)을 관리합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

export const RoutineListPage = observer(({
	routines,
	totalCount,
	isLoading,
	isDeleting,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onClickRoutineName,
	onDeleteRoutine,
}: RoutineListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	const [deleteTarget, setDeleteTarget] =
		useState<RoutineListPageRoutine | null>(null);
	const deleteModal = useDisclosure();
	const onClickDeleteButton = (routineId: string) => {
		const targetRoutine = routines.find((routine) => routine.id === routineId);
		if (!targetRoutine) {
			return;
		}
		setDeleteTarget(targetRoutine);
		deleteModal.onOpen();
	};
	const columns = buildRoutineTableColumns<RoutineListPageRoutine>({
		onClickRoutineName,
		onClickDeleteButton,
	});

	if (isLoading) {
		return <RoutinesPageFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="루틴"
				description="운동 루틴(커리큘럼)을 관리합니다."
				actions={
					<Button
						color="primary"
						startContent={<Plus className="h-4 w-4" />}
						onPress={onClickCreateButton}
					>
						루틴 등록
					</Button>
				}
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "Routine",
						columns,
						leftInputs,
						emptyMessage: "등록된 루틴이 없습니다.",
					}}
	rows={routines}
	totalCount={totalCount}
	isLoading={false}
	state={gridState}
/>
			</Surface>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>루틴 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{deleteTarget?.name}</strong> 루틴을 삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.
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
							onPress={() => {
								if (!deleteTarget) {
									return;
								}
								void onDeleteRoutine(deleteTarget.id).then(() => {
									deleteModal.onClose();
									setDeleteTarget(null);
								});
							}}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
});
