# 이용자 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/users`

## 사용자 시나리오

1. 관리자가 `/users` 경로에 진입하면 SSR Prefetch를 통해 이용자 목록이 미리 로드된다.
2. 상단에 통계 카드(전체/활성/비활성 이용자 수)가 표시된다.
3. 검색창에서 이름, 이메일, 전화번호로 통합 검색할 수 있다 (300ms 디바운스).
4. 테이블에서 이용자 목록을 확인하고 페이지네이션으로 이동할 수 있다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `PageSurface` | title="이용자 목록", description="시스템에 등록된 이용자를 조회합니다." |
| 통계 영역 | `SectionSurface` > `StatsCard` x3 | 전체(Users)/활성(UserCheck)/비활성(UserMinus) 이용자 수 |
| 목록 영역 | `SectionSurface` > `MetaDataGrid` | 이용자 목록 테이블 |

## 컬럼 정의

| 필드 | 라벨 | 너비 | Cell 컴포넌트 | 비고 |
|------|------|------|---------------|------|
| name | 이름 | 150 | 기본 텍스트 | isRequired |
| email | 이메일 | 200 | 기본 텍스트 | |
| phone | 전화번호 | 150 | `PhoneCell` | 포맷팅 표시 |
| role | 역할 | 120 | `UserRoleCell` | tenants 기반, 중앙 정렬 |
| status | 상태 | 100 | `StatusChipCell` | removedAt 기반, 중앙 정렬 |
| createdAt | 가입일 | 150 | `DateTimeCell` | |

## 검색 설정

| ID | 타입 | placeholder | 옵션 |
|----|------|-------------|------|
| search | search | "이름, 이메일, 전화번호로 검색..." | debounceMs: 300 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | 데이터 조회 중 | MetaDataGrid 스켈레톤 |
| 데이터 표시 | 이용자 목록 표시 | 통계 카드 + 테이블 |
| 빈 목록 | 조회 결과 없음 | "조회된 이용자가 없습니다." 메시지 |
| 검색 결과 없음 | 검색 후 결과 없음 | 빈 목록 메시지 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR Prefetch | `prefetchGetUsersQuery({ take: 20, skip: 0 })` | 서버 사이드 프리페칭 (쿠키 포워딩) |
| 클라이언트 렌더 | `useGetUsers({ take, skip, name })` | nuqs URL 상태 기반 조회 |

## 응답 데이터 구조

```typescript
// response?.data: UserDto[] - 이용자 목록
// response?.meta: { total, skip, take, totalPages } - 페이지네이션
// response?.stats: { total, active, inactive } - 통계 정보
```

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 검색어 입력 | `queryStates.search` 업데이트 (300ms 디바운스) → API 재호출 |
| 페이지 변경 | `queryStates.skip` 업데이트 → API 재호출 |
| 페이지 크기 변경 | `queryStates.take` 업데이트 → API 재호출 |

## URL 상태 관리

`useMetaDataGridQueryStates` 훅을 사용하여 nuqs 기반으로 URL 쿼리 파라미터를 관리합니다.

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| take | number | 20 | 페이지당 항목 수 |
| skip | number | 0 | 건너뛸 항목 수 |
| search | string | - | 검색어 (name 파라미터로 API에 전달) |

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [x] _client.tsx (클라이언트 컴포넌트, MetaDataGrid + StatsCard)
- [x] _prefetch.ts (prefetchGetUsersQuery)

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
