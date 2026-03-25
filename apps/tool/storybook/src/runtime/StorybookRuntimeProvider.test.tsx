import { render, screen, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setLoginRedirectUrlMock = vi.fn();
const setIdpLoginRedirectUrlMock = vi.fn();
const setApiPersistStoreMock = vi.fn();
const setIdpPersistStoreMock = vi.fn();
const useVerifyTokenMock = vi.fn();
const useGetMySpacesMock = vi.fn();
const customInstanceMock = vi.fn();

vi.mock("@cocrepo/ui", () => ({
	DesignSystemProvider: ({ children }: PropsWithChildren) => children,
}));

vi.mock("@cocrepo/hook/nuqs", () => ({
	NuqsReactAdapter: ({ children }: PropsWithChildren) => children,
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
	useVerifyToken: (...args: unknown[]) => useVerifyTokenMock(...args),
}));

async function loadProvider(requireAuth: boolean) {
	vi.resetModules();
	vi.stubGlobal("__STORYBOOK_REQUIRE_AUTH__", requireAuth);
	return import("./StorybookRuntimeProvider");
}

beforeEach(() => {
	customInstanceMock.mockReset();
	setApiPersistStoreMock.mockReset();
	setIdpPersistStoreMock.mockReset();
	setLoginRedirectUrlMock.mockReset();
	setIdpLoginRedirectUrlMock.mockReset();
	useVerifyTokenMock.mockReset();
	useGetMySpacesMock.mockReset();

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
	localStorage.clear();
	sessionStorage.clear();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("StorybookRuntimeProvider", () => {
	it(
		"sets Storybook login redirect URLs using the top-level story location",
		async () => {
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
		expect(screen.getByText("Story content")).toBeInTheDocument();
		},
		15000,
	);

	it(
		"renders the static admin space fallback when live auth is disabled",
		async () => {
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
			expect(screen.getByText("Admin Realm")).toBeInTheDocument();
		});
		expect(screen.getByText("Storybook Space")).toBeInTheDocument();
		expect(screen.getByText("Admin story content")).toBeInTheDocument();
		},
		15000,
	);
});
