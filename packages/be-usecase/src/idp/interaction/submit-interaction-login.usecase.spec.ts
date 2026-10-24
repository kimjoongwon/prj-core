import { SubmitInteractionLoginCommand } from "@cocrepo/command";
import type { Request, Response } from "express";
import { SubmitInteractionLoginUseCase } from "./submit-interaction-login.usecase";

function createRequest() {
	return {
		headers: {
			"x-forwarded-for": ["203.0.113.20", "10.0.0.1"],
			"user-agent": "browser/2.0",
		},
		socket: {},
	} as unknown as Request;
}

function createUseCase() {
	const req = createRequest();
	const res = {} as unknown as Response;
	const interactionService = {
		completeLogin: jest
			.fn()
			.mockResolvedValue({ redirectTo: "/interaction/complete" }),
	};
	const interactionLoginService = {
		validateUser: jest.fn(),
	};
	const oidcRedirectUrlService = {
		toAbsolute: jest.fn(
			(redirectTo: string) => `https://idp.example.com${redirectTo}`,
		),
	};
	const useCase = new SubmitInteractionLoginUseCase(
		interactionService as unknown as ConstructorParameters<
			typeof SubmitInteractionLoginUseCase
		>[0],
		interactionLoginService as unknown as ConstructorParameters<
			typeof SubmitInteractionLoginUseCase
		>[1],
		oidcRedirectUrlService as unknown as ConstructorParameters<
			typeof SubmitInteractionLoginUseCase
		>[2],
	);

	return {
		interactionLoginService,
		interactionService,
		oidcRedirectUrlService,
		req,
		res,
		useCase,
	};
}

function createSubmitInteractionLoginCommand(
	input: {
		email: string;
		password: string;
		remember?: boolean;
	},
	req: Request,
	res: Response,
): SubmitInteractionLoginCommand {
	return Object.assign(
		new SubmitInteractionLoginCommand(input, req, res),
		input,
	);
}

describe("SubmitInteractionLoginUseCase", () => {
	it("Given 올바른 계정 When interaction 로그인하면 Then login 완료와 absolute redirect를 반환한다", async () => {
		const {
			interactionLoginService,
			interactionService,
			req,
			res,
			oidcRedirectUrlService,
			useCase,
		} = createUseCase();
		interactionLoginService.validateUser.mockResolvedValue({
			success: true,
			userId: "user-1",
		});

		const result = await useCase.execute(
			createSubmitInteractionLoginCommand(
				{ email: "user@example.com", password: "password", remember: true },
				req,
				res,
			),
		);

		expect(interactionLoginService.validateUser).toHaveBeenCalledWith(
			"user@example.com",
			"password",
			"203.0.113.20",
			"browser/2.0",
		);
		expect(interactionService.completeLogin).toHaveBeenCalledWith(
			req,
			res,
			"user-1",
			true,
		);
		expect(oidcRedirectUrlService.toAbsolute).toHaveBeenCalledWith(
			"/interaction/complete",
		);
		expect(result).toEqual({
			statusCode: 200,
			body: {
				redirectTo: "https://idp.example.com/interaction/complete",
			},
		});
	});

	it("Given 일반 실패 When interaction 로그인하면 Then 401과 실패 body를 반환한다", async () => {
		const { interactionLoginService, interactionService, req, res, useCase } =
			createUseCase();
		interactionLoginService.validateUser.mockResolvedValue({
			success: false,
			error: "INVALID_CREDENTIALS",
			remainingAttempts: 1,
		});

		const result = await useCase.execute(
			createSubmitInteractionLoginCommand(
				{ email: "user@example.com", password: "wrong" },
				req,
				res,
			),
		);

		expect(result).toMatchObject({
			statusCode: 401,
			body: {
				error: "INVALID_CREDENTIALS",
				remainingAttempts: 1,
			},
		});
		expect(interactionService.completeLogin).not.toHaveBeenCalled();
	});

	it("Given 잠금 실패 When interaction 로그인하면 Then 403과 잠금 body를 반환한다", async () => {
		const { interactionLoginService, req, res, useCase } = createUseCase();
		interactionLoginService.validateUser.mockResolvedValue({
			success: false,
			error: "ACCOUNT_LOCKED_PERMANENT",
		});

		const result = await useCase.execute(
			createSubmitInteractionLoginCommand(
				{ email: "user@example.com", password: "wrong" },
				req,
				res,
			),
		);

		expect(result).toMatchObject({
			statusCode: 403,
			body: {
				error: "ACCOUNT_LOCKED_PERMANENT",
			},
		});
	});

	it("Given provider가 absolute redirect를 반환하면 When 성공 처리 Then URL을 그대로 둔다", async () => {
		const {
			interactionLoginService,
			interactionService,
			oidcRedirectUrlService,
			req,
			res,
			useCase,
		} = createUseCase();
		interactionLoginService.validateUser.mockResolvedValue({
			success: true,
			userId: "user-1",
		});
		interactionService.completeLogin.mockResolvedValue({
			redirectTo: "https://client.example.com/callback",
		});
		oidcRedirectUrlService.toAbsolute.mockImplementation(
			(redirectTo: string) => redirectTo,
		);

		const result = await useCase.execute(
			createSubmitInteractionLoginCommand(
				{ email: "user@example.com", password: "password" },
				req,
				res,
			),
		);

		expect(result).toMatchObject({
			statusCode: 200,
			body: {
				redirectTo: "https://client.example.com/callback",
			},
		});
	});
});
