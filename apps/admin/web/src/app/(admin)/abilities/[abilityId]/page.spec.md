# 권한 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/abilities/[abilityId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  권한 상세              [← 목록으로]     [✏ 수정]     [🗑 삭제]         │
│  권한 정보를 확인하고 수정하거나 삭제할 수 있습니다.                     │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  기본 정보                                                │
│  ┌──────────────────────────────┬───────────────────────────────────┐   │
│  │ 이름                         │ 유형                              │   │
│  │ read:post (font-mono)        │ [허용] (success chip)             │   │
│  ├──────────────────────────────┼───────────────────────────────────┤   │
│  │ 설명                         │ 거부 사유                         │   │
│  │ 게시글 읽기 권한              │ -                                 │   │
│  └──────────────────────────────┴───────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  CASL 정보                                                │
│  ┌──────────────────────────────┬───────────────────────────────────┐   │
│  │ Subject                      │ Action                            │   │
│  │ Post (게시글)                 │ read (읽기)                       │   │
│  ├──────────────────────────────┼───────────────────────────────────┤   │
│  │ Fields                       │ Conditions                        │   │
│  │ [title] [content]            │ <pre>{"authorId": "..."}</pre>    │   │
│  └──────────────────────────────┴───────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  메타 정보                                                │
│  ┌──────────────────────────────┬───────────────────────────────────┐   │
│  │ 생성일                       │ 수정일                            │   │
│  │ 2026-01-10 09:00             │ 2026-01-10 09:00                  │   │
│  └──────────────────────────────┴───────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

  [삭제 확인 모달]
  ┌─────────────────────────────────────────┐
  │ 🔑 권한 삭제                             │
  │ read:post 권한을 삭제하시겠습니까?        │
  │ 이 작업은 되돌릴 수 없습니다.            │
  │                         [취소] [삭제]    │
  └─────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 권한 목록에서 특정 권한을 클릭하여 상세 페이지에 진입한다.
2. 기본 정보(이름, 유형, 설명, 거부 사유)를 확인한다.
3. CASL 정보(Subject, Action, Fields, Conditions)를 확인한다.
4. 메타 정보(생성일, 수정일)를 확인한다.
5. "수정" 버튼을 클릭하여 수정 페이지로 이동한다.
6. "삭제" 버튼을 클릭하여 삭제 확인 모달을 표시한다.
7. 모달에서 삭제를 확인하면 권한을 삭제하고 목록으로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="권한 상세", description="권한 정보를 확인하고 수정하거나 삭제할 수 있습니다." |
| 액션 영역 | `Button` x3 | "목록으로" (ArrowLeft) + "수정" (Edit, primary) + "삭제" (Trash2, danger) |
| 기본 정보 섹션 | `section` | 2열 그리드: 이름(font-mono), 유형(Chip), 설명, 거부 사유 |
| CASL 정보 섹션 | `section` | 2열 그리드: Subject, Action, Fields(Chip 배열), Conditions(JSON pre) |
| 메타 정보 섹션 | `section` | 2열 그리드: 생성일, 수정일 |
| 삭제 모달 | `Modal` | Key 아이콘 + 권한명 표시 + 경고 메시지 + 취소/삭제 버튼 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 중 | API 응답 대기 | Spinner + "로딩 중..." |
| 데이터 없음 | 권한을 찾을 수 없음 | "권한을 찾을 수 없습니다." + "목록으로" 버튼 |
| 데이터 있음 | 정상 표시 | 3개 섹션 (기본 정보, CASL 정보, 메타 정보) |
| 삭제 확인 모달 | 삭제 버튼 클릭 시 | Modal 표시 |
| 삭제 중 | DELETE API 호출 대기 | 삭제 버튼 isLoading |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 초기 렌더 | `GET /api/v1/abilities/:id` (useGetAbilityById) | 상세 데이터 첫 조회 |
| 클라이언트 | `GET /api/v1/abilities/:id` (useGetAbilityById) | 상세 데이터 조회 |
| 삭제 확인 | `DELETE /api/v1/abilities/:id` (useDeleteAbility) | 권한 삭제 (소프트 삭제) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/abilities` 목록 페이지로 router.push |
| onClickEditButton | `/abilities/${abilityId}/edit` 수정 페이지로 router.push |
| deleteModal.open | 삭제 확인 모달 표시 |
| onClickDeleteConfirm | deleteAbility 뮤테이션 실행 → 성공 시 목록으로 이동 |
| deleteModal.close | 삭제 모달 닫기 |

## E2E 검증 메모

- 목록→상세 이동 E2E는 고정 시드 권한명에 의존하지 않고 첫 번째 테이블 행 자체를 클릭해 상세 전환을 검증합니다.

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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/abilities/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/abilities/[abilityId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 상세 조회/삭제/라우팅만 담당하고 시각 조합은 `AbilityDetailPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `detail`
- reusable target: `detail/view`
- screen component path: `packages/fe-ui/src/screen/AbilityDetailPage/AbilityDetailPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | 목록→상세 E2E 기준을 `상세` 버튼 클릭에서 첫 행 클릭으로 현재 DataGrid 계약에 맞게 조정 | codex |
| 2026-03-26 | `AbilityDetailPage` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-23 | 목록→상세 전환 E2E가 고정 시드 권한명 대신 첫 행 `상세` 액션을 사용하도록 검증 기준 보강 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-14 | Playwright E2E가 목록 진입/상세 전환을 `networkidle` 대신 heading 가시성과 URL 전환으로 확인하도록 안정화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 로딩/빈 상태/정상 상태 헤더를 `PageTitleBar` 기반으로 통일 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
