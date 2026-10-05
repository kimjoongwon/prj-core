import { ParseBigIntIdPipe } from "@cocrepo/be-common";
import {
	GetEmailVerificationsQuery,
	ResendEmailVerificationCommand,
} from "@cocrepo/command";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import {
	EmailVerificationDto,
	PageMetaDto,
	QueryEmailVerificationDto,
} from "@cocrepo/dto";
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("EMAIL_VERIFICATIONS")
@Controller()
@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
@SkipSpaceCheck()
export class EmailVerificationsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getEmailVerifications",
		summary: "이메일 인증 목록 조회",
		description:
			"회원가입 이메일 인증 요청을 전역 PLATFORM_ADMIN 기준으로 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(EmailVerificationDto, HttpStatus.OK, {
		isArray: true,
		metaDto: PageMetaDto,
	})
	@ResponseMessage("이메일 인증 목록 조회 성공")
	getEmailVerifications(@Query() query: QueryEmailVerificationDto) {
		return this.queryBus.execute(new GetEmailVerificationsQuery(query));
	}

	@Post(":emailVerificationId/resend")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "resendEmailVerification",
		summary: "이메일 인증 메일 재발송",
		description:
			"아직 완료되지 않은 이메일 인증 요청에 인증 메일을 다시 발송합니다.",
	})
	@ApiParam({
		name: "emailVerificationId",
		description: "이메일 인증 ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiAuth()
	@ApiErrors(400, 401, 403, 429, 500)
	@ApiResponseEntity(EmailVerificationDto, HttpStatus.OK)
	@ResponseMessage("이메일 인증 메일을 재발송했습니다.")
	resendEmailVerification(
		@Param("emailVerificationId", ParseBigIntIdPipe)
		emailVerificationId: bigint,
	) {
		return this.commandBus.execute(
			new ResendEmailVerificationCommand(emailVerificationId),
		);
	}
}
