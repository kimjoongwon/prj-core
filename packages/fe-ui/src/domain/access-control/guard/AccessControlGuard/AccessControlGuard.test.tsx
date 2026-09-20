import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccessControlGuard } from "./AccessControlGuard";

interface PageAccessItem {
	scopeKind: string;
	subject: string;
	pageLabel: string;
}

const mocks = vi.hoisted(() => ({
	account: {
		authSession: { isHydrated: true },
		isHydrated: true,
		isSelectionResolved: true,
		currentTenantId: "tenant-a" as string | null,
	},
	accessControl: {
		isLoaded: true,
		can: vi.fn(() => false),
	},
	pathname: "/admin/users" as string | null,
	pageAccessItem: {
		scopeKind: "TENANT",
		subject: "User",
		pageLabel: "사용자",
	} as PageAccessItem | null,
	isScopeAccessible: true,
	verifyTokenResponse: undefined as
		| { data?: { hasFullAccess?: boolean } }
		| undefined,
	isVerifyingToken: false,
	router: {
		back: vi.fn(),
		push: vi.fn(),
	},
}));

vi.mock("@cocrepo/api/core/auth", () => ({
	useVerifyToken: () => ({
		data: mocks.verifyTokenResponse,
		isPending: mocks.isVerifyingToken,
	}),
}));

vi.mock("@cocrepo/constant", () => ({
	ADMIN_PATHS: { DASHBOARD: "/dashboard" },
	isScopeKindAccessible: () => mocks.isScopeAccessible,
	matchAdminPageAccessItem: () => mocks.pageAccessItem,
}));

vi.mock("@cocrepo/store", () => ({
	useApp: () => ({
		account: mocks.account,
		accessControl: mocks.accessControl,
	}),
}));

vi.mock("next/navigation", () => ({
	usePathname: () => mocks.pathname,
	useRouter: () => mocks.router,
}));

vi.mock("@heroui/react", async (importOriginal) => {
	const actualHeroUi = await importOriginal<typeof import("@heroui/react")>();

	return {
		...actualHeroUi,
		Spinner: () => <div data-testid="access-guard-spinner" />,
	};
});

vi.mock("../../../../i18n", () => ({
	translateNode: (value: ReactNode) => value,
	useT: () => (value: string) => value,
}));

vi.mock("../../../../input/Button/Button", () => ({
	Button: ({
		children,
		onPress,
	}: {
		children?: ReactNode;
		onPress?: () => void;
	}) => (
		<button type="button" onClick={onPress}>
			{children}
		</button>
	),
}));

function renderGuard() {
	return render(
		<AccessControlGuard contents={<div>허용된 관리자 콘텐츠</div>} />,
	);
}

describe("AccessControlGuard", () => {
	beforeEach(() => {
		mocks.account.authSession.isHydrated = true;
		mocks.account.isHydrated = true;
		mocks.account.isSelectionResolved = true;
		mocks.account.currentTenantId = "tenant-a";
		mocks.accessControl.isLoaded = true;
		mocks.accessControl.can.mockReset();
		mocks.accessControl.can.mockReturnValue(false);
		mocks.pathname = "/admin/users";
		mocks.pageAccessItem = {
			scopeKind: "TENANT",
			subject: "User",
			pageLabel: "사용자",
		};
		mocks.isScopeAccessible = true;
		mocks.verifyTokenResponse = undefined;
		mocks.isVerifyingToken = false;
		mocks.router.back.mockReset();
		mocks.router.push.mockReset();
	});

	it("접근 계약이 없는 route는 contents를 그대로 렌더링한다", () => {
		mocks.pageAccessItem = null;

		renderGuard();

		expect(screen.getByText("허용된 관리자 콘텐츠")).toBeInTheDocument();
	});

	it("account hydration이 완료되지 않으면 로딩 스피너를 렌더링한다", () => {
		mocks.account.isHydrated = false;

		renderGuard();

		expect(screen.getByTestId("access-guard-spinner")).toBeInTheDocument();
		expect(screen.queryByText("허용된 관리자 콘텐츠")).not.toBeInTheDocument();
	});

	it("token 권한을 확인 중이면 로딩 스피너를 렌더링한다", () => {
		mocks.isVerifyingToken = true;

		renderGuard();

		expect(screen.getByTestId("access-guard-spinner")).toBeInTheDocument();
		expect(screen.queryByText("허용된 관리자 콘텐츠")).not.toBeInTheDocument();
	});

	it("access-control이 로드되지 않으면 로딩 스피너를 렌더링한다", () => {
		mocks.accessControl.isLoaded = false;

		renderGuard();

		expect(screen.getByTestId("access-guard-spinner")).toBeInTheDocument();
	});

	it("full-access role이면 contents를 렌더링한다", () => {
		mocks.accessControl.isLoaded = false;
		mocks.verifyTokenResponse = { data: { hasFullAccess: true } };

		renderGuard();

		expect(screen.getByText("허용된 관리자 콘텐츠")).toBeInTheDocument();
	});

	it("화면 접근 권한이 있으면 contents를 렌더링한다", () => {
		mocks.accessControl.can.mockReturnValue(true);

		renderGuard();

		expect(mocks.accessControl.can).toHaveBeenCalledWith("view", "User");
		expect(screen.getByText("허용된 관리자 콘텐츠")).toBeInTheDocument();
	});

	it("화면 접근 권한이 없으면 forbidden UI와 이동 action을 렌더링한다", () => {
		renderGuard();

		expect(screen.getByText("접근 권한이 없습니다")).toBeInTheDocument();
		expect(
			screen.getByText(
				"메뉴 노출 권한이 있어도 화면 접근 권한이 따로 꺼져 있으면 URL 직접 접근은 막힙니다. 역할 상세의 화면 접근 섹션에서 해당 페이지를 켜면 다시 열 수 있습니다.",
			),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "이전 화면" }));
		fireEvent.click(screen.getByRole("button", { name: "대시보드로 이동" }));

		expect(mocks.router.back).toHaveBeenCalledOnce();
		expect(mocks.router.push).toHaveBeenCalledWith("/dashboard");
	});

	it("scope에 접근할 수 없으면 tenant role 안내를 렌더링한다", () => {
		mocks.isScopeAccessible = false;

		renderGuard();

		expect(
			screen.getByText(
				"현재 선택한 tenant role이 PLATFORM_ADMIN이 아니면 global 관리 화면은 열 수 없습니다. 헤더에서 PLATFORM_ADMIN tenant로 전환한 뒤 다시 시도해 주세요.",
			),
		).toBeInTheDocument();
	});
});
