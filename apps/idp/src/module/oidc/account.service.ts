import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "@cocrepo/service";

// oidc-provider 타입 (@types/oidc-provider 기반)
interface AccountClaims {
	sub: string;
	[key: string]: unknown;
}

interface ClaimsParameterMember {
	essential?: boolean;
	value?: string;
	values?: string[];
	[key: string]: unknown;
}

interface Account {
	accountId: string;
	claims: (
		use: string,
		scope: string,
		claims: { [key: string]: ClaimsParameterMember | null },
		rejected: string[],
	) => AccountClaims | Promise<AccountClaims>;
	[key: string]: unknown;
}

type FindAccount = (
	ctx: unknown,
	id: string,
	token?: unknown,
) => Account | Promise<Account | undefined>;

/**
 * OIDC Account Service
 * oidc-provider가 사용자 정보를 조회할 때 사용
 */
@Injectable()
export class AccountService {
	private readonly logger = new Logger(AccountService.name);

	constructor(
		private readonly usersService: UsersService,
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

				return result;
			},
		};

		return account;
	};
}
