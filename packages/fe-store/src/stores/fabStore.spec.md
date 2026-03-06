# FABStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/fabStore.ts

## 역할

모바일 FAB(Floating Action Button) 상태를 관리하는 MobX Store. FAB 열림/닫힘 상태, 액션 목록 관리, 권한 기반 액션 필터링, 액션 실행(페이지 이동 또는 모달 열기)을 담당합니다.

## 타입 정의

| 타입명 | 종류 | 설명 |
|--------|------|------|
| `FABConfig` | interface | `@cocrepo/type`의 FABStore 생성자 설정 계약 |
| `FABAbilityChecker` | function type | `@cocrepo/type`의 FAB 권한 체크 함수 계약 |
| `ModalOpenHandler` | function type | `@cocrepo/type`의 모달 열기 핸들러 계약 |
| `FABStoreOptions` | interface | `@cocrepo/type`의 FABStore 생성 옵션 계약 |

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| _isOpen | `boolean` | `false` | FAB 열림 상태 |
| _actions | `FABAction[]` (readonly) | config.actions | 전체 FAB 액션 목록 |
| _abilityChecker | `FABAbilityChecker \| null` | options?.abilityChecker ?? `null` | 권한 체크 함수 |
| _navigator | `Navigator \| null` | options?.navigator ?? `null` | 페이지 이동 담당 Navigator |
| _onModalOpen | `ModalOpenHandler \| null` | options?.onModalOpen ?? `null` | 모달 열기 핸들러 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| isOpen | `boolean` | `_isOpen` 반환 |
| allActions | `FABAction[]` | `_actions` 전체 반환 (필터링 없음) |
| visibleActions | `FABAction[]` | `_abilityChecker`가 있으면 `"view"` 액션으로 필터링, 없으면 전체 반환 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setNavigator` | `navigator: Navigator` | Navigator 인스턴스 설정 |
| `setAbilityChecker` | `checker: FABAbilityChecker` | 권한 체크 함수 설정 |
| `setModalOpenHandler` | `handler: ModalOpenHandler` | 모달 열기 핸들러 설정 |
| `toggle` | 없음 | FAB 열림/닫힘 토글 |
| `open` | 없음 | FAB 열기 |
| `close` | 없음 | FAB 닫기 |
| `executeAction` | `actionId: string` | 액션 실행: 권한 체크 -> href가 있으면 Navigator.push로 이동, modal이 있으면 onModalOpen 호출, 실행 후 FAB 닫기 |
| `findActionById` | `actionId: string` | ID로 FABAction 찾기 |

## 비동기 액션 (Flow)

없음

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| Navigator | 페이지 이동 시 `push` 메서드 호출 |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| fabStore | FABStore |

## 외부 의존성

| 패키지 | 사용 |
|--------|------|
| `@cocrepo/type` | `FABAction`, `FABConfig`, `FABStoreOptions`, `FABAbilityChecker`, `ModalOpenHandler`, `NavigatorLike` 타입 |

## 주요 동작 흐름

### 액션 실행 (executeAction)
1. actionId로 액션 찾기
2. 권한 체크 (`_abilityChecker`로 `"view"` 확인)
3. `action.href`가 있고 Navigator가 있으면 -> `navigator.push(href)` 후 FAB 닫기
4. `action.modal`이 있고 `_onModalOpen`이 있으면 -> `onModalOpen(modalId)` 후 FAB 닫기

## 사용 예시

```typescript
const fabStore = new FABStore({
  actions: [
    { id: 'todayReservation', label: '오늘 예약', icon: 'CalendarCheck', subject: 'quickAction:todayReservation', href: '/reservations/today' },
    { id: 'quickReservation', label: '빠른 예약', icon: 'CalendarPlus', subject: 'quickAction:quickReservation', modal: 'quickReservation' },
  ],
});

fabStore.toggle();                        // FAB 열기/닫기
fabStore.executeAction('todayReservation'); // 액션 실행
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | FABConfig/FABStoreOptions/FABAbilityChecker/ModalOpenHandler를 @cocrepo/type 공용 계약 import로 전환 | codex |
| 2026-03-06 | FAB 권한 체크 타입을 AppAction/AppSubject로 강화하고 체크 액션을 view(소문자)로 통일 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
