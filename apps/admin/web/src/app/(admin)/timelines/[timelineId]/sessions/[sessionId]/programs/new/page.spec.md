# 프로그램 등록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/[timelineId]/sessions/[sessionId]/programs/new`

## 사용자 시나리오

1. 관리자가 세션 상세 페이지의 "프로그램 등록" 버튼을 클릭한다
2. 프로그램 등록 폼이 표시된다
3. 루틴 선택 드롭다운에서 현재 Space(및 상위 Space)의 루틴 목록을 확인한다
4. 강사 선택 드롭다운에서 현재 Space의 MANAGE 이상 역할 사용자 목록을 확인한다
5. 필수 항목(프로그램 이름, 루틴, 강사, 정원)을 입력한다
6. 난이도(선택)를 설정한다
7. "등록" 버튼을 클릭하면 프로그램이 생성되고 세션 상세 페이지로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page(mode="content")` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageHeader` | title="프로그램 등록", description="{세션명} · {타임라인명}", actions에 "취소" 버튼 |
| 등록 폼 | `Section(mode="content") + SectionHeader(title="기본 정보")` | 프로그램 정보 입력 폼 |
| 선택 모달 | `ProgramPickerModal` (feature) | 루틴/강사 검색 및 선택 |

## 입력 필드

| 필드 | 라벨 | 유형 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | 프로그램 이름 | TextInput | O | 프로그램 이름 입력 |
| routineId | 루틴 | Select (검색 가능) | O | 현재+상위 Space 루틴 목록에서 선택 |
| instructorId | 강사 | Select (검색 가능) | O | 현재 Space의 MANAGE 이상 역할 사용자 목록에서 선택 |
| capacity | 정원 | NumberInput | O | 최소 1명, 최대 제한 없음 |
| level | 난이도 | Select | X | 초급 / 중급 / 고급 (없음 선택 가능) |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetSessionQuery({ timelineId, sessionId })` | 세션명/타임라인명 표시용 |
| 폼 로드 | `useGetRoutines({ spaceId, includeParent: true })` | 루틴 선택 목록 |
| 폼 로드 | `useGetUsers({ spaceId, minRole: 'MANAGE' })` | 강사 선택 목록 |
| 등록 제출 | `useCreateProgram()` | 프로그램 등록 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "취소" 버튼 클릭 | `/timelines/{timelineId}/sessions/{sessionId}` 세션 상세로 이동 |
| "등록" 버튼 클릭 | 폼 유효성 검증 → `createProgram` 호출 → 성공 시 세션 상세로 이동 |

## 유효성 검증

| 필드 | 검증 규칙 |
|------|----------|
| name | 필수, 최대 100자 |
| routineId | 필수 |
| instructorId | 필수 |
| capacity | 필수, 최소 1 |
| level | 선택 (없으면 null) |

## 비즈니스 규칙

- **루틴 중복 불가**: 이미 같은 루틴이 이 세션에 등록되어 있으면 에러 표시 (서버 응답 처리)
- **루틴 목록 범위**: 현재 Space의 루틴 + 상위 Space(플랫폼) 루틴 모두 포함
- **강사 목록**: 현재 Space에서 MANAGE 이상 역할을 가진 사용자만 표시

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [ ] _client.tsx (클라이언트 컴포넌트, observer 래핑)
- [ ] _prefetch.ts (prefetchGetSessionQuery 호출)
- [ ] hooks/useHandlers.ts (등록 핸들러)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | orch-requirement |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 로컬 `_components` 의존 제거, `@cocrepo/ui`의 `ProgramPickerModal` feature 사용으로 정리 | codex |
| 2026-03-03 | `_client.tsx` 헤더/섹션 반복 마크업을 `PageHeader`, `SectionHeader` 조합으로 통일 | codex |
