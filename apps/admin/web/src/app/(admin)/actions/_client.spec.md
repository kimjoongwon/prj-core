# _client client 기획서

> 생성일: 2026-03-16
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/actions/_client.tsx

## 역할

브라우저에서만 Action 목록 CSR 로딩을 수행하고, 검색 querystring 상태와 Action 목록 조회를 결합해 목록 렌더링과 등록 버튼 이동을 담당합니다.

## 공개 계약

| 항목           | 설명                         |
| -------------- | ---------------------------- |
| default export | Action 목록 클라이언트 진입점 |

## 의존성

| 모듈                        | 용도                                        |
| --------------------------- | ------------------------------------------- |
| `@cocrepo/api/core/actions` | Action 목록 suspense 조회                   |
| `@cocrepo/ui`               | `Page`, `PageSurface`, `SectionSurface`, `MetaDataGrid` |
| `next/navigation`           | 등록 페이지 이동                            |

## 비즈니스 메모

- `dynamic(() => import("./_client"), { ssr: false })` wrapper 뒤에서만 렌더링되어 dev route on-demand compile 동안 blank main 상태를 피합니다.
- 목록 `group` 필터는 API 쿼리 파라미터로 전달하고, `search`는 클라이언트 필터로 적용합니다.
- 본문 surface ownership은 이 파일이 직접 소유합니다.

## Surface ownership

- `PageSurface`는 Action 검색/등록 헤더와 목록 전체를 raised 본문으로 묶습니다.
- `SectionSurface`는 `MetaDataGrid`를 감싸는 elevated 레이어이며 `padding="none"`으로 그리드와 밀착합니다.

## 변경 이력

| 일자       | 내용                                                                                          | 작성자 |
| ---------- | --------------------------------------------------------------------------------------------- | ------ |
| 2026-03-16 | `dynamic(Promise.resolve(...))` 패턴을 대체하는 Action 목록 browser-only `_client.tsx`를 신규 추가 | codex  |
