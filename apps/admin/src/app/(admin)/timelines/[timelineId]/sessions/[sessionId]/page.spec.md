# 세션 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/[timelineId]/sessions/[sessionId]`

## 사용자 시나리오

1. 관리자가 타임라인 상세에서 세션명을 클릭하여 세션 상세 페이지에 진입한다
2. 세션의 기본 정보(이름, 유형, 일정, 설명)를 확인한다
3. 이 세션에 연결된 Program 목록을 조회한다 (나중에 Program 기획 시 활용)
4. "수정" 버튼을 클릭하여 세션 정보를 수정한다
5. "삭제" 버튼을 클릭하여 세션을 삭제하고 타임라인 상세로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `PageSurface` | title="{세션명}", description="{타임라인명}", actions에 "수정", "삭제" 버튼 |
| 세션 기본 정보 | `SectionSurface` | title="기본 정보" - 이름, 유형, 일정, 설명 표시 |
| 프로그램 목록 | `SectionSurface` | title="프로그램 목록" - 연결된 Program 표시 (TODO: Program 기획 후 구현) |

## 세션 기본 정보 필드

| 필드 | 라벨 | 설명 |
|------|------|------|
| name | 세션명 | 세션 이름 |
| type | 유형 | `SessionTypeBadge` 표시 (ONE_TIME/ONE_TIME_RANGE/RECURRING) |
| startDateTime | 시작 일시 | 없으면 "-" (RECURRING 옵션) |
| endDateTime | 종료 일시 | ONE_TIME_RANGE/RECURRING에서만 표시 |
| recurringDayOfWeek | 반복 요일 | RECURRING에서만 표시 (MON→월요일 등 한글 변환) |
| repeatCycleType | 반복 주기 | RECURRING에서만 표시 (WEEKLY→주간, MONTHLY→월간) |
| description | 설명 | 없으면 "-" 표시 |
| timeline.name | 타임라인 | 상위 타임라인 이름 (링크로 `/timelines/{timelineId}` 이동) |
| createdAt | 등록일 | DateTimeCell 형식 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetSessionQuery({ timelineId, sessionId })` | 세션 상세 정보 |
| 세션 삭제 | `useDeleteSession()` | 세션 삭제 후 타임라인 상세로 이동 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "수정" 버튼 클릭 | `/timelines/{timelineId}/sessions/{sessionId}/edit` 수정 페이지로 이동 |
| "삭제" 버튼 클릭 | 확인 모달 → `deleteSession` 호출 → 성공 시 `/timelines/{timelineId}` 이동 |
| 타임라인명 링크 클릭 | `/timelines/{timelineId}` 상위 타임라인 상세로 이동 |

## 비즈니스 규칙

- **세션 삭제 제약**: 프로그램이 연결된 세션은 삭제 불가 (`programsCount > 0` 시 경고)
- **유형별 표시**: 세션 유형에 따라 일정 관련 필드 조건부 표시

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [ ] _client.tsx (클라이언트 컴포넌트, observer 래핑)
- [ ] _prefetch.ts (prefetchGetSessionQuery 호출)
- [ ] hooks/useHandlers.ts (세션 삭제 핸들러)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-L3L4-planner |
