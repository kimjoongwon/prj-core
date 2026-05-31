import { SubmitInteractionLoginCommand } from "@cocrepo/command";
import { LoginErrorDto } from "@cocrepo/dto";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { Request } from "express";
import {
	IDP_INTERACTION_LOGIN_SERVICE,
	IDP_INTERACTION_SERVICE,
	type InteractionLoginPort,
	type InteractionPort,
	type LoginValidationResult,
} from "./idp.ports";
import { toAbsoluteOidcUrl } from "./idp-local.support";

@CommandHandler(SubmitInteractionLoginCommand)
export class SubmitInteractionLoginUseCase
	implements ICommandHandler<SubmitInteractionLoginCommand>
{
	constructor(
		@Inject(IDP_INTERACTION_SERVICE)
		private readonly interactionService: InteractionPort,
		@Inject(IDP_INTERACTION_LOGIN_SERVICE)
		private readonly interactionLoginService: InteractionLoginPort,
		private readonly configService: ConfigService,
	) {}

	async execute(command: SubmitInteractionLoginCommand) {
		const ipAddress = this.getClientIp(command.req);
		const userAgent = command.req.headers["user-agent"];
		const result = await this.interactionLoginService.validateUser(
			command.loginDto.email,
			command.loginDto.password,
			ipAddress,
			Array.isArray(userAgent) ? userAgent[0] : userAgent,
		);

		if (!result.success) {
			return {
				statusCode:
					result.error === "ACCOUNT_LOCKED_TEMPORARY" ||
					result.error === "ACCOUNT_LOCKED_PERMANENT"
						? 403
						: 401,
				body: this.buildLoginErrorResponse(result),
			};
		}

		const loginResult = await this.interactionService.completeLogin(
			command.req,
			command.res,
			result.userId!,
			command.loginDto.remember || false,
		);

		return {
			statusCode: 200,
			body: {
				redirectTo: toAbsoluteOidcUrl(
					this.configService,
					loginResult.redirectTo,
				),
				mustChangePassword: result.mustChangePassword,
			},
		};
	}

	private getClientIp(req: Request): string {
		const forwarded = req.headers["x-forwarded-for"];
		if (typeof forwarded === "string") {
			return forwarded.split(",")[0].trim();
		}
		return req.ip || req.socket.remoteAddress || "unknown";
	}

	private buildLoginErrorResponse(
		result: LoginValidationResult,
	): LoginErrorDto {
		const baseResponse: LoginErrorDto = {
			error: result.error || "LOGIN_FAILED",
			displayMessage: "로그인에 실패했습니다.",
			remainingAttempts: result.remainingAttempts,
			lockedUntil: result.lockedUntil?.toISOString(),
			temporaryLockThreshold: result.temporaryLockThreshold,
			temporaryLockDurationMin: result.temporaryLockDurationMin,
		};

		switch (result.error) {
			case "INVALID_CREDENTIALS":
				return {
					...baseResponse,
					displayMessage:
						result.remainingAttempts !== undefined &&
						result.remainingAttempts > 0
							? `이메일 또는 비밀번호가 올바르지 않습니다. 남은 시도 ${result.remainingAttempts}회`
							: "이메일 또는 비밀번호가 올바르지 않습니다.",
					hint: "계속 실패하면 계정이 일시 잠길 수 있습니다.",
					recoveryActions: [
						{
							type: "forgot-password",
							label: "비밀번호 재설정",
							href: "/forgot-password",
						},
					],
				};
			case "ACCOUNT_LOCKED_TEMPORARY":
				return {
					...baseResponse,
					displayMessage: `로그인 시도가 반복되어 계정이 일시 잠겼습니다. ${result.temporaryLockDurationMin ?? 15}분 후 다시 시도하세요.`,
					hint: "급한 경우 비밀번호 재설정을 진행할 수 있습니다.",
					recoveryActions: [
						{
							type: "forgot-password",
							label: "비밀번호 재설정",
							href: "/forgot-password",
						},
					],
				};
			case "ACCOUNT_LOCKED_PERMANENT":
				return {
					...baseResponse,
					displayMessage: "보안을 위해 계정이 잠겼습니다.",
					hint: "비밀번호를 재설정하거나 관리자에게 문의하세요.",
					recoveryActions: [
						{
							type: "forgot-password",
							label: "비밀번호 재설정",
							href: "/forgot-password",
						},
						{
							type: "contact-admin",
							label: "관리자 문의",
						},
					],
				};
			default:
				return baseResponse;
		}
	}
}
