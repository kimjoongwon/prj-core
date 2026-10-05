import type { ConfigService } from "@nestjs/config";
import { OidcRedirectUrlService } from "./oidc-redirect-url.service";

describe("OidcRedirectUrlService", () => {
	const buildService = (issuer?: string) =>
		new OidcRedirectUrlService({
			get: jest.fn((key: string) =>
				key === "oidc" && issuer ? { issuer } : undefined,
			),
		} as unknown as ConfigService);

	it("Given provider가 상대 redirect를 반환하면 When 절대 URL로 보정 Then OIDC issuer를 붙인다", () => {
		const service = buildService("https://idp.example.com");

		expect(service.toAbsolute("/interaction/complete")).toBe(
			"https://idp.example.com/interaction/complete",
		);
	});

	it("Given provider가 절대 redirect를 반환하면 When 절대 URL로 보정 Then 원본 URL을 유지한다", () => {
		const service = buildService("https://idp.example.com");

		expect(service.toAbsolute("https://client.example.com/callback")).toBe(
			"https://client.example.com/callback",
		);
	});

	it("Given OIDC issuer 설정이 없으면 When 상대 redirect를 보정 Then 기본 issuer를 사용한다", () => {
		const service = buildService();

		expect(service.toAbsolute("/interaction/complete")).toBe(
			"http://localhost:3000/interaction/complete",
		);
	});
});
