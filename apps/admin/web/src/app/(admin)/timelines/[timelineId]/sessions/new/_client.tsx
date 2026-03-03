"use client";

import type { CreateSessionDtoRecurringDayOfWeek } from "@cocrepo/api";
import { useCreateSession, useGetTimelineById } from "@cocrepo/api";
import { VStack } from "@cocrepo/ui";
import {
	addToast,
	Button,
	Input,
	Select,
	SelectItem,
	Textarea,
} from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface SessionNewPageClientProps {
	timelineId: string;
}

type SessionType = "ONE_TIME" | "ONE_TIME_RANGE" | "RECURRING";
type CycleType = "WEEKLY" | "MONTHLY";

const SESSION_TYPE_OPTIONS = [
	{ value: "ONE_TIME", label: "일회성 특강" },
	{ value: "ONE_TIME_RANGE", label: "기간형 집중 프로그램" },
	{ value: "RECURRING", label: "정기 반복 클래스" },
];

const SESSION_TYPE_DESCRIPTIONS: Record<SessionType, string> = {
	ONE_TIME: "특정 일시에 한 번만 진행되는 수업입니다.",
	ONE_TIME_RANGE: "특정 기간 동안 집중적으로 진행되는 프로그램입니다.",
	RECURRING: "매주 또는 매월 반복되는 정기 수업입니다.",
};

const DAY_OF_WEEK_OPTIONS: {
	value: CreateSessionDtoRecurringDayOfWeek;
	label: string;
}[] = [
	{ value: "MONDAY", label: "월요일" },
	{ value: "TUESDAY", label: "화요일" },
	{ value: "WEDNESDAY", label: "수요일" },
	{ value: "THURSDAY", label: "목요일" },
	{ value: "FRIDAY", label: "금요일" },
	{ value: "SATURDAY", label: "토요일" },
	{ value: "SUNDAY", label: "일요일" },
];

const CYCLE_TYPE_OPTIONS = [
	{ value: "WEEKLY", label: "주간" },
	{ value: "MONTHLY", label: "월간" },
];

/**
 * 세션 등록 페이지 - 클라이언트 컴포넌트
 */
function SessionNewPageClient({ timelineId }: SessionNewPageClientProps) {
	const router = useRouter();

	const state = useLocalObservable(() => ({
		name: "",
		type: "ONE_TIME" as SessionType,
		description: "",
		startDateTime: "",
		endDateTime: "",
		recurringDayOfWeek: null as CreateSessionDtoRecurringDayOfWeek | null,
		repeatCycleType: "" as CycleType | "",
		errors: {} as Record<string, string>,
	}));

	const { data: timelineResponse } = useGetTimelineById(timelineId);
	const timeline = timelineResponse?.data;

	const { mutate: createSession, isPending } = useCreateSession();

	const onClickCancelButton = () => {
		router.push(`/timelines/${timelineId}` as Route);
	};

	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeType = (value: string) => {
		state.type = value as SessionType;
		// 유형 변경 시 일정 관련 값 초기화
		state.startDateTime = "";
		state.endDateTime = "";
		state.recurringDayOfWeek = null;
		state.repeatCycleType = "";
		state.errors = {};
	};

	const onChangeDescription = (value: string) => {
		state.description = value;
	};

	const onChangeStartDateTime = (value: string) => {
		state.startDateTime = value;
		delete state.errors.startDateTime;
	};

	const onChangeEndDateTime = (value: string) => {
		state.endDateTime = value;
		delete state.errors.endDateTime;
	};

	const onChangeDayOfWeek = (value: string) => {
		state.recurringDayOfWeek = value as CreateSessionDtoRecurringDayOfWeek;
		delete state.errors.recurringDayOfWeek;
	};

	const onChangeCycleType = (value: string) => {
		state.repeatCycleType = value as CycleType;
		delete state.errors.repeatCycleType;
	};

	const onClickSubmitButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "세션명을 입력해주세요.";
		} else if (state.name.trim().length > 100) {
			errors.name = "세션명은 100자 이하로 입력해주세요.";
		}

		if (state.type === "ONE_TIME" && !state.startDateTime) {
			errors.startDateTime = "일시를 입력해주세요.";
		}

		if (state.type === "ONE_TIME_RANGE") {
			if (!state.startDateTime)
				errors.startDateTime = "시작 일시를 입력해주세요.";
			if (!state.endDateTime) errors.endDateTime = "종료 일시를 입력해주세요.";
			if (
				state.startDateTime &&
				state.endDateTime &&
				state.startDateTime >= state.endDateTime
			) {
				errors.endDateTime = "종료 일시는 시작 일시 이후여야 합니다.";
			}
		}

		if (state.type === "RECURRING") {
			if (!state.recurringDayOfWeek)
				errors.recurringDayOfWeek = "반복 요일을 선택해주세요.";
			if (!state.repeatCycleType)
				errors.repeatCycleType = "반복 주기를 선택해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		createSession(
			{
				timelineId,
				data: {
					name: state.name.trim(),
					type: state.type,
					timelineId,
					description: state.description.trim() || undefined,
					startDateTime: state.startDateTime || undefined,
					endDateTime: state.endDateTime || undefined,
					recurringDayOfWeek: state.recurringDayOfWeek || undefined,
					repeatCycleType: state.repeatCycleType || undefined,
				},
			},
			{
				onSuccess: (response) => {
					addToast({
						title: "등록 성공",
						description: "세션이 등록되었습니다.",
						color: "success",
					});
					const newId = response.data?.id;
					if (newId) {
						router.push(`/timelines/${timelineId}/sessions/${newId}` as Route);
					} else {
						router.push(`/timelines/${timelineId}` as Route);
					}
				},
				onError: () => {
					addToast({
						title: "등록 실패",
						description: "세션 등록 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	return (
        <section><div className="flex items-start justify-between gap-4"><div><h1>{"세션 등록"}</h1>{`${timeline?.name ?? ""}에 세션을 등록합니다.` && <p>{`${timeline?.name ?? ""}에 세션을 등록합니다.`}</p>}</div><div>{<Button variant="flat" onPress={onClickCancelButton}>취소
                                                    </Button>}</div></div>
            <VStack gap={4}>
                <section><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2"><div><h2>{"기본 정보"}</h2></div></div></div>
                    <VStack gap={4}>
                        <Input
                            label="세션명"
                            labelPlacement="outside"
                            placeholder="예: 월요일 오전 요가 클래스"
                            value={state.name}
                            onValueChange={onChangeName}
                            isRequired
                            isInvalid={!!state.errors.name}
                            errorMessage={state.errors.name} />
                        <Select
                            label="세션 유형"
                            labelPlacement="outside"
                            selectedKeys={[state.type]}
                            onSelectionChange={keys => {
                                const val = Array.from(keys)[0] as string;
                                if (val)
                                    onChangeType(val);
                            }}
                            isRequired>
                            {SESSION_TYPE_OPTIONS.map(opt => (<SelectItem key={opt.value}>{opt.label}</SelectItem>))}
                        </Select>
                        <p className="text-sm text-default-500">
                            {SESSION_TYPE_DESCRIPTIONS[state.type]}
                        </p>
                        <Textarea
                            label="설명"
                            labelPlacement="outside"
                            placeholder="세션에 대한 부가 설명을 입력하세요."
                            value={state.description}
                            onValueChange={onChangeDescription}
                            maxLength={500}
                            description={`${state.description.length} / 500`} />
                    </VStack>
                </section>
                <section><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2"><div><h2>{"일정 설정"}</h2></div></div></div>
                    <VStack gap={4}>
                        {state.type === "ONE_TIME" && (<Input
                            label="일시"
                            labelPlacement="outside"
                            type="datetime-local"
                            value={state.startDateTime}
                            onValueChange={onChangeStartDateTime}
                            isRequired
                            isInvalid={!!state.errors.startDateTime}
                            errorMessage={state.errors.startDateTime} />)}
                        {state.type === "ONE_TIME_RANGE" && (<>
                            <Input
                                label="시작 일시"
                                labelPlacement="outside"
                                type="datetime-local"
                                value={state.startDateTime}
                                onValueChange={onChangeStartDateTime}
                                isRequired
                                isInvalid={!!state.errors.startDateTime}
                                errorMessage={state.errors.startDateTime} />
                            <Input
                                label="종료 일시"
                                labelPlacement="outside"
                                type="datetime-local"
                                value={state.endDateTime}
                                onValueChange={onChangeEndDateTime}
                                isRequired
                                isInvalid={!!state.errors.endDateTime}
                                errorMessage={state.errors.endDateTime} />
                        </>)}
                        {state.type === "RECURRING" && (<>
                            <div className="flex gap-4">
                                <Select
                                    label="반복 요일"
                                    labelPlacement="outside"
                                    selectedKeys={state.recurringDayOfWeek ? [state.recurringDayOfWeek] : []}
                                    onSelectionChange={keys => {
                                        const val = Array.from(keys)[0] as string;
                                        if (val)
                                            onChangeDayOfWeek(val);
                                    }}
                                    isRequired
                                    isInvalid={!!state.errors.recurringDayOfWeek}
                                    errorMessage={state.errors.recurringDayOfWeek}
                                    className="flex-1">
                                    {DAY_OF_WEEK_OPTIONS.map(opt => (<SelectItem key={opt.value ?? ""}>{opt.label}</SelectItem>))}
                                </Select>
                                <Select
                                    label="반복 주기"
                                    labelPlacement="outside"
                                    selectedKeys={state.repeatCycleType ? [state.repeatCycleType] : []}
                                    onSelectionChange={keys => {
                                        const val = Array.from(keys)[0] as string;
                                        if (val)
                                            onChangeCycleType(val);
                                    }}
                                    isRequired
                                    isInvalid={!!state.errors.repeatCycleType}
                                    errorMessage={state.errors.repeatCycleType}
                                    className="flex-1">
                                    {CYCLE_TYPE_OPTIONS.map(opt => (<SelectItem key={opt.value}>{opt.label}</SelectItem>))}
                                </Select>
                            </div>
                            <Input
                                label="시작 일시 (선택)"
                                labelPlacement="outside"
                                type="datetime-local"
                                value={state.startDateTime}
                                onValueChange={onChangeStartDateTime} />
                            <Input
                                label="종료 일시 (선택)"
                                labelPlacement="outside"
                                type="datetime-local"
                                value={state.endDateTime}
                                onValueChange={onChangeEndDateTime} />
                        </>)}
                    </VStack>
                </section>
                <div className="flex justify-end">
                    <Button
                        color="primary"
                        onPress={onClickSubmitButton}
                        isLoading={isPending}
                        isDisabled={!state.name.trim()}>등록
                                            </Button>
                </div>
            </VStack>
        </section>
    );
}

export default observer(SessionNewPageClient);
