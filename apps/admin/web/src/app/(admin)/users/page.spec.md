# 이용자 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/users`

## 사용자 시나리오

1. 관리자가 이용자 통계 카드를 통해 전체/활성/비활성 현황을 확인합니다.
2. 이름, 이메일, 전화번호로 이용자 목록을 검색합니다.
3. 페이지네이션과 페이지 크기 조절로 목록을 탐색합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/users/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/users/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`, 통계 카드, 디렉터리 헤더, `Surface` 안의 `MetaDataGrid`만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `feature/master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- `Suspense` fallback은 콘텐츠 로딩 상태만 처리합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` | 이용자 목록 안내 |
| 통계 블록 | `StatsCard` x3 | 전체/활성/비활성 이용자 요약 |
| 디렉터리 헤더 | page-local header + `Chip` | 총 인원과 설명 텍스트 |
| 목록 영역 | `Surface` + `MetaDataGrid` | 검색 입력과 이용자 목록 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetUsers({ take, skip, name })` | 이용자 목록과 stats 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 검색어 입력 | `search` URL 파라미터 갱신 후 재조회 |
| 페이지 변경 | `skip` 상태 갱신 후 재조회 |
| 페이지 크기 변경 | `take` 상태 갱신 후 재조회 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 없음
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 이용자 목록을 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | 이용자 목록 spec을 generic route layout + content-only page 구조로 재작성 | codex |
