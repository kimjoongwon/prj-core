import { Injectable, Logger } from "@nestjs/common";
import { UsersService, AbilitiesService, RolesService } from "@cocrepo/service";

// oidc-provider is ESM-only, define types locally
interface AccountClaims {
	sub: string;
	[key: string]: unknown;
}

interface ClaimsParameterMember {
	essential?: boolean;
	value?: string;
	values?: string[];
}

interface Account {
	accountId: string;
	claims: (
		use: string,
		scope: string,
		claims: { [key: string]: ClaimsParameterMember },
		rejected: string[],
	) => Promise<AccountClaims>;
}

type FindAccount = (
	ctx: unknown,
	id: string,
	token?: unknown,
) => Promise<Account | undefined>;

/**
 * OIDC 토큰에 포함될 권한 형식
 */
interface AbilityClaim {
	action: string;
	subject: string;
	fields?: string[];
	conditions?: Record<string, unknown>;
}

/**
 * OIDC Account Service
 * oidc-provider가 사용자 정보를 조회할 때 사용
 */
@Injectable()
export class AccountService {
	private readonly logger = new Logger(AccountService.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly rolesService: RolesService,
		private readonly abilitiesService: AbilitiesService,
	) {}

	/**
	 * oidc-provider의 findAccount 함수 구현
	 * Authorization Flow에서 사용자 정보를 조회할 때 호출됨
	 */
	findAccount: FindAccount = async (ctx, id, token) => {
		this.logger.debug(`Finding account for id: ${id}`);
		const user = await this.usersService.getByIdWithTenants(id);

		if (!user) {
			this.logger.debug(`User not found: ${id}`);
			return undefined;
		}

		const account: Account = {
			accountId: user.id,
			/**
			 * claims 함수: 요청된 scope에 따라 반환할 클레임 결정
			 * @param use - 'id_token' | 'userinfo'
			 * @param scope - 요청된 scope 문자열 (예: 'openid profile email')
			 * @param claims - 요청된 특정 클레임
			 * @param rejected - 거부된 클레임
			 */
			claims: async (use, scope, claims, rejected): Promise<AccountClaims> => {
				const scopeArray = scope.split(" ");
				const result: AccountClaims = {
					sub: user.id,
				};

				// profile scope
				if (scopeArray.includes("profile")) {
					result.name = user.name;
					result.updated_at = user.updatedAt
						? Math.floor(user.updatedAt.getTime() / 1000)
						: Math.floor(user.createdAt.getTime() / 1000);
				}

				// email scope
				if (scopeArray.includes("email")) {
					result.email = user.email;
					result.email_verified = true;
				}

				// phone scope
				if (scopeArray.includes("phone")) {
					result.phone_number = user.phone;
					result.phone_number_verified = true;
				}

				// roles scope (커스텀) - Tenant의 Role 정보 추출
				if (scopeArray.includes("roles")) {
					const roles = await this.getRoleNamesFromTenants(user.tenants);
					result.roles = roles;
					this.logger.debug(`User ${user.id} roles: ${roles.join(", ")}`);
				}

				// permissions scope (커스텀) - CASL Ability 연동
				if (scopeArray.includes("permissions")) {
					const permissions = await this.getPermissionsForUser(user);
					result.permissions = permissions;
					this.logger.debug(
						`User ${user.id} permissions count: ${permissions.length}`,
					);
				}

				return result;
			},
		};

		return account;
	};

	/**
	 * Tenant 목록에서 Role 이름 조회
	 * @param tenants - 사용자의 Tenant 목록 (roleId 포함)
	 * @returns Role 이름 배열 (중복 제거)
	 */
	private async getRoleNamesFromTenants(
		tenants?: Array<{ roleId?: string }>,
	): Promise<string[]> {
		if (!tenants || tenants.length === 0) {
			return [];
		}

		// roleId 추출 (중복 제거)
		const roleIds = [...new Set(
			tenants
				.filter((tenant) => tenant.roleId)
				.map((tenant) => tenant.roleId!),
		)];

		if (roleIds.length === 0) {
			return [];
		}

		// RolesService로 Role 정보 조회
		const roles = await Promise.all(
			roleIds.map((id) => this.rolesService.getById(id)),
		);

		return roles
			.filter((role) => role?.name)
			.map((role) => role!.name);
	}

	/**
	 * 사용자의 CASL 권한 조회
	 * - Role 기반 권한 + User 예외 권한 병합
	 *
	 * @param user - 사용자 정보 (tenants 포함)
	 * @returns AbilityClaim 배열
	 */
	private async getPermissionsForUser(user: {
		id: string;
		tenants?: Array<{ roleId?: string }>;
	}): Promise<AbilityClaim[]> {
		try {
			// Tenant에서 roleId 추출
			const roleIds =
				user.tenants
					?.filter((tenant) => tenant.roleId)
					.map((tenant) => tenant.roleId!) ?? [];

			if (roleIds.length === 0) {
				this.logger.debug(`User ${user.id} has no roles`);
				return [];
			}

			// AbilitiesService로 병합된 권한 조회
			const abilities = await this.abilitiesService.getMergedAbilities(
				roleIds,
				user.id,
			);

			// OIDC 토큰용 형식으로 변환
			return abilities.map((ability) => ({
				action: ability.action?.name ?? "unknown",
				subject: ability.subject?.name ?? "unknown",
				...(ability.fields && { fields: ability.fields }),
				...(ability.conditions && {
					conditions: ability.conditions as Record<string, unknown>,
				}),
			}));
		} catch (error) {
			this.logger.error(
				`Failed to load permissions for user ${user.id}:`,
				error,
			);
			return [];
		}
	}
}
