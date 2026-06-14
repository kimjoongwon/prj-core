// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setApiPersistStoreMock = vi.fn();
const setIdpPersistStoreMock = vi.fn();
const setLoginRedirectUrlMock = vi.fn();
const setIdpLoginRedirectUrlMock = vi.fn();

vi.mock("@cocrepo/ui", () => ({
	DesignSystemProvider: ({ children }: PropsWithChildren) => children,
	useDesignSystemTheme: () => ({
		setTheme: vi.fn(),
	}),
}));

vi.mock("nuqs/adapters/react", () => ({
	NuqsAdapter: ({ children }: PropsWithChildren) => children,
}));

vi.mock("../../../../../packages/fe-api/src/core/client", () => ({
	setApiPersistStore: (...args: unknown[]) => setApiPersistStoreMock(...args),
	setLoginRedirectUrl: (...args: unknown[]) => setLoginRedirectUrlMock(...args),
}));

vi.mock("../../../../../packages/fe-api/src/idp/client", () => ({
	setIdpLoginRedirectUrl: (...args: unknown[]) =>
		setIdpLoginRedirectUrlMock(...args),
	setIdpPersistStore: (...args: unknown[]) => setIdpPersistStoreMock(...args),
}));

async function loadProvider() {
	vi.resetModules();
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
	setApiPersistStoreMock.mockReset();
	setIdpPersistStoreMock.mockReset();
	setLoginRedirectUrlMock.mockReset();
	setIdpLoginRedirectUrlMock.mockReset();
	localStorage.clear();
	sessionStorage.clear();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("StorybookRuntimeProvider", () => {
	it("keeps API auth failures inside Storybook instead of redirecting to login", async () => {
		window.history.replaceState(
			{},
			"",
			"/iframe.html?id=features-button--primary&viewMode=story",
		);

		const { StorybookRuntimeProvider } = await loadProvider();

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
			expect(setApiPersistStoreMock).toHaveBeenCalled();
		});
		expect(setIdpPersistStoreMock).toHaveBeenCalled();
		expect(setLoginRedirectUrlMock).toHaveBeenCalledWith(
			"#storybook-auth-disabled",
		);
		expect(setIdpLoginRedirectUrlMock).toHaveBeenCalledWith(
			"#storybook-auth-disabled",
		);
		expect(screen.getByText("Story content")).toBeTruthy();
	}, 15000);

	it("renders the static admin space fallback when live auth is disabled", async () => {
		window.history.replaceState({}, "", "/iframe.html?id=admin-card--default");

		const { StorybookRuntimeProvider } = await loadProvider();

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
			"/iframe.html?id=screen-spacelistscreen--default&viewMode=story",
		);

		const { withStorybookRuntime } = await loadProvider();

		render(
			withStorybookRuntime(() => <div>Toolbar realm story</div>, {
				id: "screen-spacelistscreen--default",
				title: "screen/SpaceListScreen",
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

	it("wraps stories in the theme-aware canvas surface", async () => {
		window.history.replaceState(
			{},
			"",
			"/iframe.html?id=features-button--primary&viewMode=story",
		);

		const { withStorybookRuntime } = await loadProvider();

		const { container } = render(
			withStorybookRuntime(() => <div>Themed story content</div>, {
				id: "features-button--primary",
				title: "features/Button",
				parameters: {
					layout: "fullscreen",
				},
			}),
		);

		const surface = container.querySelector("[data-storybook-canvas-surface]");

		expect(surface).toBeTruthy();
		expect(surface?.getAttribute("class")).toContain("bg-background");
		expect(surface?.getAttribute("class")).toContain("text-foreground");
		expect(surface?.getAttribute("data-storybook-layout")).toBe("fullscreen");
		expect(screen.getByText("Themed story content")).toBeTruthy();
	}, 15000);

	it("keeps docs preview surfaces content-sized", async () => {
		window.history.replaceState(
			{},
			"",
			"/iframe.html?id=control-button--docs&viewMode=docs",
		);

		const { withStorybookRuntime } = await loadProvider();

		const { container } = render(
			withStorybookRuntime(() => <div>Docs story content</div>, {
				id: "control-button--docs",
				title: "action/Button",
				viewMode: "docs",
				parameters: {
					layout: "centered",
				},
			}),
		);

		const surface = container.querySelector("[data-storybook-canvas-surface]");

		expect(surface).toBeTruthy();
		expect(surface?.getAttribute("class")).toContain("inline-flex");
		expect(surface?.getAttribute("class")).not.toContain("min-h-screen");
		expect(surface?.getAttribute("data-storybook-view-mode")).toBe("docs");
		expect(screen.getByText("Docs story content")).toBeTruthy();
	}, 15000);
});
