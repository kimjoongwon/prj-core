// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setLoginRedirectUrlMock = vi.fn();
const setIdpLoginRedirectUrlMock = vi.fn();
const setApiPersistStoreMock = vi.fn();
const setIdpPersistStoreMock = vi.fn();
const useVerifyTokenMock = vi.fn();
const useGetMySpacesMock = vi.fn();
const useGetCurrentSpaceMock = vi.fn();
const useSetCurrentSpaceMock = vi.fn();
const customInstanceMock = vi.fn();

vi.mock("@cocrepo/ui", () => ({
	DesignSystemProvider: ({ children }: PropsWithChildren) => children,
}));

vi.mock("nuqs/adapters/react", () => ({
	NuqsAdapter: ({ children }: PropsWithChildren) => children,
}));

vi.mock("../../../../../packages/fe-api/src/core/client", () => ({
	customInstance: (...args: unknown[]) => customInstanceMock(...args),
	setApiPersistStore: (...args: unknown[]) => setApiPersistStoreMock(...args),
	setLoginRedirectUrl: (...args: unknown[]) => setLoginRedirectUrlMock(...args),
}));

vi.mock("../../../../../packages/fe-api/src/idp/client", () => ({
	setIdpLoginRedirectUrl: (...args: unknown[]) =>
		setIdpLoginRedirectUrlMock(...args),
	setIdpPersistStore: (...args: unknown[]) => setIdpPersistStoreMock(...args),
}));

vi.mock("../../../../../packages/fe-api/src/idp/auth", () => ({
	useGetMySpaces: (...args: unknown[]) => useGetMySpacesMock(...args),
	useGetCurrentSpace: (...args: unknown[]) => useGetCurrentSpaceMock(...args),
	useSetCurrentSpace: (...args: unknown[]) => useSetCurrentSpaceMock(...args),
	useVerifyToken: (...args: unknown[]) => useVerifyTokenMock(...args),
}));

async function loadProvider(requireAuth: boolean) {
	vi.resetModules();
	vi.stubGlobal("__STORYBOOK_REQUIRE_AUTH__", requireAuth);
	return import("./StorybookRuntimeProvider");
}

function createStorageMock() {
	const store = new Map<string, string>();

	return {
		getItem: vi.fn((key: string) => store.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			store.delete(key);
		}),
		clear: vi.fn(() => {
			store.clear();
		}),
	};
}

beforeEach(() => {
	vi.stubGlobal("localStorage", createStorageMock());
	vi.stubGlobal("sessionStorage", createStorageMock());
	customInstanceMock.mockReset();
	setApiPersistStoreMock.mockReset();
	setIdpPersistStoreMock.mockReset();
	setLoginRedirectUrlMock.mockReset();
	setIdpLoginRedirectUrlMock.mockReset();
	useVerifyTokenMock.mockReset();
	useGetMySpacesMock.mockReset();
	useGetCurrentSpaceMock.mockReset();
	useSetCurrentSpaceMock.mockReset();

	customInstanceMock.mockResolvedValue({ data: [] });
	useVerifyTokenMock.mockReturnValue({
		data: undefined,
		error: null,
		isError: false,
		isLoading: false,
	});
	useGetMySpacesMock.mockReturnValue({
		data: undefined,
		error: null,
		isError: false,
		isLoading: false,
	});
	useGetCurrentSpaceMock.mockReturnValue({
		data: undefined,
		error: null,
		isError: false,
		isLoading: false,
	});
	useSetCurrentSpaceMock.mockReturnValue({
		mutate: vi.fn(),
	});
	localStorage.clear();
	sessionStorage.clear();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("StorybookRuntimeProvider", () => {
	it("sets Storybook login redirect URLs using the top-level story location", async () => {
		window.history.replaceState(
			{},
			"",
			"/iframe.html?id=features-button--primary&viewMode=story",
		);

		const { StorybookRuntimeProvider } = await loadProvider(false);

		render(
			<StorybookRuntimeProvider
				runtime={{
					realm: "none",
					requiresSpace: false,
					currentPath: "/dashboard",
				}}
				storyId="features-button--primary"
			>
				<div>Story content</div>
			</StorybookRuntimeProvider>,
		);

		await waitFor(() => {
			expect(setLoginRedirectUrlMock).toHaveBeenCalledWith(
				"/__storybook_auth/login?returnTo=%2Fiframe.html%3Fid%3Dfeatures-button--primary%26viewMode%3Dstory",
			);
		});
		expect(setIdpLoginRedirectUrlMock).toHaveBeenCalledWith(
			"/__storybook_auth/login?returnTo=%2Fiframe.html%3Fid%3Dfeatures-button--primary%26viewMode%3Dstory",
		);
		expect(screen.getByText("Story content")).toBeTruthy();
	}, 15000);

	it("renders the static admin space fallback when live auth is disabled", async () => {
		window.history.replaceState({}, "", "/iframe.html?id=admin-card--default");

		const { StorybookRuntimeProvider } = await loadProvider(false);

		render(
			<StorybookRuntimeProvider
				runtime={{
					realm: "admin",
					requiresSpace: true,
					currentPath: "/dashboard",
				}}
				storyId="admin-card--default"
			>
				<div>Admin story content</div>
			</StorybookRuntimeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText("Admin Realm")).toBeTruthy();
		});
		const spaceSelect = screen.getByLabelText("Space") as HTMLSelectElement;
		expect(spaceSelect.value).toBe("storybook-space");
		expect(
			screen.getByRole("option", { name: "Storybook Space" }),
		).toBeTruthy();
		expect(screen.getByRole("option", { name: "Storybook Ops" })).toBeTruthy();
		expect(
			screen.getByRole("option", { name: "Storybook Growth" }),
		).toBeTruthy();

		fireEvent.change(spaceSelect, {
			target: { value: "storybook-growth-space" },
		});

		expect(spaceSelect.value).toBe("storybook-growth-space");
		expect(screen.getByText("Admin story content")).toBeTruthy();
	}, 15000);

	it("uses the Storybook toolbar realm override when the story does not provide a runtime realm", async () => {
		window.history.replaceState(
			{},
			"",
			"/iframe.html?id=page-spacelistpage--default&viewMode=story",
		);

		const { withStorybookRuntime } = await loadProvider(false);

		render(
			withStorybookRuntime(() => <div>Toolbar realm story</div>, {
				id: "page-spacelistpage--default",
				title: "page/SpaceListPage",
				globals: {
					storybookRealm: "admin",
				},
				parameters: {},
			}),
		);

		await waitFor(() => {
			expect(screen.getByText("Admin Realm")).toBeTruthy();
		});
		expect(screen.getByLabelText("Space")).toBeTruthy();
		expect(screen.getByText("Toolbar realm story")).toBeTruthy();
	}, 15000);
});
