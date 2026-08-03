import { fireEvent, render, screen } from "@testing-library/react-native";
import MainTabsLayout from "@/app/(tabs)/_layout";
import { mobileApiScope } from "@/auth/mobile-api-scope";
import type { ReactElement, ReactNode } from "react";

interface CustomHeaderProps {
  onPressSubtitle?: () => void;
  subtitle?: string;
  title?: string;
}

interface SpaceSelectionSheetProps {
  isOpen?: boolean;
  spaces?: unknown[];
}

interface MockTabsScreenOptions {
  title?: string;
  tabBarIcon?: (props: {
    color: string;
    focused: boolean;
    size: number;
  }) => ReactNode;
  tabBarButton?: (props: {
    accessibilityLabel: string;
    accessibilityRole: "button";
    children: ReactNode;
    onPress: () => void;
  }) => ReactElement;
}

interface MockTabsProps {
  children?: ReactNode;
  screenOptions?: {
    headerShown?: boolean;
    header?: (props: {
      options: { title?: string };
      route: { name: string };
    }) => ReactNode;
  };
}

interface MockTabsScreenProps {
  name: string;
  options: MockTabsScreenOptions;
}

jest.mock("@cocrepo/mo-ui", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable, Text, View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    AnimatedTabIcon: ({
      animationKey,
      focused,
      name,
    }: {
      animationKey?: number;
      focused: boolean;
      name: string;
    }) =>
      React.createElement(
        Text,
        null,
        `animated-icon:${name}:${focused ? "focused" : "rest"}:${animationKey ?? "none"}`,
      ),
    CustomHeader: ({ onPressSubtitle, subtitle, title }: CustomHeaderProps) =>
      React.createElement(View, null, [
        React.createElement(Text, { key: "title" }, `header:${title}`),
        React.createElement(
          Pressable,
          {
            accessibilityLabel: "현재 지점 변경",
            accessibilityRole: "button",
            key: "subtitle",
            onPress: onPressSubtitle,
          },
          React.createElement(Text, null, `subtitle:${subtitle}`),
        ),
      ]),
    SpaceSelectionSheet: ({ isOpen, spaces = [] }: SpaceSelectionSheetProps) =>
      isOpen
        ? React.createElement(Text, null, `space-sheet:${spaces.length}`)
        : null,
    useThemeColor: () => ["#006fee", "#71717a", "#18181b", "#27272a"],
  };
});

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

jest.mock("@cocrepo/api/idp/auth", () => ({
  useGetMySpaces: jest.fn(() => ({
    data: { data: [] },
  })),
  useSetCurrentSpace: jest.fn(() => ({
    isPending: false,
    mutateAsync: jest.fn(),
  })),
}));

jest.mock("@/auth/auth-config", () => ({
  getIdpApiBaseUrl: () => "http://localhost:3207",
}));

jest.mock("expo-router", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable, Text, View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  function MockTabs({ children, screenOptions }: MockTabsProps) {
    return React.createElement(
      View,
      {
        accessibilityLabel:
          screenOptions?.headerShown === false
            ? "expo-tabs-header-hidden"
            : "expo-tabs",
      },
      [
        typeof screenOptions?.header === "function"
          ? React.createElement(
              View,
              { key: "header" },
              screenOptions.header({
                options: { title: "오늘의 수업" },
                route: { name: "index" },
              }),
            )
          : null,
        children,
      ],
    );
  }

  function MockTabsScreen({ name, options }: MockTabsScreenProps) {
    const icon =
      typeof options.tabBarIcon === "function"
        ? options.tabBarIcon({
            color: name === "index" ? "#006fee" : "#71717a",
            focused: name === "index",
            size: 24,
          })
        : null;
    const tabButton =
      typeof options.tabBarButton === "function"
        ? options.tabBarButton({
            accessibilityLabel: `tab:${name}`,
            accessibilityRole: "button",
            children: React.createElement(Text, null, `press:${name}`),
            onPress: jest.fn(),
          })
        : React.createElement(
            Pressable,
            {
              accessibilityLabel: `tab:${name}`,
              accessibilityRole: "button",
            },
            React.createElement(Text, null, `press:${name}`),
          );

    return React.createElement(View, null, [
      React.createElement(Text, { key: "label" }, `${name}:${options.title}`),
      React.createElement(View, { key: "icon" }, icon),
      React.cloneElement(tabButton, { key: "button" }),
    ]);
  }

  MockTabs.Screen = MockTabsScreen;

  return { Tabs: MockTabs };
});

describe("mobile expo tabs layout", () => {
  beforeEach(() => {
    mobileApiScope.clear();
    mobileApiScope.setSpaceInfo({
      address: "서울 강남구",
      fitnessCenterName: "강남점",
      spaceId: "101",
      tenantId: "201",
    });
  });

  it("홈, 예약, 커뮤니티, 내 정보 라우트를 Expo Router Tabs로 등록해야 한다", () => {
    render(<MainTabsLayout />);

    expect(screen.getByLabelText("expo-tabs")).toBeTruthy();
    expect(screen.getAllByText("subtitle:강남점").length).toBeGreaterThan(0);
    expect(screen.getByText("index:오늘의 수업")).toBeTruthy();
    expect(screen.getByText("reservations:예약")).toBeTruthy();
    expect(screen.getByText("community:커뮤니티")).toBeTruthy();
    expect(screen.getByText("profile:내 정보")).toBeTruthy();
    expect(screen.getByText("animated-icon:house:focused:0")).toBeTruthy();
    expect(screen.getByText("animated-icon:calendarCheck:rest:0")).toBeTruthy();
    expect(screen.getByText("animated-icon:users:rest:0")).toBeTruthy();
    expect(screen.getByText("animated-icon:userRound:rest:0")).toBeTruthy();
  });

  it("이미 선택된 탭을 다시 눌러도 해당 아이콘 애니메이션 키를 갱신해야 한다", () => {
    render(<MainTabsLayout />);

    fireEvent.press(screen.getByLabelText("tab:index"));

    expect(screen.getByText("animated-icon:house:focused:1")).toBeTruthy();
  });
});
