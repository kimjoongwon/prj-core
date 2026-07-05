import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppProvider } from "../createAppProvider";

const {
	mockSetApiSpace,
	mockSetApiLocale,
	mockSetIdpSpace,
	mockSetIdpLocale,
	mockUsePathname,
	mockUseRouter,
} = vi.hoisted(() => ({
	mockSetApiSpace: vi.fn(),
	mockSetApiLocale: vi.fn(),
	mockSetIdpSpace: vi.fn(),
	mockSetIdpLocale: vi.fn(),
	mockUsePathname: vi.fn(),
	mockUseRouter: vi.fn(),
}));

vi.mock("@cocrepo/api/core/client", () => ({
	setApiLocale: mockSetApiLocale,
	setApiSpace: mockSetApiSpace,
}));

vi.mock("@cocrepo/api/idp/client", () => ({
	setIdpLocale: mockSetIdpLocale,
	setIdpSpace: mockSetIdpSpace,
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

describe("createAppProvider", () => {
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

	it("shares space and locale references with both core and IDP axios interceptors", () => {
		const { AppProvider } = createAppProvider({
			navItems: [],
			bottomTabIds: [],
			fabActions: [],
			persistStorageKey: "test-persist",
		});

		render(
			<AppProvider>
				<div>provider child</div>
			</AppProvider>,
		);

		expect(mockSetApiSpace).toHaveBeenCalledTimes(1);
		expect(mockSetIdpSpace).toHaveBeenCalledTimes(1);
		expect(mockSetIdpSpace).toHaveBeenCalledWith(
			mockSetApiSpace.mock.calls[0]?.[0],
		);
		expect(mockSetApiLocale).toHaveBeenCalledTimes(1);
		expect(mockSetIdpLocale).toHaveBeenCalledTimes(1);
		expect(mockSetIdpLocale).toHaveBeenCalledWith(
			mockSetApiLocale.mock.calls[0]?.[0],
		);
	});
});
