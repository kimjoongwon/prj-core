# _client client 기획서

> 생성일: 2026-03-16
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/roles/_client.tsx

## 역할

브라우저에서만 역할 목록 CSR 렌더링을 수행하고, 시스템 역할 안내 배너와 generated suspense 기반 역할 목록 테이블을 함께 렌더링합니다.

## 공개 계약

| 항목           | 설명                         |
| -------------- | ---------------------------- |
| default export | 역할 목록 클라이언트 진입점 |

## 의존성

| 모듈                      | 용도                            |
| ------------------------- | ------------------------------- |
| `@cocrepo/api/core/roles` | 역할 목록 suspense 조회         |
| `@cocrepo/ui`             | `Page`, `Section`, surface 조합 |
| `next/link`               | 역할 등록/상세 이동             |

## 비즈니스 메모

- `page.tsx` wrapper 뒤에서만 로드되어 dev on-demand compile 동안 blank main 상태를 피합니다.
- 경고 배너와 테이블 `SectionSurface` ownership은 이 파일이 직접 소유합니다.
- 시스템 역할은 테이블 셀에서도 `시스템` Chip으로 표시합니다.

## 변경 이력

| 일자       | 내용                                                                                       | 작성자 |
| ---------- | ------------------------------------------------------------------------------------------ | ------ |
| 2026-03-16 | `dynamic(Promise.resolve(...))` 패턴을 대체하는 역할 목록 browser-only `_client.tsx`를 신규 추가 | codex  |
