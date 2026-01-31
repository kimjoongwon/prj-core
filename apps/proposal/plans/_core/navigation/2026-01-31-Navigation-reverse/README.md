# Navigation 시스템 역기획

> 생성일: 2026-01-31
> 생성자: req-reverse-engineer

## 개요

이 폴더는 기존 네비게이션 시스템 코드를 분석하여 L0-L10 형식으로 역생성한 기획서입니다.

## 분석 대상

- **Store Layer**: NavigationStore, BottomTabStore, FABStore, NavItem, Navigator
- **UI Layer**: AdminLayout, SideNav, Nav, SubNav, BottomTab, SubMenuList, NavTreePanel
- **상수**: ADMIN_NAV_ITEMS, ADMIN_FAB_ACTIONS, BOTTOM_TAB_IDS

## 문서 목록

| 파일 | 레이어 | 내용 |
|------|--------|------|
| 01-overview.md | L0-L2 | 시스템 컨텍스트, 사용자, 목표 |
| 02-structure.md | L3-L4 | 기능, 화면, 메뉴 구조 |
| 03-interactions.md | L5-L6 | 인터랙션 액션, API 의존성 |
| 04-ui-details.md | L7-L8 | 데이터 모델, UI 컴포넌트 |
| 05-technical-design.md | L9-L10 | 비즈니스 로직, 테스트 케이스 |
| requirement-graph.json | 전체 | 노드/엣지 그래프 |

## 주요 특징

### v7.0 신규 기능
- 3depth 탭 지원 (TabConfig)
- 모바일 레이아웃 (BottomTab, SubMenuList, FAB)
- 11개 1depth 메뉴 (세션, 시설, 관리자, 역할/권한 분리)

### 권한 체계
- Subject 네이밍: `menu:{entity}` / `menu:{entity}:{sub}`
- AbilityChecker를 통한 권한 필터링

### 컴포넌트 계층
```
Widget (NavTreePanel) → Feature (SideNav) → Layout (AdminLayout)
```

## 소스 파일 경로

```
packages/
├── type/src/navigation.ts
├── constant/src/routing/admin-menu.ts
├── store/src/stores/
│   ├── navItem.ts
│   ├── navigator.ts
│   ├── navigationStore.ts
│   ├── bottomTabStore.ts
│   └── fabStore.ts
└── ui/src/components/
    ├── widget/NavTreePanel/
    ├── feature/SideNav/
    ├── feature/Nav/
    ├── feature/SubNav/
    ├── feature/BottomTab/
    ├── feature/SubMenuList/
    └── ui/layouts/Admin/
```
