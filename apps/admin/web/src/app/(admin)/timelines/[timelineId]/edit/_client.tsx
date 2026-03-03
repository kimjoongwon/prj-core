"use client";

import {
	getGetTimelineByIdQueryKey,
	useGetTimelineById,
	useUpdateTimeline,
} from "@cocrepo/api";
import { Page, PageHeader, Section, VStack } from "@cocrepo/ui";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TimelineEditPageClientProps {
	timelineId: string;
}

/**
 * 타임라인 수정 페이지 - 클라이언트 컴포넌트
 */
function TimelineEditPageClient({ timelineId }: TimelineEditPageClientProps) {
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

	// 기존 데이터로 초기화
	useEffect(() => {
		if (timeline && !state.isInitialized) {
			state.name = timeline.name;
			state.description = timeline.description ?? "";
			state.isInitialized = true;
		}
	}, [timeline, state]);

	const { mutate: updateTimeline, isPending } = useUpdateTimeline();

	const onClickCancelButton = () => {
		router.push(`/timelines/${timelineId}` as Route);
	};

	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeDescription = (value: string) => {
		state.description = value;
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

	// 변경 감지 (수정 버튼 활성화 조건)
	const hasChanged =
		state.isInitialized &&
		(state.name !== (timeline?.name ?? "") ||
			state.description !== (timeline?.description ?? ""));

	const pageActions = (
		<Button variant="flat" onPress={onClickCancelButton}>
			취소
		</Button>
	);

	return (
		<Page
			mode="content"
			top={
				<PageHeader
					title="타임라인 수정"
					description={timeline?.name}
					actions={pageActions}
				/>
			}
		>
			<Section mode="content">
				<VStack gap={4}>
					<Input
						label="타임라인명"
						labelPlacement="outside"
						placeholder="타임라인명을 입력하세요."
						value={state.name}
						onValueChange={onChangeName}
						isRequired
						isInvalid={!!state.errors.name}
						errorMessage={state.errors.name}
					/>
					<Textarea
						label="설명"
						labelPlacement="outside"
						placeholder="타임라인에 대한 부가 설명을 입력하세요."
						value={state.description}
						onValueChange={onChangeDescription}
						maxLength={500}
						description={`${state.description.length} / 500`}
						isInvalid={!!state.errors.description}
						errorMessage={state.errors.description}
					/>
					<div className="flex justify-end">
						<Button
							color="primary"
							onPress={onClickSubmitButton}
							isLoading={isPending}
							isDisabled={!hasChanged || !state.name.trim()}
						>
							수정
						</Button>
					</div>
				</VStack>
			</Section>
		</Page>
	);
}

export default observer(TimelineEditPageClient);
