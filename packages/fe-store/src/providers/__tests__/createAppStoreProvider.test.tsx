import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppStoreProvider } from "../createAppStoreProvider";

const {
	mockSetApiPersistStore,
	mockSetApiLocaleStore,
	mockSetIdpPersistStore,
	mockSetIdpLocaleStore,
	mockUsePathname,
	mockUseRouter,
} = vi.hoisted(() => ({
	mockSetApiPersistStore: vi.fn(),
	mockSetApiLocaleStore: vi.fn(),
	mockSetIdpPersistStore: vi.fn(),
	mockSetIdpLocaleStore: vi.fn(),
	mockUsePathname: vi.fn(),
	mockUseRouter: vi.fn(),
}));

vi.mock("@cocrepo/api/core/client", () => ({
	setApiLocaleStore: mockSetApiLocaleStore,
	setApiPersistStore: mockSetApiPersistStore,
}));

vi.mock("@cocrepo/api/idp/client", () => ({
	setIdpLocaleStore: mockSetIdpLocaleStore,
	setIdpPersistStore: mockSetIdpPersistStore,
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

describe("createAppStoreProvider", () => {
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

	it("creates a shared PersistStore for both core and IDP axios interceptors", () => {
		const { AppStoreProvider } = createAppStoreProvider({
			navItems: [],
			bottomTabIds: [],
			fabActions: [],
			persistStorageKey: "test-persist",
		});

		render(
			<AppStoreProvider>
				<div>provider child</div>
			</AppStoreProvider>,
		);

		expect(mockSetApiPersistStore).toHaveBeenCalledTimes(1);
		expect(mockSetIdpPersistStore).toHaveBeenCalledTimes(1);
		expect(mockSetIdpPersistStore).toHaveBeenCalledWith(
			mockSetApiPersistStore.mock.calls[0]?.[0],
		);
		expect(mockSetApiLocaleStore).toHaveBeenCalledTimes(1);
		expect(mockSetIdpLocaleStore).toHaveBeenCalledTimes(1);
		expect(mockSetIdpLocaleStore).toHaveBeenCalledWith(
			mockSetApiLocaleStore.mock.calls[0]?.[0],
		);
	});
});
