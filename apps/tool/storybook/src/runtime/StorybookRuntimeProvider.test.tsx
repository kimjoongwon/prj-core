// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setApiSpaceMock = vi.fn();
const setIdpSpaceMock = vi.fn();
const setLoginRedirectUrlMock = vi.fn();
const setIdpLoginRedirectUrlMock = vi.fn();

vi.mock("@cocrepo/ui", () => ({
	DesignSystemProvider: ({ children }: PropsWithChildren) => children,
}));

vi.mock("nuqs/adapters/react", () => ({
	NuqsAdapter: ({ children }: PropsWithChildren) => children,
}));

vi.mock("../../../../../packages/fe-api/src/core/client", () => ({
	setApiSpace: (...args: unknown[]) => setApiSpaceMock(...args),
	setLoginRedirectUrl: (...args: unknown[]) => setLoginRedirectUrlMock(...args),
}));

vi.mock("../../../../../packages/fe-api/src/idp/client", () => ({
	setIdpLoginRedirectUrl: (...args: unknown[]) =>
		setIdpLoginRedirectUrlMock(...args),
	setIdpSpace: (...args: unknown[]) => setIdpSpaceMock(...args),
}));

async function loadProvider() {
	vi.resetModules();
	return import("./StorybookRuntimeProvider");
}

async function createSpaceSnapshot() {
	const { useApp } = await import("@cocrepo/store");
	const { observer } = await import("mobx-react-lite");

	return observer(function SpaceSnapshot() {
		const space = useApp().space;
		if (!space) {
			throw new Error("space가 초기화되지 않았습니다.");
		}
		const value = `${space.tenantId ?? "none"}:${space.spaceId ?? "none"}:${space.isSpaceSelectionResolved ? "resolved" : "pending"}`;

		return <output aria-label="storybook-admin-space">{value}</output>;
	});
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
	setApiSpaceMock.mockReset();
	setIdpSpaceMock.mockReset();
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
					currentPath: "/dashboard",
				}}
				storyId="features-button--primary"
			>
				<div>Story content</div>
			</StorybookRuntimeProvider>,
		);

		await waitFor(() => {
			expect(setApiSpaceMock).toHaveBeenCalled();
		});
		expect(setIdpSpaceMock).toHaveBeenCalled();
		expect(setLoginRedirectUrlMock).toHaveBeenCalledWith(
			"#storybook-auth-disabled",
		);
		expect(setIdpLoginRedirectUrlMock).toHaveBeenCalledWith(
			"#storybook-auth-disabled",
		);
		expect(screen.getByText("Story content")).toBeTruthy();
	}, 15000);

	it("sets the static admin space fallback when live auth is disabled", async () => {
		window.history.replaceState({}, "", "/iframe.html?id=admin-card--default");

		const { StorybookRuntimeProvider } = await loadProvider();
		const SpaceSnapshot = await createSpaceSnapshot();

		render(
			<StorybookRuntimeProvider
				runtime={{
					realm: "admin",
					currentPath: "/dashboard",
				}}
				storyId="admin-card--default"
			>
				<div>Admin story content</div>
				<SpaceSnapshot />
			</StorybookRuntimeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByLabelText("storybook-admin-space").textContent).toBe(
				"storybook-tenant:storybook-space:resolved",
			);
		});
		expect(screen.getByText("Admin story content")).toBeTruthy();
	}, 15000);

	it("uses the story runtime parameter realm without a toolbar override", async () => {
		window.history.replaceState(
			{},
			"",
			"/iframe.html?id=screen-spacelistscreen--default&viewMode=story",
		);

		const { withStorybookRuntime } = await loadProvider();
		const SpaceSnapshot = await createSpaceSnapshot();

		render(
			withStorybookRuntime(
				() => (
					<>
						<div>Toolbar realm story</div>
						<SpaceSnapshot />
					</>
				),
				{
					id: "screen-spacelistscreen--default",
					title: "screen/SpaceListScreen",
					parameters: {
						storybookRuntime: {
							realm: "admin",
						},
					},
				},
			),
		);

		await waitFor(() => {
			expect(screen.getByLabelText("storybook-admin-space").textContent).toBe(
				"storybook-tenant:storybook-space:resolved",
			);
		});
		expect(screen.getByText("Toolbar realm story")).toBeTruthy();
	}, 15000);

	it("renders stories without injecting a styled canvas surface", async () => {
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
				parameters: {},
			}),
		);

		const surface = container.querySelector("[data-storybook-canvas-surface]");

		expect(surface).toBeNull();
		expect(screen.getByText("Themed story content")).toBeTruthy();
	}, 15000);
});
