# 타임라인 등록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/timelines/new`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                      │
│  타임라인 등록                                      [취소]       │
│  새 타임라인을 등록합니다.                                       │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                   │
│                                                                  │
│  타임라인명 *                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 예: 2025년 가을 시즌, 10월 1주차                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  설명                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │                                               0 / 500     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│                                              [등록]              │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 타임라인 목록에서 "타임라인 등록" 버튼을 클릭한다
2. 타임라인 이름과 선택적으로 설명을 입력한다
3. "등록" 버튼을 클릭하면 타임라인이 현재 Space에 생성된다
4. 성공 시 생성된 타임라인 상세 페이지(`/timelines/[timelineId]`)로 이동한다
5. "취소" 버튼 클릭 시 목록 페이지로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="타임라인 등록", description="새 타임라인을 등록합니다.", actions에 "취소" 버튼 |
| 입력 폼 | `Section` | 타임라인 정보 입력 폼 |

## 폼 필드 정의

| 필드 | 라벨 | 타입 | 필수 | 검증 규칙 | 설명 |
|------|------|------|------|-----------|------|
| name | 타임라인명 | text | 필수 | 1~100자 | 예: "2025년 가을 시즌", "10월 1주차" |
| description | 설명 | textarea | 선택 | 최대 500자 | 타임라인에 대한 부가 설명 |

## 액션 버튼

| 버튼 | 위치 | 동작 |
|------|------|------|
| 등록 | 폼 하단 우측 | 유효성 검사 후 API 호출, 성공 시 상세 페이지로 이동 |
| 취소 | 페이지 헤더 우측 | 목록 페이지(`/timelines`)로 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 등록 버튼 클릭 | `useCreateTimeline()` | 타임라인 생성 (현재 Space에 귀속) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 등록 버튼 클릭 | 폼 유효성 검사 → `createTimeline` API 호출 → 성공 시 `/timelines/{newId}` 이동, 실패 시 에러 토스트 |
| 취소 버튼 클릭 | `/timelines` 목록으로 이동 |

## 런타임 책임

- `page.tsx`가 `useCreateTimeline`, `useRouter`, `useLocalObservable`를 직접 소유합니다.
- `@cocrepo/ui`의 `TimelineCreateScreen`는 props-only pure screen로 사용합니다.

## 비즈니스 규칙

- **Space 귀속**: 생성된 타임라인은 현재 선택된 Space에 자동으로 귀속
- **creatorId**: 현재 로그인한 사용자가 자동으로 설정
- **이름 중복**: 같은 Space 내 이름 중복 불허 (백엔드 검증)

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (등록 핸들러)


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
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/timelines/new/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)