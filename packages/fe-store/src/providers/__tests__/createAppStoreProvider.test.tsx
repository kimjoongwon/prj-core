import { render } from "@testing-library/react";
import { vi } from "vitest";
import { createAppStoreProvider } from "../createAppStoreProvider";

const {
	mockSetApiPersistStore,
	mockSetIdpPersistStore,
	mockUsePathname,
	mockUseRouter,
} = vi.hoisted(() => ({
	mockSetApiPersistStore: vi.fn(),
	mockSetIdpPersistStore: vi.fn(),
	mockUsePathname: vi.fn(),
	mockUseRouter: vi.fn(),
}));

vi.mock("@cocrepo/api/core/client", () => ({
	setApiPersistStore: mockSetApiPersistStore,
}));

vi.mock("@cocrepo/api/idp/client", () => ({
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
	});
});
