import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observer } from "mobx-react-lite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LanguageStore } from "../../stores/language/languageStore";
import type { AppSessionScope } from "../../stores/rootStore";
import { useApp } from "../../stores/useApp";
import { AppProvider } from "../AppProvider";

const {
	mockSetApiSessionScope,
	mockSetApiLocale,
	mockUsePathname,
	mockUseRouter,
} = vi.hoisted(() => ({
	mockSetApiSessionScope: vi.fn<(scope: AppSessionScope) => void>(),
	mockSetApiLocale: vi.fn<(language: LanguageStore) => void>(),
	mockUsePathname: vi.fn(),
	mockUseRouter: vi.fn(),
}));

vi.mock("@cocrepo/api/core/client", () => ({
	setApiLocale: mockSetApiLocale,
	setApiSessionScope: mockSetApiSessionScope,
}));
vi.mock("@cocrepo/toolkit", () => ({
	createLogger: () => ({
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		debug: vi.fn(),
	}),
	navigateTo: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	usePathname: () => mockUsePathname(),
	useRouter: () => mockUseRouter(),
}));

const AppRuntimeState = observer(function AppRuntimeState() {
	const app = useApp();

	return (
		<>
			<output aria-label="app-name">{app.name}</output>
			<output aria-label="access-token">
				{app.account.authSession.accessToken}
			</output>
			<button
				type="button"
				onClick={() => {
					app.account.authSession.setNativeAuthSession({
						accessToken: "app-access-token",
						refreshToken: "app-refresh-token",
						sessionId: "app-session-id",
						accessTokenExpiresAt: Date.now() + 60_000,
						refreshTokenExpiresAt: Date.now() + 120_000,
					});
					app.language.setLanguageCode("en_US");
				}}
			>
				런타임 상태 변경
			</button>
		</>
	);
});

const ModalStatus = observer(function ModalStatus({
	onClose,
}: {
	onClose?: () => void;
}) {
	const modal = useApp().modal;

	return (
		<>
			<output aria-label="modal-status">
				{modal.current ? "open" : "closed"}
			</output>
			<button
				type="button"
				onClick={() => {
					modal.open({
						title: "Fixture Modal",
						state: {},
						content: { kind: "render", render: () => null },
						onClose,
					});
				}}
			>
				모달 열기
			</button>
		</>
	);
});

describe("AppProvider", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		mockUsePathname.mockReturnValue("/");
		mockUseRouter.mockReturnValue({
			push: vi.fn(),
			replace: vi.fn(),
			back: vi.fn(),
			forward: vi.fn(),
			refresh: vi.fn(),
		});
	});

	it("마운트하면 공용 AppContext와 API runtime binding을 함께 제공한다", () => {
		render(
			<AppProvider
				config={{
					appName: "TEST_APP",
					navItems: [],
					persistStorageKey: "test-persist",
				}}
			>
				<AppRuntimeState />
			</AppProvider>,
		);

		expect(screen.getByLabelText("app-name").textContent).toBe("TEST_APP");
		expect(mockSetApiSessionScope).toHaveBeenCalledTimes(1);
		expect(mockSetApiSessionScope).toHaveBeenCalledWith(
			expect.objectContaining({
				accessToken: null,
				refreshToken: null,
				sessionId: null,
				tenantId: null,
			}),
		);
		expect(mockSetApiLocale).toHaveBeenCalledTimes(1);
		const boundSessionScope = mockSetApiSessionScope.mock.calls[0]![0];
		const boundLanguage = mockSetApiLocale.mock.calls[0]![0];

		fireEvent.click(screen.getByRole("button", { name: "런타임 상태 변경" }));

		expect(boundSessionScope.accessToken).toBe("app-access-token");
		expect(boundSessionScope.refreshToken).toBe("app-refresh-token");
		expect(boundSessionScope.sessionId).toBe("app-session-id");
		expect(boundLanguage.languageCode).toBe("en_US");
		expect(document.documentElement.lang).toBe("en-US");

		act(() => {
			boundSessionScope.accessToken = "refreshed-access-token";
		});

		expect(screen.getByLabelText("access-token").textContent).toBe(
			"refreshed-access-token",
		);
		expect(mockSetApiSessionScope).toHaveBeenCalledTimes(1);
		expect(mockSetApiLocale).toHaveBeenCalledTimes(1);
	});

	it("pathname이 변경되면 열린 Modal을 callback 없이 정리한다", async () => {
		mockUsePathname.mockReturnValue("/before");
		const onClose = vi.fn();
		const view = render(
			<AppProvider
				config={{
					appName: "TEST_APP",
					navItems: [],
					persistStorageKey: "test-persist",
				}}
			>
				<ModalStatus onClose={onClose} />
			</AppProvider>,
		);

		await waitFor(() => {
			expect(screen.getByLabelText("modal-status").textContent).toBe("closed");
		});
		fireEvent.click(screen.getByRole("button", { name: "모달 열기" }));
		expect(screen.getByLabelText("modal-status").textContent).toBe("open");

		mockUsePathname.mockReturnValue("/after");
		view.rerender(
			<AppProvider
				config={{
					appName: "TEST_APP",
					navItems: [],
					persistStorageKey: "test-persist",
				}}
			>
				<ModalStatus onClose={onClose} />
			</AppProvider>,
		);

		await waitFor(() => {
			expect(screen.getByLabelText("modal-status").textContent).toBe("closed");
		});
		expect(onClose).not.toHaveBeenCalled();
	});
});
