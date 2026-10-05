import {
	getCurrentSpaceQueryKey,
	getGetMySpacesQueryKey,
} from "@cocrepo/api/idp/auth";
import { Token } from "@cocrepo/constant";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeAdminQueryClient } from "../query-client";
import { AuthenticatedProviders } from "./authenticated-providers";

const installCoreSessionRecoveryMock = vi.hoisted(() => vi.fn());
const refreshSessionTokensMock = vi.hoisted(() => vi.fn());
const getCurrentSpaceMock = vi.hoisted(() => vi.fn());
const getMySpacesMock = vi.hoisted(() => vi.fn());
const setCurrentSpaceMock = vi.hoisted(() => vi.fn());
const useVerifyTokenMock = vi.hoisted(() => vi.fn());
const useAppMock = vi.hoisted(() => vi.fn());
const routerReplaceMock = vi.hoisted(() => vi.fn());
// useEffect 의존 배열에 router가 있으므로 안정 참조를 반환해야 실제 앱처럼
// 리렌더링이 bootstrap을 재실행하지 않는다.
const routerStub = vi.hoisted(() => ({ replace: routerReplaceMock }));

vi.mock("@cocrepo/api/core/client", () => ({
	installCoreSessionRecovery: installCoreSessionRecoveryMock,
	refreshSessionTokens: refreshSessionTokensMock,
}));

// queryKey 팩토리는 실구현을 유지해 서버 prefetch와 같은 캐시 키를 검증한다.
vi.mock("@cocrepo/api/idp/auth", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@cocrepo/api/idp/auth")>();
	return {
		...actual,
		getCurrentSpace: getCurrentSpaceMock,
		getMySpaces: getMySpacesMock,
		setCurrentSpace: setCurrentSpaceMock,
		useVerifyToken: useVerifyTokenMock,
	};
});

vi.mock("@cocrepo/hook", () => ({
	useAbilityBootstrap: () => ({
		abilities: [],
		isLoading: false,
		isError: false,
	}),
	useTenantBootstrapFromApi: () => undefined,
}));

vi.mock("@cocrepo/store", () => ({
	useApp: useAppMock,
}));

vi.mock("@heroui/react", () => ({
	Spinner: () => null,
}));

vi.mock("next/navigation", () => ({
	useRouter: () => routerStub,
}));

interface AppStubInput {
	refreshToken: string | null;
	sessionId: string | null;
}

const createAppStub = ({ refreshToken, sessionId }: AppStubInput) => ({
	account: {
		authSession: {
			isLoggingOut: false,
			isHydrated: true,
			refreshToken,
			sessionId,
		},
		isHydrated: true,
		isSelectionResolved: true,
		currentTenantId: null,
	},
	accessControl: { updateRules: vi.fn() },
	navigation: { setScopeChecker: vi.fn() },
});

const writeSessionPresenceMarker = () => {
	// biome-ignore lint/suspicious/noDocumentCookie: 테스트에서 jsdom의 세션 표시 쿠키를 심는 유일한 수단
	document.cookie = `${Token.LOGGED_IN}=1`;
};

const clearSessionPresenceMarker = () => {
	// biome-ignore lint/suspicious/noDocumentCookie: 테스트에서 jsdom의 세션 표시 쿠키를 지우는 유일한 수단
	document.cookie = `${Token.LOGGED_IN}=1; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const renderAuthenticatedProviders = (queryClient: QueryClient) =>
	render(
		<QueryClientProvider client={queryClient}>
			<AuthenticatedProviders>
				<div>children-ready</div>
			</AuthenticatedProviders>
		</QueryClientProvider>,
	);

describe("AuthenticatedProviders tenant 기본 선택", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		clearSessionPresenceMarker();
		useVerifyTokenMock.mockReturnValue({ data: undefined, isPending: false });
		getCurrentSpaceMock.mockResolvedValue({ data: null });
		getMySpacesMock.mockResolvedValue({ data: [{ tenantId: BigInt(101) }] });
		setCurrentSpaceMock.mockResolvedValue({
			data: { id: BigInt(101), tenantId: BigInt(101) },
		});
	});

	afterEach(() => {
		cleanup();
		clearSessionPresenceMarker();
	});

	it("Given 스토어 세션이 살아 있고 tenant 미선택이면, When 재방문하면, Then 토큰 갱신 없이 첫 tenant를 POST로 기본 선택한다", async () => {
		useAppMock.mockReturnValue(
			createAppStub({ refreshToken: "refresh-1", sessionId: "session-1" }),
		);
		const queryClient = makeAdminQueryClient();

		renderAuthenticatedProviders(queryClient);

		await waitFor(() => {
			expect(screen.getByText("children-ready")).toBeInTheDocument();
		});
		expect(refreshSessionTokensMock).not.toHaveBeenCalled();
		expect(routerReplaceMock).not.toHaveBeenCalled();
		expect(setCurrentSpaceMock).toHaveBeenCalledTimes(1);
		expect(setCurrentSpaceMock).toHaveBeenCalledWith({ tenantId: "101" });
		expect(queryClient.getQueryData(getCurrentSpaceQueryKey())).toEqual({
			data: { id: BigInt(101), tenantId: BigInt(101) },
		});
	});

	it("Given 스토어가 비고 세션 쿠키가 있으며 tenant 미선택이면, When 진입하면, Then 토큰 갱신 후 첫 tenant를 기본 선택한다", async () => {
		useAppMock.mockReturnValue(
			createAppStub({ refreshToken: null, sessionId: null }),
		);
		refreshSessionTokensMock.mockResolvedValue(true);
		writeSessionPresenceMarker();
		const queryClient = makeAdminQueryClient();

		renderAuthenticatedProviders(queryClient);

		await waitFor(() => {
			expect(screen.getByText("children-ready")).toBeInTheDocument();
		});
		expect(refreshSessionTokensMock).toHaveBeenCalledTimes(1);
		expect(routerReplaceMock).not.toHaveBeenCalled();
		expect(setCurrentSpaceMock).toHaveBeenCalledTimes(1);
		expect(setCurrentSpaceMock).toHaveBeenCalledWith({ tenantId: "101" });
	});

	it("Given 선택이 확정된 캐시(서버 prefetch)면, When 재방문하면, Then 추가 조회·선택 없이 캐시 읽기로 끝난다", async () => {
		useAppMock.mockReturnValue(
			createAppStub({ refreshToken: "refresh-1", sessionId: "session-1" }),
		);
		const queryClient = makeAdminQueryClient();
		queryClient.setQueryData(getCurrentSpaceQueryKey(), {
			data: { id: BigInt(101), tenantId: BigInt(101) },
		});
		queryClient.setQueryData(getGetMySpacesQueryKey(), {
			data: [{ tenantId: BigInt(101) }],
		});

		renderAuthenticatedProviders(queryClient);

		await waitFor(() => {
			expect(screen.getByText("children-ready")).toBeInTheDocument();
		});
		expect(getCurrentSpaceMock).not.toHaveBeenCalled();
		expect(getMySpacesMock).not.toHaveBeenCalled();
		expect(setCurrentSpaceMock).not.toHaveBeenCalled();
	});

	it("Given 세션 표시 쿠키가 없으면, When 진입하면, Then 로그인으로 보내고 하위 트리와 기본 선택을 실행하지 않는다", async () => {
		useAppMock.mockReturnValue(
			createAppStub({ refreshToken: null, sessionId: null }),
		);
		const queryClient = makeAdminQueryClient();

		renderAuthenticatedProviders(queryClient);

		await waitFor(() => {
			expect(routerReplaceMock).toHaveBeenCalledWith("/auth/login");
		});
		expect(refreshSessionTokensMock).not.toHaveBeenCalled();
		expect(getCurrentSpaceMock).not.toHaveBeenCalled();
		expect(setCurrentSpaceMock).not.toHaveBeenCalled();
		expect(screen.queryByText("children-ready")).not.toBeInTheDocument();
	});
});
