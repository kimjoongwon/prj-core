import { LanguageCode } from "@cocrepo/constant";
import { Dropdown } from "@heroui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n";
import { AccountLogoutButton } from "./AccountLogoutButton";

const mocks = vi.hoisted(() => ({
	account: {
		authSession: {
			sessionId: "session-a" as string | null,
			refreshToken: "refresh-a" as string | null,
		},
		clear: vi.fn(),
	},
	nativeLogout: vi.fn(),
	router: {
		replace: vi.fn(),
	},
}));

vi.mock("@cocrepo/api/core/auth", () => ({
	nativeLogout: mocks.nativeLogout,
}));

vi.mock("@cocrepo/store", () => ({
	useApp: () => ({ account: mocks.account }),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => mocks.router,
}));

function LogoutMenu() {
	return (
		<Dropdown.Menu aria-label="사용자 메뉴">
			<AccountLogoutButton />
		</Dropdown.Menu>
	);
}

function renderAccountLogoutButton() {
	return render(
		<I18nProvider
			languageCode={LanguageCode.ko_KR}
			messages={{ 로그아웃: "로그아웃" }}
		>
			<Dropdown>
				<Dropdown.Trigger aria-label="메뉴 열기">메뉴</Dropdown.Trigger>
				<Dropdown.Popover>
					<LogoutMenu />
				</Dropdown.Popover>
			</Dropdown>
		</I18nProvider>,
	);
}

describe("AccountLogoutButton", () => {
	beforeEach(() => {
		mocks.account.authSession.sessionId = "session-a";
		mocks.account.authSession.refreshToken = "refresh-a";
		mocks.account.clear.mockReset();
		mocks.nativeLogout.mockReset();
		mocks.nativeLogout.mockResolvedValue({});
		mocks.router.replace.mockReset();
	});

	it("session이 있으면 native logout을 호출한다", async () => {
		renderAccountLogoutButton();

		fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
		fireEvent.click(await screen.findByText("로그아웃"));

		expect(mocks.nativeLogout).toHaveBeenCalledWith({
			sessionId: "session-a",
			refreshToken: "refresh-a",
		});
	});

	it("session이 없으면 즉시 account를 정리하고 login으로 이동한다", async () => {
		mocks.account.authSession.sessionId = null;
		renderAccountLogoutButton();

		fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
		fireEvent.click(await screen.findByText("로그아웃"));

		expect(mocks.account.clear).toHaveBeenCalledTimes(1);
		expect(mocks.router.replace).toHaveBeenCalledWith("/auth/login");
		expect(mocks.nativeLogout).not.toHaveBeenCalled();
	});

	it("native logout이 끝나면 account를 정리하고 login으로 이동한다", async () => {
		renderAccountLogoutButton();

		fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
		fireEvent.click(await screen.findByText("로그아웃"));

		await waitFor(() => {
			expect(mocks.account.clear).toHaveBeenCalledTimes(1);
			expect(mocks.router.replace).toHaveBeenCalledWith("/auth/login");
		});
	});

	it("native logout이 실패해도 account를 정리하고 login으로 이동한다", async () => {
		mocks.nativeLogout.mockRejectedValueOnce(new Error("logout failed"));
		renderAccountLogoutButton();

		fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
		fireEvent.click(await screen.findByText("로그아웃"));

		await waitFor(() => {
			expect(mocks.account.clear).toHaveBeenCalledTimes(1);
			expect(mocks.router.replace).toHaveBeenCalledWith("/auth/login");
		});
	});
});
