import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OidcClientRepository } from "../../oidc/oidc-client.repository";
import type { OidcConfig } from "../../oidc/oidc-config";
import { OidcProviderService } from "../../oidc/oidc-provider.service";
import type {
	Grant,
	Interaction,
	KoaLikeRequest,
	KoaLikeResponse,
	OidcClientInfo,
	OidcProviderInstance,
	RawOidcProviderClient,
} from "../../oidc/types";
import type { InteractionResult } from "../interaction-result";

/**
 * Interaction Service
 *
 * OIDC Interaction 흐름의 비즈니스 로직을 담당합니다.
 * - Interaction 상세 조회
 * - 로그인 완료 처리
 * - 동의(Consent) Grant 처리
 * - Interaction 중단 처리
 */
@Injectable()
export class InteractionService {
	constructor(
		private readonly oidcProviderService: OidcProviderService,
		private readonly oidcClientRepository: OidcClientRepository,
		private readonly configService: ConfigService,
	) {}

	/**
	 * Interaction 상세 정보 조회
	 */
	async getInteractionDetails(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<Interaction> {
		const provider = this.oidcProviderService.getProvider();
		return provider.interactionDetails(req, res);
	}

	/**
	 * 클라이언트 정보 조회
	 */
	async findClient(clientId: string): Promise<OidcClientInfo | undefined> {
		const provider = this.oidcProviderService.getProvider();
		const client = await provider.Client.find(clientId);
		if (!client) {
			return undefined;
		}

		const dbClient = await this.oidcClientRepository.findByClientId(clientId);
		const providerClient = this.normalizeClientInfo(client);

		return {
			...providerClient,
			name: dbClient?.name ?? providerClient.name,
			logoUri: dbClient?.logoUri ?? providerClient.logoUri,
			loginUi: dbClient?.loginUi ?? null,
		};
	}

	private normalizeClientInfo(client: RawOidcProviderClient): OidcClientInfo {
		return {
			clientId: client.clientId,
			name: this.resolveClientName(client),
			logoUri: client.logoUri,
		};
	}

	private resolveClientName(client: RawOidcProviderClient): string | undefined {
		return client.clientName;
	}

	/**
	 * 로그인 완료 처리
	 * 인증 성공 후 oidc-provider에 결과를 전달합니다.
	 */
	async completeLogin(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
		accountId: string,
		remember: boolean,
	): Promise<InteractionResult> {
		const provider = this.oidcProviderService.getProvider();
		const interaction = await provider.interactionDetails(req, res);
		const grantId = await this.createLoginConsentGrantIfAllowed(
			provider,
			interaction,
			accountId,
		);
		const result = {
			login: { accountId, remember },
			...(grantId ? { consent: { grantId } } : {}),
		};

		const redirectTo = await provider.interactionResult(req, res, result, {
			mergeWithLastSubmission: false,
		});

		return { redirectTo };
	}

	private async createLoginConsentGrantIfAllowed(
		provider: OidcProviderInstance,
		interaction: Interaction,
		accountId: string,
	): Promise<string | undefined> {
		const clientId = interaction.params.client_id;
		if (!clientId || this.hasExplicitConsentPrompt(interaction)) {
			return undefined;
		}

		const client = await this.oidcClientRepository.findByClientId(clientId);
		if (!client?.isFirstParty || !client.skipConsent) {
			return undefined;
		}

		const grant = interaction.grantId
			? await provider.Grant.find(interaction.grantId)
			: new provider.Grant({ accountId, clientId });
		if (!grant) {
			return undefined;
		}

		this.applyRequestedGrantScopes(grant, interaction);
		return grant.save();
	}

	private hasExplicitConsentPrompt(interaction: Interaction): boolean {
		const prompt = interaction.params.prompt;
		return typeof prompt === "string" && prompt.split(" ").includes("consent");
	}

	private applyRequestedGrantScopes(
		grant: Grant,
		interaction: Interaction,
	): void {
		const scope = interaction.params.scope;
		if (!scope) {
			return;
		}

		grant.addOIDCScope(scope);
		for (const resourceIndicator of this.resolveGrantResourceIndicators(
			interaction,
		)) {
			grant.addResourceScope(resourceIndicator, scope);
		}
	}

	private resolveGrantResourceIndicators(interaction: Interaction): string[] {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		const defaultResource = oidcConfig?.issuer || "http://localhost:3000";
		const resource = interaction.params.resource;
		const resources = Array.isArray(resource)
			? resource
			: typeof resource === "string"
				? [resource]
				: [defaultResource];

		return [...new Set(resources.filter((value) => value.length > 0))];
	}

	/**
	 * 동의(Consent) 처리
	 * Grant를 생성/업데이트하고 oidc-provider에 결과를 전달합니다.
	 */
	async processConsent(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<InteractionResult> {
		const provider = this.oidcProviderService.getProvider();
		const interaction = await provider.interactionDetails(req, res);

		const grant = interaction.grantId
			? await provider.Grant.find(interaction.grantId)
			: new provider.Grant({
					accountId: interaction.session?.accountId ?? "",
					clientId: interaction.params.client_id as string,
				});

		if (!grant) {
			throw new Error("Grant not found");
		}

		const details = interaction.prompt.details || {};

		// 누락된 OIDC scope 추가
		if (details.missingOIDCScope) {
			for (const scope of details.missingOIDCScope) {
				grant.addOIDCScope(scope);
			}
		}

		// 누락된 resource scope 추가
		if (details.missingResourceScopes) {
			const missingResourceScopes = details.missingResourceScopes as Record<
				string,
				string[]
			>;
			for (const [indicator, scopes] of Object.entries(missingResourceScopes)) {
				grant.addResourceScope(indicator, scopes.join(" "));
			}
		}

		const grantId = await grant.save();

		const redirectTo = await provider.interactionResult(
			req,
			res,
			{ consent: { grantId } },
			{ mergeWithLastSubmission: true },
		);

		return { redirectTo };
	}

	/**
	 * Interaction 중단 처리
	 * access_denied 에러와 함께 클라이언트로 리다이렉트합니다.
	 */
	async abortInteraction(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<InteractionResult> {
		const provider = this.oidcProviderService.getProvider();
		const result = {
			error: "access_denied",
			error_description: "End-User aborted interaction",
		};

		const redirectTo = await provider.interactionResult(req, res, result, {
			mergeWithLastSubmission: false,
		});

		return { redirectTo };
	}
}
