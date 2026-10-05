import {
	GetAuthLoginRedirectCommand,
	GetCurrentSpaceQuery,
	RefreshTokenWithIdpCommand,
	VerifyTokenQuery,
} from "@cocrepo/command";
import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import { AuthController } from "./auth.controller";
import { BadRequestException, RequestMethod } from "@nestjs/common";
import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants";
import type { CommandBus, QueryBus } from "@nestjs/cqrs";

describe("AuthController", () => {
	let controller: AuthController;
	let commandBus: jest.Mocked<Pick<CommandBus, "execute">>;
	let queryBus: jest.Mocked<Pick<QueryBus, "execute">>;

	const response = {
		redirect: jest.fn().mockReturnThis(),
		status: jest.fn().mockReturnThis(),
		send: jest.fn().mockReturnThis(),
	};

	const request = {
		cookies: {
			refreshToken: "test-refresh-token",
			sessionId: "admin-web.test-session-id",
		},
		headers: {
			[REQUEST_HEADER_KEYS.TENANT_ID]: "tenant-test-id",
		},
	};

	beforeEach(() => {
		commandBus = {
			execute: jest.fn(),
		};
		queryBus = {
			execute: jest.fn(),
		};
		controller = new AuthController(
			commandBus as unknown as CommandBus,
			queryBus as unknown as QueryBus,
		);
		jest.clearAllMocks();
	});

	it("컨트롤러가 정의되어야 한다", () => {
		expect(controller).toBeDefined();
	});

	it("login은 CommandBus로 authorization URL을 요청하고 redirect한다", async () => {
		commandBus.execute.mockResolvedValue(
			"https://idp.example.com/oidc/auth?client_id=admin-web",
		);

		await controller.login(
			"admin-web",
			"/admin/dashboard",
			"",
			response as never,
		);

		expect(commandBus.execute).toHaveBeenCalledWith(
			expect.any(GetAuthLoginRedirectCommand),
		);
		const command = commandBus.execute.mock.calls[0]?.[0];
		expect(command).toBeInstanceOf(GetAuthLoginRedirectCommand);
		const loginCommand = command as GetAuthLoginRedirectCommand;
		expect(loginCommand.clientId).toBe("admin-web");
		expect(loginCommand.returnTo).toBe("/admin/dashboard");
		expect(response.redirect).toHaveBeenCalledWith(
			"https://idp.example.com/oidc/auth?client_id=admin-web",
		);
	});

	it("login은 clientId가 없으면 400을 던진다", async () => {
		await expect(
			controller.login("", "/", "", response as never),
		).rejects.toThrow(BadRequestException);
		expect(commandBus.execute).not.toHaveBeenCalled();
	});

	it("OIDC login redirect endpoint는 oidc 경로로 구분되어야 한다", () => {
		const descriptor = Object.getOwnPropertyDescriptor(
			AuthController.prototype,
			"login",
		);

		expect(Reflect.getMetadata(PATH_METADATA, descriptor?.value)).toBe(
			"oidc/login",
		);
		expect(Reflect.getMetadata(METHOD_METADATA, descriptor?.value)).toBe(
			RequestMethod.GET,
		);
	});

	it("refreshToken은 CommandBus로 refresh workflow를 실행한다", async () => {
		commandBus.execute.mockResolvedValue({ accessToken: "next-access-token" });

		const result = await controller.refreshToken(
			request as never,
			response as never,
		);

		expect(commandBus.execute).toHaveBeenCalledWith(
			expect.any(RefreshTokenWithIdpCommand),
		);
		const command = commandBus.execute.mock.calls[0]?.[0];
		expect(command).toBeInstanceOf(RefreshTokenWithIdpCommand);
		const refreshCommand = command as RefreshTokenWithIdpCommand;
		expect(refreshCommand.refreshTokenCookie).toBe("test-refresh-token");
		expect(refreshCommand.refreshTokenHeader).toBeUndefined();
		expect(refreshCommand.sessionId).toBe("admin-web.test-session-id");
		expect(result).toEqual({ accessToken: "next-access-token" });
	});

	it("verifyToken은 QueryBus로 현재 token 상태를 조회한다", async () => {
		queryBus.execute.mockResolvedValue({ authenticated: true });

		const result = await controller.verifyToken();

		expect(queryBus.execute).toHaveBeenCalledWith(expect.any(VerifyTokenQuery));
		expect(result).toEqual({ authenticated: true });
	});

	it("getCurrentSpace는 QueryBus로 저장된 current tenant를 조회한다", async () => {
		queryBus.execute.mockResolvedValue({ id: "space-test-id" });

		const result = await controller.getCurrentSpace();

		expect(queryBus.execute).toHaveBeenCalledWith(
			expect.any(GetCurrentSpaceQuery),
		);
		const query = queryBus.execute.mock.calls[0]?.[0];
		expect(query).toBeInstanceOf(GetCurrentSpaceQuery);
		expect(result).toEqual({ id: "space-test-id" });
	});
});
