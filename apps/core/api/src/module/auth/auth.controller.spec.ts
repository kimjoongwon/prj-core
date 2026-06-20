import {
	GetAuthLoginRedirectCommand,
	GetCurrentSpaceQuery,
	RefreshTokenWithIdpCommand,
	VerifyTokenQuery,
} from "@cocrepo/command";
import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import { AuthController } from "@cocrepo/controller";
import { IS_PUBLIC_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import { BadRequestException } from "@nestjs/common";
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
			[REQUEST_HEADER_KEYS.SPACE_ID]: "space-test-id",
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
		const command = commandBus.execute.mock
			.calls[0][0] as GetAuthLoginRedirectCommand;
		expect(command.clientId).toBe("admin-web");
		expect(command.returnTo).toBe("/admin/dashboard");
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

	it("refreshToken은 CommandBus로 refresh workflow를 실행한다", async () => {
		commandBus.execute.mockResolvedValue({ accessToken: "next-access-token" });

		const result = await controller.refreshToken(
			request as never,
			response as never,
		);

		expect(commandBus.execute).toHaveBeenCalledWith(
			expect.any(RefreshTokenWithIdpCommand),
		);
		const command = commandBus.execute.mock
			.calls[0][0] as RefreshTokenWithIdpCommand;
		expect(command.refreshTokenCookie).toBe("test-refresh-token");
		expect(command.refreshTokenHeader).toBeUndefined();
		expect(command.sessionId).toBe("admin-web.test-session-id");
		expect(result).toEqual({ accessToken: "next-access-token" });
	});

	it("verifyToken은 QueryBus로 현재 token 상태를 조회한다", async () => {
		queryBus.execute.mockResolvedValue({ authenticated: true });

		const result = await controller.verifyToken();

		expect(queryBus.execute).toHaveBeenCalledWith(expect.any(VerifyTokenQuery));
		expect(result).toEqual({ authenticated: true });
	});

	it("getCurrentSpace는 QueryBus로 요청 space context를 조회한다", async () => {
		queryBus.execute.mockResolvedValue({ id: "space-test-id" });

		const result = await controller.getCurrentSpace(request as never);

		expect(queryBus.execute).toHaveBeenCalledWith(
			expect.any(GetCurrentSpaceQuery),
		);
		const query = queryBus.execute.mock.calls[0][0] as GetCurrentSpaceQuery;
		expect(query.requestedSpaceId).toBe("space-test-id");
		expect(result).toEqual({ id: "space-test-id" });
	});

	it("공개 native login endpoint는 public/skip-space metadata를 유지한다", () => {
		const descriptor = Object.getOwnPropertyDescriptor(
			AuthController.prototype,
			"nativeLogin",
		);

		expect(Reflect.getMetadata(IS_PUBLIC_KEY, descriptor?.value)).toBe(true);
		expect(Reflect.getMetadata(SKIP_SPACE_CHECK_KEY, descriptor?.value)).toBe(
			true,
		);
	});
});
