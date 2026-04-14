# _layout.test 모바일 테스트 기획서

> 생성일: 2026-04-14
> 타입: unit-test
> 위치: apps/mobile/src/app/_layout.test.tsx

## 역할

루트 layout 이 gesture root, design system provider, header hidden stack 을 함께 구성하는지 검증하는 unit smoke test 입니다.

## 시나리오

| ID | 설명 |
|----|------|
| `MO-UNIT-LAYOUT-001` | 루트 layout 렌더링 시 gesture root 와 provider wrapper 안에서 header hidden stack 이 보여야 합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 루트 layout unit smoke test 신규 추가 | codex |
| 2026-04-14 | React Native Testing Library query API 에 맞춰 accessibility assertion 을 `getByLabelText` 기준으로 보정 | codex |
