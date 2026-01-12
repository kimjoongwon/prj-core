import {
	AbilityBuilder,
	createMongoAbility,
	type MongoAbility,
} from "@casl/ability";
import { makeAutoObservable } from "mobx";
import type { Store } from "./Store";

/**
 * CASL Action 타입
 * CRUD + visibility + workflow 액션
 */
export type AppAction =
	| "create"
	| "read"
	| "update"
	| "delete"
	| "manage"
	| "view"
	| "view_masked"
	| "view_partial"
	| "view_hidden"
	| "approve"
	| "reject"
	| "submit"
	| "cancel";

/**
 * CASL Subject 타입
 * entity:xxx, menu:xxx, feature:xxx, ui:xxx 패턴
 */
export type AppSubject = string | "all";

/**
 * CASL Ability 타입
 */
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

/**
 * 서버에서 받아오는 Ability 데이터 형식
 */
export interface AbilityRule {
	action: AppAction | AppAction[];
	subject: AppSubject | AppSubject[];
	fields?: string[];
	conditions?: Record<string, unknown>;
	inverted?: boolean;
	reason?: string;
}

/**
 * AbilityStore - CASL 권한 상태 관리
 *
 * 사용 예시:
 * - can('read', 'entity:user') - User 엔티티 읽기 권한 확인
 * - can('view', 'menu:dashboard') - 대시보드 메뉴 접근 권한 확인
 * - can('create', 'feature:export') - 내보내기 기능 사용 권한 확인
 * - cannot('delete', 'entity:admin') - Admin 삭제 불가 확인
 */
export class AbilityStore {
	private _ability: AppAbility;
	private _rules: AbilityRule[] = [];
	private _isLoaded = false;

	constructor(_plateStore: Store) {
		this._ability = this.createEmptyAbility();
		makeAutoObservable(this);
	}

	/**
	 * 현재 CASL Ability 인스턴스
	 */
	get ability(): AppAbility {
		return this._ability;
	}

	/**
	 * 현재 적용된 권한 규칙들
	 */
	get rules(): AbilityRule[] {
		return this._rules;
	}

	/**
	 * 권한 로드 완료 여부
	 */
	get isLoaded(): boolean {
		return this._isLoaded;
	}

	/**
	 * 권한 확인 - can
	 */
	can(action: AppAction, subject: AppSubject, field?: string): boolean {
		if (field) {
			return this._ability.can(action, subject, field);
		}
		return this._ability.can(action, subject);
	}

	/**
	 * 권한 확인 - cannot
	 */
	cannot(action: AppAction, subject: AppSubject, field?: string): boolean {
		if (field) {
			return this._ability.cannot(action, subject, field);
		}
		return this._ability.cannot(action, subject);
	}

	/**
	 * 권한 규칙 업데이트
	 * 로그인 후 서버에서 받아온 권한 정보로 업데이트
	 */
	updateRules(rules: AbilityRule[]): void {
		this._rules = rules;
		this._ability = this.buildAbility(rules);
		this._isLoaded = true;
	}

	/**
	 * 권한 초기화 (로그아웃 시)
	 */
	clearRules(): void {
		this._rules = [];
		this._ability = this.createEmptyAbility();
		this._isLoaded = false;
	}

	/**
	 * 특정 Subject에 대한 모든 허용된 Action 목록
	 */
	getAllowedActions(subject: AppSubject): AppAction[] {
		const actions: AppAction[] = [
			"create",
			"read",
			"update",
			"delete",
			"manage",
			"view",
			"view_masked",
			"view_partial",
			"view_hidden",
			"approve",
			"reject",
			"submit",
			"cancel",
		];

		return actions.filter((action) => this.can(action, subject));
	}

	/**
	 * 특정 Action에 대한 모든 허용된 Subject 목록
	 * (현재 로드된 규칙 기반)
	 */
	getAllowedSubjects(action: AppAction): AppSubject[] {
		const subjects = new Set<AppSubject>();

		for (const rule of this._rules) {
			if (!rule.inverted) {
				const actions = Array.isArray(rule.action)
					? rule.action
					: [rule.action];
				if (actions.includes(action) || actions.includes("manage")) {
					const ruleSubjects = Array.isArray(rule.subject)
						? rule.subject
						: [rule.subject];
					for (const subject of ruleSubjects) {
						subjects.add(subject);
					}
				}
			}
		}

		return Array.from(subjects);
	}

	/**
	 * 메뉴 Subject만 필터링하여 허용된 목록 반환
	 */
	getAllowedMenus(): string[] {
		return this.getAllowedSubjects("view").filter((subject) =>
			subject.startsWith("menu:"),
		);
	}

	/**
	 * 빈 Ability 생성 (권한 없음)
	 */
	private createEmptyAbility(): AppAbility {
		return createMongoAbility<[AppAction, AppSubject]>([]);
	}

	/**
	 * 규칙 기반 Ability 빌드
	 */
	private buildAbility(rules: AbilityRule[]): AppAbility {
		const { can, cannot, build } = new AbilityBuilder<AppAbility>(
			createMongoAbility,
		);

		for (const rule of rules) {
			const actions = Array.isArray(rule.action)
				? rule.action
				: [rule.action];
			const subjects = Array.isArray(rule.subject)
				? rule.subject
				: [rule.subject];

			for (const action of actions) {
				for (const subject of subjects) {
					if (rule.inverted) {
						if (rule.fields && rule.fields.length > 0) {
							cannot(action, subject, rule.fields);
						} else {
							cannot(action, subject);
						}
					} else {
						if (rule.fields && rule.fields.length > 0) {
							can(action, subject, rule.fields);
						} else {
							can(action, subject);
						}
					}
				}
			}
		}

		return build();
	}
}
