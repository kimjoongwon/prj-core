import type {
	Prisma,
	UIConfig as UIConfigEntity,
	UIConfigScope,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";

/**
 * UI 설정 엔티티
 *
 * 하이브리드 UI Config 시스템의 DB 오버라이드 저장용입니다.
 * 기본값은 코드(FieldRegistry)에 정의되고, 사용자가 변경한 부분만 저장됩니다.
 *
 * 우선순위: USER > ROLE > GLOBAL (가장 구체적인 설정이 적용됨)
 */
export class UIConfig extends AbstractEntity implements UIConfigEntity {
	/** Space ID (멀티테넌시) */
	spaceId!: string;

	/** 엔티티명 (User, Reservation, Ground 등) */
	entity!: string;

	/** 뷰 타입 (table, form, detail, card) */
	view!: string;

	/** 설정 범위 (GLOBAL, ROLE, USER) */
	scope!: UIConfigScope;

	/** ROLE이면 roleId, USER면 userId */
	scopeId!: string | null;

	/** 설정 데이터 (JSON) - FieldConfig[] 또는 ViewConfig 형태 */
	config!: Prisma.JsonValue;

	/** Space 관계 */
	space?: Space;
}
