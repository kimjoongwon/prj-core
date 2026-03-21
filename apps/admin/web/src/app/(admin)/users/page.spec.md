# 이용자 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/users`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌────────────────────────────────────────────────────────────────────┐
│  이용자 목록                                                        │
│  시스템에 등록된 이용자를 조회합니다.                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ 전체 이용자                     │ │ 활성 이용자 │ │ 비활성 이용자 │  │
│  │ 활성 115명 · 비활성 13명        │ │ 운영 중 계정│ │ 비활성 계정   │  │
│  │                                │ │     115    │ │      13    │  │
│  │              128               │ └────────────┘ └────────────┘  │
│  └────────────────────────────────┘                                 │
│                                                                    │
│  회원 디렉터리                                      [총 128명]     │
│  등록된 이용자를 빠르게 검색하고 상태를 확인할 수 있습니다.        │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  🔍 이름, 이메일, 전화번호로 검색...                     │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 이름     │ 이메일            │ 전화번호      │ 역할  │ 상태  │ │  │
│  ├──────────┼───────────────────┼───────────────┼───────┼───────┤ │  │
│  │ 홍길동   │ hong@example.com  │ 010-1234-5678 │ MANAGE│ 활성  │ │  │
│  ├──────────┼───────────────────┼───────────────┼───────┼───────┤ │  │
│  │ 김철수   │ kim@example.com   │ 010-9876-5432 │ VIEW  │ 활성  │ │  │
│  ├──────────┼───────────────────┼───────────────┼───────┼───────┤ │  │
│  │ 이영희   │ lee@example.com   │ 010-5555-1234 │ VIEW  │ 비활성│ │  │
│  └──────────┴───────────────────┴───────────────┴───────┴───────┘ │  │
│                                                                    │
│  < 이전   1  2  3  ...  다음 >          20개씩 보기 ▼              │
└────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 `/users` 경로에 진입하면 CSR로 이용자 목록을 조회한다.
2. 상단 요약 영역에서 전체/활성/비활성 이용자 수를 위계감 있게 확인한다.
3. 디렉터리 헤더에서 총 인원 수를 확인하고, 검색창에서 이름/이메일/전화번호를 통합 검색한다 (300ms 디바운스).
4. 테이블에서 이용자 목록을 확인하고 페이지네이션으로 이동할 수 있다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/users/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/users/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageTitleBar`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `users/layout.tsx`가 제공하는 `SectionSurface` 내부에 콘텐츠를 마운트합니다.
- 이 페이지는 route-level skeleton을 다시 만들지 않고, 통계 블록과 디렉터리/grid 콘텐츠만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- `Suspense` fallback은 `page.tsx` 내부에서 콘텐츠 로딩 상태만 처리합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 통계 블록 | `StatsCard` x3 | 총 이용자 리드 카드 + 활성/비활성 보조 카드 위계 |
| 디렉터리 헤더 | page-local header + `Chip` | 총 인원 표시와 설명 텍스트 |
| 검색 영역 | page-local custom `Input` | `search` query param 기반, 300ms 디바운스 |
| 목록 영역 | `MetaDataGrid` | 이용자 목록, 페이지네이션, 빈 상태 메시지 |

## 컬럼 정의

| 필드      | 라벨     | 너비 | Cell 컴포넌트    | 비고                      |
| --------- | -------- | ---- | ---------------- | ------------------------- |
| name      | 이름     | 150  | page-local cell  | 강조 타이포, isRequired   |
| email     | 이메일   | 200  | page-local cell  | 보조 텍스트, truncate     |
| phone     | 전화번호 | 150  | page-local + `PhoneCell` | tabular 숫자 스타일 |
| role      | 역할     | 120  | `UserRoleCell`   | tenants 기반, 중앙 정렬   |
| status    | 상태     | 100  | `StatusChipCell` | removedAt 기반, 중앙 정렬 |
| createdAt | 가입일   | 150  | page-local + `DateTimeCell` | 보조 정보 톤 |

## 검색 설정

| ID     | 타입   | placeholder                        | 옵션            |
| ------ | ------ | ---------------------------------- | --------------- |
| search | custom | "이름, 이메일, 전화번호로 검색..." | `search` query param, debounceMs: 300 |

## 페이지 상태

| 상태           | 설명              | UI                                  |
| -------------- | ----------------- | ----------------------------------- |
| 로딩           | 초기 조회 중      | route layout이 제공한 본문 surface 내부 중앙 로딩 스피너 |
| 데이터 표시    | 이용자 목록 표시  | 통계 카드 + 테이블                  |
| 빈 목록        | 조회 결과 없음    | "조회된 이용자가 없습니다." 메시지  |
| 검색 결과 없음 | 검색 후 결과 없음 | 빈 목록 메시지                      |

## API 호출

| 시점            | API                                 | 설명                        |
| --------------- | ----------------------------------- | --------------------------- |
| 클라이언트 렌더 | `useGetUsers({ take, skip, name })` | `take`/`skip` + `search` URL 상태 기반 CSR 조회 |

## 응답 데이터 구조

```typescript
// response?.data: UserDto[] - 이용자 목록
// response?.meta: { total, skip, take, totalPages } - 페이지네이션
// response?.stats: { total, active, inactive } - 통계 정보
```

## 이벤트 핸들러

| 이벤트           | 동작                                                        |
| ---------------- | ----------------------------------------------------------- |
| 검색어 입력      | `search` URL 파라미터 업데이트 (300ms 디바운스) → API 재호출 |
| 페이지 변경      | `queryStates.skip` 업데이트 → API 재호출                    |
| 페이지 크기 변경 | `queryStates.take` 업데이트 → API 재호출                    |

## URL 상태 관리

페이지네이션은 `useMetaDataGridQueryStates`, 검색어는 page-local `useQueryState("search")`로 관리합니다.

- `page.tsx`가 직접 CSR 콘텐츠를 렌더링하며, `Suspense` boundary 안에서 목록 훅과 URL 상태 훅을 실행합니다.
- 검색 입력은 시각적 존재감을 높이기 위해 custom input으로 렌더링하지만, URL 파라미터 계약은 유지합니다.

| 파라미터 | 타입   | 기본값 | 설명                                |
| -------- | ------ | ------ | ----------------------------------- |
| take     | number | 20     | 페이지당 항목 수                    |
| skip     | number | 0      | 건너뛸 항목 수                      |
| search   | string | -      | 검색어 (name 파라미터로 API에 전달) |

## 구현 체크리스트

- [x] `layout.tsx`가 route-level `Page/PageSurface/Section/Surface` skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `page.tsx`에서 `useMetaDataGridQueryStates`, `useGetUsers`, `MetaDataGrid`, `StatsCard` 실행
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음 (SSR 예외 아님)
- [x] named slot 없음 (`children`만 사용)

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자       | 내용                                                                                                              | 작성자               |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | -------------------- |
| 2026-03-21 | `users/layout.tsx`가 route skeleton을 소유하도록 재구성하고 `page.tsx`를 content-only CSR 단일 파일로 통합       | codex                |
| 2026-03-21 | 이용자 목록을 요약 카드 + 디렉터리 헤더 구조로 재구성하고 page-local custom search input 및 강화된 셀 스타일을 반영 | codex                |
| 2026-03-15 | 상대 `/api` 호출의 prerender 오류를 피하기 위해 users 목록 `page.tsx`를 browser-only no-SSR boundary로 전환       | codex                |
| 2026-03-15 | Next.js build 요구에 맞춰 `useMetaDataGridQueryStates` 실행을 page-level `Suspense` boundary 안쪽으로 이동        | codex                |
| 2026-03-15 | users 목록 spec에 `PageSurface`/`SectionSurface` ownership과 elevation 결정을 명시                                | codex                |
| 2026-03-15 | `UsersPageContent` 분리를 제거하고 단일 `UsersPage`에서 `useGetUsers`와 초기 로딩 스피너를 직접 처리하도록 단순화 | codex                |
| 2026-03-15 | `Suspense` fallback에서 최종 화면 복제를 제거하고 최소 중앙 로딩 스피너만 렌더링하도록 단순화                     | codex                |
| 2026-03-15 | 이용자 목록 화면에 `Page + PageTitleBar` 구조는 유지하고 `PageSurface/SectionSurface` 표현 레이어를 추가          | codex                |
| 2026-03-15 | 이용자 목록을 CSR + Suspense 단일 `page.tsx` 패턴으로 전환하고 `_client.tsx`, `_prefetch.ts`를 제거               | codex                |
| 2026-03-16 | `dynamic(Promise.resolve(...))` no-SSR 경계를 `_client.tsx` 실제 모듈 import wrapper로 교체해 dev blank 렌더를 방지 | codex |
| 2026-02-18 | 초기 생성 (역기획)                                                                                                | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가                                                                                                  | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리                                                             | codex                |
| 2026-03-03 | `_client.tsx` 반복 헤더를 `Page + PageTitleBar` 패턴으로 정리                                                     | codex                |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리)                                                 | codex                |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영                                                                | codex                |
