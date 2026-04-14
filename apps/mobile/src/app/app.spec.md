# mobile app 기획서

> 생성일: 2026-04-14
> 타입: app
> 위치: apps/mobile/src/app/app.spec.md

## 역할

모바일 앱 route/app 수준의 계약과 테스트 ownership 을 정의합니다.

## route 계약

| route | owner spec | 설명 |
|------|------------|------|
| `/` | `apps/mobile/src/app/index.spec.md` | wrapper inventory home |
| `/_layout` | `apps/mobile/src/app/_layout.spec.md` | Expo Router root shell |

## 테스트 전략

- route unit test 는 route 옆 `*.test.tsx` 를 owner file 로 사용합니다.
- app launch E2E 는 `apps/mobile/e2e/**/*.e2e.js` 를 owner file 로 사용합니다.
- Stage 1 에서 test case 를 spec 에 기록하고, Stage 2/3/4 에서 구현/실행 상태를 동기화합니다.

### 자동 검증

- `pnpm --filter @cocrepo/mo-ui test`
- `pnpm --filter @cocrepo/mo-ui type-check`
- `pnpm --filter mobile-app test`
- `pnpm --filter mobile-app type-check`
- `pnpm --filter mobile-app test:e2e`
- `pnpm --filter mobile-app doctor`

### E2E 시나리오

| ID | 대상 | 설명 |
|----|------|------|
| `MO-E2E-001` | `/` | 앱 launch 후 인벤토리 홈 제목과 Button Showcase 섹션이 보여야 합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 app 수준 route/test ownership 과 Detox smoke 시나리오를 추가 | codex |
