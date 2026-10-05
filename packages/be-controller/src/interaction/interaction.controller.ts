import {
	AbortInteractionCommand,
	ConfirmInteractionConsentCommand,
	GetInteractionQuery,
	SubmitInteractionLoginCommand,
} from "@cocrepo/command";
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
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";

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

	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

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
	async getInteraction(
		@Param("uid") uid: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		try {
			const interaction = await this.queryBus.execute(
				new GetInteractionQuery(uid, req, res),
			);

			return res.json(interaction);
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
		try {
			const result = await this.commandBus.execute(
				new SubmitInteractionLoginCommand(loginDto, req, res),
			);

			return res.status(result.statusCode).json(result.body);
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
	async confirmConsent(
		@Param("uid") _uid: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		try {
			const consentResult = await this.commandBus.execute(
				new ConfirmInteractionConsentCommand(req, res),
			);

			return res.json({ redirectTo: consentResult.redirectTo });
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
	async abortInteraction(
		@Param("uid") _uid: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		try {
			const abortResult = await this.commandBus.execute(
				new AbortInteractionCommand(req, res),
			);

			return res.json({ redirectTo: abortResult.redirectTo });
		} catch (error) {
			this.logger.error(`Abort error: ${error}`);
			return res
				.status(500)
				.json({ error: "인증 취소 처리 중 오류가 발생했습니다." });
		}
	}
}
