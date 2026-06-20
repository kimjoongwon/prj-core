import { HandleOidcCommand } from "@cocrepo/command";
import type { Request, Response } from "express";
import { HandleOidcUseCase } from "./handle-oidc.usecase";

function createUseCase(callback = jest.fn().mockResolvedValue(undefined)) {
	const provider = {
		callback: jest.fn(() => callback),
	};
	const oidcProviderService = {
		getProvider: jest.fn(() => provider),
	};
	const useCase = new HandleOidcUseCase(oidcProviderService as never);
	return { callback, oidcProviderService, provider, useCase };
}

describe("HandleOidcUseCase", () => {
	it("Given /oidc URL When 실행하면 Then provider callback에 /oidc prefix 제거 후 위임한다", async () => {
		const { callback, oidcProviderService, provider, useCase } =
			createUseCase();
		const req = {
			url: "/oidc/auth?client_id=admin-web",
		} as unknown as Request;
		const res = {} as unknown as Response;

		await useCase.execute(new HandleOidcCommand(req, res));

		expect(oidcProviderService.getProvider).toHaveBeenCalledTimes(1);
		expect(provider.callback).toHaveBeenCalledTimes(1);
		expect(req.url).toBe("/auth?client_id=admin-web");
		expect(callback).toHaveBeenCalledWith(req, res);
	});

	it("Given provider callback 실패 When 실행하면 Then 오류를 그대로 전파한다", async () => {
		const error = new Error("provider failed");
		const { useCase } = createUseCase(jest.fn().mockRejectedValue(error));
		const req = { url: "/oidc" } as unknown as Request;
		const res = {} as unknown as Response;

		await expect(useCase.execute(new HandleOidcCommand(req, res))).rejects.toBe(
			error,
		);
		expect(req.url).toBe("/");
	});
});
