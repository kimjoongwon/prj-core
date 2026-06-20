import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";
import { AccessibilityInfo, type ViewProps } from "react-native";
import { AnimatedTabIcon } from "./index";

const mockPlay = jest.fn();
const mockReset = jest.fn();

interface MockLottieRef {
	play: typeof mockPlay;
	reset: typeof mockReset;
}

jest.mock("lottie-react-native", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	const MockLottieView = React.forwardRef<MockLottieRef, ViewProps>(
		(props, ref) => {
			React.useImperativeHandle(ref, () => ({
				play: mockPlay,
				reset: mockReset,
			}));

			return React.createElement(View, props);
		},
	);

	return {
		__esModule: true,
		default: MockLottieView,
	};
});

const mockReduceMotion = (enabled: boolean) => {
	jest
		.spyOn(AccessibilityInfo, "isReduceMotionEnabled")
		.mockResolvedValue(enabled);
	jest.spyOn(AccessibilityInfo, "addEventListener").mockReturnValue({
		remove: jest.fn(),
	} as never);
};

describe("AnimatedTabIcon", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		mockPlay.mockClear();
		mockReset.mockClear();
	});

	it("선택 상태에서는 대응 Lottie를 한 번 재생해야 한다", async () => {
		mockReduceMotion(false);

		render(<AnimatedTabIcon color="#2563eb" focused name="house" size={24} />);

		expect(screen.queryByTestId("animated-tab-icon-house")).toBeNull();

		await waitFor(() => {
			expect(screen.getByTestId("animated-tab-icon-house")).toBeTruthy();
		});
		await waitFor(() => {
			expect(mockReset).toHaveBeenCalledTimes(1);
			expect(mockPlay).toHaveBeenCalledTimes(1);
		});
	});

	it("비선택 상태에서는 Lottie를 렌더하지 않아야 한다", async () => {
		mockReduceMotion(false);

		render(
			<AnimatedTabIcon
				color="#71717a"
				focused={false}
				name="house"
				size={24}
			/>,
		);

		await waitFor(() => {
			expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled();
		});
		expect(screen.queryByTestId("animated-tab-icon-house")).toBeNull();
		expect(mockPlay).not.toHaveBeenCalled();
	});

	it("모션 축소 설정이 켜져 있으면 선택 상태에서도 SVG fallback을 유지해야 한다", async () => {
		mockReduceMotion(true);

		render(
			<AnimatedTabIcon
				color="#2563eb"
				focused
				name="calendarCheck"
				size={24}
			/>,
		);

		await waitFor(() => {
			expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled();
		});
		expect(screen.queryByTestId("animated-tab-icon-calendarCheck")).toBeNull();
		expect(mockPlay).not.toHaveBeenCalled();
	});

	it("animation 매핑이 없으면 SVG fallback으로 깨지지 않아야 한다", async () => {
		mockReduceMotion(false);

		render(<AnimatedTabIcon color="#2563eb" focused name="mail" size={24} />);

		await waitFor(() => {
			expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled();
		});
		expect(screen.queryByTestId("animated-tab-icon-mail")).toBeNull();
		expect(mockPlay).not.toHaveBeenCalled();
	});

	it("Lottie 로딩 실패 후에는 SVG fallback으로 전환해야 한다", async () => {
		mockReduceMotion(false);

		render(
			<AnimatedTabIcon color="#2563eb" focused name="userRound" size={24} />,
		);

		await waitFor(() => {
			expect(screen.getByTestId("animated-tab-icon-userRound")).toBeTruthy();
		});

		fireEvent(
			screen.getByTestId("animated-tab-icon-userRound"),
			"animationFailure",
		);

		await waitFor(() => {
			expect(screen.queryByTestId("animated-tab-icon-userRound")).toBeNull();
		});
	});
});
