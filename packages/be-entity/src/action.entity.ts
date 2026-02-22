import type { Action as ActionEntity, Prisma } from "@cocrepo/prisma";
import type {
	ActionConfig,
	ActionFormatConfig,
	ActionMaskingConfig,
	ActionTransformConfig,
} from "@cocrepo/type";
import type { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";

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
export class Action extends AbstractEntity implements ActionEntity {
	/** Action 이름 ('create', 'read', 'read:masked:email' 등) */
	name!: string;
	/** 표시명 */
	displayName!: string | null;
	/** 설명 */
	description!: string | null;
	/** 그룹 ('crud', 'visibility', 'bulk', 'workflow') */
	group!: string | null;
	/** 정렬 순서 */
	order!: number;
	/** 시스템 여부 */
	isSystem!: boolean;
	/** Action 설정 (마스킹, 포맷팅 등) */
	config!: Prisma.JsonValue | null;

	// 관계
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
