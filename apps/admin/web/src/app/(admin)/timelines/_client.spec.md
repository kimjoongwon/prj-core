# _client client 기획서

> 생성일: 2026-03-16
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/timelines/_client.tsx

## 역할

브라우저에서만 timelines 목록 화면의 CSR 렌더링과 실제 데이터 조회를 수행하고, no-SSR wrapper 뒤에서 본문 surface ownership을 담당합니다.

## 공개 계약

| 항목           | 설명 |
| -------------- | ---- |
| default export | timelines 목록 클라이언트 진입점 |

## 비즈니스 메모

- `page.tsx` wrapper는 route 진입만 담당하고, 실제 query/state/render 조합은 이 파일이 소유합니다.
- dev on-demand compile 동안 빈 `main`만 남는 현상을 피하기 위해 실제 모듈 import 기반 no-SSR 경계 뒤에서 렌더링합니다.
- `PageSurface`와 하위 `SectionSurface` ownership은 이 파일이 직접 소유합니다.

## 변경 이력

| 일자       | 내용 | 작성자 |
| ---------- | ---- | ------ |
| 2026-03-16 | `dynamic(Promise.resolve(...))` 패턴을 대체하는 timelines 목록 browser-only `_client.tsx`를 신규 추가 | codex |
