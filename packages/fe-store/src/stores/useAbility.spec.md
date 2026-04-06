# useAbility 훅 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store (React Hook)
> 위치: packages/fe-store/src/stores/useAbility.ts

## 역할

CASL 권한 확인을 위한 React Hook 모음. `AbilityStore`를 래핑하여 컴포넌트에서 간편하게 권한 확인을 수행할 수 있는 여러 훅을 제공합니다.

## 제공 훅 목록

### useAbility

| 항목 | 설명 |
|------|------|
| 역할 | AbilityStore의 전체 기능을 컴포넌트에서 사용할 수 있도록 제공 |
| 의존 | `useStore()` -> `store.abilityStore` |
| 에러 | abilityStore가 없으면 `"AbilityStore가 초기화되지 않았습니다"` 에러 |

**반환값:**

| 속성 | 타입 | 설명 |
|------|------|------|
| ability | `AppAbility` | CASL Ability 인스턴스 |
| rules | `AbilityRule[]` | 현재 적용된 권한 규칙 |
| isLoaded | `boolean` | 권한 로드 완료 여부 |
| hasGlobalAccess | `boolean` | `manage all` 전역 권한 보유 여부 |
| can | `(action, subject, field?) => boolean` | 권한 허용 확인 |
| cannot | `(action, subject, field?) => boolean` | 권한 거부 확인 |
| updateRules | `(rules) => void` | 권한 규칙 업데이트 |
| clearRules | `() => void` | 권한 초기화 |
| getAllowedActions | `(subject) => AppAction[]` | Subject에 대한 허용 액션 목록 |
| getAllowedSubjects | `(action) => AppSubject[]` | Action에 대한 허용 Subject 목록 |
| getAllowedMenus | `() => string[]` | 허용된 메뉴 Subject 목록 (`manage all` 이 있으면 `['all']` sentinel 포함 가능) |

### useCan

| 항목 | 설명 |
|------|------|
| 역할 | 단일 권한 허용 여부 확인 |
| 파라미터 | `action: AppAction, subject: AppSubject, field?: string` |
| 반환 | `boolean` |
| 사용 예시 | `const canReadUser = useCan('read', 'entity:user');` |

### useHasGlobalAccess

| 항목 | 설명 |
|------|------|
| 역할 | `manage all` 전역 권한 여부를 간단히 확인 |
| 반환 | `boolean` |
| 사용 예시 | `const hasGlobalAccess = useHasGlobalAccess();` |

### useCannot

| 항목 | 설명 |
|------|------|
| 역할 | 단일 권한 거부 여부 확인 |
| 파라미터 | `action: AppAction, subject: AppSubject, field?: string` |
| 반환 | `boolean` |
| 사용 예시 | `const cannotDeleteAdmin = useCannot('delete', 'entity:admin');` |

### useMenuPermission

| 항목 | 설명 |
|------|------|
| 역할 | 메뉴 접근 권한 확인 (`view` + `menu:{menuPath}`) |
| 파라미터 | `menuPath: string` |
| 반환 | `boolean` |
| 사용 예시 | `const canAccessDashboard = useMenuPermission('dashboard');` |

### useFeaturePermission

| 항목 | 설명 |
|------|------|
| 역할 | 기능 접근 권한 확인 (`view` + `feature:{featureName}`) |
| 파라미터 | `featureName: string` |
| 반환 | `boolean` |
| 사용 예시 | `const canExport = useFeaturePermission('export');` |

### useEntityPermission

| 항목 | 설명 |
|------|------|
| 역할 | 엔티티 CRUD 권한 확인 (`entity:{entityName}`) |
| 파라미터 | `entityName: string` |
| 반환 | `{ canCreate, canRead, canUpdate, canDelete, canManage }` (모두 boolean) |
| 사용 예시 | `const { canCreate, canDelete } = useEntityPermission('user');` |

### useUiPermission

| 항목 | 설명 |
|------|------|
| 역할 | UI 요소 표시 권한 확인 (`view` + `ui:{uiElement}`) |
| 파라미터 | `uiElement: string` |
| 반환 | `boolean` |
| 사용 예시 | `const canShowExportButton = useUiPermission('button:export');` |

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | `useStore()`로 접근 |
| AbilityStore | `store.abilityStore`에서 권한 확인 메서드 사용 |

## 비고

- `useCallback`과 `useMemo`를 사용하고 있으나, 프로젝트 규칙상 이들은 불필요한 패턴으로 향후 제거 대상일 수 있음
- 각 훅은 AbilityStore의 메서드를 Subject 패턴별로 분리하여 편의성을 제공
- 권한 관련 타입(`AppAction`, `AppSubject`, `AbilityRule`)은 `@cocrepo/type` 공통 타입을 사용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | `hasGlobalAccess` 반환값과 `useHasGlobalAccess` helper를 추가해 전역 권한 판정을 공용화 | codex |
| 2026-03-06 | 규칙 위반 정리: useMemo/useCallback/useIsMounted 제거 및 observer/이벤트 네이밍 규칙 반영 | codex |
| 2026-03-06 | CASL 타입 import 기준을 abilityStore 내부 선언에서 @cocrepo/type 공통 타입으로 전환 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
