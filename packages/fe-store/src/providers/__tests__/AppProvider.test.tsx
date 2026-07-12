import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observer } from "mobx-react-lite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useApp } from "../../stores/useApp";
import { AppProvider } from "../AppProvider";

const {
	mockSetApiSessionScope,
	mockSetApiLocale,
	mockSetIdpSessionScope,
	mockSetIdpLocale,
	mockUsePathname,
	mockUseRouter,
} = vi.hoisted(() => ({
	mockSetApiSessionScope: vi.fn(),
	mockSetApiLocale: vi.fn(),
	mockSetIdpSessionScope: vi.fn(),
	mockSetIdpLocale: vi.fn(),
	mockUsePathname: vi.fn(),
	mockUseRouter: vi.fn(),
}));

vi.mock("@cocrepo/api/core/client", () => ({
	setApiLocale: mockSetApiLocale,
	setApiSessionScope: mockSetApiSessionScope,
}));

vi.mock("@cocrepo/api/idp/client", () => ({
	setIdpLocale: mockSetIdpLocale,
	setIdpSessionScope: mockSetIdpSessionScope,
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

function AppName() {
	return <output aria-label="app-name">{useApp().name}</output>;
}

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
				<AppName />
			</AppProvider>,
		);

		expect(screen.getByLabelText("app-name").textContent).toBe("TEST_APP");
		expect(mockSetApiSessionScope).toHaveBeenCalledTimes(1);
		expect(mockSetIdpSessionScope).toHaveBeenCalledTimes(1);
		expect(mockSetIdpSessionScope).toHaveBeenCalledWith(
			mockSetApiSessionScope.mock.calls[0]?.[0],
		);
		expect(mockSetApiLocale).toHaveBeenCalledTimes(1);
		expect(mockSetIdpLocale).toHaveBeenCalledTimes(1);
		expect(mockSetIdpLocale).toHaveBeenCalledWith(
			mockSetApiLocale.mock.calls[0]?.[0],
		);
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
