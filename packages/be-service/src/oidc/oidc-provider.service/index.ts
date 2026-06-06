import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { OidcConfig } from "../oidc-config";
import { OidcConfigurationService } from "../oidc-configuration.service";
import type { OidcProviderInstance } from "../types";

/**
 * OIDC Provider Service
 *
 * oidc-provider 인스턴스의 생명주기를 관리합니다.
 * 설정 빌드는 OidcConfigurationService에 위임합니다.
 */
@Injectable()
export class OidcProviderService {
	private provider: OidcProviderInstance | null = null;
	private readonly logger = new Logger(OidcProviderService.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly configurationService: OidcConfigurationService,
	) {}

	async initialize(): Promise<void> {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		if (!oidcConfig) {
			throw new Error("OIDC config is not defined");
		}

		this.provider = await this.buildProvider(oidcConfig);
		this.registerEventHandlers();

		this.logger.log("OIDC Provider initialized");
	}

	async reload(): Promise<void> {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		if (!oidcConfig) {
			throw new Error("OIDC config is not defined");
		}

		this.provider = await this.buildProvider(oidcConfig);
		this.registerEventHandlers();
		this.logger.log("OIDC Provider reloaded");
	}

	private async buildProvider(
		oidcConfig: OidcConfig,
	): Promise<OidcProviderInstance> {
		const oidcProviderModule = await import("oidc-provider");
		const OidcProvider = oidcProviderModule.default;
		const configuration = await this.configurationService.buildConfiguration();

		const provider = new OidcProvider(
			oidcConfig.issuer,
			configuration as Record<string, unknown>,
		) as unknown as OidcProviderInstance;
		// Trust ingress forwarded proto/host so resume URLs keep the external https origin.
		provider.proxy = true;
		return provider;
	}

	getProvider(): OidcProviderInstance {
		if (!this.provider) {
			throw new Error(
				"OIDC Provider not initialized. Call initialize() first.",
			);
		}
		return this.provider;
	}

	private registerEventHandlers(): void {
		if (!this.provider) return;

		this.provider.on("server_error", (_ctx, err) => {
			const error = err as Error;
			this.logger.error(`OIDC Server Error: ${error.message}`, error.stack);
		});

		this.provider.on("authorization.error", (_ctx, err) => {
			const error = err as Error;
			this.logger.error(`Authorization Error: ${error.message}`);
		});

		this.provider.on("grant.error", (_ctx, err) => {
			const error = err as Error;
			this.logger.error(`Grant Error: ${error.message}`);
		});
	}
}
