"use client";

import {
	getGetTimelineByIdQueryKey,
	useGetTimelineById,
	useUpdateTimeline,
} from "@cocrepo/api/core/timelines";
import { useApp } from "@cocrepo/store";
import {
	Button,
	TimelineEditScreen,
	type TimelineFormState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type TimelineEditScreenParams = {
	timelineId: string;
};

const AdminTimelinesTimelineIdEditRoute = observer(() => {
	const { timelineId } = useParams<TimelineEditScreenParams>();
	const router = useRouter();
	const app = useApp();
	const queryClient = useQueryClient();

	const state = useLocalObservable<
		TimelineFormState & { isInitialized: boolean }
	>(() => ({
		name: "",
		description: "",
		errors: {},
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetTimelineById(timelineId);
	const timeline = response?.data;

	useEffect(() => {
		if (timeline && !state.isInitialized) {
			state.name = timeline.name;
			state.description = timeline.description ?? "";
			state.isInitialized = true;
		}
	}, [state, timeline]);

	const { mutate: updateTimeline, isPending } = useUpdateTimeline();

	const onClickSubmitButton = () => {
		const errors: TimelineFormState["errors"] = {};

		if (!state.name.trim()) {
			errors.name = "타임라인명을 입력해주세요.";
		} else if (state.name.trim().length > 100) {
			errors.name = "타임라인명은 100자 이하로 입력해주세요.";
		}

		if (state.description.length > 500) {
			errors.description = "설명은 500자 이하로 입력해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateTimeline(
			{
				timelineId,
				data: {
					name: state.name.trim(),
					description: state.description.trim() || undefined,
				},
			},
			{
				onSuccess: () => {
					toast.success("수정 성공", {
						description: "타임라인이 수정되었습니다.",
					});
					queryClient.invalidateQueries({
						queryKey: getGetTimelineByIdQueryKey(timelineId),
					});
					router.push(`/timelines/${timelineId}` as Route);
				},
				onError: () => {
					toast.danger("수정 실패", {
						description: "타임라인 수정 중 오류가 발생했습니다.",
					});
				},
			},
		);
	};

	const isSubmitDisabled =
		!state.isInitialized ||
		!state.name.trim() ||
		(state.name === (timeline?.name ?? "") &&
			state.description === (timeline?.description ?? ""));

	return (
		<TimelineEditScreen
			title="타임라인 수정"
			description={
				timeline?.name ? `${timeline.name} 타임라인을 수정합니다.` : undefined
			}
			state={state}
			contentLanguageCode={app.contentLanguageCode}
			isLoading={isLoading && !state.isInitialized}
			notFound={!isLoading && !timeline}
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/timelines/${timelineId}` as Route);
						}}
					>
						상세로
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending}
						isDisabled={isSubmitDisabled}
						onPress={onClickSubmitButton}
					>
						저장
					</Button>
				</div>
			}
		/>
	);
});

export default dynamic(
	() => Promise.resolve(AdminTimelinesTimelineIdEditRoute),
	{
		ssr: false,
	},
);
