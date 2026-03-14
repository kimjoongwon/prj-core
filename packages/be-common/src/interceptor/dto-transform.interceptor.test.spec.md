# dto-transform.interceptor.spec.ts 기획서

> 생성일: 2026-03-14
> 타입: test
> 위치: packages/be-common/src/interceptor/dto-transform.interceptor.spec.ts

## 역할

`DtoTransformInterceptor`가 plain `{ data, meta }` 응답에서 `data`만 DTO 배열로 변환하고 메타데이터 구조는 그대로 유지하는지 회귀 검증합니다.

## 검증 포인트

| 항목 | 설명 |
|------|------|
| plain wrapper 처리 | `wrapResponse` 없이 반환된 `{ data, meta }` 응답을 지원해야 합니다. |
| 배열 DTO 변환 | `DTO_IS_ARRAY_METADATA=true`일 때 `data` 배열 항목이 DTO 인스턴스로 변환되어야 합니다. |
| 메타 보존 | `meta` 필드는 변형 없이 유지되어야 합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | audit log 응답 회귀를 막기 위한 interceptor 단위 테스트 추가 | codex |
