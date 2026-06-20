# 타임라인 수정 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/[timelineId]/edit`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                      │
│  타임라인 수정                                      [취소]       │
│  2025 가을시즌                                                   │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                   │
│                                                                  │
│  타임라인명 *                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 2025 가을시즌                 ← 기존 값 프리필             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  설명                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 여름 학기 강좌               ← 기존 값 프리필             │ │
│  │                                             14 / 500       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ※ 변경 사항이 없으면 "수정" 버튼 비활성화                      │
│                                              [수정]              │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 타임라인 상세 페이지에서 "수정" 버튼을 클릭한다
2. 기존 타임라인 정보(이름, 설명)가 폼에 프리필(pre-fill)되어 있다
3. 변경할 내용을 입력한 후 "수정" 버튼을 클릭한다
4. 성공 시 타임라인 상세 페이지로 돌아간다
5. "취소" 버튼 클릭 시 상세 페이지로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `페이지 헤더 영역` | title="타임라인 수정", description="{타임라인명}", actions에 "취소" 버튼 |
| 입력 폼 | `섹션 영역` | 타임라인 정보 수정 폼 (기존 값 프리필) |

## 폼 필드 정의

| 필드 | 라벨 | 타입 | 필수 | 검증 규칙 | 설명 |
|------|------|------|------|-----------|------|
| name | 타임라인명 | text | 필수 | 1~100자 | 기존 값 프리필 |
| description | 설명 | textarea | 선택 | 최대 500자 | 기존 값 프리필 (없으면 빈 값) |

## 액션 버튼

| 버튼 | 위치 | 동작 |
|------|------|------|
| 수정 | 폼 하단 우측 | 유효성 검사 후 API 호출, 성공 시 상세 페이지로 이동 |
| 취소 | 페이지 헤더 우측 | 상세 페이지(`/timelines/{timelineId}`)로 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| CSR 초기 진입 | `useGetTimelineById(timelineId)` | 기존 타임라인 정보 로드 및 폼 프리필 |
| 수정 버튼 클릭 | `useUpdateTimeline()` | 타임라인 정보 업데이트 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 수정 버튼 클릭 | 폼 유효성 검사 → `updateTimeline` API 호출 → 성공 시 `/timelines/{timelineId}` 이동, 실패 시 에러 토스트 |
| 취소 버튼 클릭 | `/timelines/{timelineId}` 상세로 이동 |

## 런타임 책임

- `page.tsx`가 `useParams`, `useRouter`, `useQueryClient`, `useLocalObservable`, timeline query/mutation을 직접 소유합니다.
- `packages/fe-ui/src/screen/TimelineEditScreen/TimelineEditScreen.tsx`는 props-only pure screen로 사용합니다.
- 검증 에러, 변경 감지, 토스트, invalidate, 상세 페이지 이동은 route가 책임집니다.

## 비즈니스 규칙

- **변경 감지**: 수정 내용이 없으면 "수정" 버튼 비활성화
- **이름 중복**: 같은 Space 내 다른 타임라인과 이름 중복 불허 (백엔드 검증)

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [x] route가 query/mutation/router/local state를 소유
- [x] `@cocrepo/ui` pure screen props 주입


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
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/timelines/[timelineId]/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 있음 (`ssr: false` client-only export)
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)