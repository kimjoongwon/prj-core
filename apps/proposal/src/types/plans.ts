/**
 * 기획서 폴더 구조 타입 정의
 */

/**
 * 전체 기획서 트리 구조
 */
export interface PlansTree {
  /** 공통 시스템 카테고리 목록 (_core) */
  core: CoreCategory[];
  /** 프로젝트 목록 */
  projects: ProjectInfo[];
}

/**
 * 프로젝트 정보 (prj-core, project-alpha 등)
 */
export interface ProjectInfo {
  /** 프로젝트 ID (폴더명) */
  id: string;
  /** 프로젝트 이름 */
  name: string;
  /** 앱 목록 */
  apps: AppInfo[];
}

/**
 * 앱 정보 (admin-web, admin-mobile 등)
 */
export interface AppInfo {
  /** 앱 ID (폴더명) */
  id: string;
  /** 앱 이름 */
  name: string;
  /** 기능 목록 */
  features: FeatureInfo[];
}

/**
 * 공통 시스템 카테고리 (_core 하위)
 */
export interface CoreCategory {
  /** 카테고리 ID (폴더명) */
  id: string;
  /** 카테고리 이름 */
  name: string;
  /** 기능 목록 */
  features: FeatureInfo[];
}

/**
 * 기능 정보 (YYYY-MM-DD-FeatureName 형식의 폴더)
 */
export interface FeatureInfo {
  /** 기능 ID (폴더명) */
  id: string;
  /** 기능 이름 (날짜 제외) */
  name: string;
  /** 생성 날짜 */
  date: string;
  /** 전체 경로 (plans 폴더 기준 상대 경로) */
  path: string;
}

/**
 * 카테고리 한글 이름 매핑
 */
export const CORE_CATEGORY_NAMES: Record<string, string> = {
  infrastructure: "인프라",
  navigation: "네비게이션",
  "ui-system": "UI 시스템",
  "shared-domain": "공유 도메인",
};
