import { Public } from "@cocrepo/decorator";
import {
	AbortResultDto,
	ConsentResultDto,
	InteractionDataDto,
	LoginErrorDto,
	LoginSuccessDto,
	OidcLoginPayloadDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Logger,
	Param,
	Post,
	Req,
	Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import type { OidcConfig } from "../../config/oidc.config";
import type { KoaLikeRequest, KoaLikeResponse } from "../oidc/types";
import { InteractionFacade } from "./interaction.facade";
import type { LoginValidationResult } from "./interaction-login.service";

/**
 * OIDC Interaction Controller
 *
 * OIDC 인증 흐름에서 사용자 상호작용(로그인, 동의)을 처리합니다.
 * idp-client(Next.js)가 프론트엔드를 담당하고,
 * 이 컨트롤러는 JSON API만 제공합니다.
 */
@Public()
@ApiTags("Interaction")
@Controller("api/interaction")
export class InteractionController {
	private readonly logger = new Logger(InteractionController.name);
	private readonly isDev =
		process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "staging";

	constructor(
		private readonly interactionApplicationService: InteractionFacade,
		private readonly configService: ConfigService,
	) {}

	/**
	 * 상대경로를 절대경로로 변환
	 * oidc-provider가 반환하는 redirectTo가 /oidc/auth/... 형태일 수 있음
	 */
	private toAbsoluteUrl(redirectTo: string): string {
		if (redirectTo.startsWith("http")) {
			return redirectTo;
		}
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		const issuer = oidcConfig?.issuer || "http://localhost:3007";
		return `${issuer}${redirectTo}`;
	}

	/**
	 * 요청에서 클라이언트 IP 주소를 추출합니다
	 */
	private getClientIp(req: Request): string {
		const forwarded = req.headers["x-forwarded-for"];
		if (typeof forwarded === "string") {
			return forwarded.split(",")[0].trim();
		}
		return req.ip || req.socket.remoteAddress || "unknown";
	}

	/**
	 * 로그인 실패 결과를 사용자 친화적인 응답 DTO로 변환합니다.
	 */
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

	@ApiOperation({
		operationId: "getInteraction",
		summary: "인증 상호작용 데이터 조회",
		description:
			"OIDC 인증 흐름의 로그인 또는 동의에 필요한 데이터를 JSON으로 반환합니다.",
	})
	@ApiParam({
		name: "uid",
		description: "Interaction 고유 ID (oidc-provider가 생성)",
		example: "abc123xyz",
	})
	@ApiResponse({
		status: 200,
		description: "인터랙션 데이터 (type: login | consent)",
		type: InteractionDataDto,
	})
	@Get(":uid")
	async getInteraction(@Param("uid") uid: string, @Res() res: Response) {
		try {
			const req = res.req as unknown as KoaLikeRequest;
			const koaRes = res as unknown as KoaLikeResponse;

			const interaction =
				await this.interactionApplicationService.getInteractionDetails(
					req,
					koaRes,
				);
			const { prompt, params, session } = interaction;
			const client = await this.interactionApplicationService.findClient(
				params.client_id as string,
			);

			return res.json({
				type: prompt.name,
				uid,
				client: client
					? {
							clientId: client.clientId,
							name: client.name,
							logoUri: client.logoUri,
							loginUi: client.loginUi ?? null,
						}
					: null,
				prompt,
				params,
				session,
				isDev: this.isDev,
			});
		} catch (error) {
			this.logger.error(`Interaction error: ${error}`);
			return res.status(400).json({ error: "유효하지 않은 인터랙션입니다." });
		}
	}

	@ApiOperation({
		operationId: "submitLogin",
		summary: "로그인 처리",
		description: "사용자 인증을 처리하고 리다이렉트 URL을 반환합니다.",
	})
	@ApiParam({ name: "uid", description: "Interaction 고유 ID" })
	@ApiResponse({
		status: 200,
		description: "인증 성공 시 redirectTo URL 반환",
		type: LoginSuccessDto,
	})
	@ApiResponse({
		status: 401,
		description: "인증 실패 시 에러 메시지 반환",
		type: LoginErrorDto,
	})
	@ApiBody({ type: OidcLoginPayloadDto })
	@HttpCode(HttpStatus.OK)
	@Post(":uid/login")
	async submitLogin(
		@Param("uid") _uid: string,
		@Body() loginDto: OidcLoginPayloadDto,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const koaReq = req as unknown as KoaLikeRequest;
		const koaRes = res as unknown as KoaLikeResponse;

		try {
			const ipAddress = this.getClientIp(req);
			const userAgent = req.headers["user-agent"];

			const result = await this.interactionApplicationService.validateUser(
				loginDto.email,
				loginDto.password,
				ipAddress,
				userAgent,
			);

			if (!result.success) {
				const statusCode =
					result.error === "ACCOUNT_LOCKED_TEMPORARY" ||
					result.error === "ACCOUNT_LOCKED_PERMANENT"
						? 403
						: 401;

				return res
					.status(statusCode)
					.json(this.buildLoginErrorResponse(result));
			}

			const { redirectTo } =
				await this.interactionApplicationService.completeLogin(
					koaReq,
					koaRes,
					result.userId!,
					loginDto.remember || false,
				);

			return res.json({
				redirectTo: this.toAbsoluteUrl(redirectTo),
				mustChangePassword: result.mustChangePassword,
			});
		} catch (error) {
			this.logger.error(`Login error: ${error}`);
			return res
				.status(500)
				.json({ error: "로그인 처리 중 오류가 발생했습니다." });
		}
	}

	@ApiOperation({
		operationId: "confirmConsent",
		summary: "동의 처리",
		description: "사용자 동의를 처리하고 리다이렉트 URL을 반환합니다.",
	})
	@ApiParam({ name: "uid", description: "Interaction 고유 ID" })
	@ApiResponse({
		status: 200,
		description: "동의 완료 후 redirectTo URL 반환",
		type: ConsentResultDto,
	})
	@HttpCode(HttpStatus.OK)
	@Post(":uid/confirm")
	async confirmConsent(@Param("uid") _uid: string, @Res() res: Response) {
		try {
			const req = res.req as unknown as KoaLikeRequest;
			const koaRes = res as unknown as KoaLikeResponse;

			const { redirectTo } =
				await this.interactionApplicationService.processConsent(req, koaRes);

			return res.json({ redirectTo: this.toAbsoluteUrl(redirectTo) });
		} catch (error) {
			this.logger.error(`Consent error: ${error}`);
			return res
				.status(500)
				.json({ error: "동의 처리 중 오류가 발생했습니다." });
		}
	}

	@ApiOperation({
		operationId: "abortInteraction",
		summary: "인증 취소",
		description: "사용자가 인증을 거부하고 리다이렉트 URL을 반환합니다.",
	})
	@ApiParam({ name: "uid", description: "Interaction 고유 ID" })
	@ApiResponse({
		status: 200,
		description: "취소 후 redirectTo URL 반환",
		type: AbortResultDto,
	})
	@HttpCode(HttpStatus.OK)
	@Post(":uid/abort")
	async abortInteraction(@Param("uid") _uid: string, @Res() res: Response) {
		try {
			const req = res.req as unknown as KoaLikeRequest;
			const koaRes = res as unknown as KoaLikeResponse;

			const { redirectTo } =
				await this.interactionApplicationService.abortInteraction(req, koaRes);

			return res.json({ redirectTo: this.toAbsoluteUrl(redirectTo) });
		} catch (error) {
			this.logger.error(`Abort error: ${error}`);
			return res
				.status(500)
				.json({ error: "인증 취소 처리 중 오류가 발생했습니다." });
		}
	}
}
