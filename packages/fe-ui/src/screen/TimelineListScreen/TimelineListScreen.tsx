"use client";

import type { TimelineDto } from "@cocrepo/api/core/timelines";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	SectionSurface,
	buildTimelineTableColumns,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button } from "../../action/Button/Button";
import { Modal, useOverlayState } from "@heroui/react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "타임라인 이름으로 검색...",
	},
];

export const adminTimelinesPageQueryInputs = [...leftInputs];

export interface TimelineListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
}
export type TimelineListScreenSetQueryStates = DataGridSetQueryStates;

export interface TimelineListScreenProps {
	timelines?: TimelineDto[];
	totalCount: number;
	isLoading: boolean;
	isDeleting: boolean;
	queryStates: TimelineListScreenQueryStates;
	setQueryStates: TimelineListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onDeleteTimeline: (timelineId: string) => Promise<void>;
}

function TimelinesScreenFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="타임라인"
				description="학기/시즌 단위 타임라인을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface/70">
				{null}
			</SectionSurface>
		</div>
	);
}

export const TimelineListScreen = observer(
	({
		timelines,
		totalCount,
		isLoading,
		isDeleting,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onDeleteTimeline,
	}: TimelineListScreenProps) => {
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const timelineRows = timelines ?? [];
		const [deleteTarget, setDeleteTarget] = useState<TimelineDto | null>(null);
		const deleteModal = useOverlayState();
		const onClickDeleteIcon = (timelineId: string) => {
			const targetTimeline = timelineRows.find(
				(timeline) => timeline.id === timelineId,
			);
			if (!targetTimeline) {
				return;
			}
			setDeleteTarget(targetTimeline);
			deleteModal.open();
		};
		const columns = buildTimelineTableColumns<TimelineDto>({
			onClickDeleteButton: onClickDeleteIcon,
		});

		if (isLoading) {
			return <TimelinesScreenFallback />;
		}

		return (
			<div className="space-y-5">
				<PageTitleBar
					title="타임라인"
					description="학기/시즌 단위 타임라인을 관리합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							타임라인 등록
						</Button>
					}
				/>
				<SectionSurface className="overflow-hidden rounded-2xl border-border/80 bg-surface/70">
					<DataGrid
						config={{
							entity: "Timeline",
							columns,
							leftInputs,
							emptyMessage: "등록된 타임라인이 없습니다.",
						}}
						rows={timelineRows}
						totalCount={totalCount}
						state={gridState}
					/>
				</SectionSurface>
				<Modal state={deleteModal}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>타임라인 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{deleteTarget?.name}</strong> 타임라인을
										삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										세션이 있는 타임라인은 삭제할 수 없습니다.
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
											void onDeleteTimeline(deleteTarget.id).then(() => {
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
