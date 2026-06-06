import { ConfigService } from "@nestjs/config";
import type { OidcConfigLike } from "./oidc-config-like";

export function toAbsoluteOidcUrl(
	configService: ConfigService,
	redirectTo: string,
) {
	if (redirectTo.startsWith("http")) {
		return redirectTo;
	}
	const oidcConfig = configService.get<OidcConfigLike>("oidc");
	const issuer = oidcConfig?.issuer || "http://localhost:3000";
	return `${issuer}${redirectTo}`;
}
