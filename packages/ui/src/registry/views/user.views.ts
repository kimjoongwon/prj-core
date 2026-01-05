/**
 * User Entity 뷰 정의 예시
 *
 * 이 파일은 User Entity의 뷰별 기본 설정을 정의합니다.
 * 테이블, 폼, 상세, 카드 뷰 각각에 대한 필드 순서와 옵션을 설정합니다.
 */

import type { SortConfig, ViewType } from "../types";
import { ViewRegistry } from "../view-registry";

/**
 * User 테이블 뷰 설정
 */
export const UserTableView = {
	entity: "User",
	view: "table" as ViewType,
	fields: ["name", "email", "phone", "status", "role", "createdAt"],
	defaultSort: { field: "createdAt", direction: "desc" } as SortConfig,
	pageSize: 20,
};

/**
 * User 폼 뷰 설정
 */
export const UserFormView = {
	entity: "User",
	view: "form" as ViewType,
	fields: ["name", "email", "phone", "role", "status"],
};

/**
 * User 상세 뷰 설정
 */
export const UserDetailView = {
	entity: "User",
	view: "detail" as ViewType,
	fields: [
		"id",
		"name",
		"email",
		"phone",
		"status",
		"role",
		"createdAt",
		"lastLoginAt",
	],
};

/**
 * User 카드 뷰 설정
 */
export const UserCardView = {
	entity: "User",
	view: "card" as ViewType,
	fields: ["name", "email", "status"],
};

/**
 * User 뷰를 ViewRegistry에 등록합니다.
 *
 * 이 함수를 앱 초기화 시점에 호출하세요.
 *
 * @example
 * ```typescript
 * // apps/admin/src/app.tsx
 * import { registerUserViews } from '@cocrepo/ui';
 *
 * registerUserViews();
 * ```
 */
export function registerUserViews(): void {
	ViewRegistry.register(UserTableView);
	ViewRegistry.register(UserFormView);
	ViewRegistry.register(UserDetailView);
	ViewRegistry.register(UserCardView);
}

/**
 * 모든 User 뷰 정의를 배열로 반환합니다.
 *
 * @example
 * ```typescript
 * const views = getUserViews();
 * views.forEach(view => ViewRegistry.register(view));
 * ```
 */
export function getUserViews() {
	return [UserTableView, UserFormView, UserDetailView, UserCardView];
}

/**
 * 자동 등록 (모듈 로드 시 실행)
 *
 * 이 파일을 import하면 자동으로 User 뷰가 등록됩니다.
 * 명시적 등록을 원하면 registerUserViews()를 직접 호출하세요.
 */
// registerUserViews();
