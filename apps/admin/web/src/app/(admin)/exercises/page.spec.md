# 운동 종목 목록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/exercises`

## 사용자 시나리오

1. 관리자가 현재 Space에서 사용 가능한 운동 종목 목록을 조회한다
2. 이름으로 검색하거나, Space 범위 필터(현재 Space / 상위 포함)로 좁혀본다
3. 운동명을 클릭하여 상세 페이지로 이동한다
4. "운동 등록" 버튼을 클릭하여 등록 페이지로 이동한다
5. 현재 Space 소유 운동에 한해 삭제 액션을 실행한다 (상위 Space 운동은 읽기 전용)

## 도메인 관계

```
Exercise (운동 실체)
  └─ Task (도메인 브릿지, 1:1)
       └─ Activity[] (루틴 내 배치)
```

Exercise 등록 시 서버에서 Task도 동시 생성됩니다.
UI에서는 Exercise 정보만 노출합니다.

## L3: 기능 목록

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| F-001 | 운동 목록 조회 | 높음 | 페이지네이션, 정렬, 검색 지원 |
| F-002 | 운동 검색 | 높음 | 이름 기반 실시간 검색 (debounce 300ms) |
| F-003 | Space 범위 필터 | 중간 | 현재 Space / 상위 Space 포함 전환 |
| F-004 | 운동 상세 이동 | 높음 | 이름 클릭 시 상세 페이지 이동 |
| F-005 | 운동 등록 이동 | 높음 | "운동 등록" 버튼 클릭 시 등록 페이지 이동 |
| F-006 | 운동 삭제 | 중간 | 현재 Space 소유 운동만 삭제 가능. 루틴에서 사용 중이면 삭제 불가 |

## L4: 화면 구조

### 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page(mode="content")` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageHeader` | title="운동 종목", description="루틴에서 사용할 운동 콘텐츠를 관리합니다.", actions에 "운동 등록" 버튼 |
| 데이터 그리드 | `Section(mode="content")` > `MetaDataGrid` | 운동 목록 표시, 검색/필터/페이지네이션 지원 |

### 컬럼 정의

| 필드 | 라벨 | 크기 | 정렬 | 셀 컴포넌트 |
|------|------|------|------|-------------|
| name | 운동명 | 200 | - | 링크 스타일 (클릭 시 상세 이동) |
| duration | 지속시간 | 100 | center | `DurationCell` (초 → 분:초 변환, 예: "1분 30초") |
| count | 반복횟수 | 80 | center | `{count}회` |
| description | 설명 | 250 | - | 텍스트 요약 (최대 2줄, overflow hidden) |
| spaceName | Space | 150 | - | 기본 (현재 Space 소유 시 Badge 강조) |
| createdAt | 등록일 | 150 | - | `DateTimeCell` |
| actions | 액션 | 80 | center | 삭제 아이콘 (현재 Space 소유 운동만 표시) |

### 필터/검색 정의

| 위치 | 타입 | ID | 설명 |
|------|------|-----|------|
| 좌측 | search | search | 운동명으로 검색 (debounce 300ms) |
| 좌측 | select | spaceScope | Space 범위: "현재 Space만" / "상위 Space 포함" (기본: 상위 포함) |

### 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 조회 중 | MetaDataGrid 로딩 상태 |
| 데이터 표시 | 목록 로드 완료 | 페이지네이션 포함 운동 목록 |
| 빈 데이터 | 조회 결과 없음 | "등록된 운동 종목이 없습니다." + "운동 등록" 버튼 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetExercisesQuery({ take: 20, skip: 0 })` | 서버 사이드에서 첫 페이지 프리페칭 |
| 클라이언트 | `useGetExercises({ take, skip, search, spaceScope })` | 서버 사이드 필터링+페이지네이션 |
| 삭제 시 | `useDeleteExercise()` | 운동 삭제 (현재 Space 소유 운동만) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 운동명 클릭 | `/exercises/{exerciseId}` 상세 페이지로 이동 |
| "운동 등록" 버튼 클릭 | `/exercises/new` 등록 페이지로 이동 |
| 삭제 아이콘 클릭 | 확인 모달 표시 → 확인 시 `deleteExercise` 호출, 성공 시 목록 캐시 무효화 |
| 검색/필터 변경 | URL 쿼리 파라미터 업데이트로 API 재호출 |

## 비즈니스 규칙

- **Space 계층 공유**: `spaceScope=INCLUDE_ANCESTORS` 시 현재 Space + 모든 상위 Space의 운동 조회
- **읽기 전용 보호**: 상위 Space 소유 운동은 삭제 아이콘 미표시 (현재 Space의 `spaceId`와 비교)
- **삭제 제약**: 루틴 Activity에서 사용 중인 운동은 삭제 불가 (서버에서 409 에러 반환, 에러 토스트 표시)
- **지속시간 표시**: 초 단위 정수를 "분:초" 형식으로 변환 (60초 → "1분 0초", 90초 → "1분 30초")

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [ ] _client.tsx (클라이언트 컴포넌트, observer 래핑)
- [ ] _prefetch.ts (prefetchGetExercisesQuery 호출)
- [ ] hooks/useHandlers.ts (삭제 핸들러)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더를 `Page(mode="content") + PageHeader` 패턴으로 정리 | codex |
