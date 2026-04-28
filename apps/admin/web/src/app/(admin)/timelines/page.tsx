"use client";

import {
	getGetTimelinesQueryKey,
	useDeleteTimeline,
	useGetTimelines,
} from "@cocrepo/api/core/timelines";
import { TimelineListPage } from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

interface TimelinesQueryStates {
	take: number;
	skip: number;
	search: string;
}

export default observer(function TimelinesPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
	});
	const timelineParams = getTimelineParams(queryStates);
	const { data: response, isLoading } = useGetTimelines(timelineParams);
	const deleteMutation = useDeleteTimeline();

	return (
		<TimelineListPage
			timelines={response?.data}
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

function getTimelineParams(queryStates: TimelinesQueryStates) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	};
}
