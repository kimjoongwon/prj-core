import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { OidcConfig } from "../oidc/oidc-config";

/**
 * OIDC interaction 결과 redirect URL을 client가 이동할 수 있는 절대 URL로 보정합니다.
 */
@Injectable()
export class OidcRedirectUrlService {
	constructor(private readonly configService: ConfigService) {}

	/**
	 * oidc-provider가 반환한 redirect 경로를 OIDC issuer 기준의 절대 URL로 변환합니다.
	 *
	 * @param redirectTo oidc-provider interactionResult가 반환한 상대 또는 절대 URL입니다.
	 * @returns 절대 URL이면 원본을, 상대 경로면 OIDC issuer를 붙인 URL을 반환합니다.
	 */
	toAbsolute(redirectTo: string): string {
		if (redirectTo.startsWith("http")) {
			return redirectTo;
		}

		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		const issuer = oidcConfig?.issuer || "http://localhost:3000";
		return `${issuer}${redirectTo}`;
	}
}
