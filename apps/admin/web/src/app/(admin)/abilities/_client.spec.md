# _client client 기획서

> 생성일: 2026-03-16
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/abilities/_client.tsx

## 역할

브라우저에서만 권한 목록 CSR 렌더링을 수행하고, generated suspense 훅과 로컬 필터 상태를 결합해 필터/목록/상세 이동 UI를 그립니다.

## 공개 계약

| 항목           | 설명                         |
| -------------- | ---------------------------- |
| default export | 권한 목록 클라이언트 진입점 |

## 의존성

| 모듈                           | 용도                             |
| ------------------------------ | -------------------------------- |
| `@cocrepo/api/core/abilities`  | 권한 목록 suspense 조회          |
| `@cocrepo/api/core/actions`    | Action 필터 옵션 조회            |
| `@cocrepo/api/core/subjects`   | Subject 필터 옵션 조회           |
| `@cocrepo/ui`                  | `Page`, `Section`, surface 조합  |
| `next/navigation`, `next/link` | 권한 등록/상세 이동              |

## 비즈니스 메모

- `page.tsx` wrapper 뒤에서만 로드되어 dev on-demand compile 동안 blank main 상태를 피합니다.
- `PageSurface`와 각 `SectionSurface` ownership은 이 파일이 직접 소유합니다.
- 필터 상태는 로컬 observable로 유지하며 상세 이동은 row click과 상세 버튼을 함께 지원합니다.

## 변경 이력

| 일자       | 내용                                                                                          | 작성자 |
| ---------- | --------------------------------------------------------------------------------------------- | ------ |
| 2026-03-16 | `dynamic(Promise.resolve(...))` 패턴을 대체하는 권한 목록 browser-only `_client.tsx`를 신규 추가 | codex  |
