import { Public } from "@cocrepo/decorator";
import {
	ForgotPasswordResultDto,
	PasswordPolicyDto,
	ResetPasswordErrorDto,
	ResetPasswordResultDto,
	TokenValidationDto,
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
import { PasswordResetService } from "./password-reset.service";

/**
 * 비밀번호 재설정 Controller
 *
 * 비밀번호 찾기/재설정 흐름의 API를 제공합니다.
 * 모든 엔드포인트는 인증 없이 접근 가능합니다.
 */
@Public()
@ApiTags("Password Reset")
@Controller("api")
export class PasswordResetController {
	private readonly logger = new Logger(PasswordResetController.name);

	constructor(private readonly passwordResetService: PasswordResetService) {}

	@ApiOperation({
		operationId: "getPasswordPolicy",
		summary: "비밀번호 정책 조회",
		description:
			"비밀번호 정책(최소 길이, 대소문자/숫자/특수문자 필수 여부)을 반환합니다. 인증 불요.",
	})
	@ApiResponse({
		status: 200,
		description: "비밀번호 정책 정보",
		type: PasswordPolicyDto,
	})
	@Get("password-policy")
	async getPasswordPolicy(@Res() res: Response) {
		const policy = await this.passwordResetService.getPasswordPolicy();
		return res.json(policy);
	}

	@ApiOperation({
		operationId: "requestPasswordReset",
		summary: "비밀번호 재설정 요청",
		description:
			"이메일로 비밀번호 재설정 링크를 발송합니다. 보안을 위해 이메일 존재 여부와 관계없이 동일한 응답을 반환합니다.",
	})
	@ApiBody({
		schema: {
			type: "object",
			required: ["email"],
			properties: {
				email: { type: "string", format: "email", example: "user@example.com" },
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "항상 성공 응답 (이메일 존재 여부 노출 방지)",
		type: ForgotPasswordResultDto,
	})
	@HttpCode(HttpStatus.OK)
	@Post("forgot-password")
	async requestReset(@Body("email") email: string, @Res() res: Response) {
		try {
			await this.passwordResetService.requestReset(email);
			return res.json({
				message: "입력하신 이메일로 재설정 링크를 발송했습니다.",
			});
		} catch (error) {
			this.logger.error(`비밀번호 재설정 요청 오류: ${error}`);
			// 보안: 어떤 오류든 동일한 성공 응답
			return res.json({
				message: "입력하신 이메일로 재설정 링크를 발송했습니다.",
			});
		}
	}

	@ApiOperation({
		operationId: "validateResetToken",
		summary: "재설정 토큰 검증",
		description: "비밀번호 재설정 토큰의 유효성을 확인합니다.",
	})
	@ApiParam({
		name: "token",
		description: "비밀번호 재설정 토큰 (이메일 링크에 포함)",
	})
	@ApiResponse({
		status: 200,
		description: "토큰 유효성 검증 결과",
		type: TokenValidationDto,
	})
	@Get("reset-password/:token")
	async validateToken(@Param("token") token: string, @Res() res: Response) {
		const result = await this.passwordResetService.validateToken(token);
		return res.json(result);
	}

	@ApiOperation({
		operationId: "executePasswordReset",
		summary: "비밀번호 재설정 실행",
		description:
			"토큰을 검증하고 새 비밀번호를 설정합니다. 성공 시 모든 세션이 무효화됩니다.",
	})
	@ApiParam({
		name: "token",
		description: "비밀번호 재설정 토큰",
	})
	@ApiBody({
		schema: {
			type: "object",
			required: ["password", "confirmPassword"],
			properties: {
				password: { type: "string", example: "NewPassword1!@" },
				confirmPassword: { type: "string", example: "NewPassword1!@" },
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "비밀번호 변경 성공",
		type: ResetPasswordResultDto,
	})
	@ApiResponse({
		status: 400,
		description: "토큰 만료, 정책 미달, 재사용 등",
		type: ResetPasswordErrorDto,
	})
	@HttpCode(HttpStatus.OK)
	@Post("reset-password/:token")
	async executeReset(
		@Param("token") token: string,
		@Body() body: { password: string; confirmPassword: string },
		@Res() res: Response,
	) {
		// 비밀번호 확인 일치 검증
		if (body.password !== body.confirmPassword) {
			return res.status(400).json({ error: "PASSWORD_MISMATCH" });
		}

		try {
			await this.passwordResetService.executeReset(token, body.password);
			return res.json({
				message: "비밀번호가 변경되었습니다. 다시 로그인해주세요.",
			});
		} catch (error) {
			if (error instanceof Error && error.message) {
				const errorCode = error.message;
				if (
					errorCode.startsWith("TOKEN_EXPIRED") ||
					errorCode.startsWith("PASSWORD_POLICY_VIOLATION") ||
					errorCode.startsWith("PASSWORD_REUSE")
				) {
					return res.status(400).json({ error: errorCode });
				}
			}
			this.logger.error(`비밀번호 재설정 실행 오류: ${error}`);
			return res
				.status(500)
				.json({ error: "비밀번호 재설정 중 오류가 발생했습니다." });
		}
	}
}
