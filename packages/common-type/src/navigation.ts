// ============================================
// 네비게이션 관련 타입
// ============================================

import type { AppIconName } from "./icon";

/**
 * 탭 설정 인터페이스 (v7.0 신규)
 * 페이지 내 3depth 탭 정보
 */
export interface TabConfig {
	id: string;
	label: string;
	href: string;
}

/**
 * 네비게이션 아이템 설정 인터페이스 (생성자 파라미터용)
 */
export interface NavItemConfig {
	id: string;
	label: string;
	path?: string;
	icon?: AppIconName;
	subject: string;
	children?: NavItemConfig[];
	/** v7.0 신규: 3depth 탭 정보 */
	tabs?: TabConfig[];
}

/**
 * FAB 액션 인터페이스
 * 모바일 FAB에서 표시되는 빠른 액션 정의
 */
export interface FABAction {
	id: string;
	label: string;
	icon: AppIconName;
	/** 권한 체크용 subject */
	subject: string;
	/** 페이지 이동 경로 (href와 modal 중 하나만 사용) */
	href?: string;
	/** 모달 열기 ID (href와 modal 중 하나만 사용) */
	modal?: string;
}
