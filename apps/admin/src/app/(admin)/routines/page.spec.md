# 루틴 목록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/routines`

## 사용자 시나리오

1. 관리자가 현재 Space에서 사용 가능한 루틴 목록을 조회한다
2. 이름/라벨로 검색하거나, Space 범위 필터(현재 Space / 상위 포함)로 좁혀본다
3. 루틴 이름을 클릭하여 상세 페이지로 이동한다
4. "루틴 등록" 버튼을 클릭하여 등록 페이지로 이동한다
5. 현재 Space 소유 루틴에 한해 삭제 액션을 실행한다 (상위 Space 루틴은 읽기 전용)

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `PageSurface` | title="루틴", description="운동 루틴(커리큘럼)을 관리합니다.", actions에 "루틴 등록" 버튼 |
| 데이터 그리드 | `SectionSurface` > `MetaDataGrid` | 루틴 목록 표시, 검색/필터/페이지네이션 지원 |

## 컬럼 정의

| 필드 | 라벨 | 크기 | 정렬 | 셀 컴포넌트 |
|------|------|------|------|-------------|
| name | 루틴명 | 200 | - | 링크 스타일 (클릭 시 상세 이동) |
| label | 라벨 | 150 | - | 기본 |
| spaceName | Space | 150 | - | 기본 (현재 Space 소유 시 Badge 강조) |
| activitiesCount | 운동 수 | 80 | center | 숫자 |
| programsCount | 프로그램 수 | 100 | center | 숫자 (0이면 비활성 스타일) |
| createdAt | 등록일 | 150 | - | `DateTimeCell` |
| actions | 액션 | 80 | center | 삭제 아이콘 (현재 Space 소유 루틴만 표시) |

## 필터/검색 정의

| 위치 | 타입 | ID | 설명 |
|------|------|-----|------|
| 좌측 | search | search | 루틴명, 라벨로 검색 (debounce 300ms) |
| 좌측 | select | spaceScope | Space 범위: "현재 Space만" / "상위 Space 포함" (기본: 상위 포함) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 조회 중 | MetaDataGrid 로딩 상태 |
| 데이터 표시 | 목록 로드 완료 | 페이지네이션 포함 루틴 목록 |
| 빈 데이터 | 조회 결과 없음 | "등록된 루틴이 없습니다." + "루틴 등록" 버튼 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetRoutinesQuery({ take, skip })` | 서버 사이드에서 첫 페이지 프리페칭 |
| 클라이언트 | `useGetRoutines({ take, skip, search, spaceScope })` | 서버 사이드 필터링+페이지네이션, spaceScope에 따라 상위 Space 루틴 포함 |
| 삭제 시 | `useDeleteRoutine({ routineId })` | 루틴 삭제 (현재 Space 소유 루틴만) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 루틴명 클릭 | `/routines/{routineId}` 상세 페이지로 이동 |
| "루틴 등록" 버튼 클릭 | `/routines/new` 등록 페이지로 이동 |
| 삭제 아이콘 클릭 | 확인 모달 표시 → 확인 시 `deleteRoutine` 호출, 성공 시 목록 캐시 무효화 |
| 검색/필터 변경 | URL 쿼리 파라미터 업데이트로 API 재호출 |

## 비즈니스 규칙

- **Space 계층 공유**: `spaceScope=INCLUDE_ANCESTORS` 시 현재 Space + 모든 상위 Space의 루틴 조회
- **읽기 전용 보호**: 상위 Space 소유 루틴은 삭제 아이콘 미표시 (현재 Space의 `spaceId`와 비교)
- **삭제 제약**: 프로그램에서 사용 중인 루틴은 삭제 불가 (`programsCount > 0` 경고 표시)

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [ ] _client.tsx (클라이언트 컴포넌트, observer 래핑)
- [ ] _prefetch.ts (prefetchGetRoutinesQuery 호출)
- [ ] hooks/useHandlers.ts (삭제 핸들러)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | 직접 기획 |
