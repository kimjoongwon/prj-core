# 운동 종목 목록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/tasks`

## 사용자 시나리오

1. 관리자가 현재 Space에서 사용 가능한 운동 종목 목록을 조회한다
2. 이름으로 검색하거나, Space 범위 필터(현재 Space / 상위 포함)로 좁혀본다
3. 운동명을 클릭하여 상세 페이지로 이동한다
4. "태스크 등록" 버튼을 클릭하여 등록 페이지로 이동한다
5. 삭제 액션을 실행하면 확인 모달을 거쳐 태스크 삭제를 시도한다

## 도메인 관계

```
Exercise (운동 실체)
  └─ Task (도메인 브릿지, 1:1)
       └─ Activity[] (루틴 내 배치)
```

Exercise 등록 시 서버에서 Task도 동시 생성됩니다.
UI에서는 Exercise 정보만 노출합니다.

## L3: 기능 목록

| ID    | 기능             | 우선순위 | 설명                                                           |
| ----- | ---------------- | -------- | -------------------------------------------------------------- |
| F-001 | 운동 목록 조회   | 높음     | 페이지네이션, 정렬, 검색 지원                                  |
| F-002 | 운동 검색        | 높음     | 이름 기반 실시간 검색 (debounce 300ms)                         |
| F-003 | Space 범위 필터  | 중간     | 현재 Space / 상위 Space 포함 전환                              |
| F-004 | 운동 상세 이동   | 높음     | 이름 클릭 시 상세 페이지 이동                                  |
| F-005 | 태스크 등록 이동 | 높음     | "태스크 등록" 버튼 클릭 시 등록 페이지 이동                    |
| F-006 | 운동 삭제        | 중간     | 삭제 확인 후 태스크를 삭제한다. 루틴에서 사용 중이면 삭제 불가 |

## L4: 화면 구조

### 레이아웃 구성

| 영역          | 컴포넌트                   | 설명                                                                                                                |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 페이지 래퍼   | `Page`                     | 페이지 콘텐츠 구조 배치                                                                                             |
| 페이지 헤더   | `PageTitleBar`             | title="태스크 목록", description="시스템에 등록된 태스크와 운동 detail을 관리합니다.", actions에 "태스크 등록" 버튼 |
| 데이터 그리드 | `Section` > `MetaDataGrid` | 운동 목록 표시, 검색/필터/페이지네이션 지원                                                                         |

### Surface / Elevation

| 항목                   | 결정                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| PageSurface owner      | `apps/admin/web/src/app/(admin)/tasks/page.tsx`                        |
| PageSurface 역할       | 태스크 검색/필터와 목록 전체를 raised 본문으로 묶음                    |
| SectionSurface 대상    | 태스크 `MetaDataGrid`                                                  |
| SectionSurface padding | `padding="none"`                                                       |
| 예외                   | 없음. `MetaDataGrid` 슬롯의 검색/필터 배치와 surface 소유권은 분리한다 |

### 컬럼 정의

| 필드        | 라벨     | 크기 | 정렬   | 셀 컴포넌트                                      |
| ----------- | -------- | ---- | ------ | ------------------------------------------------ |
| name        | 운동명   | 200  | -      | 링크 스타일 (클릭 시 상세 이동)                  |
| duration    | 지속시간 | 100  | center | `DurationCell` (초 → 분:초 변환, 예: "1분 30초") |
| count       | 반복횟수 | 80   | center | `{count}회`                                      |
| description | 설명     | 250  | -      | 텍스트 요약 (최대 2줄, overflow hidden)          |
| createdAt   | 등록일   | 150  | -      | `DateTimeCell`                                   |
| actions     | 액션     | 80   | center | 삭제 텍스트 버튼                                 |

### 필터/검색 정의

| 위치 | 타입   | ID         | 설명                                                             |
| ---- | ------ | ---------- | ---------------------------------------------------------------- |
| 좌측 | search | search     | 운동명으로 검색 (debounce 300ms)                                 |
| 좌측 | select | spaceScope | Space 범위: "현재 Space만" / "상위 Space 포함" (기본: 상위 포함) |

### 페이지 상태

| 상태        | 설명               | UI                                             |
| ----------- | ------------------ | ---------------------------------------------- |
| 로딩        | suspense 재조회 중 | `Suspense` fallback에서 MetaDataGrid 로딩 상태 |
| 데이터 표시 | 목록 로드 완료     | 페이지네이션 포함 운동 목록                    |
| 빈 데이터   | 조회 결과 없음     | "등록된 태스크가 없습니다."                    |

## API 호출

| 시점       | API                                                       | 설명                          |
| ---------- | --------------------------------------------------------- | ----------------------------- |
| 클라이언트 | `useGetTasksSuspense({ take, skip, search, spaceScope })` | CSR + Suspense 기반 목록 조회 |
| 삭제 시    | `useDeleteTask()`                                         | 운동 삭제                     |

## 이벤트 핸들러

| 이벤트                  | 동작                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| 운동명 클릭             | `/tasks/{taskId}/exercise` 상세 페이지로 이동                        |
| "태스크 등록" 버튼 클릭 | `/tasks/new` 등록 페이지로 이동                                      |
| 삭제 버튼 클릭          | 확인 모달 표시 → 확인 시 `deleteTask` 호출, 성공 시 목록 캐시 무효화 |
| 검색/필터 변경          | URL 쿼리 파라미터 업데이트로 API 재호출                              |

## E2E 메모

- CRUD sidecar E2E는 HeroUI 접근성 이름 기준(`운동명*`, `분`, `초`, `반복횟수*`) selector를 사용합니다.
- 운동명 fixture는 브라우저 입력 안정성을 위해 ASCII 문자열을 사용합니다.
- 등록 폼 상호작용 전에는 hydration 재생성 안정화를 위해 짧은 대기 후 입력합니다.
- 상세 화면 이름 검증은 중복 텍스트 strict mode를 피하기 위해 heading locator를 우선 사용합니다.

## 비즈니스 규칙

- **Space 계층 공유**: `spaceScope=INCLUDE_ANCESTORS` 시 현재 Space + 모든 상위 Space의 운동 조회
- **삭제 제약**: 루틴 Activity에서 사용 중인 운동은 삭제 불가 (서버에서 409 에러 반환, 에러 토스트 표시)
- **지속시간 표시**: 초 단위 정수를 "분:초" 형식으로 변환 (60초 → "1분 0초", 90초 → "1분 30초")

## 특이사항

- CSR + Suspense 기본 패턴을 유지하되, 상대 `/api` 호출의 prerender 오류를 피하기 위해 `page.tsx`가 browser-only no-SSR boundary를 제공합니다.
- API 응답의 `TaskDto`를 `TaskExerciseRow`로 변환해 `exercise` 하위 정보를 평탄화해서 표시
- 삭제 확인 모달은 페이지 로컬 observable state(`deleteTarget`)로 관리
- 삭제 성공 시 `getGetTasksQueryKey()` 기준으로 목록 캐시를 무효화

## 구현 체크리스트

- [x] page.tsx (browser-only no-SSR boundary + 내부 페이지 컴포넌트에서 `useMetaDataGridQueryStates`, `useGetTasksSuspense` 실행)
- [x] `_client.tsx` 없음 (CSR 기본 패턴)
- [x] `_prefetch.ts` 없음 (SSR 예외 아님)
- [x] 삭제 확인 모달과 캐시 무효화는 `page.tsx`에서 직접 처리

## Surface / Elevation

| 항목                   | 결정                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| PageSurface owner      | `apps/admin/web/src/app/(admin)/tasks/page.tsx`                                                                           |
| ------                 | ------                                                                                                                    |
| PageSurface 역할       | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다.                                                                   |
| SectionSurface 대상    | 본문 섹션, 폼, 표, 로딩/빈 상태 블록                                                                                      |
| SectionSurface padding | DataGrid/테이블은 필요 시 `padding="none"`, 그 외 기본 패딩                                                               |
| 예외                   | 없음. `Layout`/`Page`/`Section` 슬롯 배치만으로는 surface가 생기지 않으므로 page 또는 `_client.tsx`가 owner를 명시합니다. |

## 변경 이력

| 일자       | 내용                                                                                                         | 작성자             |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ------------------ |
| 2026-03-15 | 상대 `/api` 호출의 prerender 오류를 피하기 위해 태스크 목록 `page.tsx`를 browser-only no-SSR boundary로 전환 | codex              |
| 2026-03-15 | Next.js build 요구에 맞춰 `useMetaDataGridQueryStates` 실행을 page-level `Suspense` boundary 안쪽으로 이동   | codex              |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화                                                                  | codex              |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화                             | codex              |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화                                                                      | codex              |
| 2026-03-15 | 태스크 목록 본문에 `PageSurface > SectionSurface(padding="none")` ownership을 추가                           | codex              |
| 2026-03-15 | 태스크 목록을 CSR + Suspense 단일 `page.tsx` 패턴으로 전환하고 `_client.tsx`, `_prefetch.ts`를 제거          | codex              |
| 2026-03-14 | Task CRUD E2E 상세 화면 이름 검증을 heading locator 기준으로 안정화                                          | codex              |
| 2026-03-14 | CRUD sidecar E2E 입력 selector, ASCII fixture, hydration 안정화 대기 계약을 HeroUI 기준으로 명시             | codex              |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환                                                    | codex              |
| 2026-02-19 | 초기 생성                                                                                                    | req-screen-planner |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리                                                        | codex              |
| 2026-03-03 | `_client.tsx` 반복 헤더를 `Page + PageTitleBar` 패턴으로 정리                                                | codex              |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리)                                            | codex              |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영                                                           | codex              |
