# 01. 개요 (역기획)

> 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.
> 생성일: 2026-01-31

## 시스템 컨텍스트 (L0)

| 항목 | 내용 |
|------|------|
| 시스템명 | 네비게이션 시스템 |
| 설명 | 어드민 애플리케이션의 메뉴 및 네비게이션을 관리하는 시스템. 데스크톱/모바일 반응형 레이아웃과 권한 기반 메뉴 필터링을 지원한다. |
| 분석 도메인 | Navigation |
| 버전 | v7.0 |

### 시스템 범위

```
+------------------------------------------+
|           Navigation System              |
|------------------------------------------|
| - 메뉴 구조 관리 (2depth + 3depth 탭)     |
| - 권한 기반 메뉴 필터링                   |
| - 반응형 레이아웃 (Desktop/Mobile)        |
| - 페이지 라우팅 연동                      |
+------------------------------------------+
        |               |               |
   Desktop UI      Mobile UI       Store Layer
   (Sidebar)     (BottomTab/FAB)   (MobX)
```

---

## 사용자 (L1 Actor)

| ID | 이름 | 설명 | 권한 소스 |
|----|------|------|----------|
| L1-ACT-001 | 슈퍼 관리자 | 모든 메뉴에 접근 가능한 최상위 관리자 | SUPER_ADMIN role |
| L1-ACT-002 | 일반 관리자 | 권한에 따라 특정 메뉴에만 접근 가능한 관리자 | ADMIN role + Abilities |
| L1-ACT-003 | 스태프 | 제한된 메뉴에만 접근 가능한 운영 스태프 | STAFF role + Abilities |

### 권한 체계

```typescript
// 권한 체크 함수 타입
type AbilityChecker = (action: string, subject: string) => boolean;

// Subject 네이밍 규칙
// - menu:{entity} - 1depth 메뉴
// - menu:{entity}:{sub} - 2depth 메뉴
// 예: "menu:users", "menu:users:list"
```

---

## 사용자 목표 (L2 Goal)

| ID | Actor | 목표 | 설명 |
|----|-------|------|------|
| L2-GOL-001 | 모든 관리자 | 빠른 메뉴 탐색 | 원하는 기능 메뉴로 빠르게 이동할 수 있어야 한다 |
| L2-GOL-002 | 모든 관리자 | 현재 위치 파악 | 현재 어느 메뉴에 있는지 시각적으로 알 수 있어야 한다 |
| L2-GOL-003 | 모든 관리자 | 권한 내 메뉴만 표시 | 접근 권한이 없는 메뉴는 표시되지 않아야 한다 |
| L2-GOL-004 | 모바일 사용자 | 터치 친화적 탐색 | 모바일에서도 편리하게 메뉴를 탐색할 수 있어야 한다 |
| L2-GOL-005 | 모바일 사용자 | 빠른 액션 실행 | 자주 사용하는 기능을 빠르게 실행할 수 있어야 한다 (FAB) |

---

## 핵심 구성 요소

### 메뉴 계층 구조

```
1depth (Main Menu)
  └─ 2depth (Sub Menu)
       └─ 3depth (Tab) - v7.0 신규
```

### 디바이스별 UI 구성

| 디바이스 | 레이아웃 구성 |
|----------|-------------|
| Desktop (>= md) | Sidebar (항상 펼침) + Header + Main Content |
| Mobile (< md) | Header + Main Content + BottomTab + FAB + SubMenuList |

---

## 소스 파일 요약

| 레이어 | 파일 | 역할 |
|--------|------|------|
| 타입 | `packages/type/src/navigation.ts` | NavItemConfig, TabConfig, FABAction 인터페이스 |
| Store | `packages/store/src/stores/navigationStore.ts` | 메뉴 상태 관리 |
| Store | `packages/store/src/stores/navItem.ts` | 메뉴 아이템 클래스 |
| Store | `packages/store/src/stores/navigator.ts` | 라우터 래퍼 |
| Store | `packages/store/src/stores/bottomTabStore.ts` | 모바일 하단 탭 상태 |
| Store | `packages/store/src/stores/fabStore.ts` | FAB 상태 관리 |
| Widget | `packages/ui/src/components/widget/NavTreePanel/` | 트리 UI |
| Feature | `packages/ui/src/components/feature/SideNav/` | Sidebar 연결 |
| Feature | `packages/ui/src/components/feature/Nav/` | Header 네비게이션 |
| Feature | `packages/ui/src/components/feature/SubNav/` | 2depth 네비게이션 |
| Feature | `packages/ui/src/components/feature/BottomTab/` | 모바일 하단 탭 |
| Feature | `packages/ui/src/components/feature/SubMenuList/` | 모바일 서브메뉴 |
| Layout | `packages/ui/src/components/ui/layouts/Admin/` | 레이아웃 컴포넌트들 |
| 상수 | `packages/constant/src/routing/admin-menu.ts` | 메뉴 설정 데이터 |
