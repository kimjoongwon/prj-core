"use client";

import type { RoutineDto } from "@cocrepo/api/core/routines";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildRoutineTableColumns,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	Section,
	SectionSurface,
} from "@cocrepo/ui";
import { Modal, useOverlayState } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button } from "../../action/Button/Button";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "루틴명으로 검색...",
	},
	{
		type: "select",
		id: "spaceScope",
		placeholder: "Space 범위",
		props: {
			options: [
				{
					label: "현재 Space만",
					value: "CURRENT",
				},
				{
					label: "상위 Space 포함",
					value: "INCLUDE_ANCESTORS",
				},
			],
		},
	},
];
export const adminRoutinesPageQueryInputs = [...leftInputs];
export interface RoutineListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}
export type RoutineListScreenSetQueryStates = DataGridSetQueryStates;
export interface RoutineListScreenProps {
	routines?: RoutineDto[];
	totalCount: number;
	isLoading: boolean;
	isDeleting: boolean;
	queryStates: RoutineListScreenQueryStates;
	setQueryStates: RoutineListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickRoutineName: (routineId: string) => void;
	onDeleteRoutine: (routineId: string) => Promise<void>;
}
function RoutinesScreenFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="루틴"
				description="운동 루틴(커리큘럼)을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface/70">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	);
}
export const RoutineListScreen = observer(
	({
		routines,
		totalCount,
		isLoading,
		isDeleting,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickRoutineName,
		onDeleteRoutine,
	}: RoutineListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridStateModel({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const routineRows = routines ?? [];
		const [deleteTarget, setDeleteTarget] = useState<RoutineDto | null>(null);
		const deleteModal = useOverlayState();
		const onClickDeleteButton = (routineId: string) => {
			const targetRoutine = routineRows.find(
				(routine) => routine.id === routineId,
			);
			if (!targetRoutine) {
				return;
			}
			setDeleteTarget(targetRoutine);
			deleteModal.open();
		};
		const columns = buildRoutineTableColumns<RoutineDto>({
			onClickRoutineName,
			onClickDeleteButton,
		});
		if (isLoading) {
			return <RoutinesScreenFallback />;
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
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									entity: "Routine",
									columns,
									leftInputs,
									emptyMessage: "등록된 루틴이 없습니다.",
								}}
								rows={routineRows}
								totalCount={totalCount}
								state={gridState}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
				<Modal state={deleteModal}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>루틴 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{deleteTarget?.name}</strong> 루틴을
										삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={deleteModal.close}
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
												deleteModal.close();
												setDeleteTarget(null);
											});
										}}
									>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			</div>
		);
	},
);
