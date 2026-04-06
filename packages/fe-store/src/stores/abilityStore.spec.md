# AbilityStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/abilityStore.ts

## 역할

CASL 기반 권한(Ability) 상태를 관리하는 MobX Store. 서버에서 받아온 권한 규칙(AbilityRule)을 기반으로 CASL Ability 인스턴스를 빌드하고, `can`/`cannot` 메서드로 프론트엔드 전역에서 권한 확인을 수행합니다.

## 타입 정의

| 타입명 | 종류 | 설명 |
|--------|------|------|
| `AppAction` | union type | CASL 액션 (`create`, `read`, `update`, `delete`, `manage`, `view`, `view_masked`, `view_partial`, `view_hidden`, `export`, `import`, `approve`, `reject`, `submit`, `cancel`) |
| `AppSubject` | union type | CASL Subject (`string \| "all"`) - `entity:xxx`, `menu:xxx`, `feature:xxx`, `ui:xxx` 패턴 |
| `AppAbility` | type alias | `MongoAbility<[AppAction, AppSubject]>` |
| `AbilityRule` | interface | Store 표준 권한 데이터 형식 (`action`, `subject`, `fields?`, `conditions?`, `inverted?`, `reason?`) |
| `AbilityApiResponse` | interface | API 응답 변환 입력 타입 (`action`, `subject`, `isActive?` 등) |

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| _ability | `AppAbility` | 빈 Ability | 현재 CASL Ability 인스턴스 |
| _rules | `AbilityRule[]` | `[]` | 현재 적용된 권한 규칙 목록 |
| _isLoaded | `boolean` | `false` | 권한 로드 완료 여부 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| ability | `AppAbility` | `_ability` 반환 |
| rules | `AbilityRule[]` | `_rules` 반환 |
| isLoaded | `boolean` | `_isLoaded` 반환 |
| hasGlobalAccess | `boolean` | `can('manage', 'all')` 결과를 반환 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `can` | `action: AppAction, subject: AppSubject, field?: string` | 해당 권한이 허용되는지 확인하여 boolean 반환 |
| `cannot` | `action: AppAction, subject: AppSubject, field?: string` | 해당 권한이 거부되는지 확인하여 boolean 반환 |
| `updateRules` | `rules: AbilityRule[]` | 권한 규칙 업데이트 후 Ability 재빌드, `_isLoaded`를 true로 설정 |
| `clearRules` | 없음 | 모든 권한 초기화 (로그아웃 시), `_isLoaded`를 false로 설정 |
| `getAllowedActions` | `subject: AppSubject` | 특정 Subject에 대해 허용된 모든 Action 목록 반환 |
| `getAllowedSubjects` | `action: AppAction` | 특정 Action에 대해 허용된 모든 Subject 목록 반환 (규칙 기반 직접 필터링) |
| `getAllowedMenus` | 없음 | `view` 액션에 대해 `menu:` 접두사를 가진 허용 Subject 목록 반환. `manage all` 이 있으면 `['all']` sentinel 반환 |

## 공개 유틸 함수

| 함수 | 파라미터 | 동작 |
|------|----------|------|
| `convertApiToAbilityRules` | `apiResponses: AbilityApiResponse[]` | API 응답을 Store 표준 `AbilityRule[]`로 변환 (`access -> view`, `read:full -> view`, `read:hidden -> view_hidden`, `read:masked:* -> view_masked`) |

## 비동기 액션 (Flow)

없음

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| Store | 생성자 파라미터로 받으나 내부에서 사용하지 않음 (`_plateStore`) |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| abilityStore | AbilityStore |

## 외부 의존성

| 패키지 | 사용 |
|--------|------|
| `@casl/ability` | `AbilityBuilder`, `createMongoAbility`, `MongoAbility` |
| `@cocrepo/type` | `APP_ACTIONS`, `AppAction`, `AppSubject`, `AbilityRule`, `AbilityApiResponse` |

## 사용 예시

```typescript
// 권한 확인
abilityStore.can('read', 'entity:user');       // 엔티티 읽기
abilityStore.can('view', 'menu:dashboard');     // 메뉴 접근
abilityStore.can('create', 'feature:export');   // 기능 사용
abilityStore.cannot('delete', 'entity:admin');  // 삭제 불가 확인

// 권한 규칙 업데이트 (로그인 후)
abilityStore.updateRules(rulesFromServer);

// 권한 초기화 (로그아웃)
abilityStore.clearRules();
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | `manage all` 전역 권한을 `hasGlobalAccess` computed와 `getAllowedMenus()` sentinel 처리로 공용화 | codex |
| 2026-03-06 | CASL 공용 타입을 @cocrepo/type으로 이관하고 API->Rule 변환 유틸(convertApiToAbilityRules) 추가 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
