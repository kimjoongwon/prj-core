jest.mock("./interaction.service", () => ({
	InteractionService: class InteractionService {},
}));
jest.mock("./interaction-login.service", () => ({
	InteractionLoginService: class InteractionLoginService {},
}));
jest.mock("./password-reset.service", () => ({
	PasswordResetService: class PasswordResetService {},
}));

import type { Request, Response } from "express";
import {
	IDP_INTERACTION_LOGIN_SERVICE as DIRECT_IDP_INTERACTION_LOGIN_SERVICE,
} from "./idp-interaction-login-service.token";
import {
	IDP_OIDC_PROVIDER_SERVICE as DIRECT_IDP_OIDC_PROVIDER_SERVICE,
} from "./idp-oidc-provider-service.token";
import {
	IDP_PASSWORD_RESET_SERVICE as DIRECT_IDP_PASSWORD_RESET_SERVICE,
} from "./idp-password-reset-service.token";
import {
	IDP_INTERACTION_LOGIN_SERVICE,
	IDP_OIDC_PROVIDER_SERVICE,
	IDP_PASSWORD_RESET_SERVICE,
	type InteractionLoginPort,
	type OidcProviderPort,
	type PasswordResetPort,
} from "./index";

describe("idp ports", () => {
	it("Given IDP DI token exports When 비교하면 Then direct token과 같은 고유 Symbol이어야 함", () => {
		expect(typeof IDP_INTERACTION_LOGIN_SERVICE).toBe("symbol");
		expect(typeof IDP_OIDC_PROVIDER_SERVICE).toBe("symbol");
		expect(typeof IDP_PASSWORD_RESET_SERVICE).toBe("symbol");
		expect(IDP_INTERACTION_LOGIN_SERVICE).toBe(
			DIRECT_IDP_INTERACTION_LOGIN_SERVICE,
		);
		expect(IDP_OIDC_PROVIDER_SERVICE).toBe(DIRECT_IDP_OIDC_PROVIDER_SERVICE);
		expect(IDP_PASSWORD_RESET_SERVICE).toBe(
			DIRECT_IDP_PASSWORD_RESET_SERVICE,
		);
		expect(IDP_INTERACTION_LOGIN_SERVICE).not.toBe(IDP_OIDC_PROVIDER_SERVICE);
		expect(IDP_INTERACTION_LOGIN_SERVICE).not.toBe(IDP_PASSWORD_RESET_SERVICE);
		expect(IDP_OIDC_PROVIDER_SERVICE).not.toBe(IDP_PASSWORD_RESET_SERVICE);
	});

	it("Given IDP port 계약 When mock 구현을 만들면 Then 기존 메서드 시그니처를 유지한다", async () => {
		const interactionLoginPort: InteractionLoginPort = {
			validateUser: jest.fn().mockResolvedValue({ success: true }),
		};
		const oidcProviderPort: OidcProviderPort = {
			reload: jest.fn().mockResolvedValue(undefined),
			getProvider: jest.fn(() => ({
				callback: jest.fn(() => jest.fn().mockResolvedValue(undefined)),
			})),
		};
		const passwordResetPort: PasswordResetPort = {
			getPasswordPolicy: jest.fn().mockResolvedValue({}),
			requestReset: jest.fn().mockResolvedValue({}),
			validateToken: jest.fn().mockResolvedValue({}),
			executeReset: jest.fn().mockResolvedValue({}),
		};

		await expect(
			interactionLoginPort.validateUser(
				"user@example.com",
				"password",
				"127.0.0.1",
			),
		).resolves.toEqual({ success: true });
		const providerCallback = oidcProviderPort.getProvider().callback();
		expect(
			providerCallback(
				{} as unknown as Request,
				{} as unknown as Response,
			),
		).toBeInstanceOf(Promise);
		await expect(passwordResetPort.getPasswordPolicy()).resolves.toEqual({});
	});
});
