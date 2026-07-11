import { LanguageCode } from "@cocrepo/constant";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n";
import { AccountUserMenu } from "./AccountUserMenu";

const mocks = vi.hoisted(() => ({
	account: {
		authSession: {
			sessionId: "session-a",
			refreshToken: "refresh-a",
		},
		clear: vi.fn(),
	},
	nativeLogout: vi.fn(),
	router: { replace: vi.fn() },
}));

vi.mock("@cocrepo/api/idp/auth", () => ({
	nativeLogout: mocks.nativeLogout,
}));

vi.mock("@cocrepo/store", () => ({
	useApp: () => ({ account: mocks.account }),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => mocks.router,
}));

function renderAccountUserMenu() {
	return render(
		<I18nProvider
			languageCode={LanguageCode.ko_KR}
			messages={{ "사용자 메뉴": "사용자 메뉴", 로그아웃: "로그아웃" }}
		>
			<AccountUserMenu />
		</I18nProvider>,
	);
}

describe("AccountUserMenu", () => {
	it("계정 사용자 정보를 표시한다", () => {
		renderAccountUserMenu();

		expect(
			screen.getByRole("button", { name: "사용자 메뉴" }),
		).toHaveTextContent("관리자");
	});

	it("사용자 메뉴에 account logout action을 표시한다", async () => {
		renderAccountUserMenu();

		fireEvent.click(screen.getByRole("button", { name: "사용자 메뉴" }));

		expect(await screen.findByText("로그아웃")).toBeInTheDocument();
	});
});
