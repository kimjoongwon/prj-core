/**
 * 정책 기반 권한 검사 Guard
 *
 * @description
 * CASL 기반 권한 검사를 수행하는 Guard입니다.
 * @CheckPolicies 데코레이터와 함께 사용하여 세밀한 권한 제어를 수행합니다.
 */
import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
	SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import type { IPolicyHandler, PolicyHandler } from "../casl/policy-handlers";
import type { AppAbility } from "../casl/types";

/**
 * 정책 검사 메타데이터 키
 */
export const CHECK_POLICIES_KEY = "check_policy";

/**
 * 정책 검사 데코레이터
 *
 * @description
 * Controller 메서드에 적용하여 특정 권한이 필요함을 선언합니다.
 *
 * @example
 * // 메뉴 접근 권한 검사
 * @CheckPolicies([new AccessMenuPolicy('menu:members')])
 * async getMembers() { ... }
 *
 * // 여러 권한 동시 검사 (AND 조건)
 * @CheckPolicies([
 *   new AccessMenuPolicy('menu:members'),
 *   new ManageEntityPolicy('READ', 'User'),
 * ])
 * async getUsers() { ... }
 */
export const CheckPolicies = (handlers: PolicyHandler[]) =>
	SetMetadata(CHECK_POLICIES_KEY, handlers);

/**
 * 정책 기반 권한 검사 Guard
 *
 * @description
 * - @CheckPolicies 데코레이터로 선언된 정책을 검사합니다.
 * - 정책이 없으면 접근을 허용합니다.
 * - 모든 정책을 만족해야 접근이 허용됩니다. (AND 조건)
 *
 * @example
 * // Controller에서 사용
 * @UseGuards(JwtAuthGuard, PoliciesGuard)
 * @Controller('users')
 * export class UsersController {
 *   @Get()
 *   @CheckPolicies([new AccessMenuPolicy('menu:members')])
 *   async getUsers() { ... }
 * }
 */
@Injectable()
export class PoliciesGuard implements CanActivate {
	private readonly logger = new Logger(PoliciesGuard.name);

	constructor(
		private readonly reflector: Reflector,
		private readonly caslAbilityFactory: CaslAbilityFactory,
	) {}

	/**
	 * 요청에 대한 권한을 검사합니다.
	 *
	 * @param context - 실행 컨텍스트
	 * @returns 권한이 있으면 true, 없으면 ForbiddenException 발생
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// 정책 핸들러 조회
		const policyHandlers =
			this.reflector.get<PolicyHandler[]>(
				CHECK_POLICIES_KEY,
				context.getHandler(),
			) || [];

		// 정책이 없으면 접근 허용
		if (policyHandlers.length === 0) {
			return true;
		}

		// 요청에서 사용자 정보 추출
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user) {
			this.logger.warn("인증된 사용자 정보가 없습니다.");
			throw new ForbiddenException("권한이 없습니다.");
		}

		// 사용자의 Ability 생성
		const ability = await this.caslAbilityFactory.createForUser(user);

		// 모든 정책 검사 (AND 조건)
		const hasPermission = policyHandlers.every((handler) =>
			this.execPolicyHandler(handler, ability),
		);

		if (!hasPermission) {
			this.logger.warn(
				`권한 없음: userId=${user.id}, handler=${policyHandlers.map((h) => h.constructor.name).join(", ")}`,
			);
			throw new ForbiddenException("해당 작업에 대한 권한이 없습니다.");
		}

		return true;
	}

	/**
	 * 정책 핸들러를 실행합니다.
	 *
	 * @param handler - 정책 핸들러 (클래스 또는 함수)
	 * @param ability - CASL Ability 객체
	 * @returns 권한이 있으면 true, 없으면 false
	 */
	private execPolicyHandler(
		handler: PolicyHandler,
		ability: AppAbility,
	): boolean {
		// 함수 형태의 핸들러
		if (typeof handler === "function") {
			return handler(ability);
		}

		// 클래스 형태의 핸들러
		return (handler as IPolicyHandler).handle(ability);
	}
}
