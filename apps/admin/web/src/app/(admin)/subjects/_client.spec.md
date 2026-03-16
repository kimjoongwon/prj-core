# _client client 기획서

> 생성일: 2026-03-16
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/subjects/_client.tsx

## 역할

브라우저에서만 Subject 목록 CSR 렌더링을 수행하고, querystring 기반 검색/분류 필터 상태와 generated suspense 훅을 결합해 목록 그리드를 그립니다.

## 공개 계약

| 항목           | 설명                           |
| -------------- | ------------------------------ |
| default export | Subject 목록 클라이언트 진입점 |

## 의존성

| 모듈                         | 용도                                 |
| ---------------------------- | ------------------------------------ |
| `@cocrepo/api/core/subjects` | Subject 목록 suspense 조회           |
| `@cocrepo/ui`                | `Page`, `MetaDataGrid`, surface 조합 |

## 비즈니스 메모

- `page.tsx` wrapper 뒤에서만 로드되어 dev on-demand compile 동안 blank main 상태를 피합니다.
- 검색어와 분류 필터는 `useMetaDataGridQueryStates`로 URL과 동기화합니다.
- `PageSurface`와 `SectionSurface` ownership은 이 파일이 직접 소유합니다.

## 변경 이력

| 일자       | 내용                                                                                          | 작성자 |
| ---------- | --------------------------------------------------------------------------------------------- | ------ |
| 2026-03-16 | `dynamic(Promise.resolve(...))` 패턴을 대체하는 Subject 목록 browser-only `_client.tsx`를 신규 추가 | codex  |
