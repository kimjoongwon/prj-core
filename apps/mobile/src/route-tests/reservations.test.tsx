import { act, render, screen } from "@testing-library/react-native";
import ReservationsTabRoute from "@/app/(tabs)/reservations";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const mockUseGetMyReservations = jest.fn();

interface ReservationListItem {
  id: string;
  dateLabel?: string;
  title?: string;
  statusLabel?: string;
  metaLabel?: string;
  memo?: string | null;
}

interface MyReservationsScreenProps {
  errorDescription?: string;
  items?: ReservationListItem[];
  onPressRetry?: () => void;
  status?: string;
}

jest.mock("@cocrepo/api/core/reservations", () => ({
  useGetMyReservations: (...args: unknown[]) =>
    mockUseGetMyReservations(...args),
}));

jest.mock("@/auth/auth-config", () => ({
  getCoreApiBaseUrl: () => "http://localhost:3306",
}));

jest.mock("@cocrepo/mo-ui", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable, Text, View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    MyReservationsScreen: ({
      errorDescription,
      items = [],
      onPressRetry,
      status,
    }: MyReservationsScreenProps) => {
      const renderStatus = () => {
        if (status === "loading") {
          return React.createElement(
            Text,
            { key: "loading" },
            "내 예약을 불러오는 중",
          );
        }

        if (status === "error") {
          return React.createElement(View, { key: "error" }, [
            React.createElement(
              Text,
              { key: "title" },
              "내 예약을 확인할 수 없습니다",
            ),
            React.createElement(Text, { key: "description" }, errorDescription),
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
            React.createElement(Text, { key: "title" }, "아직 예약이 없습니다"),
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
            React.createElement(Text, { key: "date" }, item.dateLabel),
            React.createElement(Text, { key: "title" }, item.title),
            React.createElement(Text, { key: "status" }, item.statusLabel),
            React.createElement(Text, { key: "meta" }, item.metaLabel),
            item.memo
              ? React.createElement(Text, { key: "memo" }, item.memo)
              : null,
          ]),
        );
      };

      return React.createElement(View, null, [
        React.createElement(Text, { key: "heading" }, "내 예약"),
        React.createElement(
          Text,
          { key: "description" },
          "예약 확정과 대기 상태를 실제 Reservation API 기준으로 확인합니다.",
        ),
        renderStatus(),
      ]);
    },
  };
});

describe("mobile reservations tab route", () => {
  beforeEach(() => {
    mobileApiScope.clear();
    mobileApiScope.setSpaceInfo({
      tenantId: "tenant-1",
      spaceId: "space-1",
      fitnessCenterName: "강남점",
      contentLanguageCode: "ko_KR",
    });
    mockUseGetMyReservations.mockReturnValue({
      data: {
        data: [
          {
            canceledAt: null,
            cancelReason: null,
            confirmedAt: new Date("2026-05-09T09:00:00.000Z"),
            createdAt: new Date("2026-05-09T09:00:00.000Z"),
            id: 1n,
            idempotencyKey: "idem-1",
            memo: null,
            occurrenceStartAt: new Date("2026-05-09T10:00:00.000Z"),
            program: { name: "F45 Strength" },
            programId: 1n,
            removedAt: null,
            session: { name: "Morning Class" },
            sessionId: 1n,
            spaceId: 1n,
            status: "CONFIRMED",
            timeline: { name: "Gangnam Studio" },
            timelineId: 1n,
            updatedAt: new Date("2026-05-09T09:00:00.000Z"),
            userId: 1n,
            waitlistPosition: null,
          },
        ],
      },
      error: undefined,
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    act(() => {
      mobileApiScope.clear();
    });
  });

  it("예약 탭에서 실제 내 예약 목록을 렌더링해야 한다", () => {
    render(<ReservationsTabRoute />);

    expect(screen.getByText("내 예약")).toBeTruthy();
    expect(
      screen.getByText(
        "예약 확정과 대기 상태를 실제 Reservation API 기준으로 확인합니다.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("F45 Strength")).toBeTruthy();
    expect(screen.getByText("예약 확정")).toBeTruthy();
    expect(screen.queryByText("스튜디오 촬영 상담")).toBeNull();
    expect(mockUseGetMyReservations).toHaveBeenCalledWith(
      { skip: 0, take: 20 },
      {
        query: { enabled: true },
        request: { baseURL: "http://localhost:3306" },
      },
    );
  });
});
