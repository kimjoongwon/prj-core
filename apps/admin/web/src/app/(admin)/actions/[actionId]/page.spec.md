# Action 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/actions/[actionId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Action 상세                                                         │
│  사용자 생성 (user:create)          [← 목록으로] [수정] [삭제]       │
├─────────────────────────────────────────────────────────────────────┤
│  ※ 시스템 Action인 경우에만 표시                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  ⚠️  시스템 Action은 수정 및 삭제할 수 없습니다.              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  기본 정보                                                   │    │
│  │  ┌────────────────────────┬───────────────────────────┐    │    │
│  │  │ 행위 식별자             │ 표시명                    │    │    │
│  │  │ user:create  [시스템]  │ 사용자 생성               │    │    │
│  │  ├────────────────────────┼───────────────────────────┤    │    │
│  │  │ 분류                   │ 순서                      │    │    │
│  │  │ [CRUD]                 │ 1                         │    │    │
│  │  ├────────────────────────┴───────────────────────────┤    │    │
│  │  │ 설명                                               │    │    │
│  │  │ 사용자를 시스템에 등록하는 행위입니다.              │    │    │
│  │  └────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Config 설정  (config가 있을 때만 표시)                       │    │
│  │  ┌────────────────────────────────────────────────────┐    │    │
│  │  │ {                                                  │    │    │
│  │  │   "maxRetry": 3,                                   │    │    │
│  │  │   "timeout": 5000                                  │    │    │
│  │  │ }                                                  │    │    │
│  │  └────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  추가 정보                                                   │    │
│  │  ┌────────────────────────┬───────────────────────────┐    │    │
│  │  │ 생성일                  │ 수정일                    │    │    │
│  │  │ 2026-01-10 09:00       │ 2026-02-15 14:30         │    │    │
│  │  └────────────────────────┴───────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  [삭제 확인 모달]                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Action을 삭제하시겠습니까?                                   │    │
│  │  "user:create" Action이 삭제됩니다.                          │    │
│  │  이 작업은 되돌릴 수 없습니다.                                │    │
│  │                               [취소]  [삭제]                │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 Action 목록에서 특정 Action을 클릭하여 상세 페이지에 진입한다.
2. 기본 정보(식별자, 표시명, 분류, 순서, 설명)를 확인한다.
3. Config JSON이 있으면 설정 섹션에서 확인한다.
4. 추가 정보(생성일, 수정일)를 확인한다.
5. 시스템 Action이 아닌 경우 "수정" 또는 "삭제" 버튼을 사용할 수 있다.
6. 삭제 시 확인 모달이 표시되고, 확인하면 삭제 후 목록으로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="Action 상세", description 동적 (표시명 또는 식별자 기반) |
| 액션 영역 | `Button` x3 | "목록으로" (ArrowLeft) + "수정" (Edit, primary, 비시스템만) + "삭제" (Trash2, danger, 비시스템만) |
| 시스템 안내 | `div` | warning 배경, 시스템 Action은 수정/삭제 불가 안내 (isSystem일 때만 표시) |
| 기본 정보 섹션 | `section` | 2열 그리드: 식별자(font-mono + 시스템 Chip), 표시명, 분류(Chip), 순서, 설명 |
| Config 섹션 | `section` | JSON pre 포맷 (config가 있을 때만 표시) |
| 추가 정보 섹션 | `section` | 2열 그리드: 생성일, 수정일 |
| 삭제 모달 | `Modal` | Action명 표시 + 경고 메시지 + 취소/삭제 버튼 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 중 | API 응답 대기 | "로딩 중..." 텍스트 |
| 데이터 없음 | Action을 찾을 수 없음 | "Action을 찾을 수 없습니다." + "목록으로" 버튼 |
| 시스템 Action | isSystem=true | 수정/삭제 버튼 숨김 + 시스템 안내 배너 표시 |
| 사용자 Action | isSystem=false | 수정/삭제 버튼 표시 |
| 삭제 확인 모달 | 삭제 버튼 클릭 시 | Modal 표시 |
| 삭제 중 | DELETE API 호출 대기 | 삭제 버튼 isLoading, 취소 버튼 isDisabled |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR Prefetch | `GET /api/v1/actions/:id` (prefetchActionDetailData) | 상세 데이터 프리페치 |
| 클라이언트 | `GET /api/v1/actions/:id` (useGetActionById) | ActionResponseDto 반환 (config 포함) |
| 삭제 확인 | `DELETE /api/v1/actions/:id` (useDeleteAction) | Action 삭제 (소프트 삭제) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/actions` 목록 페이지로 router.push |
| onClickEditButton | `/actions/${actionId}/edit` 수정 페이지로 router.push |
| deleteModal.onOpen | 삭제 확인 모달 표시 |
| onClickDeleteConfirm | deleteAction 뮤테이션 실행 → 성공 시 모달 닫기 + 목록 이동 |
| deleteModal.onClose | 삭제 모달 닫기 |

## group 색상 매핑

| group | 색상 |
|-------|------|
| crud | primary |
| visibility | secondary |
| workflow | success |
| bulk | warning |
| (기타) | default |

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)


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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/actions/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/actions/[actionId]/page.tsx` |
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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 로딩/빈 상태/정상 상태 헤더를 `PageTitleBar` 기반으로 통일 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
