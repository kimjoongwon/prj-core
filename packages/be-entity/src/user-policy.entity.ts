import type { UserPolicy as UserPolicyEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Policy } from "./policy.entity";
import type { User } from "./user.entity";

/**
 * UserPolicy 엔티티
 *
 * User에 Space별 예외 Policy를 직접 할당합니다.
 */
export class UserPolicy extends AbstractEntity implements UserPolicyEntity {
	userId!: string;
	policyId!: string;
	isActive!: boolean;
	priority!: number;

	user?: User;

	@Type(() => Policy)
	policy?: Policy;

	isEnabled(): boolean {
		return this.isActive && this.removedAt === null;
	}
}
