import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import { Injectable, Logger } from "@nestjs/common";
import { DirectUserRepository } from "../oidc/direct-user.repository";
import { OidcProviderService } from "../oidc/oidc-provider.service";
import type {
	Interaction,
	KoaLikeRequest,
	KoaLikeResponse,
	OidcClientInfo,
} from "../oidc/types";

export interface InteractionViewData {
	uid: string;
	client?: OidcClientInfo;
	prompt?: Interaction["prompt"];
	params?: Interaction["params"];
	session?: Interaction["session"];
	error?: string | null;
}

export interface InteractionResult {
	redirectTo: string;
}

/**
 * Interaction Service
 *
 * OIDC Interaction 흐름의 비즈니스 로직을 담당합니다.
 * - 사용자 인증 (이메일/비밀번호)
 * - Interaction 상세 조회
 * - 로그인 완료 처리
 * - 동의(Consent) Grant 처리
 * - Interaction 중단 처리
 */
@Injectable()
export class InteractionService {
	private readonly logger = new Logger(InteractionService.name);

	constructor(
		private readonly directUserRepository: DirectUserRepository,
		private readonly oidcProviderService: OidcProviderService,
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
		return provider.Client.find(clientId);
	}

	/**
	 * 사용자 인증 (이메일/비밀번호)
	 * @returns 인증 성공 시 User, 실패 시 null
	 */
	async validateUser(email: string, password: string) {
		this.logger.debug(`Login attempt: ${email}`);

		const user = await this.directUserRepository.findByEmailForAuth(email);

		if (!user) {
			this.logger.debug(`User not found: ${email}`);
			return null;
		}

		try {
			const plainPassword = PlainPassword.create(password);
			const hashedPassword = HashedPassword.fromHash(user.password);

			const isValid = await hashedPassword.compare(plainPassword);

			if (!isValid) {
				this.logger.debug(`Invalid password for: ${email}`);
				return null;
			}

			this.logger.debug(`Login successful: ${email}`);
			return user;
		} catch (error) {
			this.logger.debug(`Password validation error: ${error}`);
			return null;
		}
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
		const result = {
			login: { accountId, remember },
		};

		const redirectTo = await provider.interactionResult(req, res, result, {
			mergeWithLastSubmission: false,
		});

		return { redirectTo };
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
		const { prompt, params, session } = interaction;

		const grant = interaction.grantId
			? await provider.Grant.find(interaction.grantId)
			: new provider.Grant({
					accountId: session?.accountId ?? "",
					clientId: params.client_id as string,
				});

		if (!grant) {
			throw new Error("Grant not found");
		}

		const details = prompt.details || {};

		// 누락된 OIDC scope 추가
		if (details.missingOIDCScope) {
			for (const scope of details.missingOIDCScope) {
				grant.addOIDCScope(scope);
			}
		}

		// 누락된 resource scope 추가
		if (details.missingResourceScopes) {
			for (const [indicator, scopes] of Object.entries(
				details.missingResourceScopes,
			)) {
				grant.addResourceScope(indicator, scopes.join(" "));
			}
		}

		const grantId = await grant.save();

		const redirectTo = await provider.interactionResult(
			req,
			res,
			{ consent: { grantId } },
			{ mergeWithLastSubmission: false },
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
