import {
	OccurrencePicker,
	ScreenFrame,
	SelectableCardList,
	StatusFeedback,
	SummaryList,
	type OccurrenceOption,
	type OccurrencePickerSessionType,
	type SelectableCardItem,
	type SummaryListItem,
} from "@cocrepo/mo-ui";
import {
	useGetPrograms,
	useGetSessions,
	useGetTimelines,
	type ProgramDto,
	type SessionDto,
	type TimelineDto,
} from "@cocrepo/api/core/timelines";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { getCoreApiBaseUrl } from "@/auth/auth-config";
import { mainTabStyles as styles } from "@/tabs/main-tab-styles";

const CATALOG_QUERY_PARAMS = {
	skip: 0,
	take: 20,
};
const MAX_MEMO_LENGTH = 500;
const PENDING_BACKEND_HANDOFF_MESSAGE = "백엔드 핸드오프 대기 중입니다.";

type FieldName =
	| "timelineId"
	| "sessionId"
	| "programId"
	| "occurrenceStartAt"
	| "memo";
type FieldErrors = Partial<Record<FieldName, string>>;
type SubmitState = "idle" | "submitting" | "succeeded";

interface PendingReservationDraft {
	idempotencyKey: string;
	memo?: string;
	occurrenceStartAt: string;
	programId: string;
	sessionId: string;
	timelineId: string;
}

const isActiveRecord = (record: { removedAt?: string | null }) =>
	record.removedAt === null || record.removedAt === undefined;

const padTime = (value: number) => value.toString().padStart(2, "0");

const formatDateTime = (value?: string | null) => {
	if (!value) {
		return "일시 미정";
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return `${date.getMonth() + 1}월 ${date.getDate()}일 ${padTime(
		date.getHours(),
	)}:${padTime(date.getMinutes())}`;
};

const getSessionTypeLabel = (type: SessionDto["type"]) => {
	switch (type) {
		case "ONE_TIME":
			return "고정 일정";
		case "ONE_TIME_RANGE":
			return "시간 선택";
		case "RECURRING":
			return "반복 일정";
		default:
			return "일정";
	}
};

const getScheduleText = (session: SessionDto) => {
	if (session.type === "RECURRING") {
		return `${session.recurringDayOfWeek ?? "반복 요일 미정"} · ${
			session.repeatCycleType ?? "반복 주기 미정"
		}`;
	}

	if (session.type === "ONE_TIME_RANGE") {
		return `${formatDateTime(session.startDateTime)} - ${formatDateTime(
			session.endDateTime,
		)}`;
	}

	return formatDateTime(session.startDateTime);
};

const getActiveTimelines = (timelines?: TimelineDto[]) =>
	(timelines ?? []).filter(isActiveRecord);

const getActiveSessions = (sessions?: SessionDto[]) =>
	(sessions ?? []).filter(isActiveRecord);

const getActivePrograms = (programs?: ProgramDto[]) =>
	(programs ?? []).filter(isActiveRecord);

const createTimelineItems = (
	timelines: readonly TimelineDto[],
): SelectableCardItem[] =>
	timelines.map((timeline) => ({
		description: timeline.description || "예약 대상 설명이 준비 중입니다.",
		eyebrow: "예약 대상",
		meta: [`일정 ${timeline.sessions?.filter(isActiveRecord).length ?? 0}개`],
		title: timeline.name,
		value: timeline.id,
	}));

const createSessionItems = (
	sessions: readonly SessionDto[],
): SelectableCardItem[] =>
	sessions.map((session) => ({
		description: session.description || getScheduleText(session),
		disabledReason:
			session.type === "ONE_TIME" && !session.startDateTime
				? "고정 예약 일시가 없어 선택할 수 없습니다."
				: undefined,
		eyebrow: getSessionTypeLabel(session.type),
		isDisabled: session.type === "ONE_TIME" && !session.startDateTime,
		meta: [getScheduleText(session)],
		title: session.name,
		value: session.id,
	}));

const createProgramItems = (
	programs: readonly ProgramDto[],
): SelectableCardItem[] =>
	programs.map((program) => ({
		description:
			program.routineLabelSnapshot ||
			program.routineNameSnapshot ||
			"프로그램 상세 정보가 준비 중입니다.",
		eyebrow: "예약 옵션",
		meta: [
			`정원 ${program.capacity}명`,
			program.activityCount !== undefined
				? `활동 ${program.activityCount}개`
				: "활동 정보 준비 중",
		],
		tags: [
			program.level,
			...(program.previewExerciseNames?.slice(0, 2) ?? []),
		].filter(Boolean),
		title: program.name,
		value: program.id,
	}));

const getOccurrencePickerSessionType = (
	session?: SessionDto,
): OccurrencePickerSessionType => {
	if (!session) {
		return "ONE_TIME";
	}

	if (
		session.type === "ONE_TIME" ||
		session.type === "ONE_TIME_RANGE" ||
		session.type === "RECURRING"
	) {
		return session.type;
	}

	return "ONE_TIME";
};

const createRangeOccurrenceOptions = (
	session?: SessionDto,
): OccurrenceOption[] => {
	if (!session || session.type !== "ONE_TIME_RANGE") {
		return [];
	}

	const start = new Date(session.startDateTime ?? "");
	const end = new Date(session.endDateTime ?? "");
	if (
		Number.isNaN(start.getTime()) ||
		Number.isNaN(end.getTime()) ||
		start >= end
	) {
		return [];
	}

	const optionDates = [start];
	const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);
	if (oneHourLater < end) {
		optionDates.push(oneHourLater);
	}

	return optionDates.map((date) => ({
		description: "선택 가능한 예약 시작 시간",
		label: formatDateTime(date.toISOString()),
		value: date.toISOString(),
	}));
};

const getEffectiveOccurrenceStartAt = (
	session: SessionDto | undefined,
	occurrenceStartAt: string,
) => {
	if (session?.type === "ONE_TIME") {
		return session.startDateTime ?? "";
	}

	return occurrenceStartAt;
};

const isPastDateTime = (value: string) => {
	const date = new Date(value);
	return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
};

const isInSessionRange = (session: SessionDto, value: string) => {
	const selected = new Date(value);
	const start = new Date(session.startDateTime ?? "");
	const end = new Date(session.endDateTime ?? "");

	if (
		Number.isNaN(selected.getTime()) ||
		Number.isNaN(start.getTime()) ||
		Number.isNaN(end.getTime())
	) {
		return false;
	}

	return selected >= start && selected < end;
};

const createIdempotencyKey = () =>
	`mobile-home-${Date.now().toString(36)}-${Math.random()
		.toString(36)
		.slice(2, 10)}`;

const getErrorStatus = (error: unknown) => {
	if (!error || typeof error !== "object") {
		return undefined;
	}

	const responseStatus = (error as { response?: { status?: number } }).response
		?.status;
	if (responseStatus) {
		return responseStatus;
	}

	return (error as { status?: number; httpStatus?: number }).status ??
		(error as { status?: number; httpStatus?: number }).httpStatus;
};

const getApiErrorDescription = (error: unknown) => {
	switch (getErrorStatus(error)) {
		case 400:
			return "선택 조건을 확인해 주세요.";
		case 401:
			return "로그인이 만료되었습니다. 다시 로그인한 뒤 예약해 주세요.";
		case 403:
			return "현재 공간에서 예약 권한이 없습니다.";
		case 404:
			return "선택한 예약 대상이 더 이상 없습니다. 목록을 새로고침해 주세요.";
		case 409:
			return "이미 예약되었거나 정원이 찼습니다. 다른 일정이나 옵션을 선택해 주세요.";
		default:
			return "예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
	}
};

const validateReservationDraft = (params: {
	memo: string;
	occurrenceStartAt: string;
	program?: ProgramDto;
	session?: SessionDto;
	timeline?: TimelineDto;
}) => {
	const nextErrors: FieldErrors = {};

	if (!params.timeline) {
		nextErrors.timelineId = "예약 대상을 선택해 주세요.";
	}

	if (!params.session) {
		nextErrors.sessionId = "일정을 선택해 주세요.";
	}

	if (!params.program) {
		nextErrors.programId = "예약 옵션을 선택해 주세요.";
	}

	const occurrenceStartAt = getEffectiveOccurrenceStartAt(
		params.session,
		params.occurrenceStartAt,
	);
	if (!occurrenceStartAt) {
		nextErrors.occurrenceStartAt = "예약 일시를 선택해 주세요.";
	} else if (params.session?.type === "RECURRING") {
		nextErrors.occurrenceStartAt =
			"반복 세션은 예약 가능 회차 API가 준비되면 선택할 수 있습니다.";
	} else if (isPastDateTime(occurrenceStartAt)) {
		nextErrors.occurrenceStartAt = "과거 일시는 예약할 수 없습니다.";
	} else if (params.session?.type === "ONE_TIME_RANGE") {
		if (!isInSessionRange(params.session, occurrenceStartAt)) {
			nextErrors.occurrenceStartAt =
				"예약 일시는 선택한 일정 범위 안에서만 고를 수 있습니다.";
		}
	}

	if (params.memo.trim().length > MAX_MEMO_LENGTH) {
		nextErrors.memo = `메모는 ${MAX_MEMO_LENGTH}자 이하로 입력해 주세요.`;
	}

	return nextErrors;
};

const hasFieldErrors = (fieldErrors: FieldErrors) =>
	Object.keys(fieldErrors).length > 0;

const createSummaryItems = (params: {
	fieldErrors: FieldErrors;
	memo: string;
	occurrenceStartAt: string;
	program?: ProgramDto;
	session?: SessionDto;
	timeline?: TimelineDto;
}): SummaryListItem[] => [
	{
		helperText: params.fieldErrors.timelineId,
		label: "예약 대상",
		placeholder: "미선택",
		state: params.fieldErrors.timelineId ? "warning" : undefined,
		value: params.timeline?.name,
	},
	{
		helperText: params.fieldErrors.sessionId,
		label: "일정",
		placeholder: "미선택",
		state: params.fieldErrors.sessionId ? "warning" : undefined,
		value: params.session?.name,
	},
	{
		helperText: params.fieldErrors.programId,
		label: "예약 옵션",
		placeholder: "미선택",
		state: params.fieldErrors.programId ? "warning" : undefined,
		value: params.program?.name,
	},
	{
		helperText: params.fieldErrors.occurrenceStartAt,
		label: "예약 일시",
		placeholder: "미선택",
		state: params.fieldErrors.occurrenceStartAt ? "warning" : undefined,
		value: params.occurrenceStartAt
			? formatDateTime(params.occurrenceStartAt)
			: undefined,
	},
	{
		helperText: params.fieldErrors.memo,
		label: "메모",
		placeholder: "선택 입력",
		state: params.fieldErrors.memo ? "warning" : undefined,
		value: params.memo.trim() || undefined,
	},
];

const useHomeReservation = () => {
	const [selectedTimelineId, setSelectedTimelineId] = useState<string | null>(
		null,
	);
	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
	const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
	const [occurrenceStartAt, setOccurrenceStartAt] = useState("");
	const [memo, setMemo] = useState("");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [submitState, setSubmitState] = useState<SubmitState>("idle");
	const [pendingDraft, setPendingDraft] = useState<PendingReservationDraft | null>(
		null,
	);
	const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (submitTimerRef.current) {
				clearTimeout(submitTimerRef.current);
			}
		},
		[],
	);

	const requestOptions = { baseURL: getCoreApiBaseUrl() };
	const timelinesQuery = useGetTimelines(CATALOG_QUERY_PARAMS, {
		request: requestOptions,
	});
	const timelines = getActiveTimelines(timelinesQuery.data?.data);
	const selectedTimeline = timelines.find(
		(timeline) => timeline.id === selectedTimelineId,
	);

	const sessionsQuery = useGetSessions(
		selectedTimelineId ?? "",
		CATALOG_QUERY_PARAMS,
		{
			query: {
				enabled: Boolean(selectedTimeline),
			},
			request: requestOptions,
		},
	);
	const sessions = getActiveSessions(sessionsQuery.data?.data);
	const selectedSession = sessions.find(
		(session) => session.id === selectedSessionId,
	);

	const programsQuery = useGetPrograms(
		selectedTimelineId ?? "",
		selectedSessionId ?? "",
		CATALOG_QUERY_PARAMS,
		{
			query: {
				enabled: Boolean(selectedTimeline && selectedSession),
			},
			request: requestOptions,
		},
	);
	const programs = getActivePrograms(programsQuery.data?.data);
	const selectedProgram = programs.find(
		(program) => program.id === selectedProgramId,
	);

	const effectiveOccurrenceStartAt = getEffectiveOccurrenceStartAt(
		selectedSession,
		occurrenceStartAt,
	);
	const summaryItems = createSummaryItems({
		fieldErrors,
		memo,
		occurrenceStartAt: effectiveOccurrenceStartAt,
		program: selectedProgram,
		session: selectedSession,
		timeline: selectedTimeline,
	});

	function clearSubmitTimer() {
		if (submitTimerRef.current) {
			clearTimeout(submitTimerRef.current);
			submitTimerRef.current = null;
		}
	}

	function resetSubmitResult() {
		clearSubmitTimer();
		setPendingDraft(null);
		setSubmitState("idle");
	}

	function handleSelectTimeline(value: string) {
		resetSubmitResult();
		setFieldErrors({});
		setSelectedTimelineId(value);
		setSelectedSessionId(null);
		setSelectedProgramId(null);
		setOccurrenceStartAt("");
	}

	function handleSelectSession(value: string) {
		const nextSession = sessions.find((session) => session.id === value);

		resetSubmitResult();
		setFieldErrors({});
		setSelectedSessionId(value);
		setSelectedProgramId(null);
		setOccurrenceStartAt(
			nextSession?.type === "ONE_TIME" ? (nextSession.startDateTime ?? "") : "",
		);
	}

	function handleSelectProgram(value: string) {
		resetSubmitResult();
		setFieldErrors({});
		setSelectedProgramId(value);
	}

	function handleChangeOccurrence(value: string) {
		resetSubmitResult();
		setFieldErrors((current) => ({
			...current,
			occurrenceStartAt: undefined,
		}));
		setOccurrenceStartAt(value);
	}

	function handleChangeMemo(value: string) {
		resetSubmitResult();
		setFieldErrors((current) => ({
			...current,
			memo: undefined,
		}));
		setMemo(value);
	}

	function handlePressTimelineRetry() {
		void timelinesQuery.refetch();
	}

	function handlePressSessionRetry() {
		void sessionsQuery.refetch();
	}

	function handlePressProgramRetry() {
		void programsQuery.refetch();
	}

	function handleResetDraft() {
		setSelectedTimelineId(null);
		setSelectedSessionId(null);
		setSelectedProgramId(null);
		setOccurrenceStartAt("");
		setMemo("");
		setFieldErrors({});
		resetSubmitResult();
	}

	function handleSubmitReservation() {
		const nextErrors = validateReservationDraft({
			memo,
			occurrenceStartAt,
			program: selectedProgram,
			session: selectedSession,
			timeline: selectedTimeline,
		});
		setFieldErrors(nextErrors);

		if (
			hasFieldErrors(nextErrors) ||
			!selectedTimeline ||
			!selectedSession ||
			!selectedProgram
		) {
			setSubmitState("idle");
			setPendingDraft(null);
			return;
		}

		const nextDraft: PendingReservationDraft = {
			idempotencyKey: createIdempotencyKey(),
			memo: memo.trim() || undefined,
			occurrenceStartAt: effectiveOccurrenceStartAt,
			programId: selectedProgram.id,
			sessionId: selectedSession.id,
			timelineId: selectedTimeline.id,
		};

		clearSubmitTimer();
		setPendingDraft(nextDraft);
		setSubmitState("submitting");
		submitTimerRef.current = setTimeout(() => {
			setSubmitState("succeeded");
			submitTimerRef.current = null;
		}, 0);
	}

	function renderTimelineContent() {
		if (timelinesQuery.isLoading || timelinesQuery.isFetching) {
			return (
				<StatusFeedback
					status="loading"
					title="예약 대상을 불러오는 중"
					description="현재 공간의 예약 카탈로그를 확인하고 있습니다."
				/>
			);
		}

		if (timelinesQuery.isError) {
			return (
				<StatusFeedback
					status="error"
					title="예약 정보를 확인할 수 없습니다"
					description={getApiErrorDescription(timelinesQuery.error)}
					primaryActionLabel="다시 시도"
					onPressPrimaryAction={handlePressTimelineRetry}
				/>
			);
		}

		if (timelines.length === 0) {
			return (
				<StatusFeedback
					status="empty"
					title="예약 가능한 대상이 아직 없습니다"
					description="운영자가 Timeline 카탈로그를 공개하면 이곳에서 바로 예약을 시작할 수 있습니다."
					primaryActionLabel="예약 대상 새로고침"
					onPressPrimaryAction={handlePressTimelineRetry}
				/>
			);
		}

		return (
			<SelectableCardList
				items={createTimelineItems(timelines)}
				onSelect={handleSelectTimeline}
				selectedValue={selectedTimelineId}
				title="예약 대상"
				description="예약하려는 카탈로그를 선택하세요."
				selectLabel="선택"
				selectedLabel="선택됨"
			/>
		);
	}

	function renderSessionContent() {
		if (!selectedTimeline) {
			return (
				<StatusFeedback
					status="idle"
					title="예약 대상을 먼저 선택하세요"
					description="대상을 고르면 연결된 Session 일정이 표시됩니다."
				/>
			);
		}

		if (sessionsQuery.isLoading || sessionsQuery.isFetching) {
			return (
				<StatusFeedback
					status="loading"
					title="일정을 불러오는 중"
					description="선택한 예약 대상의 Session 일정을 확인하고 있습니다."
				/>
			);
		}

		if (sessionsQuery.isError) {
			return (
				<StatusFeedback
					status="error"
					title="일정을 확인할 수 없습니다"
					description={getApiErrorDescription(sessionsQuery.error)}
					primaryActionLabel="다시 시도"
					onPressPrimaryAction={handlePressSessionRetry}
				/>
			);
		}

		if (sessions.length === 0) {
			return (
				<StatusFeedback
					status="empty"
					title="선택 가능한 일정이 없습니다"
					description="다른 예약 대상을 선택하거나 잠시 후 다시 확인해 주세요."
					primaryActionLabel="일정 새로고침"
					onPressPrimaryAction={handlePressSessionRetry}
				/>
			);
		}

		return (
			<SelectableCardList
				items={createSessionItems(sessions)}
				onSelect={handleSelectSession}
				selectedValue={selectedSessionId}
				title="일정 선택"
				description="예약 가능한 날짜와 유형을 확인하세요."
				selectLabel="선택"
				selectedLabel="선택됨"
			/>
		);
	}

	function renderProgramContent() {
		if (!selectedSession) {
			return (
				<StatusFeedback
					status="idle"
					title="일정을 먼저 선택하세요"
					description="일정을 고르면 연결된 Program 옵션이 표시됩니다."
				/>
			);
		}

		if (programsQuery.isLoading || programsQuery.isFetching) {
			return (
				<StatusFeedback
					status="loading"
					title="예약 옵션을 불러오는 중"
					description="선택한 일정의 Program 옵션을 확인하고 있습니다."
				/>
			);
		}

		if (programsQuery.isError) {
			return (
				<StatusFeedback
					status="error"
					title="예약 옵션을 확인할 수 없습니다"
					description={getApiErrorDescription(programsQuery.error)}
					primaryActionLabel="다시 시도"
					onPressPrimaryAction={handlePressProgramRetry}
				/>
			);
		}

		if (programs.length === 0) {
			return (
				<StatusFeedback
					status="empty"
					title="선택 가능한 예약 옵션이 없습니다"
					description="다른 일정을 선택하거나 잠시 후 다시 확인해 주세요."
					primaryActionLabel="옵션 새로고침"
					onPressPrimaryAction={handlePressProgramRetry}
				/>
			);
		}

		return (
			<SelectableCardList
				items={createProgramItems(programs)}
				onSelect={handleSelectProgram}
				selectedValue={selectedProgramId}
				title="예약 옵션"
				description="정원과 루틴 정보를 확인한 뒤 옵션을 선택하세요."
				selectLabel="선택"
				selectedLabel="선택됨"
			/>
		);
	}

	function renderOccurrenceContent() {
		if (!selectedSession) {
			return (
				<StatusFeedback
					status="idle"
					title="예약 일시 선택 대기"
					description="일정을 선택하면 고정 일시 또는 선택 가능한 시간대가 표시됩니다."
				/>
			);
		}

		return (
			<OccurrencePicker
				title="예약 일시"
				description="Session 유형에 맞는 예약 시작 시간을 확인하세요."
				errorMessage={fieldErrors.occurrenceStartAt}
				fixedDescription="이 Session은 시작 시간이 예약 일시로 고정됩니다."
				fixedLabel={formatDateTime(selectedSession.startDateTime)}
				fixedValue={selectedSession.startDateTime}
				onChange={handleChangeOccurrence}
				options={createRangeOccurrenceOptions(selectedSession)}
				recurringUnavailableMessage="반복 세션은 예약 가능 회차 API가 준비되면 선택할 수 있습니다."
				selectedValue={effectiveOccurrenceStartAt}
				sessionType={getOccurrencePickerSessionType(selectedSession)}
			/>
		);
	}

	function renderSubmitStatus() {
		if (submitState === "submitting") {
			return (
				<StatusFeedback
					status="submitting"
					title="예약 요청을 정리하는 중"
					description="네트워크 호출 없이 현재 선택값을 백엔드 핸드오프 대기 상태로 기록합니다."
				/>
			);
		}

		if (submitState === "succeeded" && pendingDraft) {
			return (
				<StatusFeedback
					status="success"
					title="예약 요청 준비가 완료되었습니다"
					description={`${PENDING_BACKEND_HANDOFF_MESSAGE} Reservation create API가 준비되면 idempotencyKey ${pendingDraft.idempotencyKey}로 제출합니다.`}
					primaryActionLabel="새 요청 준비"
					onPressPrimaryAction={handleResetDraft}
				/>
			);
		}

		return (
			<StatusFeedback
				status="idle"
				title="Reservation API 연결 대기"
				description="현재 createReservation Orval hook이 없어 제출 버튼은 검증 후 route-local 완료 상태만 기록합니다."
			/>
		);
	}

	return {
		handleChangeMemo,
		handleSubmitReservation,
		memo,
		renderOccurrenceContent,
		renderProgramContent,
		renderSessionContent,
		renderSubmitStatus,
		renderTimelineContent,
		submitDisabled: submitState === "submitting",
		summaryItems,
	};
};

export default observer(function HomeTabRoute() {
	const reservation = useHomeReservation();

	return (
		<ScreenFrame
			backgroundColor="#0c0f0b"
			contentStyle={styles.root}
			edges={["top", "right", "left"]}
		>
			<ScrollView
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.tabContent}>
					<View style={styles.hero}>
						<Text style={styles.eyebrow}>오노라</Text>
						<Text style={styles.heroTitle}>예약을 시작하세요</Text>
						<Text style={styles.heroDescription}>
							Timeline, Session, Program 카탈로그를 확인하고 가능한 예약 일시를 선택합니다.
						</Text>
					</View>

					<View style={homeStyles.section}>
						{reservation.renderTimelineContent()}
					</View>
					<View style={homeStyles.section}>
						{reservation.renderSessionContent()}
					</View>
					<View style={homeStyles.section}>
						{reservation.renderProgramContent()}
					</View>
					<View style={homeStyles.section}>
						{reservation.renderOccurrenceContent()}
					</View>

					<View style={homeStyles.section}>
						<SummaryList
							title="예약 확인"
							description="선택한 예약 요청 내용을 검토하세요."
							items={reservation.summaryItems}
						/>
						<View style={homeStyles.memoField}>
							<Text style={homeStyles.memoLabel}>메모</Text>
							<TextInput
								accessibilityLabel="예약 메모"
								multiline
								onChangeText={reservation.handleChangeMemo}
								placeholder="요청 사항을 입력하세요."
								placeholderTextColor="#7f897d"
								style={homeStyles.memoInput}
								value={reservation.memo}
							/>
						</View>
						<Pressable
							accessibilityLabel="예약 요청 제출"
							accessibilityRole="button"
							disabled={reservation.submitDisabled}
							onPress={reservation.handleSubmitReservation}
							style={[
								homeStyles.submitButton,
								reservation.submitDisabled
									? homeStyles.submitButtonDisabled
									: null,
							]}
						>
							<Text style={homeStyles.submitButtonText}>예약 요청 제출</Text>
						</Pressable>
						{reservation.renderSubmitStatus()}
					</View>
				</View>
			</ScrollView>
		</ScreenFrame>
	);
});

const homeStyles = StyleSheet.create({
	memoField: {
		gap: 8,
	},
	memoInput: {
		backgroundColor: "#151915",
		borderColor: "#2b342c",
		borderRadius: 12,
		borderWidth: 1,
		color: "#f5f8f1",
		fontSize: 15,
		minHeight: 92,
		padding: 14,
		textAlignVertical: "top",
	},
	memoLabel: {
		color: "#f5f8f1",
		fontSize: 15,
		fontWeight: "700",
	},
	section: {
		gap: 12,
	},
	submitButton: {
		alignItems: "center",
		backgroundColor: "#9ad66d",
		borderRadius: 999,
		minHeight: 48,
		justifyContent: "center",
		paddingHorizontal: 18,
		paddingVertical: 12,
	},
	submitButtonDisabled: {
		opacity: 0.55,
	},
	submitButtonText: {
		color: "#10150f",
		fontSize: 16,
		fontWeight: "800",
	},
});
