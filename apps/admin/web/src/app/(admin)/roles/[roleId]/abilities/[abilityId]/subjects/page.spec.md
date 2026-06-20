# Subject 관리 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/[roleId]/abilities/[abilityId]/subjects`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────┐
│  [페이지 헤더 영역]                                              │
│                                                             │
│  Subject 관리                   [ <- 역할 상세로 ]          │
│  권한의 대상(Subject)을 관리합니다.                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [섹션 영역]                                     │  │
│  │                                                       │  │
│  │  권한 ID                                              │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  `abilityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx`  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ⚠ Subject 관리 기능은 추후 구현 예정입니다.           │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 특정 역할의 특정 권한(Ability)에 대한 대상(Subject)을 관리하기 위해 페이지에 진입한다.
2. 현재는 플레이스홀더 상태로, "Subject 관리 기능은 추후 구현 예정입니다." 안내가 표시된다.
3. 권한 ID가 코드 형태로 표시된다.
4. "역할 상세로" 버튼으로 역할 상세 페이지로 돌아갈 수 있다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `Page + PageTitleBar` | title="Subject 관리", description="권한의 대상(Subject)을 관리합니다." |
| 헤더 액션 | Button | "역할 상세로" 버튼, ArrowLeft 아이콘 |
| 콘텐츠 | `Section + PageTitleBar` | 권한 ID 표시 + 미구현 안내 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 플레이스홀더 | 미구현 상태 | 권한 ID + "추후 구현 예정" 안내 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| (없음) | - | TODO: prefetch ability data |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles/${roleId}`로 이동 |

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] 실제 Subject 관리 기능 구현 (미완료)


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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/[roleId]/abilities/[abilityId]/subjects/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)