import { OidcLoginPayloadDto } from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Logger,
	Param,
	Post,
	Render,
	Res,
} from "@nestjs/common";
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import type { KoaLikeRequest, KoaLikeResponse } from "../oidc/types";
import { InteractionService } from "./interaction.service";

/**
 * OIDC Interaction Controller
 *
 * OIDC 인증 흐름에서 사용자 상호작용(로그인, 동의)을 처리합니다.
 * 비즈니스 로직은 InteractionService에 위임하고,
 * 이 컨트롤러는 HTTP 라우팅과 뷰 렌더링만 담당합니다.
 */
@ApiTags("Interaction")
@Controller("interaction")
export class InteractionController {
	private readonly logger = new Logger(InteractionController.name);
	private readonly isDev =
		process.env.NODE_ENV !== "production" &&
		process.env.NODE_ENV !== "staging";

	constructor(private readonly interactionService: InteractionService) {}

	@ApiOperation({
		operationId: "getInteraction",
		summary: "인증 상호작용 화면 조회",
		description: "OIDC 인증 흐름의 로그인 또는 동의 화면을 표시합니다.",
	})
	@ApiParam({
		name: "uid",
		description: "Interaction 고유 ID (oidc-provider가 생성)",
		example: "abc123xyz",
	})
	@ApiResponse({
		status: 200,
		description: "로그인 또는 동의 HTML 페이지",
	})
	@Get(":uid")
	@Render("login")
	async getInteraction(@Param("uid") uid: string, @Res() res: Response) {
		try {
			const req = res.req as unknown as KoaLikeRequest;
			const koaRes = res as unknown as KoaLikeResponse;

			const interaction = await this.interactionService.getInteractionDetails(
				req,
				koaRes,
			);
			const { prompt, params, session } = interaction;
			const client = await this.interactionService.findClient(
				params.client_id as string,
			);

			if (prompt.name === "consent") {
				return res.render("consent", {
					uid,
					client,
					prompt,
					params,
					session,
				});
			}

			return {
				uid,
				client,
				prompt,
				params,
				error: null,
				isDev: this.isDev,
			};
		} catch (error) {
			this.logger.error(`Interaction error: ${error}`);
			return { uid, error: "Invalid interaction", isDev: this.isDev };
		}
	}

	@ApiOperation({
		operationId: "submitLogin",
		summary: "로그인 처리",
		description: "사용자 인증을 처리하고 OIDC 흐름을 계속합니다.",
	})
	@ApiParam({ name: "uid", description: "Interaction 고유 ID" })
	@ApiResponse({
		status: 302,
		description: "인증 성공 시 동의 화면 또는 클라이언트로 리다이렉트",
	})
	@ApiResponse({
		status: 200,
		description: "인증 실패 시 에러 메시지와 함께 로그인 화면 재표시",
	})
	@ApiBody({ type: OidcLoginPayloadDto })
	@HttpCode(HttpStatus.OK)
	@Post(":uid/login")
	async submitLogin(
		@Param("uid") uid: string,
		@Body() loginDto: OidcLoginPayloadDto,
		@Res() res: Response,
	) {
		const req = res.req as unknown as KoaLikeRequest;
		const koaRes = res as unknown as KoaLikeResponse;

		try {
			const user = await this.interactionService.validateUser(
				loginDto.email,
				loginDto.password,
			);

			if (!user) {
				const interaction = await this.interactionService.getInteractionDetails(
					req,
					koaRes,
				);
				const client = await this.interactionService.findClient(
					interaction.params.client_id as string,
				);

				return res.render("login", {
					uid,
					client,
					prompt: interaction.prompt,
					params: interaction.params,
					error: "이메일 또는 비밀번호가 올바르지 않습니다.",
				});
			}

			const { redirectTo } = await this.interactionService.completeLogin(
				req,
				koaRes,
				user.id,
				loginDto.remember || false,
			);

			return res.redirect(redirectTo);
		} catch (error) {
			this.logger.error(`Login error: ${error}`);
			return res.render("login", {
				uid,
				error: "로그인 처리 중 오류가 발생했습니다.",
			});
		}
	}

	@ApiOperation({
		operationId: "confirmConsent",
		summary: "동의 처리",
		description: "사용자 동의를 처리하고 Authorization Code를 발급합니다.",
	})
	@ApiParam({ name: "uid", description: "Interaction 고유 ID" })
	@ApiResponse({
		status: 302,
		description: "동의 완료 후 클라이언트의 redirect_uri로 리다이렉트",
	})
	@HttpCode(HttpStatus.OK)
	@Post(":uid/confirm")
	async confirmConsent(@Param("uid") uid: string, @Res() res: Response) {
		try {
			const req = res.req as unknown as KoaLikeRequest;
			const koaRes = res as unknown as KoaLikeResponse;

			const { redirectTo } = await this.interactionService.processConsent(
				req,
				koaRes,
			);

			return res.redirect(redirectTo);
		} catch (error) {
			this.logger.error(`Consent error: ${error}`);
			return res.render("consent", {
				uid,
				error: "동의 처리 중 오류가 발생했습니다.",
			});
		}
	}

	@ApiOperation({
		operationId: "abortInteraction",
		summary: "인증 취소",
		description: "사용자가 인증을 거부하고 access_denied 에러를 반환합니다.",
	})
	@ApiParam({ name: "uid", description: "Interaction 고유 ID" })
	@ApiResponse({
		status: 302,
		description: "access_denied 에러와 함께 클라이언트로 리다이렉트",
	})
	@HttpCode(HttpStatus.OK)
	@Post(":uid/abort")
	async abortInteraction(@Param("uid") _uid: string, @Res() res: Response) {
		try {
			const req = res.req as unknown as KoaLikeRequest;
			const koaRes = res as unknown as KoaLikeResponse;

			const { redirectTo } = await this.interactionService.abortInteraction(
				req,
				koaRes,
			);

			return res.redirect(redirectTo);
		} catch (error) {
			this.logger.error(`Abort error: ${error}`);
			return res.status(500).json({ error: "Failed to abort interaction" });
		}
	}
}
