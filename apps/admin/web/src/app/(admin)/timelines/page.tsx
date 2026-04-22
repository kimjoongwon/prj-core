"use client";

import {
	getGetTimelinesQueryKey,
	type TimelineDto,
	useDeleteTimeline,
	useGetTimelines,
} from "@cocrepo/api/core/timelines";
import {
	adminTimelinesPageQueryInputs,
	TimelineListPage,
	type TimelineListPageTimeline,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function TimelinesPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminTimelinesPageQueryInputs,
	);
	const { data: response, isLoading } = useGetTimelines(
		getTimelineParams(queryStates),
	);
	const deleteMutation = useDeleteTimeline();
	const timelines = (response?.data ?? []).map(mapTimelineRow);

	return (
		<TimelineListPage
			timelines={timelines}
			totalCount={response?.meta?.total ?? 0}
			isLoading={isLoading}
			isDeleting={deleteMutation.isPending}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/timelines/new" as Route);
			}}
			onDeleteTimeline={async (timelineId) => {
				try {
					await deleteMutation.mutateAsync({ timelineId });
					await queryClient.invalidateQueries({
						queryKey: getGetTimelinesQueryKey(),
					});
					addToast({
						title: "삭제 성공",
						description: "타임라인이 삭제되었습니다.",
						color: "success",
					});
				} catch (error) {
					addToast({
						title: "삭제 실패",
						description:
							"타임라인 삭제 중 오류가 발생했습니다. 세션이 있는 타임라인은 삭제할 수 없습니다.",
						color: "danger",
					});
					throw error;
				}
			}}
		/>
	);
});

function getTimelineParams(
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0],
) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	};
}

function mapTimelineRow(timeline: TimelineDto): TimelineListPageTimeline {
	return {
		id: timeline.id,
		name: timeline.name,
		href: `/timelines/${timeline.id}` as Route,
		description: timeline.description,
		createdAt: timeline.createdAt,
	};
}
