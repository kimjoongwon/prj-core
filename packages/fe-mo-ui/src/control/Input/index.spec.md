# Input 모바일 control 기획서

> 생성일: 2026-04-08
> 타입: control
> 위치: packages/fe-mo-ui/src/control/Input/index.ts

## 역할

HeroUI Native control을 명시적 wrapper로 감싸고, `state`/`path` 기반 MobX observable state와 값을 동기화하는 모바일용 control 경계를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `Input` | MobX observable state와 동기화되는 mobile control wrapper입니다. |
| `PureInputProps` | upstream control root를 감싼 순수 wrapper props 계약입니다. |
| `InputProps` | `state`와 `path`를 포함한 MobX binding props 계약입니다. |

## 비고

- `packages/fe-ui`의 control 패턴을 참고하되 RN/Expo 입력 계약에 맞게 이벤트 이름과 값 형태를 단순화합니다.
- 필요한 경우 기본 compound 조합을 내부에서 구성해 화면 코드가 더 간단하게 사용할 수 있게 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 명시적 wrapper와 MobX state/path 바인딩 구조로 재구성 | codex |
| 2026-04-08 | HeroUI Native Input 공개 계약 신규 생성 | codex |
