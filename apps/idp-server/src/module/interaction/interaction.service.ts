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

/** 일시 잠금까지 허용 실패 횟수 */
const TEMPORARY_LOCK_THRESHOLD = 5;
/** 영구 잠금까지 허용 실패 횟수 */
const PERMANENT_LOCK_THRESHOLD = 10;
/** 일시 잠금 시간 (밀리초) */
const TEMPORARY_LOCK_DURATION_MS = 15 * 60 * 1000;

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

/** 로그인 검증 결과 */
export interface LoginValidationResult {
	success: boolean;
	userId?: string;
	mustChangePassword?: boolean;
	error?: string;
	remainingAttempts?: number;
	lockedUntil?: Date;
}

/**
 * Interaction Service
 *
 * OIDC Interaction 흐름의 비즈니스 로직을 담당합니다.
 * - 사용자 인증 (이메일/비밀번호) + 실패 제한 + 잠금 + 감사 로그
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
	 * 사용자 인증 (이메일/비밀번호) + 실패 제한 + 잠금 + 감사 로그
	 */
	async validateUser(
		email: string,
		password: string,
		ipAddress: string,
		userAgent?: string,
		clientId?: string,
	): Promise<LoginValidationResult> {
		this.logger.debug(`로그인 시도: ${email}`);

		const auditBase = { email, ipAddress, userAgent, clientId };

		// 1. 사용자 조회
		const user = await this.directUserRepository.findByEmailForAuth(email);
		if (!user) {
			this.logger.debug(`사용자 미존재: ${email}`);
			await this.directUserRepository.createAuditLog({
				...auditBase,
				result: "FAILURE",
				failureReason: "USER_NOT_FOUND",
			});
			return { success: false, error: "INVALID_CREDENTIALS" };
		}

		// 2. 활성 상태 확인
		if (!user.isActive) {
			this.logger.debug(`비활성 계정: ${email}`);
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId: user.id,
				result: "FAILURE",
				failureReason: "ACCOUNT_INACTIVE",
			});
			return { success: false, error: "INVALID_CREDENTIALS" };
		}

		// 3. 영구 잠금 확인
		if (user.isPermanentlyLocked) {
			this.logger.debug(`영구 잠금 계정: ${email}`);
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId: user.id,
				result: "LOCKED",
				failureReason: "ACCOUNT_LOCKED_PERMANENT",
			});
			return { success: false, error: "ACCOUNT_LOCKED_PERMANENT" };
		}

		// 4. 일시 잠금 확인
		if (user.lockedUntil) {
			if (user.lockedUntil > new Date()) {
				this.logger.debug(`일시 잠금 중: ${email}`);
				await this.directUserRepository.createAuditLog({
					...auditBase,
					userId: user.id,
					result: "LOCKED",
					failureReason: "ACCOUNT_LOCKED_TEMPORARY",
				});
				return {
					success: false,
					error: "ACCOUNT_LOCKED_TEMPORARY",
					lockedUntil: user.lockedUntil,
				};
			}
			// 잠금 시간 경과 → 자동 해제
			await this.directUserRepository.clearLock(user.id);
		}

		// 5. 비밀번호 검증
		try {
			const plainPassword = PlainPassword.create(password);
			const hashedPassword = HashedPassword.fromHash(user.password);
			const isValid = await hashedPassword.compare(plainPassword);

			if (!isValid) {
				return this.handleLoginFailure(user.id, email, user.failedLoginAttempts, auditBase);
			}
		} catch (error) {
			this.logger.debug(`비밀번호 검증 오류: ${error}`);
			return this.handleLoginFailure(user.id, email, user.failedLoginAttempts, auditBase);
		}

		// 6. 로그인 성공
		this.logger.debug(`로그인 성공: ${email}`);
		await this.directUserRepository.updateLoginSuccess(user.id, ipAddress);
		await this.directUserRepository.createAuditLog({
			...auditBase,
			userId: user.id,
			result: "SUCCESS",
		});

		return {
			success: true,
			userId: user.id,
			mustChangePassword: user.mustChangePassword,
		};
	}

	/**
	 * 로그인 실패 처리 (횟수 증가 + 잠금 판단 + 감사 로그)
	 */
	private async handleLoginFailure(
		userId: string,
		email: string,
		currentAttempts: number,
		auditBase: { email: string; ipAddress: string; userAgent?: string; clientId?: string },
	): Promise<LoginValidationResult> {
		const newAttempts = currentAttempts + 1;

		// 10회 이상 → 영구 잠금
		if (newAttempts >= PERMANENT_LOCK_THRESHOLD) {
			await this.directUserRepository.updateLoginFailure(userId, newAttempts, {
				isPermanentlyLocked: true,
			});
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId,
				result: "LOCKED",
				failureReason: "ACCOUNT_LOCKED_PERMANENT",
			});
			return { success: false, error: "ACCOUNT_LOCKED_PERMANENT" };
		}

		// 5회 이상 → 15분 일시 잠금
		if (newAttempts >= TEMPORARY_LOCK_THRESHOLD) {
			const lockedUntil = new Date(Date.now() + TEMPORARY_LOCK_DURATION_MS);
			await this.directUserRepository.updateLoginFailure(userId, newAttempts, {
				lockedUntil,
			});
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId,
				result: "LOCKED",
				failureReason: "ACCOUNT_LOCKED_TEMPORARY",
			});
			return {
				success: false,
				error: "ACCOUNT_LOCKED_TEMPORARY",
				lockedUntil,
			};
		}

		// 일반 실패
		await this.directUserRepository.updateLoginFailure(userId, newAttempts);
		await this.directUserRepository.createAuditLog({
			...auditBase,
			userId,
			result: "FAILURE",
			failureReason: "INVALID_CREDENTIALS",
		});

		return {
			success: false,
			error: "INVALID_CREDENTIALS",
			remainingAttempts: TEMPORARY_LOCK_THRESHOLD - newAttempts,
		};
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
