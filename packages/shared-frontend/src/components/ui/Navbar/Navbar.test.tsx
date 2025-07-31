import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "./Navbar";
import { Route } from "./types";

// DOM 매처 확장
declare global {
	namespace Vi {
		interface Assertion<_T = any> {
			toBeInTheDocument(): void;
			toHaveAttribute(attr: string, value?: string): void;
		}
	}
}

// UI components mock
vi.mock("../../ui", () => ({
	HStack: ({ children, className }: any) => (
		<div className={className}>{children}</div>
	),
	VStack: ({ children, className }: any) => (
		<div className={className}>{children}</div>
	),
}));

// Plate mock
vi.mock("../../../..", () => ({
	Plate: {
		navigation: {
			setCurrentPath: vi.fn(),
		},
	},
}));

// @heroui/react mock
vi.mock("@heroui/react", () => ({
	Button: ({
		children,
		onPress,
		variant,
		color,
		startContent,
		...props
	}: any) => (
		<button
			onClick={onPress}
			data-testid={`button-${children}`}
			data-variant={variant}
			data-color={color}
			{...props}
		>
			{startContent}
			{children}
		</button>
	),
}));

// iconUtils mock
vi.mock("../../../utils/iconUtils", () => ({
	renderLucideIcon: vi.fn((iconName: string) => (
		<span data-testid={`icon-${iconName}`} />
	)),
}));

// Mock 함수에 접근하기 위한 헬퍼
const getMockNavigation = () => {
	const { Plate } = require("../../../..");
	return Plate.navigation;
};

describe("Navbar", () => {
	const mockRoutes: Route[] = [
		{
			name: "사용자 서비스",
			fullPath: "/dashboard/user-service",
			relativePath: "user-service",
			active: false,
			icon: "Users",
			children: [
				{
					name: "사용자 목록",
					fullPath: "/dashboard/user-service/users",
					relativePath: "users",
					active: false,
					icon: "User",
					children: [],
				},
				{
					name: "사용자 상세",
					fullPath: "/dashboard/user-service/users/:userId",
					relativePath: "users/:userId",
					active: false,
					icon: "UserDetail",
					children: [],
				},
			],
		},
		{
			name: "공간 서비스",
			fullPath: "/dashboard/space-service",
			relativePath: "space-service",
			active: true,
			icon: "Space",
			children: [
				{
					name: "공간 목록",
					fullPath: "/dashboard/space-service/spaces",
					relativePath: "spaces",
					active: false,
					icon: "MapPin",
					children: [],
				},
			],
		},
		{
			name: "설정",
			fullPath: "/dashboard/settings",
			relativePath: "settings",
			active: false,
			icon: "Settings",
			children: [], // 자식이 없는 라우트
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("수평 방향으로 라우트 버튼들을 렌더링해야 한다", () => {
			render(<Navbar routes={mockRoutes} />);

			expect(screen.getByTestId("button-사용자 서비스")).toBeDefined();
			expect(screen.getByTestId("button-공간 서비스")).toBeDefined();
			expect(screen.getByTestId("button-설정")).toBeDefined();
		});

		it("수직 방향으로 라우트 버튼들을 렌더링해야 한다", () => {
			render(<Navbar routes={mockRoutes} direction="vertical" />);

			expect(screen.getByTestId("button-사용자 서비스")).toBeDefined();
			expect(screen.getByTestId("button-공간 서비스")).toBeDefined();
			expect(screen.getByTestId("button-설정")).toBeDefined();
		});

		it("활성 상태인 라우트는 primary 색상을 가져야 한다", () => {
			render(<Navbar routes={mockRoutes} />);

			const activeButton = screen.getByTestId("button-공간 서비스");
			expect(activeButton.getAttribute("data-color")).toBe("primary");
		});

		it("비활성 상태인 라우트는 default 색상을 가져야 한다", () => {
			render(<Navbar routes={mockRoutes} />);

			const inactiveButton = screen.getByTestId("button-사용자 서비스");
			expect(inactiveButton.getAttribute("data-color")).toBe("default");
		});
	});

	describe("클릭 이벤트 처리", () => {
		it("라우트를 클릭하면 setCurrentPath를 호출해야 한다", () => {
			const mockOnRouteClick = vi.fn((route) => {
				getMockNavigation().setCurrentPath(route.fullPath);
			});

			render(<Navbar routes={mockRoutes} onRouteClick={mockOnRouteClick} />);

			const userServiceButton = screen.getByTestId("button-사용자 서비스");
			fireEvent.click(userServiceButton);

			expect(getMockNavigation().setCurrentPath).toHaveBeenCalledWith(
				"/dashboard/user-service",
			);
		});

		it("다른 라우트를 클릭해도 setCurrentPath를 호출해야 한다", () => {
			const mockOnRouteClick = vi.fn((route) => {
				getMockNavigation().setCurrentPath(route.fullPath);
			});

			render(<Navbar routes={mockRoutes} onRouteClick={mockOnRouteClick} />);

			const spaceServiceButton = screen.getByTestId("button-공간 서비스");
			fireEvent.click(spaceServiceButton);

			expect(getMockNavigation().setCurrentPath).toHaveBeenCalledWith(
				"/dashboard/space-service",
			);
		});

		it("자식이 없는 라우트를 클릭해도 setCurrentPath를 호출해야 한다", () => {
			const mockOnRouteClick = vi.fn((route) => {
				getMockNavigation().setCurrentPath(route.fullPath);
			});

			render(<Navbar routes={mockRoutes} onRouteClick={mockOnRouteClick} />);

			const settingsButton = screen.getByTestId("button-설정");
			fireEvent.click(settingsButton);

			expect(getMockNavigation().setCurrentPath).toHaveBeenCalledWith(
				"/dashboard/settings",
			);
		});

		it("fullPath가 없는 라우트를 클릭하면 아무것도 하지 않아야 한다", () => {
			const routeWithoutPath: Route[] = [
				{
					name: "경로 없는 라우트",
					fullPath: "",
					relativePath: "",
					active: false,
					children: [],
				},
			];

			const mockOnRouteClick = vi.fn((route) => {
				getMockNavigation().setCurrentPath(route.fullPath);
			});

			render(
				<Navbar routes={routeWithoutPath} onRouteClick={mockOnRouteClick} />,
			);

			const button = screen.getByTestId("button-경로 없는 라우트");
			fireEvent.click(button);

			expect(getMockNavigation().setCurrentPath).not.toHaveBeenCalled();
		});
	});

	describe("아이콘 렌더링", () => {
		it("아이콘이 있는 라우트는 아이콘을 렌더링해야 한다", () => {
			render(<Navbar routes={mockRoutes} />);

			expect(screen.getByTestId("icon-Users")).toBeDefined();
			expect(screen.getByTestId("icon-Space")).toBeDefined();
			expect(screen.getByTestId("icon-Settings")).toBeDefined();
		});
	});

	describe("엣지 케이스", () => {
		it("빈 라우트 배열을 처리할 수 있어야 한다", () => {
			render(<Navbar routes={[]} />);

			// 에러 없이 렌더링되어야 함
			expect(screen.queryByRole("button")).toBeNull();
		});

		it("자식이 빈 배열인 라우트는 해당 경로로 이동해야 한다", () => {
			const routeWithEmptyChildren: Route[] = [
				{
					name: "빈 자식 라우트",
					fullPath: "/dashboard/empty-children",
					relativePath: "empty-children",
					active: false,
					children: [],
				},
			];

			const mockOnRouteClick = vi.fn((route) => {
				getMockNavigation().setCurrentPath(route.fullPath);
			});

			render(
				<Navbar
					routes={routeWithEmptyChildren}
					onRouteClick={mockOnRouteClick}
				/>,
			);

			const button = screen.getByTestId("button-빈 자식 라우트");
			fireEvent.click(button);

			expect(getMockNavigation().setCurrentPath).toHaveBeenCalledWith(
				"/dashboard/empty-children",
			);
		});
	});
});
