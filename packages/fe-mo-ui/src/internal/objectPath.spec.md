# objectPath 내부 유틸 기획서

> 생성일: 2026-04-13
> 타입: internal
> 위치: packages/fe-mo-ui/src/internal/objectPath.ts

## 역할

모바일 control MobX wrapper가 `state`와 `path`를 기준으로 값을 읽고 쓸 수 있도록 dot path 접근 유틸을 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `getPathValue` | dot path 기준으로 state 값을 읽고 fallback을 반환합니다. |
| `setPathValue` | dot path 기준으로 state 값을 갱신하고 중간 객체를 보강합니다. |

## 비고

- `packages/fe-ui`의 MobX form-field 패턴을 RN wrapper에 맞게 옮기기 위한 내부 유틸입니다.
- 배열 인덱스 표기(`items[0].name`)를 dot path로 정규화해서 처리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 control MobX wrapper 지원을 위한 path 유틸 신규 추가 | codex |
