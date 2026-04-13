# useMobxField 내부 유틸 기획서

> 생성일: 2026-04-13
> 타입: internal
> 위치: packages/fe-mo-ui/src/internal/useMobxField.ts

## 역할

모바일 control wrapper가 MobX observable state와 HeroUI Native control value를 양방향으로 동기화할 수 있도록 내부 form-field hook을 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `MobxProps` | 모바일 control wrapper가 받는 공통 `state`/`path` 계약입니다. |
| `useMobxField` | local observable value와 외부 state path를 `reaction`으로 동기화합니다. |

## 비고

- `packages/fe-ui`의 `useFormField` 패턴을 RN 패키지 내부에서 독립적으로 사용할 수 있게 축약 구현합니다.
- `@cocrepo/hook`의 Next.js 의존을 끌고 오지 않도록 `@cocrepo/mo-ui` 내부 유틸로 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 control MobX 바인딩을 위한 내부 hook 신규 추가 | codex |
