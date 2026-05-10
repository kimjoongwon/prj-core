import { fireEvent, render, screen } from "@testing-library/react-native";
import ReservationPaymentCheckoutRoute from "@/app/payments/checkout";

const mockUseGetReservationCheckoutBootstrap = jest.fn();
const mockUseCreateReservationCheckout = jest.fn();
const mockGetGetReservationBookingFeedQueryKey = jest.fn();
const mockGetGetMyReservationsQueryKey = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

let mockParams: Record<string, string> = {
	occurrenceStartAt: "2026-06-01T10:00:00.000Z",
	programId: "program-1",
	programName: "F45 Strength",
	sessionId: "session-1",
	sessionName: "Morning Class",
	timeLabel: "10:00 - 11:00",
	timelineId: "timeline-1",
	timelineName: "Gangnam Studio",
};

jest.mock("@tanstack/react-query", () => ({
	useQueryClient: () => ({
		invalidateQueries: mockInvalidateQueries,
	}),
}));

jest.mock("expo-router", () => ({
	useLocalSearchParams: () => mockParams,
	useRouter: () => ({
		back: mockBack,
		replace: mockReplace,
	}),
}));

jest.mock("@cocrepo/api/core/reservations", () => ({
	getGetMyReservationsQueryKey: (...args: unknown[]) =>
		mockGetGetMyReservationsQueryKey(...args),
	getGetReservationBookingFeedQueryKey: (...args: unknown[]) =>
		mockGetGetReservationBookingFeedQueryKey(...args),
	useCreateReservationCheckout: (...args: unknown[]) =>
		mockUseCreateReservationCheckout(...args),
	useGetReservationCheckoutBootstrap: (...args: unknown[]) =>
		mockUseGetReservationCheckoutBootstrap(...args),
}));

jest.mock("@/auth/auth-config", () => ({
	getCoreApiBaseUrl: () => "http://localhost:3306",
}));

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	const renderText = (value: any, key?: string) => {
		if (value === undefined || value === null || value === false) {
			return null;
		}

		return React.createElement(Text, key ? { key } : null, value);
	};

	return {
		ReservationPaymentCheckoutScreen: ({
			amountLabel,
			courseOptions = [],
			currencyLabel,
			errorDescription,
			methodOptions = [],
			onPressBack,
			onPressReservations,
			onPressSubmit,
			onSelectCourseOption,
			onSelectPaymentMethod,
			progressSteps = [],
			status,
			submitLabel,
			summaryItems = [],
		}: any) =>
			React.createElement(View, null, [
				renderText("결제 후 예약", "heading"),
				renderText(status, "status"),
				...summaryItems.map((item: any, index: number) =>
					React.createElement(View, { key: `summary-${index}` }, [
						renderText(item.label, "label"),
						renderText(item.value, "value"),
					]),
				),
				...courseOptions.map((item: any) =>
					React.createElement(
						Pressable,
						{
							accessibilityLabel: `course-${item.id}`,
							accessibilityRole: "button",
							key: `course-${item.id}`,
							onPress: () => onSelectCourseOption?.(item.id),
						},
						React.createElement(Text, null, item.title),
					),
				),
				...methodOptions.map((item: any) =>
					React.createElement(
						Pressable,
						{
							accessibilityLabel: `method-${item.value}`,
							accessibilityRole: "button",
							key: `method-${item.value}`,
							onPress: () => onSelectPaymentMethod?.(item.value),
						},
						React.createElement(Text, null, item.label),
					),
				),
				...progressSteps.map((item: any) =>
					renderText(item.label, `progress-${item.id}`),
				),
				renderText(amountLabel, "amount"),
				renderText(currencyLabel, "currency"),
				renderText(errorDescription, "error"),
				React.createElement(
					Pressable,
					{
						accessibilityLabel: "checkout-back",
						accessibilityRole: "button",
						key: "back",
						onPress: onPressBack,
					},
					React.createElement(Text, null, "뒤로"),
				),
				React.createElement(
					Pressable,
					{
						accessibilityLabel: "create-reservation-checkout",
						accessibilityRole: "button",
						key: "submit",
						onPress: onPressSubmit,
					},
					React.createElement(Text, null, submitLabel),
				),
				React.createElement(
					Pressable,
					{
						accessibilityLabel: "예약 내역 보기",
						accessibilityRole: "button",
						key: "reservations",
						onPress: onPressReservations,
					},
					React.createElement(Text, null, "예약 내역 보기"),
				),
			]),
	};
});

const createBootstrapResponse = () => ({
	data: {
		context: {
			coachName: "Coach Kim",
			feedItemId: "program-1:2026-06-01T10:00:00.000Z",
			occurrenceEndsAt: "2026-06-01T11:00:00.000Z",
			occurrenceStartAt: "2026-06-01T10:00:00.000Z",
			programId: "program-1",
			programName: "F45 Strength",
			sessionId: "session-1",
			sessionName: "Morning Class",
			timelineId: "timeline-1",
			timelineName: "Gangnam Studio",
		},
		options: [
			{
				courseId: "course-1",
				courseName: "초급 필라테스",
				courseOfferingId: "offering-1",
				courseOfferingName: "강남점 6개월반",
				currency: "KRW",
				durationMonths: 6,
				priceAmount: 450000,
				reservationLimit: 24,
				timelineId: "timeline-1",
			},
		],
		paymentMethods: ["CARD", "EXTERNAL", "BANK_TRANSFER"],
	},
});

const createCheckoutResponse = () => ({
	data: {
		coursePass: { id: "course-pass-1" },
		enrollment: { id: "enrollment-1" },
		payment: {
			id: "payment-1",
			status: "PAID",
		},
		progressSteps: [
			{
				id: "payment-approval",
				label: "결제 승인 처리",
				status: "COMPLETED",
			},
			{
				id: "reservation",
				label: "예약 확정",
				status: "COMPLETED",
			},
		],
		reservation: { id: "reservation-1" },
		status: "PAID",
	},
});

describe("mobile reservation payment checkout route", () => {
	let bootstrapQuery: Record<string, unknown>;
	let checkoutMutation: Record<string, unknown>;
	let checkoutOptions: any;

	beforeEach(() => {
		mockParams = {
			occurrenceStartAt: "2026-06-01T10:00:00.000Z",
			programId: "program-1",
			programName: "F45 Strength",
			sessionId: "session-1",
			sessionName: "Morning Class",
			timeLabel: "10:00 - 11:00",
			timelineId: "timeline-1",
			timelineName: "Gangnam Studio",
		};
		bootstrapQuery = {
			data: createBootstrapResponse(),
			error: undefined,
			isError: false,
			isLoading: false,
		};
		checkoutMutation = {
			data: undefined,
			error: undefined,
			isError: false,
			isPending: false,
			isSuccess: false,
			mutate: jest.fn((payload) => {
				checkoutOptions?.mutation?.onSuccess?.(createCheckoutResponse(), payload, undefined);
			}),
		};
		checkoutOptions = undefined;
		mockUseGetReservationCheckoutBootstrap.mockReturnValue(bootstrapQuery);
		mockUseCreateReservationCheckout.mockImplementation((options) => {
			checkoutOptions = options;
			return checkoutMutation;
		});
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

	it("route params와 bootstrap 결과를 결제 screen props로 매핑하고 checkout mutation을 호출한다", () => {
		render(<ReservationPaymentCheckoutRoute />);

		expect(screen.getByText("결제 후 예약")).toBeTruthy();
		expect(screen.getByText("F45 Strength")).toBeTruthy();
		expect(screen.getByText("초급 필라테스")).toBeTruthy();
		expect(screen.getByText("카드")).toBeTruthy();
		expect(screen.getByText("₩450,000")).toBeTruthy();
		expect(mockUseGetReservationCheckoutBootstrap).toHaveBeenCalledWith(
			expect.objectContaining({
				occurrenceStartAt: "2026-06-01T10:00:00.000Z",
				programId: "program-1",
				sessionId: "session-1",
				timelineId: "timeline-1",
			}),
			expect.objectContaining({
				request: { baseURL: "http://localhost:3306" },
			}),
		);

		fireEvent.press(screen.getByLabelText("method-EXTERNAL"));
		fireEvent.press(screen.getByLabelText("create-reservation-checkout"));

		expect(checkoutMutation.mutate).toHaveBeenCalledWith({
			data: expect.objectContaining({
				courseOfferingId: "offering-1",
				idempotencyKey: expect.stringMatching(/^mobile-reservation-checkout-/),
				occurrenceStartAt: "2026-06-01T10:00:00.000Z",
				paymentMethod: "EXTERNAL",
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

		fireEvent.press(screen.getByLabelText("checkout-back"));
		expect(mockBack).toHaveBeenCalled();
	});

	it("checkout 성공 후 진행 상태와 예약 내역 이동을 표시한다", () => {
		checkoutMutation = {
			...checkoutMutation,
			data: createCheckoutResponse(),
			isSuccess: true,
		};
		mockUseCreateReservationCheckout.mockReturnValue(checkoutMutation);

		render(<ReservationPaymentCheckoutRoute />);

		expect(screen.getByText("success")).toBeTruthy();
		expect(screen.getByText("결제 승인 처리")).toBeTruthy();
		expect(screen.getByText("예약 확정")).toBeTruthy();

		fireEvent.press(screen.getByLabelText("예약 내역 보기"));

		expect(mockReplace).toHaveBeenCalledWith("/reservations");
	});

	it("필수 params가 없으면 mutation을 호출하지 않고 오류 상태를 보여준다", () => {
		mockParams = {
			programName: "Missing Params",
		};

		render(<ReservationPaymentCheckoutRoute />);

		expect(screen.getByText("error")).toBeTruthy();
		expect(
			screen.getByText(
				"결제에 필요한 예약 정보가 누락되었습니다. 홈에서 클래스를 다시 선택해 주세요.",
			),
		).toBeTruthy();

		fireEvent.press(screen.getByLabelText("create-reservation-checkout"));

		expect(checkoutMutation.mutate).not.toHaveBeenCalled();
	});
});
