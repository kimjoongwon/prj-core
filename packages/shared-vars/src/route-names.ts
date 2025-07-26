/**
 * 상수형으로 routes에서 사용되는 name들을 모두 정의
 * 이렇게 하면 타입스크립트가 const assertion을 통해 정확한 타입을 유추할 수 있음
 */
export const ROUTE_NAMES = {
  ADMIN: "관리자",
  AUTH: "인증",
  LOGIN: "로그인",
  TENANT_SELECT: "테넌트 선택",
  TENANT: "테넌트",
  DASHBOARD: "대시보드",
  USER_SERVICE: "유저 서비스",
  USERS: "유저",
  SPACE_SERVICE: "공간 서비스",
  GROUND: "그라운드",
  GROUNDS: "그라운드 리스트",
  GROUND_EDIT: "그라운드 편집",
  CATEGORIES: "카테고리 리스트",
  CATEGORY: "카테고리",
  CATEGORY_EDIT: "카테고리 편집",
  CATEGORY_ADD: "카테고리 추가",
  GROUPS: "그룹 리스트",
  GROUP: "그룹",
  GROUP_EDIT: "그룹 편집",
} as const;
