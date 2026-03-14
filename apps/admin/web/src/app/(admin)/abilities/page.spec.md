# 권한 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/abilities`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  권한 목록                                           [+ 권한 추가]      │
│  시스템에 등록된 CASL 권한을 관리합니다.                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  필터                                                     │
│ ┌─────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ 🔍 권한 이름 검색│ │ Subject   ▼ │ │ Action    ▼ │ │ 유형      ▼ │ │
│ └─────────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
│                                                     [필터 초기화]        │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  목록                                                     │
│ ┌──────────────┬──────────┬──────────┬───────┬──────┬──────┬──────────┐ │
│ │ 권한 이름    │ Subject  │ Action   │ 유형  │ 필드 │ 조건 │ 생성일   │ │
│ ├──────────────┼──────────┼──────────┼───────┼──────┼──────┼──────────┤ │
│ │ read:post    │ Post     │ read     │[허용] │ 전체 │[없음]│ 2026-01- │ │
│ │ delete:user  │ User     │ delete   │[거부] │  3   │[있음]│ 2026-01- │ │
│ │ manage:role  │ Role     │ manage   │[허용] │ 전체 │[없음]│ 2026-01- │ │
│ └──────────────┴──────────┴──────────┴───────┴──────┴──────┴──────────┘ │
│  총 3건                                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 시스템에 등록된 CASL 권한 목록을 조회한다.
2. 권한 이름으로 검색하여 특정 권한을 찾는다.
3. Subject, Action, 유형(허용/거부) 필터를 사용하여 권한을 필터링한다.
4. 필터를 초기화하여 전체 목록을 다시 조회한다.
5. 특정 권한 행을 클릭하여 상세 페이지로 이동한다.
6. "권한 추가" 버튼을 클릭하여 등록 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="권한 목록", description="시스템에 등록된 CASL 권한을 관리합니다." |
| 액션 영역 | `Button (Link)` | "권한 추가" 버튼, `/abilities/new`로 이동, Plus 아이콘 |
| 필터 섹션 | `Section + PageTitleBar("필터")` | 4열 그리드 필터 (검색, Subject, Action, 유형) + 필터 초기화 버튼 |
| 목록 섹션 | `Section + PageTitleBar("권한 목록")` | HTML 테이블 기반 목록 (커스텀 table, MetaDataGrid 미사용) |

## 컬럼 정의

| 필드 | 라벨 | 크기 | 정렬 | 셀 렌더링 |
|------|------|------|------|----------|
| name | 권한 이름 | 180px | 좌측 | font-mono 텍스트 |
| subject | Subject | 150px | 좌측 | displayName 또는 name |
| action | Action | 120px | 좌측 | displayName 또는 name |
| inverted | 유형 | 100px | 중앙 | Chip (허용=success, 거부=danger) |
| fields | 필드 수 | 80px | 중앙 | 0이면 "전체", 아니면 개수 |
| conditions | 조건 | 80px | 중앙 | Chip (있음=primary, 없음=default) |
| createdAt | 생성일 | 150px | 좌측 | DateTimeCell |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 중 | API 응답 대기 | Spinner + "로딩 중..." 텍스트 |
| 빈 목록 | 등록된 권한 없음 | Key 아이콘 + "등록된 권한이 없습니다." |
| 필터 결과 없음 | 검색 조건 불일치 | Key 아이콘 + "검색 조건에 맞는 권한이 없습니다." |
| 데이터 있음 | 정상 표시 | 테이블 + 총 N건 표시 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 페이지 진입 | `GET /api/v1/abilities` (useQuery 커스텀 훅) | 전체 권한 목록 조회 |
| 페이지 진입 | `GET /api/v1/subjects` (useGetSubjects) | Subject 필터 옵션 로드 |
| 페이지 진입 | `GET /api/v1/actions` (useGetActions) | Action 필터 옵션 로드 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickRow(abilityId) | `/abilities/${abilityId}` 상세 페이지로 router.push |
| onClickResetFilters | searchTerm, selectedSubjectId, selectedActionId, selectedInverted 모두 초기화 |
| 검색어 입력 | state.searchTerm 업데이트 (클라이언트 사이드 필터링) |
| Subject 선택 | state.selectedSubjectId 업데이트 (클라이언트 사이드 필터링) |
| Action 선택 | state.selectedActionId 업데이트 (클라이언트 사이드 필터링) |
| 유형 선택 | state.selectedInverted 업데이트 (클라이언트 사이드 필터링) |

## 로컬 상태 (useLocalObservable)

| 필드 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| searchTerm | string | "" | 이름 검색어 |
| selectedSubjectId | string | "" | Subject 필터 |
| selectedActionId | string | "" | Action 필터 |
| selectedInverted | string | "" | 유형 필터 ("" / "true" / "false") |

## 참고사항

- Orval 생성 훅 대신 `customInstance`를 사용한 임시 `useGetAllAbilities` 커스텀 훅 사용 중
- 필터링은 모두 클라이언트 사이드에서 처리
- `_prefetch.ts` 파일 없음 (prefetch 없이 진행)

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트)
- [x] _client.tsx (클라이언트 컴포넌트)
- [ ] _prefetch.ts (데이터 프리페치) - 미구현

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Playwright E2E가 `networkidle` 대신 heading/대상 요소 가시성을 기준으로 페이지 준비를 판정하도록 안정화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더를 `PageTitleBar(level=1/2)` 패턴으로 전환 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
