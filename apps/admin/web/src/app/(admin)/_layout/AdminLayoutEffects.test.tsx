import { render, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
	AdminLayoutEffects,
	resolveCurrentSpaceGroundName,
} from "./AdminLayoutEffects";

const mockUseSpaceBootstrap = vi.fn();
const mockUseVerifyToken = vi.fn();
const mockUseSpaceGuard = vi.fn();
const mockUsePersistStore = vi.fn();
const mockUseNavigationStore = vi.fn();

vi.mock("@cocrepo/api/idp/auth", () => ({
	useVerifyToken: () => mockUseVerifyToken(),
}));

vi.mock("@cocrepo/ui", () => ({
	SpaceAlert: () => null,
}));

vi.mock("@cocrepo/hook", () => ({
	resolveCurrentSpaceGroundName: (
		currentSpace: { id?: string; ground?: { name?: string | null } | null },
		spaces: Array<{ id?: string; ground?: { name?: string | null } | null }>,
	) =>
		currentSpace?.ground?.name ??
		spaces.find((space) => space.id === currentSpace?.id)?.ground?.name ??
		"",
}));

vi.mock("@/hooks", () => ({
	useSpaceBootstrap: () => mockUseSpaceBootstrap(),
	useSpaceGuard: () => mockUseSpaceGuard(),
}));

vi.mock("@/stores/AppStoreProvider", () => ({
	usePersistStore: () => mockUsePersistStore(),
	useNavigationStore: () => mockUseNavigationStore(),
}));

describe("AdminLayoutEffects", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseSpaceBootstrap.mockReturnValue(undefined);
		mockUseVerifyToken.mockReturnValue({
			data: { data: { hasFullAccess: false } },
		});
		mockUseSpaceGuard.mockReturnValue({
			showAlert: false,
			handleConfirm: vi.fn(),
			handleDismiss: vi.fn(),
		});
	});

	it("current tenant FULL_ACCESS 여부를 navigation scope checker에 연결해야 한다", async () => {
		const persistStore = {
			isHydrated: true,
			isSpaceSelectionResolved: true,
		};
		const navigationStore = {
			setScopeChecker: vi.fn(),
		};

		mockUsePersistStore.mockReturnValue(persistStore);
		mockUseNavigationStore.mockReturnValue(navigationStore);
		mockUseVerifyToken.mockReturnValue({
			data: { data: { hasFullAccess: true } },
		});

		render(<AdminLayoutEffects />);

		await waitFor(() => {
			expect(mockUseSpaceBootstrap).toHaveBeenCalled();
			expect(navigationStore.setScopeChecker).toHaveBeenCalled();
		});

		const scopeChecker = navigationStore.setScopeChecker.mock.calls[0]?.[0];
		expect(scopeChecker("global-full-access-only")).toBe(true);
		expect(scopeChecker("space")).toBe(true);
	});

	it("current-space에 ground가 비어 있으면 my-spaces의 같은 id ground 이름으로 보강해야 한다", () => {
		expect(
			resolveCurrentSpaceGroundName({ id: "space-a" }, [
				{
					id: "space-a",
					ground: { name: "플랫폼 운영본부" },
				},
			]),
		).toBe("플랫폼 운영본부");
	});
});
