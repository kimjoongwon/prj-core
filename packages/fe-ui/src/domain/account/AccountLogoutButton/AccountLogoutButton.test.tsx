import { LanguageCode } from "@cocrepo/constant";
import { Dropdown } from "@heroui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n";
import { AccountLogoutButton } from "./AccountLogoutButton";

const mocks = vi.hoisted(() => ({
	account: {
		clear: vi.fn(),
	},
	fetch: vi.fn(),
	router: {
		replace: vi.fn(),
	},
}));

vi.stubGlobal(
	"fetch",
	mocks.fetch.mockResolvedValue({ ok: true } as Response),
);

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
		mocks.account.clear.mockReset();
		mocks.fetch.mockReset();
		mocks.fetch.mockResolvedValue({ ok: true } as Response);
		mocks.router.replace.mockReset();
	});

	it("쿠키 로그아웃 API를 호출한다", async () => {
		renderAccountLogoutButton();

		fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
		fireEvent.click(await screen.findByText("로그아웃"));

		await waitFor(() => {
			expect(mocks.fetch).toHaveBeenCalledWith("/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		});
	});

	it("로그아웃 후 account를 정리하고 login으로 이동한다", async () => {
		renderAccountLogoutButton();

		fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
		fireEvent.click(await screen.findByText("로그아웃"));

		await waitFor(() => {
			expect(mocks.account.clear).toHaveBeenCalledTimes(1);
			expect(mocks.router.replace).toHaveBeenCalledWith("/auth/login");
		});
	});

	it("쿠키 로그아웃이 실패해도 account를 정리하고 login으로 이동한다", async () => {
		mocks.fetch.mockRejectedValueOnce(new Error("logout failed"));
		renderAccountLogoutButton();

		fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
		fireEvent.click(await screen.findByText("로그아웃"));

		await waitFor(() => {
			expect(mocks.account.clear).toHaveBeenCalledTimes(1);
			expect(mocks.router.replace).toHaveBeenCalledWith("/auth/login");
		});
	});
});
