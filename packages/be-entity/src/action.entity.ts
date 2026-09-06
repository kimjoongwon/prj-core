import {
	ClassField,
	NumberFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { ActionSchema } from "@cocrepo/schema";
import type {
	ActionConfig,
	ActionFormatConfig,
	ActionMaskingConfig,
	ActionTransformConfig,
} from "@cocrepo/type";
import { Exclude } from "class-transformer";
import { Ability } from "./ability.entity";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

// @cocrepo/type에서 타입 재export (하위 호환성)
export type {
	ActionConfig,
	ActionFormatConfig,
	ActionMaskingConfig,
	ActionTransformConfig,
};

/**
 * Action 엔티티 (CASL Action 정의)
 *
 * 행위의 완전한 정의를 담당합니다.
 * DDD 원칙에 따라 마스킹, 포맷팅 등의 설정을 config에 포함합니다.
 *
 * @example
 * // 기본 CRUD Action
 * { name: 'create', group: 'crud', config: null }
 *
 * // 마스킹 Action
 * { name: 'read:masked:email', group: 'visibility', config: { type: 'masking', preset: 'PRESET_EMAIL' } }
 */
@AbstractEntityFields()
export class Action extends ActionSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) declare actionId: ActionSchema["actionId"];

	/** Action 이름 ('create', 'read', 'read:masked:email' 등) */
	@StringFieldMetadata() declare name: ActionSchema["name"];
	/** 표시명 */
	@StringFieldOptionalMetadata({ nullable: true })
	declare displayName: ActionSchema["displayName"];
	/** 설명 */
	@StringFieldOptionalMetadata({ nullable: true })
	declare description: ActionSchema["description"];
	/** 그룹 ('crud', 'visibility', 'bulk', 'workflow') */
	@StringFieldOptionalMetadata({ nullable: true })
	declare group: ActionSchema["group"];
	/** 정렬 순서 */
	@NumberFieldMetadata() declare order: ActionSchema["order"];
	/** Action 설정 (마스킹, 포맷팅 등) */
	declare config: ActionSchema["config"];

	// 관계
	@ClassField(() => Ability, { required: false, each: true, isArray: true })
	abilities?: Ability[];

	/**
	 * config에서 마스킹 프리셋 가져오기
	 *
	 * @returns 마스킹 프리셋 이름 또는 null
	 */
	getMaskingPreset(): string | null {
		if (!this.config || typeof this.config !== "object") return null;
		const cfg = this.config as { type?: string; preset?: string };
		if (cfg.type === "masking" && cfg.preset) {
			return cfg.preset;
		}
		return null;
	}

	/**
	 * config에서 설정 타입 가져오기
	 *
	 * @returns config 타입 ('masking', 'format', 'transform') 또는 null
	 */
	getConfigType(): string | null {
		if (!this.config || typeof this.config !== "object") return null;
		const cfg = this.config as { type?: string };
		return cfg.type ?? null;
	}

	/**
	 * 마스킹 Action인지 확인
	 */
	isMaskingAction(): boolean {
		return this.getConfigType() === "masking";
	}

	/**
	 * CRUD Action인지 확인
	 */
	isCrudAction(): boolean {
		return this.group === "crud";
	}

	/**
	 * Visibility Action인지 확인
	 */
	isVisibilityAction(): boolean {
		return this.group === "visibility";
	}

	/**
	 * 타입 안전한 config 반환
	 */
	getTypedConfig(): ActionConfig {
		if (!this.config || typeof this.config !== "object") return null;
		return this.config as unknown as ActionConfig;
	}
}
