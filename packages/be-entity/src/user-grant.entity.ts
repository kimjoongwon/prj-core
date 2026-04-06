import type { UserGrant as UserGrantEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";

/**
 * UserGrant 엔티티 (사용자 예외 권한 할당)
 *
 * User에 Ability를 직접 부여하는 사용자 전용 BRIDGE 테이블입니다.
 * 역할 기반 기본 권한을 덮어쓰는 예외 권한을 표현합니다.
 */
export class UserGrant extends AbstractEntity implements UserGrantEntity {
	/** 권한 대상 User ID */
	userId!: string;
	/** 권한 ID */
	abilityId!: string;
	/** 활성화 여부 */
	isActive!: boolean;
	/** 우선순위 (기본값: 10) */
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
