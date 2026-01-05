/**
 * CASL 기반 권한 시스템 모듈
 *
 * @description
 * CASL(Code Access Security Library)을 기반으로 한 세밀한 권한 관리 시스템입니다.
 *
 * @example
 * // Controller에서 사용
 * import {
 *   CaslAbilityFactory,
 *   AccessMenuPolicy,
 *   ManageEntityPolicy,
 *   CheckPolicies,
 *   PoliciesGuard,
 * } from '@cocrepo/be-common';
 *
 * @UseGuards(JwtAuthGuard, PoliciesGuard)
 * @Controller('users')
 * export class UsersController {
 *   @Get()
 *   @CheckPolicies([
 *     new AccessMenuPolicy('menu:members'),
 *     new ManageEntityPolicy('READ', 'User'),
 *   ])
 *   async getUsers() { ... }
 * }
 */

// Factory
export { CaslAbilityFactory } from "./casl-ability.factory";

// Policy Handlers
export {
	AccessApiPolicy,
	AccessFeaturePolicy,
	AccessMenuPolicy,
	CustomPolicy,
	ManageEntityPolicy,
} from "./policy-handlers";
export type {
	IPolicyHandler,
	PolicyHandler,
	PolicyHandlerCallback,
} from "./policy-handlers";

// Types
export type {
	AbilityCondition,
	Actions,
	AppAbility,
	AppAbilityBuilder,
	AppAbilityClass,
	ConditionExpression,
	Subjects,
} from "./types";
