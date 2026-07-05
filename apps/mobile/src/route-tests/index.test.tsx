import { fireEvent, render, screen } from "@testing-library/react-native";
import HomeTabRoute from "@/app/(tabs)/index";
import ReservationsTabRoute from "@/app/(tabs)/reservations";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const mockUseGetReservationBookingFeed = jest.fn();
const mockUseCreateReservation = jest.fn();
const mockUseGetMyReservations = jest.fn();
const mockGetGetReservationBookingFeedQueryKey = jest.fn();
const mockGetGetMyReservationsQueryKey = jest.fn();
const mockInvalidateQueries = jest.fn();

interface ReservationListItem {
  id: string;
  dateLabel?: string;
  title?: string;
  statusLabel?: string;
  metaLabel?: string;
  memo?: string | null;
}

interface DateOptionItem {
  value: string;
  dateLabel?: string;
}

interface FilterOptionItem {
  value: string;
  label?: string;
}

interface BookingCardItem {
  id: string;
  timeLabel?: string;
  programName?: string;
  sessionName?: string;
  statusLabel?: string;
  ctaLabel?: string;
  [key: string]: unknown;
}

interface ReservationPolicySheet {
  confirmLabel?: string;
  isLoading?: boolean;
  isOpen?: boolean;
  item?: BookingCardItem;
  memoValue?: string;
  onChangeMemo?: (value: string) => void;
  onConfirm?: (item: BookingCardItem, memoValue?: string) => void;
}

interface MyReservationsScreenProps {
  errorDescription?: string;
  items?: ReservationListItem[];
  onPressRetry?: () => void;
  status?: string;
}

interface ReservationHomeScreenProps {
  cardItems?: BookingCardItem[];
  dateOptions?: DateOptionItem[];
  feedErrorDescription?: string;
  feedStatus?: string;
  filterOptions?: FilterOptionItem[];
  onPressBookingCta?: (item: BookingCardItem) => void;
  onPressFilter?: (value: string) => void;
  onPressRetry?: () => void;
  onSelectDate?: (value: string, option: DateOptionItem) => void;
  policySheet?: ReservationPolicySheet;
  reservationErrorDescription?: string;
  reservationSuccessDescription?: string;
}

interface MutationLifecycleOptions {
  mutation?: {
    onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  };
}

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock("@cocrepo/api/core/reservations", () => ({
  getGetMyReservationsQueryKey: (...args: unknown[]) =>
    mockGetGetMyReservationsQueryKey(...args),
  getGetReservationBookingFeedQueryKey: (...args: unknown[]) =>
    mockGetGetReservationBookingFeedQueryKey(...args),
  useCreateReservation: (...args: unknown[]) =>
    mockUseCreateReservation(...args),
  useGetMyReservations: (...args: unknown[]) =>
    mockUseGetMyReservations(...args),
  useGetReservationBookingFeed: (...args: unknown[]) =>
    mockUseGetReservationBookingFeed(...args),
}));

jest.mock("@/auth/auth-config", () => ({
  getCoreApiBaseUrl: () => "http://localhost:3306",
}));

jest.mock("@cocrepo/mo-ui", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable, Text, TextInput, View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  const renderText = (value: unknown, key?: string) => {
    if (value === undefined || value === null || value === false) {
      return null;
    }

    return React.createElement(Text, key ? { key } : null, String(value));
  };

  return {
    MyReservationsScreen: ({
      errorDescription,
      items = [],
      onPressRetry,
      status,
    }: MyReservationsScreenProps) => {
      const renderStatus = () => {
        if (status === "loading") {
          return renderText("내 예약을 불러오는 중", "loading");
        }

        if (status === "error") {
          return React.createElement(View, { key: "error" }, [
            renderText("내 예약을 확인할 수 없습니다", "title"),
            renderText(errorDescription, "description"),
            React.createElement(
              Pressable,
              {
                accessibilityLabel: "다시 시도",
                accessibilityRole: "button",
                key: "retry",
                onPress: onPressRetry,
              },
              React.createElement(Text, null, "다시 시도"),
            ),
          ]);
        }

        if (status === "empty") {
          return React.createElement(View, { key: "empty" }, [
            renderText("아직 예약이 없습니다", "title"),
            React.createElement(
              Pressable,
              {
                accessibilityLabel: "목록 새로고침",
                accessibilityRole: "button",
                key: "retry",
                onPress: onPressRetry,
              },
              React.createElement(Text, null, "목록 새로고침"),
            ),
          ]);
        }

        return items.map((item) =>
          React.createElement(View, { key: item.id }, [
            renderText(item.dateLabel, "date"),
            renderText(item.title, "title"),
            renderText(item.statusLabel, "status"),
            renderText(item.metaLabel, "meta"),
            renderText(item.memo, "memo"),
          ]),
        );
      };

      return React.createElement(View, null, [
        renderText("내 예약", "heading"),
        renderStatus(),
      ]);
    },
    ReservationHomeScreen: ({
      cardItems = [],
      dateOptions = [],
      feedErrorDescription,
      feedStatus,
      filterOptions = [],
      onPressBookingCta,
      onPressFilter,
      onPressRetry,
      onSelectDate,
      policySheet,
      reservationErrorDescription,
      reservationSuccessDescription,
    }: ReservationHomeScreenProps) =>
      React.createElement(View, null, [
        renderText("오늘의 수업", "heading"),
        ...dateOptions.map((option) =>
          React.createElement(
            Pressable,
            {
              accessibilityLabel: `date-${option.value}`,
              accessibilityRole: "button",
              key: `date-${option.value}`,
              onPress: () => onSelectDate?.(option.value, option),
            },
            React.createElement(Text, null, option.dateLabel),
          ),
        ),
        ...filterOptions.map((option) =>
          React.createElement(
            Pressable,
            {
              accessibilityLabel: `filter-${option.value}`,
              accessibilityRole: "button",
              key: `filter-${option.value}`,
              onPress: () => onPressFilter?.(option.value),
            },
            React.createElement(Text, null, option.label),
          ),
        ),
        feedStatus === "loading"
          ? renderText("수업 피드를 불러오는 중", "loading")
          : null,
        feedStatus === "empty"
          ? React.createElement(View, { key: "empty" }, [
              renderText("표시할 수업이 없습니다", "title"),
              React.createElement(
                Pressable,
                {
                  accessibilityLabel: "피드 새로고침",
                  accessibilityRole: "button",
                  key: "retry",
                  onPress: onPressRetry,
                },
                React.createElement(Text, null, "피드 새로고침"),
              ),
            ])
          : null,
        feedStatus === "error"
          ? React.createElement(View, { key: "error" }, [
              renderText("예약 피드를 확인할 수 없습니다", "title"),
              renderText(feedErrorDescription, "description"),
              React.createElement(
                Pressable,
                {
                  accessibilityLabel: "다시 시도",
                  accessibilityRole: "button",
                  key: "retry",
                  onPress: onPressRetry,
                },
                React.createElement(Text, null, "다시 시도"),
              ),
            ])
          : null,
        ...cardItems.map((item) =>
          React.createElement(View, { key: item.id }, [
            renderText(item.timeLabel, "time"),
            renderText(item.programName, "program"),
            renderText(item.sessionName, "session"),
            renderText(item.statusLabel, "status"),
            renderText(item.ctaLabel, "cta-label"),
            React.createElement(
              Pressable,
              {
                accessibilityLabel: `cta-${item.id}`,
                accessibilityRole: "button",
                key: "cta",
                onPress: () => onPressBookingCta?.(item),
              },
              React.createElement(Text, null, item.ctaLabel),
            ),
          ]),
        ),
        policySheet?.isOpen && policySheet?.item
          ? React.createElement(View, { key: "policy" }, [
              renderText("예약 정책 확인", "title"),
              renderText(policySheet.item.programName, "program"),
              React.createElement(TextInput, {
                accessibilityLabel: "요청 메모",
                key: "memo",
                onChangeText: policySheet.onChangeMemo,
                value: policySheet.memoValue,
              }),
              React.createElement(
                Pressable,
                {
                  accessibilityLabel: "confirm-policy",
                  accessibilityRole: "button",
                  disabled: policySheet.isLoading,
                  key: "confirm",
	                  onPress: () =>
	                    policySheet.onConfirm?.(
	                      policySheet.item!,
	                      policySheet.memoValue,
	                    ),
                },
                React.createElement(Text, null, policySheet.confirmLabel),
              ),
            ])
          : null,
        renderText(
          reservationSuccessDescription ? "예약 요청 완료" : null,
          "success",
        ),
        renderText(
          reservationErrorDescription ? "예약 요청에 실패했습니다" : null,
          "error",
        ),
      ]),
  };
});

const pad2 = (value: number) => value.toString().padStart(2, "0");

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const todayKey = toDateKey(new Date());
const tomorrowKey = toDateKey(addDays(new Date(), 1));

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

const createFeedItem = (overrides: Record<string, unknown> = {}) => ({
  availableSeatCount: 6,
  cancelableUntilAt: `${todayKey}T08:00:00.000Z`,
  capacity: 18,
  coachName: "Coach Kim",
  confirmedCount: 12,
  ctaLabel: "예약",
  date: todayKey,
  endsAt: `${todayKey}T11:00:00.000Z`,
  feedItemId: "program-1:today",
  level: "INTERMEDIATE",
  myReservationStatus: undefined,
  previewExerciseNames: ["Squat", "Row"],
  programId: "program-1",
  programName: "F45 Strength",
  routineLabelSnapshot: "Lower body",
  sessionId: "session-1",
  sessionName: "Morning Class",
  startsAt: `${todayKey}T10:00:00.000Z`,
  timelineId: "timeline-1",
  timelineName: "Gangnam Studio",
  availabilityStatus: "AVAILABLE",
  waitlistCount: 0,
  ...overrides,
});

const createReservation = (overrides: Record<string, unknown> = {}) => ({
  canceledAt: null,
  cancelReason: null,
  confirmedAt: `${todayKey}T09:00:00.000Z`,
  createdAt: `${todayKey}T09:00:00.000Z`,
  id: "reservation-1",
  idempotencyKey: "idem-1",
  memo: null,
  occurrenceStartAt: `${todayKey}T10:00:00.000Z`,
  program: { name: "F45 Strength" },
  programId: "program-1",
  removedAt: null,
  session: { name: "Morning Class" },
  sessionId: "session-1",
  spaceId: "space-1",
  status: "CONFIRMED",
  timeline: { name: "Gangnam Studio" },
  timelineId: "timeline-1",
  updatedAt: `${todayKey}T09:00:00.000Z`,
  userId: "user-1",
  waitlistPosition: null,
  ...overrides,
});

let bookingFeedQuery = createQuery([createFeedItem()]);
let myReservationsQuery = createQuery([createReservation()]);
let createMutationState: Record<string, unknown>;
let createReservationOptions: MutationLifecycleOptions | undefined;

describe("mobile reservation booking routes", () => {
  beforeEach(() => {
    mobileApiScope.clear();
    mobileApiScope.setSpaceInfo({
      tenantId: "tenant-1",
      spaceId: "space-1",
      groundName: "강남점",
      contentLanguageCode: "ko_KR",
    });
    bookingFeedQuery = createQuery([
      createFeedItem(),
      createFeedItem({
        availabilityStatus: "WAITLIST_OPEN",
        availableSeatCount: 0,
        ctaLabel: "대기",
        date: tomorrowKey,
        feedItemId: "program-2:tomorrow",
        programId: "program-2",
        programName: "HIIT Waitlist",
        startsAt: `${tomorrowKey}T10:00:00.000Z`,
        endsAt: `${tomorrowKey}T11:00:00.000Z`,
      }),
    ]);
    myReservationsQuery = createQuery([createReservation()]);
    createMutationState = {
      error: undefined,
      isError: false,
      isPending: false,
      isSuccess: false,
      mutate: jest.fn((payload: unknown) => {
        createMutationState.isSuccess = true;
        createReservationOptions?.mutation?.onSuccess?.(
          { data: createReservation() },
          payload,
          undefined,
        );
      }),
      reset: jest.fn(),
    };
    createReservationOptions = undefined;

    mockUseGetReservationBookingFeed.mockImplementation(() => bookingFeedQuery);
    mockUseGetMyReservations.mockImplementation(() => myReservationsQuery);
    mockUseCreateReservation.mockImplementation(
      (options: MutationLifecycleOptions) => {
      createReservationOptions = options;
      return createMutationState;
      },
    );
    mockGetGetReservationBookingFeedQueryKey.mockReturnValue([
      "/api/v1/reservations/booking-feed",
    ]);
    mockGetGetMyReservationsQueryKey.mockReturnValue([
      "/api/v1/reservations/me",
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("홈에서 booking feed 카드와 날짜 스트립을 렌더링한다", () => {
    render(<HomeTabRoute />);

    expect(screen.getByText("오늘의 수업")).toBeTruthy();
    expect(screen.getByText("F45 Strength")).toBeTruthy();
    expect(screen.getAllByText("예약 가능").length).toBeGreaterThan(0);
    expect(screen.queryByText(/백엔드 핸드오프/)).toBeNull();
    expect(mockUseGetReservationBookingFeed).toHaveBeenCalledWith(
      expect.objectContaining({
        dateFrom: expect.any(String),
        dateTo: expect.any(String),
        timeZone: "Asia/Seoul",
      }),
      {
        query: { enabled: true },
        request: { baseURL: "http://localhost:3306" },
      },
    );
  });

  it("홈 feed loading, empty, error retry 상태를 렌더링한다", () => {
    bookingFeedQuery = createQuery([], { isLoading: true });
    const loadingView = render(<HomeTabRoute />);

    expect(screen.getByText("수업 피드를 불러오는 중")).toBeTruthy();
    loadingView.unmount();

    const refetch = jest.fn();
    bookingFeedQuery = createQuery([], { refetch });
    const emptyView = render(<HomeTabRoute />);

    expect(screen.getByText("표시할 수업이 없습니다")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("피드 새로고침"));
    expect(refetch).toHaveBeenCalled();
    emptyView.unmount();

    bookingFeedQuery = createQuery([], {
      error: createError(401),
      isError: true,
      refetch,
    });
    render(<HomeTabRoute />);

    expect(screen.getByText("예약 피드를 확인할 수 없습니다")).toBeTruthy();
    expect(
      screen.getByText(
        "로그인이 만료되었습니다. 다시 로그인한 뒤 예약해 주세요.",
      ),
    ).toBeTruthy();
  });

  it("날짜 선택과 대기 필터로 다른 날짜의 waitlist 카드를 보여준다", () => {
    render(<HomeTabRoute />);

    expect(screen.queryByText("HIIT Waitlist")).toBeNull();

    fireEvent.press(screen.getByLabelText(`date-${tomorrowKey}`));

    expect(screen.getByText("HIIT Waitlist")).toBeTruthy();
    expect(screen.getAllByText("대기 가능").length).toBeGreaterThan(0);

    fireEvent.press(screen.getByLabelText("filter-waitlist"));

    expect(screen.getByText("HIIT Waitlist")).toBeTruthy();
  });

  it("예약 CTA는 정책 sheet 확인 후 createReservation을 호출하고 캐시를 갱신한다", () => {
    render(<HomeTabRoute />);

    fireEvent.press(screen.getByLabelText("cta-program-1:today"));
    fireEvent.changeText(screen.getByLabelText("요청 메모"), "front desk note");
    fireEvent.press(screen.getByLabelText("confirm-policy"));

    expect(createMutationState.mutate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        idempotencyKey: expect.stringMatching(/^mobile-booking-/),
        memo: "front desk note",
        occurrenceStartAt: `${todayKey}T10:00:00.000Z`,
        programId: "program-1",
        sessionId: "session-1",
        timelineId: "timeline-1",
      }),
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["/api/v1/reservations/booking-feed"],
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["/api/v1/reservations/me"],
    });
    expect(screen.getByText("예약 요청 완료")).toBeTruthy();
  });

  it("내 예약 탭은 getMyReservations API 결과를 렌더링하고 더미 예약을 노출하지 않는다", () => {
    render(<ReservationsTabRoute />);

    expect(screen.getByText("내 예약")).toBeTruthy();
    expect(screen.getByText("F45 Strength")).toBeTruthy();
    expect(screen.getByText("예약 확정")).toBeTruthy();
    expect(screen.queryByText("헤어 케어 예약")).toBeNull();
    expect(mockUseGetMyReservations).toHaveBeenCalledWith(
      { skip: 0, take: 20 },
      {
        query: { enabled: true },
        request: { baseURL: "http://localhost:3306" },
      },
    );
  });

  it("내 예약 탭 empty/error retry 상태를 렌더링한다", () => {
    const refetch = jest.fn();
    myReservationsQuery = createQuery([], { refetch });
    const emptyView = render(<ReservationsTabRoute />);

    expect(screen.getByText("아직 예약이 없습니다")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("목록 새로고침"));
    expect(refetch).toHaveBeenCalled();
    emptyView.unmount();

    myReservationsQuery = createQuery([], {
      error: createError(403),
      isError: true,
      refetch,
    });
    render(<ReservationsTabRoute />);

    expect(screen.getByText("내 예약을 확인할 수 없습니다")).toBeTruthy();
    expect(
      screen.getByText("현재 공간에서 예약 목록을 볼 권한이 없습니다."),
    ).toBeTruthy();
  });
});
