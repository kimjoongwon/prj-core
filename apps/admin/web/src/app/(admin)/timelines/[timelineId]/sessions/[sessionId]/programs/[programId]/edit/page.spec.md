# 프로그램 수정 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit`

## 사용자 시나리오

1. 관리자가 프로그램 상세 또는 세션 상세의 프로그램 목록에서 "수정" 버튼을 클릭한다
2. 기존 프로그램 정보가 폼에 미리 채워진다
3. 수정할 항목을 변경한다
4. "저장" 버튼을 클릭하면 변경 사항이 저장되고 프로그램 상세 페이지로 이동한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="프로그램 수정", description="{프로그램명} · {세션명}", actions에 "취소" 버튼 |
| 수정 폼 | `Section + PageTitleBar(title="기본 정보")` | 프로그램 정보 수정 폼 |
| 선택 모달 | `ProgramPickerModal` (feature) | 루틴/강사 검색 및 선택 |

## 입력 필드

| 필드 | 라벨 | 유형 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | 프로그램 이름 | TextInput | O | 프로그램 이름 입력 |
| routineId | 루틴 | Select (검색 가능) | O | 현재+상위 Space 루틴 목록에서 선택 |
| instructorId | 강사 | Select (검색 가능) | O | 현재 Space의 MANAGE 이상 역할 사용자 목록에서 선택 |
| capacity | 정원 | NumberInput | O | 최소 1명 |
| level | 난이도 | Select | X | 초급 / 중급 / 고급 (없음 선택 가능) |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetProgramQuery({ timelineId, sessionId, programId })` | 현재 프로그램 정보 (폼 초기값) |
| 폼 로드 | `useGetRoutines({ spaceId, includeParent: true })` | 루틴 선택 목록 |
| 폼 로드 | `useGetUsers({ spaceId, minRole: 'MANAGE' })` | 강사 선택 목록 |
| 수정 제출 | `useUpdateProgram()` | 프로그램 수정 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "취소" 버튼 클릭 | `/timelines/{timelineId}/sessions/{sessionId}/programs/{programId}` 상세로 이동 |
| "저장" 버튼 클릭 | 폼 유효성 검증 → `updateProgram` 호출 → 성공 시 상세 페이지로 이동 |

## 유효성 검증

| 필드 | 검증 규칙 |
|------|----------|
| name | 필수, 최대 100자 |
| routineId | 필수 |
| instructorId | 필수 |
| capacity | 필수, 최소 1 |
| level | 선택 (없으면 null) |

## 비즈니스 규칙

- **루틴 변경 시 중복 확인**: 다른 루틴으로 변경할 경우 세션 내 중복 여부 확인 (서버 응답 처리)
- **루틴 목록 범위**: 현재 Space의 루틴 + 상위 Space(플랫폼) 루틴 모두 포함
- **강사 목록**: 현재 Space에서 MANAGE 이상 역할을 가진 사용자만 표시

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (수정 핸들러)


## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/timelines/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-02-19 | 초기 생성 | orch-requirement |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 로컬 `_components` 의존 제거, `@cocrepo/ui`의 `ProgramPickerModal` feature 사용으로 정리 | codex |
| 2026-03-03 | `_client.tsx` 헤더/섹션 반복 마크업을 `PageTitleBar`, `PageTitleBar` 조합으로 통일 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
