import type { ConfigService } from "@nestjs/config";
import { OidcClient, type OidcTokenResponse } from "../src/oidc.client";

describe("OidcClient", () => {
	const fetchMock = jest.fn();
	const oidcConfig = {
		issuer: "https://idp.example.com",
		jwksUri: "https://idp.example.com/oidc/jwks",
	};
	const protocolClient = {
		clientId: "admin-web",
		clientSecret: "super-secret",
		redirectUri: "https://admin.example.com/api/v1/auth/callback",
		scope: "openid profile email",
	};

	beforeEach(() => {
		fetchMock.mockReset();
		global.fetch = fetchMock as typeof fetch;
	});

	function createClient(): OidcClient {
		return new OidcClient({
			get: jest.fn().mockReturnValue(oidcConfig),
		} as unknown as ConfigService);
	}

	it("인증 요청 URL에 공개 clientId만 유지하고 내부 id 파라미터를 추가하지 않는다", () => {
		const client = createClient();

		const result = client.createAuthorizationRequest(
			protocolClient,
			"/console",
		);
		const authorizationUrl = new URL(result.authorizationUrl);

		expect(authorizationUrl.origin).toBe("https://idp.example.com");
		expect(authorizationUrl.pathname).toBe("/oidc/auth");
		expect(authorizationUrl.searchParams.get("client_id")).toBe(
			protocolClient.clientId,
		);
		expect(authorizationUrl.searchParams.get("id")).toBeNull();
		expect(result.returnTo).toBe("/console");
	});

	it("토큰 교환 요청 본문에 client_id를 그대로 사용한다", async () => {
		const tokenResponse: OidcTokenResponse = {
			access_token: "access-token",
			refresh_token: "refresh-token",
			token_type: "Bearer",
			expires_in: 3600,
		};
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify(tokenResponse), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		const client = createClient();

		await expect(
			client.exchangeCodeForTokens("auth-code", "verifier", protocolClient),
		).resolves.toEqual(tokenResponse);

		expect(fetchMock).toHaveBeenCalledWith(
			"https://idp.example.com/oidc/token",
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			}),
		);

		const request = fetchMock.mock.calls[0]?.[1];
		const body = new URLSearchParams(String(request?.body));

		expect(body.get("client_id")).toBe(protocolClient.clientId);
		expect(body.get("client_secret")).toBe(protocolClient.clientSecret);
		expect(body.get("id")).toBeNull();
	});

	it("리프레시와 폐기 요청도 client_id를 그대로 사용한다", async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					access_token: "new-access-token",
					refresh_token: "new-refresh-token",
					token_type: "Bearer",
					expires_in: 3600,
				} satisfies OidcTokenResponse),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				},
			),
		);
		const client = createClient();

		await client.refreshTokens("refresh-token", protocolClient);
		let request = fetchMock.mock.calls[0]?.[1];
		let body = new URLSearchParams(String(request?.body));

		expect(body.get("grant_id")).toBeNull();
		expect(body.get("client_id")).toBe(protocolClient.clientId);

		fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
		await client.revokeToken("access-token", protocolClient);
		request = fetchMock.mock.calls[1]?.[1];
		body = new URLSearchParams(String(request?.body));

		expect(body.get("client_id")).toBe(protocolClient.clientId);
		expect(body.get("id")).toBeNull();
	});
});
