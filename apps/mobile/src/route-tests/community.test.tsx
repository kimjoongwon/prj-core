import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import CommunityTabRoute from "@/app/(tabs)/community";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const mockInvalidateQueries = jest.fn();
const mockUseGetCommunityPosts = jest.fn();
const mockUseCreateCommunityPost = jest.fn();

interface CommunityComposerState {
	isSubmitting?: boolean;
	text: string;
	textError?: string | null;
	title: string;
}

interface CommunityPostItem {
	id: string;
	authorName?: string;
	text?: string;
	title?: string;
}

interface CommunityScreenProps {
	composer: CommunityComposerState;
	errorDescription?: string;
	onChangeComposerText?: (value: string) => void;
	onChangeComposerTitle?: (value: string) => void;
	onPressRetry?: () => void;
	onPressSubmitComposer?: () => void;
	onPressWrite?: () => void;
	posts?: CommunityPostItem[];
	status?: string;
}

jest.mock("@tanstack/react-query", () => ({
	useQueryClient: () => ({
		invalidateQueries: mockInvalidateQueries,
	}),
}));

jest.mock("@cocrepo/api/core/community", () => ({
	getGetCommunityPostsQueryKey: (params?: unknown) => [
		"/api/v1/community/posts",
		params,
	],
	useCreateCommunityPost: (...args: unknown[]) =>
		mockUseCreateCommunityPost(...args),
	useGetCommunityPosts: (...args: unknown[]) => mockUseGetCommunityPosts(...args),
}));

jest.mock("@/auth/auth-config", () => ({
	getCoreApiBaseUrl: () => "http://localhost:3306",
}));

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text, TextInput, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		CommunityScreen: ({
			composer,
			errorDescription,
			onChangeComposerText,
			onChangeComposerTitle,
			onPressRetry,
			onPressSubmitComposer,
			onPressWrite,
			posts = [],
			status,
		}: CommunityScreenProps) => {
			const renderStatus = () => {
				if (status === "loading") {
					return React.createElement(Text, { key: "loading" }, "loading");
				}

				if (status === "error") {
					return React.createElement(View, { key: "error" }, [
						React.createElement(Text, { key: "title" }, "error"),
						React.createElement(Text, { key: "description" }, errorDescription),
						React.createElement(
							Pressable,
							{
								accessibilityLabel: "다시 시도",
								key: "retry",
								onPress: onPressRetry,
							},
							React.createElement(Text, null, "다시 시도"),
						),
					]);
				}

				if (status === "empty") {
					return React.createElement(Text, { key: "empty" }, "empty");
				}

				return posts.map((post) =>
					React.createElement(View, { key: post.id }, [
						React.createElement(Text, { key: "author" }, post.authorName),
						React.createElement(Text, { key: "title" }, post.title),
						React.createElement(Text, { key: "text" }, post.text),
					]),
				);
			};

			return React.createElement(View, null, [
				React.createElement(Text, { key: "heading" }, "지점 커뮤니티"),
				renderStatus(),
				React.createElement(
					Pressable,
					{
						accessibilityLabel: "글쓰기",
						key: "write",
						onPress: onPressWrite,
					},
					React.createElement(Text, null, "글쓰기"),
				),
				React.createElement(TextInput, {
					accessibilityLabel: "커뮤니티 글 제목",
					key: "title-input",
					onChangeText: onChangeComposerTitle,
					value: composer.title,
				}),
				React.createElement(TextInput, {
					accessibilityLabel: "커뮤니티 글 내용",
					key: "text-input",
					onChangeText: onChangeComposerText,
					value: composer.text,
				}),
				React.createElement(
					Pressable,
					{
						accessibilityLabel: "글 등록",
						key: "submit",
						onPress: onPressSubmitComposer,
					},
					React.createElement(
						Text,
						null,
						composer.isSubmitting ? "등록 중" : "등록",
					),
				),
				composer.textError
					? React.createElement(Text, { key: "text-error" }, composer.textError)
					: null,
			]);
		},
	};
});

describe("mobile community tab route", () => {
	beforeEach(() => {
		mockInvalidateQueries.mockReset();
		mobileApiScope.clear();
		mobileApiScope.setSpaceInfo({
			tenantId: "tenant-1",
      spaceId: "space-1",
			groundName: "강남점",
			contentLanguageCode: "ko_KR",
		});
		mockUseGetCommunityPosts.mockReturnValue({
			data: {
				data: [
					{
						authorName: "민지 회원",
						createdAt: "2026-05-27T09:00:00.000Z",
						id: "community-post-1",
						isMine: true,
						isPinned: false,
						text: "오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?",
						title: "저녁 수업 후 스트레칭",
					},
				],
			},
			error: undefined,
			isError: false,
			isLoading: false,
			refetch: jest.fn(),
		});
		mockUseCreateCommunityPost.mockReturnValue({
			isPending: false,
			mutateAsync: jest.fn().mockResolvedValue({
				data: {
					id: "community-post-2",
				},
			}),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		act(() => {
			mobileApiScope.clear();
		});
	});

	it("커뮤니티 탭에서 실제 커뮤니티 글 목록을 렌더링해야 한다", () => {
		render(<CommunityTabRoute />);

		expect(screen.getByText("지점 커뮤니티")).toBeTruthy();
		expect(screen.getByText("저녁 수업 후 스트레칭")).toBeTruthy();
		expect(screen.getByText("민지 회원")).toBeTruthy();
		expect(mockUseGetCommunityPosts).toHaveBeenCalledWith(
			{ skip: 0, take: 20 },
			{
				query: { enabled: true },
				request: { baseURL: "http://localhost:3306" },
			},
		);
	});

	it("글 등록 시 API mutation 후 목록을 갱신해야 한다", async () => {
		const mutateAsync = jest.fn().mockResolvedValue({
			data: {
				id: "community-post-2",
			},
		});
		mockUseCreateCommunityPost.mockReturnValue({
			isPending: false,
			mutateAsync,
		});

		render(<CommunityTabRoute />);

		fireEvent.changeText(screen.getByLabelText("커뮤니티 글 제목"), "새 글");
		fireEvent.changeText(screen.getByLabelText("커뮤니티 글 내용"), "함께 운동해요.");
		fireEvent.press(screen.getByLabelText("글 등록"));

		await waitFor(() => {
			expect(mutateAsync).toHaveBeenCalledWith({
				data: {
					text: "함께 운동해요.",
					title: "새 글",
				},
			});
		});
		expect(mockInvalidateQueries).toHaveBeenCalledWith({
			queryKey: ["/api/v1/community/posts", { skip: 0, take: 20 }],
		});
	});
});
