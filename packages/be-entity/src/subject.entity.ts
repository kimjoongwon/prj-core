import type { Subject as SubjectEntity } from "@cocrepo/prisma";
import type { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";

/**
 * CASL Subject 엔티티
 * 권한 대상 (entity:xxx, menu:xxx, feature:xxx, ui:xxx)
 */
export class Subject
	extends AbstractEntity
	implements DomainEntityModel<SubjectEntity>
{
	name!: string;
	displayName!: string | null;
	icon!: string | null;
	group!: string | null;
	order!: number;

	abilities?: Ability[];

	/**
	 * Entity Subject인지 확인
	 */
	isEntitySubject(): boolean {
		return this.name.startsWith("entity:");
	}

	/**
	 * Menu Subject인지 확인
	 */
	isMenuSubject(): boolean {
		return this.name.startsWith("menu:");
	}

	/**
	 * Feature Subject인지 확인
	 */
	isFeatureSubject(): boolean {
		return this.name.startsWith("feature:");
	}

	/**
	 * UI Subject인지 확인
	 */
	isUiSubject(): boolean {
		return this.name.startsWith("ui:");
	}

	/**
	 * Subject 타입 가져오기
	 */
	getSubjectType(): "entity" | "menu" | "feature" | "ui" | "unknown" {
		if (this.isEntitySubject()) return "entity";
		if (this.isMenuSubject()) return "menu";
		if (this.isFeatureSubject()) return "feature";
		if (this.isUiSubject()) return "ui";
		return "unknown";
	}

	/**
	 * Subject 이름에서 실제 이름 추출
	 * 예: 'entity:User' -> 'User', 'menu:dashboard' -> 'dashboard'
	 */
	getSubjectName(): string {
		const parts = this.name.split(":");
		return parts.length > 1 ? parts.slice(1).join(":") : this.name;
	}

	/**
	 * 그룹별 색상 (HeroUI variant)
	 */
	getGroupColor(): "primary" | "secondary" | "success" | "warning" | "default" {
		switch (this.group) {
			case "entity":
				return "primary";
			case "menu":
				return "secondary";
			case "feature":
				return "success";
			case "ui":
				return "warning";
			default:
				return "default";
		}
	}

	/**
	 * 그룹별 한글 라벨
	 */
	getGroupLabel(): string {
		switch (this.group) {
			case "entity":
				return "엔티티";
			case "menu":
				return "메뉴";
			case "feature":
				return "기능";
			case "ui":
				return "UI 요소";
			default:
				return "기타";
		}
	}
}
