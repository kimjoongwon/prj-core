"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildTimelineTableColumns,
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
import type { Route } from "next";
import { useEffect, useState } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "타임라인 이름으로 검색...",
		props: {
			placement: "column-header",
		},
	},
];

export const adminTimelinesPageQueryInputs = [...leftInputs];

export interface TimelineListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
}
export type TimelineListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface TimelineListPageTimeline {
	id: string;
	name: string;
	href: Route;
	description?: string | null;
	createdAt: string | Date | null;
}

export interface TimelineListPageProps {
	timelines: TimelineListPageTimeline[];
	totalCount: number;
	isLoading: boolean;
	isDeleting: boolean;
	queryStates: TimelineListPageQueryStates;
	setQueryStates: TimelineListPageSetQueryStates;
	onClickCreateButton: () => void;
	onDeleteTimeline: (timelineId: string) => Promise<void>;
}

function TimelinesPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="타임라인"
				description="학기/시즌 단위 타임라인을 관리합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

export const TimelineListPage = observer(({
	timelines,
	totalCount,
	isLoading,
	isDeleting,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onDeleteTimeline,
}: TimelineListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	const [deleteTarget, setDeleteTarget] =
		useState<TimelineListPageTimeline | null>(null);
	const deleteModal = useDisclosure();
	const onClickDeleteIcon = (timelineId: string) => {
		const targetTimeline = timelines.find(
			(timeline) => timeline.id === timelineId,
		);
		if (!targetTimeline) {
			return;
		}
		setDeleteTarget(targetTimeline);
		deleteModal.onOpen();
	};
	const columns = buildTimelineTableColumns<TimelineListPageTimeline>({
		onClickDeleteButton: onClickDeleteIcon,
	});

	if (isLoading) {
		return <TimelinesPageFallback />;
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
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "Timeline",
						columns,
						leftInputs,
						emptyMessage: "등록된 타임라인이 없습니다.",
					}}
	rows={timelines}
	totalCount={totalCount}
	isLoading={false}
	state={gridState}
/>
			</Surface>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>타임라인 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{deleteTarget?.name}</strong> 타임라인을 삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							세션이 있는 타임라인은 삭제할 수 없습니다.
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
								void onDeleteTimeline(deleteTarget.id).then(() => {
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
