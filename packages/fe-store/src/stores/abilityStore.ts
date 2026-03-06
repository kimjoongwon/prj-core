import {
	AbilityBuilder,
	createMongoAbility,
	type MongoAbility,
} from "@casl/ability";
import {
	APP_ACTIONS,
	type AbilityApiResponse,
	type AbilityRule,
	type AppAction,
	type AppSubject,
} from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import type { RootStore } from "./rootStore";

/**
 * CASL Ability 타입
 */
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

/**
 * Backend Action name -> Frontend AppAction 정규화
 * - access -> view
 * - read:full -> view
 * - read:hidden -> view_hidden
 * - read:masked:* -> view_masked
 */
const ACTION_ALIAS_MAP: Readonly<Record<string, AppAction>> = {
	access: "view",
	read_full: "view",
	read_hidden: "view_hidden",
	read_partial: "view_partial",
};

const APP_ACTION_SET = new Set<string>(APP_ACTIONS);

function normalizeActionName(rawActionName: string): AppAction | null {
	const normalized = rawActionName.trim().toLowerCase().replace(/:/g, "_");
	if (APP_ACTION_SET.has(normalized)) {
		return normalized as AppAction;
	}
	if (normalized.startsWith("read_masked")) {
		return "view_masked";
	}
	return ACTION_ALIAS_MAP[normalized] ?? null;
}

function extractName(
	value: AbilityApiResponse["action"] | AbilityApiResponse["subject"],
): string | null {
	if (typeof value === "string") {
		const normalizedValue = value.trim();
		return normalizedValue.length > 0 ? normalizedValue : null;
	}
	if (
		value &&
		typeof value === "object" &&
		"name" in value &&
		typeof value.name === "string"
	) {
		const normalizedValue = value.name.trim();
		return normalizedValue.length > 0 ? normalizedValue : null;
	}
	return null;
}

/**
 * API 권한 응답 배열을 Store 규칙으로 변환
 */
export function convertApiToAbilityRules(
	apiResponses: AbilityApiResponse[],
): AbilityRule[] {
	const rules: AbilityRule[] = [];

	for (const apiResponse of apiResponses) {
		if (apiResponse.isActive === false) {
			continue;
		}

		const actionName = extractName(apiResponse.action);
		const subjectName = extractName(apiResponse.subject);

		if (!actionName || !subjectName) {
			continue;
		}

		const normalizedAction = normalizeActionName(actionName);
		if (!normalizedAction) {
			continue;
		}

		rules.push({
			action: normalizedAction,
			subject: subjectName as AppSubject,
			fields: apiResponse.fields ?? undefined,
			conditions: apiResponse.conditions ?? undefined,
			inverted: apiResponse.inverted,
			reason: apiResponse.reason ?? undefined,
		});
	}

	return rules;
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

	constructor(_rootStore: RootStore) {
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
		return APP_ACTIONS.filter((action) => this.can(action, subject));
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
			const actions = Array.isArray(rule.action) ? rule.action : [rule.action];
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
