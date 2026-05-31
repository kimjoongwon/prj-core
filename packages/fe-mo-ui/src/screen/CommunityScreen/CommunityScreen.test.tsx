import { type ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DesignSystemProvider } from "../../design-system/provider";
import {
	CommunityScreen,
	type CommunityScreenProps,
} from "./CommunityScreen";

jest.mock("react-native-safe-area-context", () => ({
	SafeAreaListener: ({ children }: { children: ReactNode }) => children,
	useSafeAreaInsets: () => ({
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	}),
}));

jest.mock("heroui-native/bottom-sheet", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");
	const BottomSheet = ({ children }: { children: ReactNode }) =>
		React.createElement(View, null, children);

	BottomSheet.Trigger = ({ children }: { children: ReactNode }) =>
		React.createElement(View, null, children);
	BottomSheet.Portal = ({ children }: { children: ReactNode }) =>
		React.createElement(View, null, children);
	BottomSheet.Overlay = () => null;
	BottomSheet.Content = ({ children }: { children: ReactNode }) =>
		React.createElement(View, null, children);
	BottomSheet.Title = ({ children }: { children: ReactNode }) =>
		React.createElement(Text, null, children);
	BottomSheet.Description = ({ children }: { children: ReactNode }) =>
		React.createElement(Text, null, children);
	BottomSheet.Close = () =>
		React.createElement(
			Pressable,
			{ accessibilityLabel: "닫기" },
			React.createElement(Text, null, "닫기"),
		);

	return {
		BottomSheet,
		bottomSheetClassNames: {},
		useBottomSheet: () => ({ nativeID: "community-bottom-sheet" }),
		useBottomSheetAnimation: () => ({}),
	};
});

const createProps = (
	overrides: Partial<CommunityScreenProps> = {},
): CommunityScreenProps => ({
	composer: {
		isOpen: false,
		text: "",
		title: "",
	},
	onPressRetry: jest.fn(),
	onPressWrite: jest.fn(),
	posts: [
		{
			authorName: "민지 회원",
			createdAtLabel: "방금 전",
			id: "community-post-1",
			isMine: true,
			text: "오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?",
			title: "저녁 수업 후 스트레칭",
		},
	],
	status: "ready",
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

describe("CommunityScreen", () => {
	it("커뮤니티 글 목록을 렌더링해야 한다", () => {
		renderWithDesignSystem(<CommunityScreen {...createProps()} />);

		expect(screen.getByText("지점 커뮤니티")).toBeTruthy();
		expect(screen.getByText("저녁 수업 후 스트레칭")).toBeTruthy();
		expect(screen.getByText("민지 회원")).toBeTruthy();
	});

	it("empty/error 상태 액션을 위임해야 한다", () => {
		const onPressWrite = jest.fn();
		const emptyView = renderWithDesignSystem(
			<CommunityScreen
				{...createProps({
					onPressWrite,
					posts: [],
					status: "empty",
				})}
			/>,
		);

		fireEvent.press(screen.getByLabelText("첫 글 쓰기"));
		expect(onPressWrite).toHaveBeenCalledTimes(1);
		emptyView.unmount();

		const onPressRetry = jest.fn();
		renderWithDesignSystem(
			<CommunityScreen
				{...createProps({
					errorDescription: "공간을 먼저 선택해 주세요.",
					onPressRetry,
					posts: [],
					status: "error",
				})}
			/>,
		);

		fireEvent.press(screen.getByLabelText("다시 시도"));
		expect(onPressRetry).toHaveBeenCalledTimes(1);
	});
});
