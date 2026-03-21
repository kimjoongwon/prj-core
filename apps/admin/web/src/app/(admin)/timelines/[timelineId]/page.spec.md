# 타임라인 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/[timelineId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                      │
│  2025 가을시즌                          [수정]  [삭제]          │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역 - 기본 정보                                       │
│                                                                  │
│  타임라인명    2025 가을시즌                                     │
│  설명          여름 학기 강좌                                    │
│  Space         헬스장 A                                         │
│  등록자        홍길동                                            │
│  등록일        2026-01-10 09:00                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역 - 세션 목록            [+ 세션 등록]             │
│                                                                  │
│  세션명          유형          시작 일시        반복요일  반복주기  프로그램 수  등록일       액션│
│  ────────────────────────────────────────────────────────────── │
│  월요일 요가    [RECURRING]    -               월       주간      3           2026-01-11   🗑│
│  1월 특강       [ONE_TIME]     2026-01-15 10:00  -       -         1           2026-01-12   🗑│
│  겨울 집중반   [ONE_TIME_RANGE] 2026-01-20      -       -         2           2026-01-13   🗑│
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│                 ← 1  2 →   총 3건                               │
│                                                                  │
│  [세션 없음 시]                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  등록된 세션이 없습니다.  [+ 세션 등록]                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 타임라인 목록에서 타임라인을 클릭하여 상세 페이지에 진입한다
2. 타임라인의 기본 정보(이름, 설명, 등록일, 등록자)를 확인한다
3. 하단 세션 목록에서 이 타임라인에 속한 세션들을 조회한다
4. "세션 등록" 버튼을 클릭하여 새 세션을 추가한다
5. 세션 이름을 클릭하여 세션 상세 페이지로 이동한다
6. 상단 "수정" 버튼을 클릭하여 타임라인 정보를 수정한다
7. 상단 "삭제" 버튼을 클릭하여 타임라인을 삭제하고 목록으로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `페이지 헤더 영역` | title="{타임라인명}", actions에 "수정", "삭제" 버튼 |
| 타임라인 정보 | `섹션 영역` | title="기본 정보" - 이름, 설명, Space, 등록자, 등록일 표시 |
| 세션 목록 | `섹션 영역` | title="세션 목록", actions에 "세션 등록" 버튼 - MetaDataGrid로 세션 표시 |

## 타임라인 정보 필드

| 필드 | 라벨 | 설명 |
|------|------|------|
| name | 타임라인명 | 타임라인 이름 |
| description | 설명 | 없으면 "-" 표시 |
| space.name | Space | 소속 Space 이름 |
| creator.name | 등록자 | 생성자 이름 (없으면 "시스템") |
| createdAt | 등록일 | DateTimeCell 형식 |

## 세션 목록 컬럼 정의

| 필드 | 라벨 | 크기 | 정렬 | 셀 컴포넌트 |
|------|------|------|------|-------------|
| name | 세션명 | 200 | - | 링크 스타일 (클릭 시 세션 상세 이동) |
| type | 유형 | 120 | center | `SessionTypeBadge` (ONE_TIME/ONE_TIME_RANGE/RECURRING 뱃지) |
| startDateTime | 시작 일시 | 160 | - | `DateTimeCell` (없으면 "-") |
| endDateTime | 종료 일시 | 160 | - | `DateTimeCell` (없으면 "-", ONE_TIME_RANGE만 표시) |
| recurringDayOfWeek | 반복 요일 | 100 | center | 요일 한글 표시 (MON→월, RECURRING만 표시) |
| repeatCycleType | 반복 주기 | 100 | center | WEEKLY→주간, MONTHLY→월간 (RECURRING만) |
| programsCount | 프로그램 수 | 100 | center | 숫자 (0이면 비활성 스타일) |
| createdAt | 등록일 | 150 | - | `DateTimeCell` |
| actions | 액션 | 80 | center | 삭제 아이콘 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetTimelineQuery({ timelineId })` | 타임라인 기본 정보 |
| SSR 프리페칭 | `prefetchGetSessionsQuery({ timelineId, take, skip })` | 세션 목록 첫 페이지 |
| 타임라인 삭제 | `useDeleteTimeline()` | 타임라인 삭제 후 `/timelines`로 이동 |
| 세션 삭제 | `useDeleteSession()` | 세션 삭제 후 목록 캐시 무효화 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "수정" 버튼 클릭 | `/timelines/{timelineId}/edit` 수정 페이지로 이동 |
| "삭제" 버튼 클릭 | 확인 모달 → `deleteTimeline` 호출 → 성공 시 `/timelines` 이동 |
| "세션 등록" 버튼 클릭 | `/timelines/{timelineId}/sessions/new` 세션 등록 페이지로 이동 |
| 세션명 클릭 | `/timelines/{timelineId}/sessions/{sessionId}` 세션 상세 페이지로 이동 |
| 세션 삭제 아이콘 클릭 | 확인 모달 → `deleteSession` 호출 → 성공 시 세션 목록 캐시 무효화 |

## 비즈니스 규칙

- **타임라인 삭제 제약**: 세션이 있는 타임라인은 삭제 불가 (`sessionsCount > 0` 시 경고 표시)
- **세션 삭제 제약**: 프로그램이 연결된 세션은 삭제 불가 (`programsCount > 0` 경고)
- **세션 유형별 컬럼 표시**: type에 따라 날짜/요일 컬럼 표시/숨김

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (타임라인 삭제, 세션 삭제 핸들러)


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
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/timelines/[timelineId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `feature/detail/view`
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
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | PageTitleBar(level=1/2) 패턴 정리 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
