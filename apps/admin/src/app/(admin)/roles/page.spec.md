# 역할 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles`

## 사용자 시나리오

1. 관리자가 시스템에 등록된 역할 목록을 조회한다.
2. 각 역할의 식별자, 표시명, 설명, 상태, 생성일을 테이블 형태로 확인한다.
3. 시스템 역할(FULL_ACCESS, MANAGE, VIEW)에는 "시스템" 칩이 표시된다.
4. "역할 추가" 버튼을 클릭하여 등록 페이지로 이동한다.
5. 각 역할의 "상세" 버튼을 클릭하여 상세 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | PageSurface | title="역할 목록", description="시스템에 등록된 역할을 관리합니다." |
| 헤더 액션 | Button (Link) | "역할 추가" 버튼, `/roles/new`로 이동, Plus 아이콘 |
| 안내 메시지 | div (warning) | 시스템 역할 수정/삭제 불가 안내 |
| 역할 테이블 | SectionSurface > table | 컬럼: 역할 식별자, 표시명, 설명, 상태, 생성일, 액션 |
| 테이블 푸터 | div | 총 N건 표시 |

## 테이블 컬럼 정의

| 필드 | 라벨 | 크기 | 셀 렌더링 |
|------|------|------|-----------|
| name | 역할 식별자 | 180px | font-mono + isSystem일 때 "시스템" Chip |
| displayName | 표시명 | 150px | 기본 텍스트 |
| description | 설명 | 250px | text-default-500, 1줄 말줄임 |
| status | 상태 | 100px, center | StatusChipCell (removedAt 기반) |
| createdAt | 생성일 | 150px | DateTimeCell |
| (액션) | 액션 | 100px, center | "상세" Button (Link) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 호출 중 | "로딩 중..." 텍스트 |
| 빈 목록 | roles.length === 0 | Shield 아이콘 + "등록된 역할이 없습니다." |
| 데이터 표시 | 역할 목록 존재 | 테이블 + 총 건수 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR Prefetch | `prefetchGetRolesQuery` | 역할 목록 프리페치 |
| 클라이언트 | `useGetRoles()` | 역할 목록 조회 (GET /api/v1/roles) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "역할 추가" 버튼 클릭 | `/roles/new`로 Link 이동 |
| "상세" 버튼 클릭 | `/roles/${role.id}`로 Link 이동 |

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, SSR Prefetch + HydrationBoundary)
- [x] _client.tsx (클라이언트 컴포넌트, observer)
- [x] _prefetch.ts (prefetchGetRolesQuery)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
