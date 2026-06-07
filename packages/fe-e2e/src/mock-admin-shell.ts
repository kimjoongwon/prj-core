import type { E2EPageRouteLike } from "./e2e-page-route-like";
import type { AdminShellOptions } from "./admin-shell-options";
import { mockApi } from "./mock-api";

const DEFAULT_SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const DEFAULT_GROUND_NAME = "플랫폼 운영본부";
const DEFAULT_ACCESS_TOKEN = "mock-admin-access-token";
const DEFAULT_REFRESH_TOKEN = "mock-admin-refresh-token";

export async function mockAdminShell(
	page: E2EPageRouteLike & {
		addInitScript?(
			script: (options: Required<AdminShellOptions>) => void,
			options: Required<AdminShellOptions>,
		): Promise<void>;
	},
	options: AdminShellOptions = {},
) {
	const shellOptions = {
		spaceId: options.spaceId ?? DEFAULT_SYSTEM_SPACE_ID,
		groundName: options.groundName ?? DEFAULT_GROUND_NAME,
		contentLanguageCode: options.contentLanguageCode ?? "ko_KR",
		accessToken: options.accessToken ?? DEFAULT_ACCESS_TOKEN,
		refreshToken: options.refreshToken ?? DEFAULT_REFRESH_TOKEN,
		hasFullAccess: options.hasFullAccess ?? true,
		abilities: options.abilities ?? [],
	};

	await page.addInitScript?.(
		({
			spaceId,
			groundName,
			accessToken,
			refreshToken,
		}: Required<AdminShellOptions>) => {
			const browserGlobal = globalThis as unknown as {
				localStorage?: {
					setItem(key: string, value: string): void;
				};
			};
			const now = Date.now();

			browserGlobal.localStorage?.setItem(
				"admin-persist",
				JSON.stringify({
					accessToken,
					refreshToken,
					spaceId,
					groundName,
					spaces: [{ spaceId, groundName }],
					accessTokenExpiresAt: now + 60 * 60 * 1000,
					refreshTokenExpiresAt: now + 2 * 60 * 60 * 1000,
				}),
			);
		},
		shellOptions,
	);

	await mockApi(page, [
		{
			url: "**/api/v1/auth/verify-token**",
			json: {
				data: {
					valid: true,
					hasFullAccess: shellOptions.hasFullAccess,
				},
			},
		},
		{
			url: "**/api/v1/auth/current-space**",
			json: {
				data: {
					id: shellOptions.spaceId,
					ground: { name: shellOptions.groundName },
					contentLanguageCode: shellOptions.contentLanguageCode,
				},
			},
		},
		{
			url: "**/api/v1/auth/my-spaces**",
			json: {
				data: [
					{
						id: shellOptions.spaceId,
						ground: { name: shellOptions.groundName },
						contentLanguageCode: shellOptions.contentLanguageCode,
					},
				],
			},
		},
		{
			url: "**/api/v1/abilities/my**",
			json: {
				data: shellOptions.abilities,
				meta: { total: shellOptions.abilities.length },
			},
		},
		{
			url: "**/api/v1/abilities**",
			json: {
				data: shellOptions.abilities,
				meta: { total: shellOptions.abilities.length },
			},
		},
	]);
}
