# objectPath.test 내부 테스트 기획서

> 생성일: 2026-04-14
> 타입: unit-test
> 위치: packages/fe-mo-ui/src/internal/objectPath.test.ts

## 역할

`objectPath` 내부 유틸의 dot path read/write 계약이 유지되는지 검증하는 unit test 입니다.

## 시나리오

| ID | 설명 |
|----|------|
| `MO-UNIT-OBJECTPATH-001` | 중첩 dot path 를 읽고 fallback 을 반환해야 합니다. |
| `MO-UNIT-OBJECTPATH-002` | 배열 인덱스 경로를 정규화해 중간 구조를 생성하며 값을 써야 합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | objectPath unit test 신규 추가 | codex |
