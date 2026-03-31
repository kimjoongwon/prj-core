import { render, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
	AdminLayoutEffects,
	resolveCurrentSpaceGroundName,
} from "./AdminLayoutEffects";

const mockUseGetMySpaces = vi.fn();
const mockUseGetCurrentSpace = vi.fn();
const mockUseSpaceGuard = vi.fn();
const mockUsePersistStore = vi.fn();
let mySpacesResult: unknown;
let currentSpaceResult: unknown;

vi.mock("@cocrepo/api/idp/auth", () => ({
	useGetMySpaces: () => mockUseGetMySpaces(),
	useGetCurrentSpace: () => mockUseGetCurrentSpace(),
}));

vi.mock("@cocrepo/ui", () => ({
	SpaceAlert: () => null,
}));

vi.mock("@/hooks", () => ({
	useSpaceGuard: () => mockUseSpaceGuard(),
}));

vi.mock("@/stores/AppStoreProvider", () => ({
	usePersistStore: () => mockUsePersistStore(),
}));

describe("AdminLayoutEffects", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mySpacesResult = undefined;
		currentSpaceResult = undefined;
		mockUseGetMySpaces.mockImplementation(() => mySpacesResult);
		mockUseGetCurrentSpace.mockImplementation(() => currentSpaceResult);
		mockUseSpaceGuard.mockReturnValue({
			showAlert: false,
			handleConfirm: vi.fn(),
			handleDismiss: vi.fn(),
		});
	});

	it("current-space 응답에 ground가 없어도 my-spaces의 ground 이름으로 현재 Space를 설정해야 한다", async () => {
		const persistStore = {
			setSpaces: vi.fn(),
			setSpace: vi.fn(),
			clearSpace: vi.fn(),
			setSpaceSelectionResolved: vi.fn(),
		};

		mockUsePersistStore.mockReturnValue(persistStore);
		currentSpaceResult = {
			data: { data: { id: "space-a" } },
			isFetched: true,
		};
		mySpacesResult = {
			data: {
				data: [
					{
						id: "space-a",
						ground: { name: "플랫폼 운영본부" },
					},
				],
			},
		};

		render(<AdminLayoutEffects />);

		await waitFor(() => {
			expect(persistStore.setSpaces).toHaveBeenCalledWith([
				{
					spaceId: "space-a",
					groundName: "플랫폼 운영본부",
				},
			]);
			expect(persistStore.setSpace).toHaveBeenCalledWith(
				"space-a",
				"플랫폼 운영본부",
			);
			expect(persistStore.setSpaceSelectionResolved).toHaveBeenCalledWith(true);
		});
	});

	it("current-space에 ground가 비어 있으면 my-spaces의 같은 id ground 이름으로 보강해야 한다", () => {
		expect(
			resolveCurrentSpaceGroundName(
				{ id: "space-a" },
				[
					{
						id: "space-a",
						ground: { name: "플랫폼 운영본부" },
					},
				],
			),
		).toBe("플랫폼 운영본부");
	});
});
