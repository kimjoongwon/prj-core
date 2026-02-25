"use client";

import { useCreateTimeline } from "@cocrepo/api";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button, Input, Textarea, addToast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 타임라인 등록 페이지 - 클라이언트 컴포넌트
 */
function TimelineNewPageClient() {
	const router = useRouter();

	const state = useLocalObservable(() => ({
		name: "",
		description: "",
		errors: {} as Record<string, string>,
	}));

	const { mutate: createTimeline, isPending } = useCreateTimeline();

	const onClickCancelButton = () => {
		router.push("/timelines" as Route);
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

		createTimeline(
			{
				data: {
					name: state.name.trim(),
					description: state.description.trim() || undefined,
				},
			},
			{
				onSuccess: (response) => {
					addToast({
						title: "등록 성공",
						description: "타임라인이 등록되었습니다.",
						color: "success",
					});
					const newId = response.data?.id;
					if (newId) {
						router.push(`/timelines/${newId}` as Route);
					} else {
						router.push("/timelines" as Route);
					}
				},
				onError: () => {
					addToast({
						title: "등록 실패",
						description:
							"타임라인 등록 중 오류가 발생했습니다. 이름이 중복되지 않았는지 확인해주세요.",
						color: "danger",
					});
				},
			},
		);
	};

	return (
		<PageSurface
			title="타임라인 등록"
			description="새 타임라인을 등록합니다."
			actions={
				<Button variant="flat" onPress={onClickCancelButton}>
					취소
				</Button>
			}
		>
			<SectionSurface>
				<VStack gap={4}>
					<Input
						label="타임라인명"
						labelPlacement="outside"
						placeholder="예: 2025년 가을 시즌, 10월 1주차"
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
							isDisabled={!state.name.trim()}
						>
							등록
						</Button>
					</div>
				</VStack>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(TimelineNewPageClient);
