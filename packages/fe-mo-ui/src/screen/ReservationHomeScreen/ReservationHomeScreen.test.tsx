import { type ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DesignSystemProvider } from "../../design-system/provider";
import {
  ReservationHomeScreen,
  type ReservationHomeScreenProps,
} from "./ReservationHomeScreen";
import type { BookingClassFeedItem } from "../../data-display/BookingClassCard";

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaListener: ({ children }: { children: ReactNode }) => children,
  useSafeAreaInsets: () => ({
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }),
}));

const createCardItem = (
  overrides: Partial<BookingClassFeedItem> = {},
): BookingClassFeedItem => ({
  availableCount: 6,
  capacity: 18,
  coachName: "Coach Kim",
  confirmedCount: 12,
  ctaLabel: "예약",
  id: "program-1:today",
  level: "INTERMEDIATE",
  previewExerciseTags: ["Squat", "Row"],
  programName: "F45 Strength",
  routineLabel: "Lower body",
  sessionName: "Morning Class",
  status: "AVAILABLE",
  statusLabel: "예약 가능",
  timeLabel: "10:00 - 11:00",
  timelineName: "Gangnam Studio",
  waitlistCount: 0,
  ...overrides,
});

const createProps = (
  overrides: Partial<ReservationHomeScreenProps> = {},
): ReservationHomeScreenProps => ({
  bookingWindowDays: 14,
  cardItems: [createCardItem()],
  dateOptions: [
    {
      count: 1,
      dateLabel: "오늘",
      dayLabel: "토",
      value: "2026-05-09",
    },
  ],
  feedStatus: "ready",
  filterOptions: [
    { label: "전체", value: "all" },
    { label: "대기 가능", value: "waitlist" },
  ],
  onPressBookingCta: jest.fn(),
  onPressFilter: jest.fn(),
  onPressRetry: jest.fn(),
  onSelectDate: jest.fn(),
  policySheet: {
    isOpen: false,
  },
  reservedCount: 1,
  selectedDate: "2026-05-09",
  selectedDateLabel: "5월 9일 토요일",
  selectedFilter: "all",
  ...overrides,
});

const renderWithDesignSystem = (children: ReactNode) =>
  render(
    <DesignSystemProvider
      config={{
        animation: "disable-all",
        devInfo: {
          stylingPrinciples: false,
        },
        toast: false,
      }}
    >
      {children}
    </DesignSystemProvider>,
  );

describe("ReservationHomeScreen", () => {
  it("날짜 스트립, 필터, booking card를 렌더링하고 이벤트를 위임해야 한다", () => {
    const props = createProps();

    renderWithDesignSystem(<ReservationHomeScreen {...props} />);

    expect(screen.getByText("예약 현황")).toBeTruthy();
    expect(screen.getByText("F45 Strength")).toBeTruthy();
    expect(screen.getByText("예약 가능")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("토 오늘"));
    fireEvent.press(screen.getByLabelText("filter-waitlist"));
    fireEvent.press(screen.getByLabelText("예약"));

    expect(props.onSelectDate).toHaveBeenCalledWith(
      "2026-05-09",
      props.dateOptions[0],
    );
    expect(props.onPressFilter).toHaveBeenCalledWith("waitlist");
    expect(props.onPressBookingCta).toHaveBeenCalledWith(props.cardItems[0]);
  });

  it("정책 sheet에서 memo와 confirm 이벤트를 route handler로 위임해야 한다", () => {
    const onChangeMemo = jest.fn();
    const onConfirm = jest.fn();
    const item = createCardItem();

    renderWithDesignSystem(
      <ReservationHomeScreen
        {...createProps({
          policySheet: {
            confirmLabel: "예약 확인",
            isOpen: true,
            item,
            memoValue: "front desk note",
            onChangeMemo,
            onConfirm,
          },
        })}
      />,
    );

    fireEvent.changeText(screen.getByLabelText("요청 메모"), "new memo");
    fireEvent.press(screen.getByLabelText("예약 확인"));

    expect(onChangeMemo).toHaveBeenCalledWith("new memo");
    expect(onConfirm).toHaveBeenCalledWith(item, "front desk note");
  });

  it("feed 상태별 feedback을 렌더링해야 한다", () => {
    const loadingView = renderWithDesignSystem(
      <ReservationHomeScreen {...createProps({ feedStatus: "loading" })} />,
    );

    expect(screen.getByText("수업 피드를 불러오는 중")).toBeTruthy();
    loadingView.unmount();

    const onPressRetry = jest.fn();
    const errorView = renderWithDesignSystem(
      <ReservationHomeScreen
        {...createProps({
          feedErrorDescription: "권한을 확인해 주세요.",
          feedStatus: "error",
          onPressRetry,
        })}
      />,
    );

    expect(screen.getByText("예약 피드를 확인할 수 없습니다")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("다시 시도"));
    expect(onPressRetry).toHaveBeenCalled();
    errorView.unmount();

    renderWithDesignSystem(
      <ReservationHomeScreen
        {...createProps({
          cardItems: [],
          feedStatus: "empty",
        })}
      />,
    );

    expect(screen.getByText("표시할 수업이 없습니다")).toBeTruthy();
  });
});
