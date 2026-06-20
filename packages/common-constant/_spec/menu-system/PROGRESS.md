# 메뉴 시스템 역기획 진행 상황

## 기본 정보

| 항목 | 내용 |
|------|------|
| 프로젝트 | prj-core |
| 앱 | admin-web |
| 기능 | MenuSystem (메뉴 시스템) |
| 유형 | 역기획 (기존 코드 분석) |
| 생성일 | 2026-01-31 |

---

## 완료된 작업

### Stage: 역기획 분석

- [x] Explore 에이전트로 메뉴 시스템 코드 분석 (2026-01-31)
  - 분석 대상: 18개 핵심 파일
  - 아키텍처 문서화 완료

- [x] L0-L10 역기획서 작성 (2026-01-31)
  - 생성: 내부 기획 경로에 PLAN.md 작성

---

## 분석된 파일 목록

### 상수/설정
- `packages/common-constant/src/routing/admin-menu.ts`
- `packages/common-type/src/navigation.ts`

### Store
- `packages/fe-store/src/stores/navItem.ts`
- `packages/fe-store/src/stores/navigationStore.ts`
- `packages/fe-store/src/stores/bottomTabStore.ts`
- `packages/fe-store/src/stores/fabStore.ts`
- `packages/fe-store/src/stores/rootStore.ts`
- `packages/fe-store/src/stores/persistStore.ts`
- `packages/fe-store/src/stores/abilityStore.ts`
- `packages/fe-store/src/providers/createAppStoreProvider.tsx`

### UI 컴포넌트
- `packages/fe-ui/src/display/layout/Admin/AdminLayout.tsx`
- `packages/fe-ui/src/display/layout/Admin/AdminSidebar.tsx`
- `packages/fe-ui/src/display/layout/Admin/AdminBottomTab.tsx`
- `packages/fe-ui/src/display/layout/Admin/AdminFAB.tsx`
- `packages/fe-ui/src/widget/NavTreePanel/NavTreePanel.tsx`
- `packages/fe-ui/src/feature/SideNav/SideNav.tsx`
- `packages/fe-ui/src/feature/SubNav/SubNav.tsx`

### 앱
- `apps/admin/web/src/stores/AppStoreProvider.tsx`
- `apps/admin/web/src/app/layout.tsx`

---

## 주요 발견 사항

### 아키텍처 특징

1. **계층화된 설계**: 상수 → 타입 → Store → UI → 앱
2. **MobX 반응성**: observer로 세분화된 관찰
3. **CASL 권한 통합**: Store 레벨에서 필터링
4. **반응형 UI**: 데스크톱(Sidebar) / 모바일(BottomTab + FAB)

### v7.0 신규 기능

- 3depth 탭 지원 (`NavItemConfig.tabs`)
- 모바일 하단 탭 (`BottomTabStore`)
- 모바일 FAB (`FABStore`)
- "더보기" 탭 패턴

---

## 권장 후속 작업

1. **테스트 커버리지 향상**: FABStore, UI 컴포넌트 테스트 추가
2. **Storybook 문서화**: Widget 컴포넌트 스토리 작성
3. **성능 프로파일링**: 대규모 메뉴 구조 최적화 검증
