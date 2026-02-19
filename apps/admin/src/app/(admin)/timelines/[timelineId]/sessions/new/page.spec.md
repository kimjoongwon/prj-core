# 세션 등록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/[timelineId]/sessions/new`

## 사용자 시나리오

1. 관리자가 타임라인 상세 페이지에서 "세션 등록" 버튼을 클릭한다
2. 세션 이름을 입력하고 세션 유형(ONE_TIME, ONE_TIME_RANGE, RECURRING)을 선택한다
3. 선택한 유형에 따라 날짜/시간 입력 필드가 동적으로 변경된다
4. 선택적으로 설명을 입력한다
5. "등록" 버튼을 클릭하면 세션이 현재 타임라인에 등록된다
6. 성공 시 세션 상세 페이지(`/timelines/[timelineId]/sessions/[sessionId]`)로 이동한다
7. "취소" 버튼 클릭 시 타임라인 상세 페이지로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `PageSurface` | title="세션 등록", description="{타임라인명}에 세션을 등록합니다.", actions에 "취소" 버튼 |
| 기본 정보 폼 | `SectionSurface` | title="기본 정보" - 이름, 유형, 설명 입력 |
| 일정 설정 폼 | `SectionSurface` | title="일정 설정" - 유형에 따라 동적 표시 |

## 폼 필드 정의

### 기본 정보 섹션

| 필드 | 라벨 | 타입 | 필수 | 검증 규칙 | 설명 |
|------|------|------|------|-----------|------|
| name | 세션명 | text | 필수 | 1~100자 | 예: "월요일 오전 요가 클래스" |
| type | 세션 유형 | select | 필수 | ONE_TIME, ONE_TIME_RANGE, RECURRING | 유형 선택에 따라 일정 섹션 변경 |
| description | 설명 | textarea | 선택 | 최대 500자 | 세션 부가 설명 |

### 일정 설정 섹션 - 유형별 분기

#### ONE_TIME (일회성 특강)

| 필드 | 라벨 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| startDateTime | 일시 | datetime | 필수 | 특강 일시 (단일 시점) |

#### ONE_TIME_RANGE (기간형 집중 프로그램)

| 필드 | 라벨 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| startDateTime | 시작 일시 | datetime | 필수 | 집중 프로그램 시작 |
| endDateTime | 종료 일시 | datetime | 필수 | 집중 프로그램 종료 (시작 이후여야 함) |

#### RECURRING (정기 반복 클래스)

| 필드 | 라벨 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| recurringDayOfWeek | 반복 요일 | select | 필수 | MON~SUN 중 선택 |
| repeatCycleType | 반복 주기 | select | 필수 | WEEKLY(주간), MONTHLY(월간) |
| startDateTime | 시작 일시 | datetime | 선택 | 반복 시작 기준 일시 (선택) |
| endDateTime | 종료 일시 | datetime | 선택 | 반복 종료 기준 일시 (선택) |

## 유형별 설명 안내 텍스트

| 유형 | 안내 텍스트 |
|------|------------|
| ONE_TIME | "특정 일시에 한 번만 진행되는 수업입니다." |
| ONE_TIME_RANGE | "특정 기간 동안 집중적으로 진행되는 프로그램입니다." |
| RECURRING | "매주 또는 매월 반복되는 정기 수업입니다." |

## 액션 버튼

| 버튼 | 위치 | 동작 |
|------|------|------|
| 등록 | 폼 하단 우측 | 유효성 검사 후 API 호출, 성공 시 세션 상세 페이지로 이동 |
| 취소 | 페이지 헤더 우측 | 타임라인 상세 페이지(`/timelines/{timelineId}`)로 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetTimelineQuery({ timelineId })` | 상위 타임라인 정보 (breadcrumb/설명용) |
| 등록 버튼 클릭 | `useCreateSession()` | 세션 생성 (timelineId 자동 포함) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 유형 선택 변경 | 일정 설정 섹션 필드 동적 변경 (이전 입력값 초기화) |
| 등록 버튼 클릭 | 폼 유효성 검사 → `createSession` API 호출 → 성공 시 `/timelines/{timelineId}/sessions/{newId}` 이동 |
| 취소 버튼 클릭 | `/timelines/{timelineId}` 상세로 이동 |

## 비즈니스 규칙

- **timelineId 자동 포함**: URL 파라미터의 timelineId가 세션 생성 시 자동으로 연결
- **날짜 유효성**: ONE_TIME_RANGE에서 endDateTime은 startDateTime 이후여야 함
- **유형 변경 시 초기화**: 유형 변경 시 이전 유형의 날짜/요일 입력값 초기화
- **RECURRING의 날짜**: startDateTime, endDateTime은 선택사항으로 반복 범위를 한정할 때 사용

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [ ] _client.tsx (클라이언트 컴포넌트, observer 래핑)
- [ ] _prefetch.ts (prefetchGetTimelineQuery 호출)
- [ ] hooks/useHandlers.ts (등록 핸들러, 유형 변경 핸들러)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-L3L4-planner |
