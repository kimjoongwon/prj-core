"use client";

import {
	getGetTimelinesQueryKey,
	type TimelineDto,
	useDeleteTimeline,
	useGetTimelines,
} from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	Page,
	PageHeader,
	Section,
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
 * 좌측 입력 정의 (검색)
 */
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

/**
 * 타임라인 목록 페이지 - 클라이언트 컴포넌트
 */
function TimelinesPageClient() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	const state = useLocalObservable(() => ({
		deleteTarget: null as TimelineDto | null,
	}));

	const { data: response, isLoading } = useGetTimelines({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	});

	const timelines = (response?.data ?? []) as TimelineDto[];
	const meta = response?.meta;
	const totalCount = meta?.total ?? 0;

	const { mutate: deleteTimeline, isPending: isDeleting } = useDeleteTimeline();

	const deleteModal = useDisclosure();

	const onClickTimelineName = (timeline: TimelineDto) => {
		router.push(`/timelines/${timeline.id}`);
	};

	const onClickDeleteIcon = (timeline: TimelineDto) => {
		state.deleteTarget = timeline;
		deleteModal.onOpen();
	};

	const onClickDeleteConfirm = () => {
		const target = state.deleteTarget;
		if (!target) return;

		deleteTimeline(
			{ timelineId: target.id },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "타임라인이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					state.deleteTarget = null;
					queryClient.invalidateQueries({
						queryKey: getGetTimelinesQueryKey(),
					});
				},
				onError: () => {
					addToast({
						title: "삭제 실패",
						description:
							"타임라인 삭제 중 오류가 발생했습니다. 세션이 있는 타임라인은 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	const columns: MetaDataGridColumnConfig<TimelineDto>[] = [
		{
			field: "name",
			label: "타임라인명",
			size: 200,
			isRequired: true,
			cell: ({ getValue, row }) => (
				<button
					type="button"
					className="text-primary hover:underline cursor-pointer text-left"
					onClick={() => onClickTimelineName(row.original as TimelineDto)}
				>
					{getValue() as string}
				</button>
			),
		},
		{
			field: "description",
			label: "설명",
			size: 300,
			cell: ({ getValue }) => (
				<span className="text-default-500 text-sm line-clamp-1">
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
				<Button
					size="sm"
					color="danger"
					variant="light"
					onPress={() => onClickDeleteIcon(row.original as TimelineDto)}
				>
					삭제
				</Button>
			),
		},
	];

	return (
		<Page
			mode="content"
			top={
				<PageHeader
					title="타임라인"
					description="학기/시즌 단위 타임라인을 관리합니다."
					actions={
						<Button
							as={Link}
							href="/timelines/new"
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
						>
							타임라인 등록
						</Button>
					}
				/>
			}
		>
			<Section mode="content">
				<MetaDataGrid
					config={{
						entity: "Timeline",
						data: timelines,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 타임라인이 없습니다.",
					}}
				/>
			</Section>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>타임라인 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{state.deleteTarget?.name}</strong> 타임라인을
							삭제하시겠습니까?
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

export default observer(TimelinesPageClient);
