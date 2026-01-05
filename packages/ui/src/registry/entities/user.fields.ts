/**
 * User Entity 필드 정의 예시
 *
 * 이 파일은 User Entity의 필드 메타데이터를 정의합니다.
 * 각 필드의 라벨, 너비, 정렬 가능 여부, 포맷터, 반응형 설정 등을 포함합니다.
 */

import { FieldRegistry } from "../field-registry";
import type { FieldDefinition } from "../types";

/**
 * User Entity 필드 정의
 *
 * 타입 안전한 필드 정의를 위해 satisfies를 사용합니다.
 * 이를 통해 타입 체크와 자동 완성이 가능합니다.
 */
export const UserFields = {
	id: {
		field: "id",
		label: "ID",
		width: 80,
		sortable: true,
		align: "center",
		editable: false,
		responsive: { mobile: false, tablet: false, desktop: true },
	},
	name: {
		field: "name",
		label: "이름",
		width: 120,
		sortable: true,
		required: true,
		editable: true,
		responsive: { mobile: true, tablet: true, desktop: true },
	},
	email: {
		field: "email",
		label: "이메일",
		width: 200,
		sortable: true,
		required: true,
		editable: true,
		responsive: { mobile: false, tablet: true, desktop: true },
	},
	phone: {
		field: "phone",
		label: "전화번호",
		width: 140,
		sortable: false,
		editable: true,
		// formatter는 실제 앱에서 @cocrepo/utils의 formatPhoneNumber를 사용
		// formatter: formatPhoneNumber,
		responsive: { mobile: true, tablet: true, desktop: true },
	},
	status: {
		field: "status",
		label: "상태",
		width: 100,
		align: "center",
		sortable: true,
		editable: false,
		// component는 실제 앱에서 UserStatusBadge 컴포넌트를 주입
		// component: UserStatusBadge,
		responsive: { mobile: true, tablet: true, desktop: true },
	},
	createdAt: {
		field: "createdAt",
		label: "가입일",
		width: 160,
		sortable: true,
		editable: false,
		// formatter는 실제 앱에서 @cocrepo/utils의 formatDateTime을 사용
		// formatter: formatDateTime,
		responsive: { mobile: false, tablet: false, desktop: true },
	},
	role: {
		field: "role",
		label: "역할",
		width: 100,
		sortable: true,
		editable: true,
		responsive: { mobile: false, tablet: true, desktop: true },
	},
	lastLoginAt: {
		field: "lastLoginAt",
		label: "마지막 로그인",
		width: 160,
		sortable: true,
		editable: false,
		responsive: { mobile: false, tablet: false, desktop: true },
	},
} satisfies Record<string, FieldDefinition>;

/**
 * User 필드 키 타입
 * 타입 안전한 필드 접근을 위한 유니온 타입입니다.
 */
export type UserFieldKey = keyof typeof UserFields;

/**
 * User 필드를 FieldRegistry에 등록합니다.
 *
 * 이 함수를 앱 초기화 시점에 호출하세요.
 *
 * @example
 * ```typescript
 * // apps/admin/src/app.tsx
 * import { registerUserFields } from '@cocrepo/ui';
 *
 * registerUserFields();
 * ```
 */
export function registerUserFields(): void {
	FieldRegistry.register("User", UserFields);
}

/**
 * 자동 등록 (모듈 로드 시 실행)
 *
 * 이 파일을 import하면 자동으로 User 필드가 등록됩니다.
 * 명시적 등록을 원하면 registerUserFields()를 직접 호출하세요.
 */
// registerUserFields();
