import type { RoleGrant as RoleGrantEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";

/**
 * RoleGrant 엔티티 (역할 권한 할당)
 *
 * Role에 Ability를 부여하는 역할 전용 BRIDGE 테이블입니다.
 * 기본 권한 묶음을 표현하며, roleId와 abilityId 조합으로 식별됩니다.
 */
export class RoleGrant extends AbstractEntity implements RoleGrantEntity {
	/** 권한 대상 Role ID */
	roleId!: string;
	/** 권한 ID */
	abilityId!: string;
	/** 활성화 여부 */
	isActive!: boolean;
	/** 우선순위 (기본값: 0) */
	priority!: number;

	@Type(() => Ability)
	ability?: Ability;

	/**
	 * 권한이 활성화되어 있는지 확인합니다.
	 */
	isEnabled(): boolean {
		return this.isActive && this.removedAt === null;
	}
}
