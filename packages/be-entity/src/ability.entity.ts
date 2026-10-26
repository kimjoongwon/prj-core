import {
	BigIntIdFieldMetadata,
	BooleanFieldMetadata,
	ClassField,
	ClassFieldMetadata,
	NumberField,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { AbilitySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Action } from "./action.entity";
import { PolicyEntry } from "./policy-entry.entity";
import { Subject } from "./subject.entity";

/**
 * Ability 엔티티 (CASL ABAC 기반)
 *
 * 재사용 가능한 권한 정의를 담당합니다.
 * - 권한 정의만 담당, 실제 부여는 Policy/PolicyEntry/RoleAssignment에서 관리
 * - PolicyEntry를 통해 공간별 Policy에 포함됩니다
 *
 * DDD 원칙에 따라 Ability는 Subject + Action + fields + conditions 조합으로 권한을 정의합니다.
 * 마스킹 등의 설정은 Action.config에서 가져옵니다.
 */
@AbstractEntityFields()
export class Ability extends AbilitySchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) declare abilityId: AbilitySchema["abilityId"];

	// 메타데이터
	/** 권한 이름 (재사용 가능한 고유 이름) */
	@StringFieldMetadata() declare name: AbilitySchema["name"];
	/** 권한 설명 */
	@StringFieldOptionalMetadata({ nullable: true })
	declare description: AbilitySchema["description"];

	// CASL 필수 필드
	/** 대상 필드 목록 (빈 배열이면 전체 필드) */
	@StringFieldMetadata({ each: true }) declare fields: AbilitySchema["fields"];
	/** 권한 조건 (JSON 형식) */
	@ClassFieldMetadata(() => Object, { required: false, nullable: true })
	declare conditions: AbilitySchema["conditions"];
	/** 거부 권한 여부 (true: cannot, false: can) */
	@BooleanFieldMetadata() declare inverted: AbilitySchema["inverted"];
	/** 거부 사유 (inverted=true일 때 사용) */
	@StringFieldOptionalMetadata({ nullable: true })
	declare reason: AbilitySchema["reason"];

	// 연결 대상
	/** Subject ID (권한 대상) */
	@BigIntIdFieldMetadata() declare subjectId: AbilitySchema["subjectId"];
	/** Action ID (행위 정의) */
	@BigIntIdFieldMetadata() declare actionId: AbilitySchema["actionId"];

	// RoleAssignment에서 조회할 때 설정되는 필드 (optional)
	/** 우선순위 (Policy assignment priority 값) */
	@NumberField({ required: false }) priority?: number;

	// 관계
	@ClassField(() => Subject, { required: false }) subject?: Subject;
	@ClassField(() => Action, { required: false }) action?: Action;
	@ClassField(() => PolicyEntry, { required: false, each: true, isArray: true })
	policyEntries?: PolicyEntry[];

	/**
	 * 허용 권한인지 확인
	 */
	isAllowed(): boolean {
		return !this.inverted;
	}

	/**
	 * 거부 권한인지 확인
	 */
	isDenied(): boolean {
		return this.inverted;
	}

	/**
	 * Action 이름 가져오기
	 * (action 관계가 로드된 경우만 사용 가능)
	 */
	getActionName(): string | null {
		return this.action?.name ?? null;
	}

	/**
	 * 마스킹 Action인지 확인
	 * (action 관계가 로드된 경우만 사용 가능)
	 */
	isMaskingAbility(): boolean {
		return this.action?.isMaskingAction() ?? false;
	}

	/**
	 * 마스킹 프리셋 가져오기
	 * (action 관계가 로드된 경우만 사용 가능)
	 */
	getMaskingPreset(): string | null {
		return this.action?.getMaskingPreset() ?? null;
	}
}
