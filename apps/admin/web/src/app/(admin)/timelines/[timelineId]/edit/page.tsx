"use client";

import {
	getGetTimelineByIdQueryKey,
	useGetTimelineById,
	useUpdateTimeline,
} from "@cocrepo/api/core/timelines";
import { TimelineEditPage } from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui/heroui";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type TimelineEditPageParams = {
	timelineId: string;
};

const AdminTimelinesTimelineIdEditRoute = observer(() => {
	const { timelineId } = useParams<TimelineEditPageParams>();
	const router = useRouter();
	const queryClient = useQueryClient();

	const state = useLocalObservable(() => ({
		name: "",
		description: "",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	const { data: response } = useGetTimelineById(timelineId);
	const timeline = response?.data;

	useEffect(() => {
		if (timeline && !state.isInitialized) {
			state.name = timeline.name;
			state.description = timeline.description ?? "";
			state.isInitialized = true;
		}
	}, [state, timeline]);

	const { mutate: updateTimeline, isPending } = useUpdateTimeline();

	const onClickCancelButton = () => {
		router.push(`/timelines/${timelineId}` as Route);
	};

	const onChangeNameInput = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeDescriptionTextarea = (value: string) => {
		state.description = value;
		delete state.errors.description;
	};

	const onClickSubmitButton = () => {
		const errors: Record<string, string> = {};

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
					addToast({
						title: "수정 성공",
						description: "타임라인이 수정되었습니다.",
						color: "success",
					});
					queryClient.invalidateQueries({
						queryKey: getGetTimelineByIdQueryKey(timelineId),
					});
					router.push(`/timelines/${timelineId}` as Route);
				},
				onError: () => {
					addToast({
						title: "수정 실패",
						description: "타임라인 수정 중 오류가 발생했습니다.",
						color: "danger",
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
		<TimelineEditPage
			timelineName={timeline?.name}
			name={state.name}
			description={state.description}
			nameError={state.errors.name}
			descriptionError={state.errors.description}
			isSubmitPending={isPending}
			isSubmitDisabled={isSubmitDisabled}
			onChangeNameInput={onChangeNameInput}
			onChangeDescriptionTextarea={onChangeDescriptionTextarea}
			onClickCancelButton={onClickCancelButton}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

export default dynamic(
	() => Promise.resolve(AdminTimelinesTimelineIdEditRoute),
	{
		ssr: false,
	},
);
