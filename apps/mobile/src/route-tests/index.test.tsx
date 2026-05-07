import { act, fireEvent, render, screen } from "@testing-library/react-native";
import HomeTabRoute from "@/app/(tabs)/index";

const mockUseGetTimelines = jest.fn();
const mockUseGetSessions = jest.fn();
const mockUseGetPrograms = jest.fn();

jest.mock("@cocrepo/api/core/timelines", () => ({
	useGetPrograms: (...args: unknown[]) => mockUseGetPrograms(...args),
	useGetSessions: (...args: unknown[]) => mockUseGetSessions(...args),
	useGetTimelines: (...args: unknown[]) => mockUseGetTimelines(...args),
}));

jest.mock("@/auth/auth-config", () => ({
	getCoreApiBaseUrl: () => "http://localhost:3306",
}));

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text, TextInput, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	const renderText = (value: any, key?: string) => {
		if (value === undefined || value === null || value === false) {
			return null;
		}

		return React.createElement(Text, key ? { key } : null, value);
	};

	const renderList = (values: any[] | undefined, keyPrefix: string) =>
		(values ?? []).map((value, index) =>
			renderText(value, `${keyPrefix}-${index}`),
		);

	return {
		OccurrencePicker: ({
			emptyMessage,
			errorMessage,
			fixedLabel,
			fixedValue,
			onChange,
			options = [],
			recurringUnavailableMessage,
			sessionType,
			title,
		}: any) =>
			React.createElement(View, null, [
				renderText(title, "title"),
				sessionType === "ONE_TIME" && fixedValue
					? React.createElement(
							Pressable,
							{
								accessibilityLabel: fixedLabel,
								accessibilityRole: "button",
								key: "fixed",
								onPress: () => onChange?.(fixedValue),
							},
							React.createElement(Text, null, fixedLabel),
						)
					: null,
				sessionType !== "ONE_TIME" && options.length === 0
					? renderText(
							sessionType === "RECURRING"
								? recurringUnavailableMessage
								: emptyMessage,
							"empty",
						)
					: null,
				...options.map((option: any) =>
					React.createElement(
						Pressable,
						{
							accessibilityLabel: option.label,
							accessibilityRole: "button",
							key: option.value,
							onPress: () => onChange?.(option.value),
						},
						React.createElement(Text, null, option.label),
					),
				),
				renderText(errorMessage, "error"),
			]),
		ScreenFrame: ({ children }: any) =>
			React.createElement(View, { accessibilityLabel: "screen-frame" }, children),
		SelectableCardList: ({
			description,
			emptyContent,
			emptyLabel,
			items = [],
			onSelect,
			title,
		}: any) =>
			React.createElement(View, null, [
				renderText(title, "title"),
				renderText(description, "description"),
				items.length === 0
					? emptyContent || renderText(emptyLabel, "empty")
					: null,
				...items.map((item: any) =>
					React.createElement(
						Pressable,
						{
							accessibilityLabel: item.title,
							accessibilityRole: "button",
							disabled: item.isDisabled,
							key: item.value,
							onPress: () => onSelect?.(item.value),
						},
						React.createElement(View, null, [
							renderText(item.eyebrow, "eyebrow"),
							renderText(item.title, "title"),
							renderText(item.description, "description"),
							...renderList(item.meta, "meta"),
							...renderList(item.tags, "tag"),
							renderText(item.disabledReason, "disabledReason"),
						]),
					),
				),
			]),
		StatusFeedback: ({
			description,
			onPressPrimaryAction,
			primaryActionLabel,
			title,
		}: any) =>
			React.createElement(View, null, [
				renderText(title, "title"),
				renderText(description, "description"),
				primaryActionLabel
					? React.createElement(
							Pressable,
							{
								accessibilityLabel: primaryActionLabel,
								accessibilityRole: "button",
								key: "primary",
								onPress: onPressPrimaryAction,
							},
							React.createElement(Text, null, primaryActionLabel),
						)
					: null,
			]),
		SummaryList: ({ description, items = [], title }: any) =>
			React.createElement(View, null, [
				renderText(title, "title"),
				renderText(description, "description"),
				...items.map((item: any, index: number) =>
					React.createElement(View, { key: `summary-${index}` }, [
						renderText(item.label, "label"),
						renderText(item.value ?? item.placeholder, "value"),
						renderText(item.helperText, "helper"),
					]),
				),
			]),
		TextInput,
	};
});

const createQuery = (
	data: unknown[],
	overrides: Record<string, unknown> = {},
) => ({
	data: { data },
	error: undefined,
	isError: false,
	isFetching: false,
	isLoading: false,
	refetch: jest.fn(),
	...overrides,
});

const createError = (status: number) => ({
	response: {
		status,
	},
});

const timeline = {
	createdAt: "2030-01-01T00:00:00",
	creatorId: "user-1",
	description: "몸과 마음을 위한 예약 카탈로그",
	id: "timeline-1",
	name: "테라피 예약",
	removedAt: null,
	sessions: [],
	spaceId: "space-1",
	tenantId: "tenant-1",
	updatedAt: "2030-01-01T00:00:00",
};

const oneTimeSession = {
	createdAt: "2030-01-01T00:00:00",
	description: "한 번 진행되는 오전 일정",
	endDateTime: "2030-06-02T11:00:00",
	id: "session-1",
	name: "오전 원데이",
	programs: [],
	recurringDayOfWeek: null,
	removedAt: null,
	repeatCycleType: null,
	startDateTime: "2030-06-02T10:00:00",
	timeline,
	timelineId: timeline.id,
	type: "ONE_TIME",
	updatedAt: "2030-01-01T00:00:00",
};

const rangeSession = {
	...oneTimeSession,
	description: "시작 시간을 고를 수 있는 오전 일정",
	endDateTime: "2030-06-03T11:00:00",
	id: "session-range",
	name: "오전 선택 일정",
	startDateTime: "2030-06-03T09:00:00",
	type: "ONE_TIME_RANGE",
};

const recurringSession = {
	...oneTimeSession,
	id: "session-recurring",
	name: "매주 관리",
	recurringDayOfWeek: "MONDAY",
	repeatCycleType: "WEEKLY",
	type: "RECURRING",
};

const program = {
	activityCount: 2,
	capacity: 8,
	createdAt: "2030-01-01T00:00:00",
	executionPlan: [],
	id: "program-1",
	instructorId: "instructor-1",
	level: "입문",
	name: "아로마 테라피",
	previewExerciseNames: ["호흡", "스트레칭"],
	removedAt: null,
	routine: {},
	routineId: "routine-1",
	routineLabelSnapshot: "60분 케어 루틴",
	routineNameSnapshot: "care-routine",
	session: oneTimeSession,
	sessionId: oneTimeSession.id,
	updatedAt: "2030-01-01T00:00:00",
};

const queryState = {
	programs: createQuery([program]),
	sessions: createQuery([oneTimeSession]),
	timelines: createQuery([timeline]),
};

const setDefaultQueries = () => {
	queryState.timelines = createQuery([{ ...timeline, sessions: [oneTimeSession] }]);
	queryState.sessions = createQuery([oneTimeSession]);
	queryState.programs = createQuery([program]);
};

describe("mobile home reservation route", () => {
	beforeEach(() => {
		jest.useRealTimers();
		setDefaultQueries();
		mockUseGetTimelines.mockImplementation(() => queryState.timelines);
		mockUseGetSessions.mockImplementation(() => queryState.sessions);
		mockUseGetPrograms.mockImplementation(() => queryState.programs);
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it("루트 홈 예약 owner를 렌더링하고 기존 더미 홈 예약 문구를 노출하지 않는다", () => {
		render(<HomeTabRoute />);

		expect(screen.getByText("오노라")).toBeTruthy();
		expect(screen.getByText("예약을 시작하세요")).toBeTruthy();
		expect(screen.getByText("테라피 예약")).toBeTruthy();
		expect(screen.queryByText("헤어 케어 예약")).toBeNull();
		expect(screen.queryByText("모바일 컴포넌트 인벤토리")).toBeNull();
		expect(mockUseGetTimelines).toHaveBeenCalledWith(
			{ skip: 0, take: 20 },
			{ request: { baseURL: "http://localhost:3306" } },
		);
	});

	it("예약 대상 loading, empty, retry 상태를 렌더링한다", () => {
		queryState.timelines = createQuery([], { isLoading: true });
		const loadingView = render(<HomeTabRoute />);

		expect(screen.getByText("예약 대상을 불러오는 중")).toBeTruthy();
		loadingView.unmount();

		const refetch = jest.fn();
		queryState.timelines = createQuery([], { refetch });
		render(<HomeTabRoute />);

		expect(screen.getByText("예약 가능한 대상이 아직 없습니다")).toBeTruthy();
		fireEvent.press(screen.getByLabelText("예약 대상 새로고침"));
		expect(refetch).toHaveBeenCalled();
	});

	it.each([
		[400, "선택 조건을 확인해 주세요."],
		[401, "로그인이 만료되었습니다. 다시 로그인한 뒤 예약해 주세요."],
		[403, "현재 공간에서 예약 권한이 없습니다."],
		[404, "선택한 예약 대상이 더 이상 없습니다. 목록을 새로고침해 주세요."],
		[409, "이미 예약되었거나 정원이 찼습니다. 다른 일정이나 옵션을 선택해 주세요."],
		[500, "예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."],
	])("예약 대상 조회 %s 에러 메시지를 렌더링한다", (status, message) => {
		const refetch = jest.fn();
		queryState.timelines = createQuery([], {
			error: createError(status),
			isError: true,
			refetch,
		});

		render(<HomeTabRoute />);

		expect(screen.getByText("예약 정보를 확인할 수 없습니다")).toBeTruthy();
		expect(screen.getByText(message)).toBeTruthy();
		fireEvent.press(screen.getByLabelText("다시 시도"));
		expect(refetch).toHaveBeenCalled();
	});

	it("Timeline 선택 전 Session, Program, Submit 검증이 선택 대기 상태를 보여준다", () => {
		render(<HomeTabRoute />);

		expect(screen.getByText("예약 대상을 먼저 선택하세요")).toBeTruthy();
		expect(screen.getByText("일정을 먼저 선택하세요")).toBeTruthy();

		fireEvent.press(screen.getByLabelText("예약 요청 제출"));

		expect(screen.getByText("예약 대상을 선택해 주세요.")).toBeTruthy();
		expect(screen.getByText("일정을 선택해 주세요.")).toBeTruthy();
		expect(screen.getByText("예약 옵션을 선택해 주세요.")).toBeTruthy();
		expect(screen.getAllByText("예약 일시를 선택해 주세요.").length).toBeGreaterThan(0);
	});

	it("Timeline, Session, Program 선택 시 확인 요약과 고정 occurrence가 갱신된다", () => {
		render(<HomeTabRoute />);

		fireEvent.press(screen.getByLabelText("테라피 예약"));
		fireEvent.press(screen.getByLabelText("오전 원데이"));
		fireEvent.press(screen.getByLabelText("아로마 테라피"));

		expect(screen.getAllByText("테라피 예약").length).toBeGreaterThan(0);
		expect(screen.getAllByText("오전 원데이").length).toBeGreaterThan(0);
		expect(screen.getAllByText("아로마 테라피").length).toBeGreaterThan(0);
		expect(screen.getAllByText("6월 2일 10:00").length).toBeGreaterThan(0);
	});

	it("시간 선택 Session은 occurrence 검증 후 route-local pending backend 성공 상태로 완료된다", () => {
		jest.useFakeTimers();
		queryState.sessions = createQuery([rangeSession]);
		queryState.programs = createQuery([
			{ ...program, session: rangeSession, sessionId: rangeSession.id },
		]);

		render(<HomeTabRoute />);

		fireEvent.press(screen.getByLabelText("테라피 예약"));
		fireEvent.press(screen.getByLabelText("오전 선택 일정"));
		fireEvent.press(screen.getByLabelText("아로마 테라피"));
		fireEvent.press(screen.getByLabelText("예약 요청 제출"));

		expect(screen.getAllByText("예약 일시를 선택해 주세요.").length).toBeGreaterThan(0);

		fireEvent.press(screen.getByLabelText("6월 3일 09:00"));
		fireEvent.press(screen.getByLabelText("예약 요청 제출"));

		expect(screen.getByText("예약 요청을 정리하는 중")).toBeTruthy();

		act(() => {
			jest.runOnlyPendingTimers();
		});

		expect(screen.getByText("예약 요청 준비가 완료되었습니다")).toBeTruthy();
		expect(
			screen.getByText(/백엔드 핸드오프 대기 중입니다./),
		).toBeTruthy();
	});

	it("반복 Session은 occurrence read model 부재를 검증 메시지로 기록한다", () => {
		queryState.sessions = createQuery([recurringSession]);
		queryState.programs = createQuery([
			{ ...program, session: recurringSession, sessionId: recurringSession.id },
		]);

		render(<HomeTabRoute />);

		fireEvent.press(screen.getByLabelText("테라피 예약"));
		fireEvent.press(screen.getByLabelText("매주 관리"));
		fireEvent.press(screen.getByLabelText("아로마 테라피"));

		expect(
			screen.getByText("반복 세션은 예약 가능 회차 API가 준비되면 선택할 수 있습니다."),
		).toBeTruthy();

		fireEvent.press(screen.getByLabelText("예약 요청 제출"));

		expect(
			screen.getAllByText(
				"반복 세션은 예약 가능 회차 API가 준비되면 선택할 수 있습니다.",
			).length,
		).toBeGreaterThan(0);
	});
});
