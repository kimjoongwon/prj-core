# mobile index page 기획서

> 생성일: 2026-04-08
> 타입: page
> 위치: apps/mobile/src/app/index.tsx

## 역할

모바일 앱의 기본 엔트리 화면으로, `@cocrepo/mo-ui`에서 만든 control, display, layout wrapper를 카테고리별 인벤토리로 나열하는 소개 페이지를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| hero section | 페이지 제목과 인벤토리 목적을 설명하는 상단 소개 영역 |
| summary cards | Control, Display, Layout 구현 개수를 보여주는 요약 카드 |
| button showcase | `Button` wrapper를 variant, size, feedbackVariant, disabled 상태별로 나열하는 검증 영역 |
| control section | 현재 구현된 control wrapper 이름 목록 |
| display section | 현재 구현된 display wrapper 이름 목록 |
| layout section | 현재 구현된 layout wrapper 이름 목록 |
| note box | 현재는 인벤토리 중심으로 단순화한 상태라는 안내 영역 |

## 규칙

- Expo starter 예제 대신 현재 `@cocrepo/mo-ui` wrapper 목록을 바로 확인할 수 있는 인벤토리 홈 화면을 사용합니다.
- Expo Go에서 안정적으로 열리도록 홈 화면은 React Native 기본 컴포넌트 중심으로 구성합니다.
- 개별 wrapper 검증이 필요한 경우 홈 화면 상단에 단일 컴포넌트 showcase 섹션을 추가해 속성별 렌더링을 먼저 확인합니다.
- 실제 wrapper 데모는 다음 단계에서 안정성이 확인된 순서대로 다시 붙일 수 있도록, 우선 이름 목록과 개수 요약을 정확히 보여주는 데 집중합니다.

## 구현 체크리스트

- [x] `index.tsx`
- [x] `index.test.tsx`
- [x] `apps/mobile/e2e/smoke.e2e.js`에서 홈 화면 smoke 검증

## 테스트 케이스

> 구현 도구: Jest + React Native Testing Library, Detox

### 단위 테스트

| ID | 분류 | Given | When | Then |
|----|------|-------|------|------|
| `MO-UNIT-INDEX-001` | Happy Path | 홈 화면을 렌더링 | 제목/섹션을 조회 | `모바일 컴포넌트 인벤토리`, `Button Showcase`, `현재 상태`가 보입니다. |

### E2E 시나리오

| ID | 설명 |
|----|------|
| `MO-E2E-001` | 앱 launch 후 홈 화면 제목과 Button Showcase 섹션이 보여야 합니다. |

## 자동 검증

- `pnpm --filter mobile-app test`
- `pnpm --filter mobile-app test:e2e`
- `pnpm --filter mobile-app type-check`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 홈 route unit/E2E 테스트 케이스와 구현 체크리스트를 추가 | codex |
| 2026-04-13 | Button wrapper를 variant, size, feedbackVariant, disabled 상태별로 나열하는 showcase 섹션 추가 | codex |
| 2026-04-13 | Expo Go 안정성을 위해 홈 화면을 wrapper 인벤토리 중심의 단순한 목록 화면으로 재정리 | codex |
| 2026-04-13 | 빈 상태 화면을 제거하고 `@cocrepo/mo-ui` showcase 홈 화면으로 전환 | codex |
| 2026-04-08 | Expo starter 홈 화면을 제거하고 빈 상태 화면으로 교체 | codex |
