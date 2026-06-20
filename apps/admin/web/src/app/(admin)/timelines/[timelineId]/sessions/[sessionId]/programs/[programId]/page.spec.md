# 프로그램 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]`

## 사용자 시나리오

1. 관리자가 세션 상세 페이지의 프로그램 목록에서 프로그램명을 클릭한다
2. 프로그램 상세 정보(이름, 루틴명, 강사명, 정원, 난이도)를 확인한다
3. "수정" 버튼을 클릭하여 프로그램 수정 페이지로 이동한다
4. "삭제" 버튼을 클릭하여 프로그램을 삭제하고 세션 상세 페이지로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `페이지 헤더 영역` | title="{프로그램명}", description="{세션명} · {타임라인명}", actions에 "수정", "삭제" 버튼 |
| 기본 정보 | `섹션 영역` | title="기본 정보" - 프로그램 상세 정보 표시 |

## 표시 필드

| 필드 | 라벨 | 설명 |
|------|------|------|
| name | 프로그램 이름 | 프로그램 이름 |
| routine.name | 루틴 | 연결된 루틴 이름 (링크로 `/routines/{routineId}` 이동) |
| instructorName | 강사 | instructorId로 조회한 사용자 이름 |
| capacity | 정원 | n명 형식 |
| level | 난이도 | 초급/중급/고급 또는 "-" (없을 때) |
| session.name | 세션 | 상위 세션 이름 (링크로 세션 상세 이동) |
| createdAt | 등록일 | DateTimeCell 형식 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetProgramQuery({ timelineId, sessionId, programId })` | 프로그램 상세 정보 |
| 프로그램 삭제 | `useDeleteProgram()` | 삭제 후 세션 상세로 이동 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "수정" 버튼 클릭 | `/timelines/{timelineId}/sessions/{sessionId}/programs/{programId}/edit` 이동 |
| "삭제" 버튼 클릭 | 확인 모달 → `deleteProgram` 호출 → 성공 시 `/timelines/{timelineId}/sessions/{sessionId}` 이동 |
| 루틴명 링크 클릭 | `/routines/{routineId}` 루틴 상세로 이동 |
| 세션명 링크 클릭 | `/timelines/{timelineId}/sessions/{sessionId}` 세션 상세로 이동 |

## 비즈니스 규칙

- 프로그램 삭제 전 확인 모달을 반드시 표시한다
- 삭제 성공 후 세션 상세 페이지로 이동한다

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (삭제 핸들러)


## SectionSurface / Elevation

| 항목 | 결정 |
|------|------|
| ScreenSurface owner | page/screen content owner |
| ScreenSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. `layout.tsx`는 `Page` 구조만 소유하고 surface는 page/screen content owner가 명시합니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/timelines/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 있음 (`ssr: false` client-only export)
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)