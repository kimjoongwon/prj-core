# _client client 기획서

> 생성일: 2026-03-16
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/users/_client.tsx

## 역할

브라우저에서만 이용자 목록 CSR 렌더링을 수행하고, querystring 기반 검색 상태와 generated user query를 결합해 통계 카드와 목록 그리드를 그립니다.

## 공개 계약

| 항목           | 설명                           |
| -------------- | ------------------------------ |
| default export | 이용자 목록 클라이언트 진입점 |

## 의존성

| 모듈                      | 용도                                      |
| ------------------------- | ----------------------------------------- |
| `@cocrepo/api/core/users` | 이용자 목록/통계 조회                     |
| `@cocrepo/ui`             | `Page`, `StatsCard`, `MetaDataGrid` 조합 |

## 비즈니스 메모

- `page.tsx` wrapper 뒤에서만 로드되어 dev on-demand compile 동안 blank main 상태를 피합니다.
- 검색 상태는 `useMetaDataGridQueryStates`로 URL과 동기화합니다.
- 통계 카드와 목록 `SectionSurface` ownership은 이 파일이 직접 소유합니다.

## 변경 이력

| 일자       | 내용                                                                                           | 작성자 |
| ---------- | ---------------------------------------------------------------------------------------------- | ------ |
| 2026-03-16 | `dynamic(Promise.resolve(...))` 패턴을 대체하는 이용자 목록 browser-only `_client.tsx`를 신규 추가 | codex  |
