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
import {
  OidcProviderService,
  type KoaLikeRequest,
  type KoaLikeResponse,
} from "../oidc/oidc-provider.service";
import { InteractionService } from "./interaction.service";
import { LoginDto } from "./dto/login.dto";

/**
 * OIDC Interaction Controller
 *
 * OIDC 인증 흐름에서 사용자 상호작용(로그인, 동의)을 처리합니다.
 * oidc-provider가 사용자 인증이 필요할 때 이 컨트롤러로 리다이렉트합니다.
 *
 * ## 인증 흐름
 * 1. 클라이언트가 /oidc/auth로 Authorization 요청
 * 2. oidc-provider가 /interaction/:uid로 리다이렉트
 * 3. 사용자가 로그인 폼 제출
 * 4. 인증 성공 시 동의 화면 표시 (필요한 경우)
 * 5. 동의 완료 후 클라이언트의 redirect_uri로 리다이렉트
 */
@ApiTags("Interaction")
@Controller("interaction")
export class InteractionController {
  private readonly logger = new Logger(InteractionController.name);

  constructor(
    private readonly oidcProviderService: OidcProviderService,
    private readonly interactionService: InteractionService
  ) {}

  /**
   * 로그인/동의 화면 표시
   *
   * OIDC 인증 흐름에서 사용자 인증이 필요할 때 호출됩니다.
   * prompt.name에 따라 로그인 또는 동의 화면을 렌더링합니다.
   */
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
      const provider = this.oidcProviderService.getProvider();
      const interaction = await provider.interactionDetails(
        res.req as unknown as KoaLikeRequest,
        res as unknown as KoaLikeResponse
      );

      const { prompt, params, session } = interaction;

      // 동의 화면이 필요한 경우
      if (prompt.name === "consent") {
        return res.render("consent", {
          uid,
          client: await provider.Client.find(params.client_id as string),
          prompt,
          params,
          session,
        });
      }

      // 로그인 화면
      return {
        uid,
        client: await provider.Client.find(params.client_id as string),
        prompt,
        params,
        error: null,
      };
    } catch (error) {
      this.logger.error(`Interaction error: ${error}`);
      return { uid, error: "Invalid interaction" };
    }
  }

  /**
   * 로그인 폼 제출 처리
   *
   * 사용자가 입력한 이메일/비밀번호를 검증하고,
   * 인증 성공 시 oidc-provider에 결과를 전달합니다.
   */
  @ApiOperation({
    operationId: "submitLogin",
    summary: "로그인 처리",
    description: "사용자 인증을 처리하고 OIDC 흐름을 계속합니다.",
  })
  @ApiParam({
    name: "uid",
    description: "Interaction 고유 ID",
  })
  @ApiResponse({
    status: 302,
    description: "인증 성공 시 동의 화면 또는 클라이언트로 리다이렉트",
  })
  @ApiResponse({
    status: 200,
    description: "인증 실패 시 에러 메시지와 함께 로그인 화면 재표시",
  })
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Post(":uid/login")
  async submitLogin(
    @Param("uid") uid: string,
    @Body() loginDto: LoginDto,
    @Res() res: Response
  ) {
    try {
      const provider = this.oidcProviderService.getProvider();
      const interaction = await provider.interactionDetails(
        res.req as unknown as KoaLikeRequest,
        res as unknown as KoaLikeResponse
      );

      // 사용자 인증
      const user = await this.interactionService.validateUser(
        loginDto.email,
        loginDto.password
      );

      if (!user) {
        const { params } = interaction;
        return res.render("login", {
          uid,
          client: await provider.Client.find(params.client_id as string),
          prompt: interaction.prompt,
          params,
          error: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      // 로그인 성공 - Interaction 완료
      const result = {
        login: {
          accountId: user.id,
          remember: loginDto.remember || false,
        },
      };

      const redirectTo = await provider.interactionResult(
        res.req as unknown as KoaLikeRequest,
        res as unknown as KoaLikeResponse,
        result,
        { mergeWithLastSubmission: false }
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

  /**
   * 동의 폼 제출 처리
   *
   * 사용자가 요청된 scope에 대한 동의를 확인하면,
   * Grant를 생성/업데이트하고 클라이언트로 리다이렉트합니다.
   */
  @ApiOperation({
    operationId: "confirmConsent",
    summary: "동의 처리",
    description: "사용자 동의를 처리하고 Authorization Code를 발급합니다.",
  })
  @ApiParam({
    name: "uid",
    description: "Interaction 고유 ID",
  })
  @ApiResponse({
    status: 302,
    description: "동의 완료 후 클라이언트의 redirect_uri로 리다이렉트",
  })
  @HttpCode(HttpStatus.OK)
  @Post(":uid/confirm")
  async confirmConsent(@Param("uid") uid: string, @Res() res: Response) {
    try {
      const provider = this.oidcProviderService.getProvider();
      const interaction = await provider.interactionDetails(
        res.req as unknown as KoaLikeRequest,
        res as unknown as KoaLikeResponse
      );

      const { prompt, params, session } = interaction;

      // Grant 생성 또는 업데이트
      let grant = interaction.grantId
        ? await provider.Grant.find(interaction.grantId)
        : new provider.Grant({
            accountId: session?.accountId,
            clientId: params.client_id as string,
          });

      if (grant) {
        const details = prompt.details || {};

        // 누락된 OIDC scope 추가
        const missingOIDCScope = details.missingOIDCScope as
          | string[]
          | undefined;
        if (missingOIDCScope) {
          for (const scope of missingOIDCScope) {
            grant.addOIDCScope(scope);
          }
        }

        // 누락된 resource scope 추가
        const missingResourceScopes = details.missingResourceScopes as
          | Record<string, string[]>
          | undefined;
        if (missingResourceScopes) {
          for (const [indicator, scopes] of Object.entries(
            missingResourceScopes
          )) {
            grant.addResourceScope(indicator, scopes.join(" "));
          }
        }

        const grantId = await grant.save();

        const result = { consent: { grantId } };
        const redirectTo = await provider.interactionResult(
          res.req as unknown as KoaLikeRequest,
          res as unknown as KoaLikeResponse,
          result,
          { mergeWithLastSubmission: false }
        );

        return res.redirect(redirectTo);
      }

      throw new Error("Grant not found");
    } catch (error) {
      this.logger.error(`Consent error: ${error}`);
      return res.render("consent", {
        uid,
        error: "동의 처리 중 오류가 발생했습니다.",
      });
    }
  }

  /**
   * 인증 취소 처리
   *
   * 사용자가 로그인 또는 동의를 거부할 때 호출됩니다.
   * access_denied 에러와 함께 클라이언트로 리다이렉트합니다.
   */
  @ApiOperation({
    operationId: "abortInteraction",
    summary: "인증 취소",
    description: "사용자가 인증을 거부하고 access_denied 에러를 반환합니다.",
  })
  @ApiParam({
    name: "uid",
    description: "Interaction 고유 ID",
  })
  @ApiResponse({
    status: 302,
    description: "access_denied 에러와 함께 클라이언트로 리다이렉트",
  })
  @HttpCode(HttpStatus.OK)
  @Post(":uid/abort")
  async abortInteraction(@Param("uid") uid: string, @Res() res: Response) {
    try {
      const provider = this.oidcProviderService.getProvider();

      const result = {
        error: "access_denied",
        error_description: "End-User aborted interaction",
      };

      const redirectTo = await provider.interactionResult(
        res.req as unknown as KoaLikeRequest,
        res as unknown as KoaLikeResponse,
        result,
        { mergeWithLastSubmission: false }
      );

      return res.redirect(redirectTo);
    } catch (error) {
      this.logger.error(`Abort error: ${error}`);
      return res.status(500).json({ error: "Failed to abort interaction" });
    }
  }
}
