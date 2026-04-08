"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig } from "@cocrepo/type";
import {
	buildTimelineTableColumns,
	MetaDataGrid,
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
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useState } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "타임라인 이름으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

export const adminTimelinesPageQueryInputs = [...leftInputs];

export type AdminTimelinesPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type AdminTimelinesPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface AdminTimelinesPageTimeline {
	id: string;
	name: string;
	href: Route;
	description?: string | null;
	createdAt: string | Date | null;
}

export interface AdminTimelinesPageProps {
	timelines: AdminTimelinesPageTimeline[];
	totalCount: number;
	isLoading: boolean;
	isDeleting: boolean;
	queryStates: AdminTimelinesPageQueryStates;
	setQueryStates: AdminTimelinesPageSetQueryStates;
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

export const AdminTimelinesPage = observer(({
	timelines,
	totalCount,
	isLoading,
	isDeleting,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onDeleteTimeline,
}: AdminTimelinesPageProps) => {
	const [deleteTarget, setDeleteTarget] =
		useState<AdminTimelinesPageTimeline | null>(null);
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
	const columns = buildTimelineTableColumns<AdminTimelinesPageTimeline>({
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
						data: timelines,
						totalCount,
						isLoading: false,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 타임라인이 없습니다.",
					}}
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
