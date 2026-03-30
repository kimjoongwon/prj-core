# 역할 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/[roleId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌────────────────────────────────────────────────────────────────────┐
│  역할 상세: CUSTOM_ROLE          [← 목록]  [수정]  [삭제]          │
│  커스텀 역할 설명                                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ── 시스템 역할일 경우에만 표시 ──────────────────────────────────  │
│  ⚠  시스템 역할은 수정하거나 삭제할 수 없습니다.                    │
│                                                                    │
│  ┌── 기본 정보 ─────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  식별자        CUSTOM_ROLE                                   │  │
│  │  표시명        커스텀 역할                                    │  │
│  │  설명          이 역할은 특정 도메인의 접근 권한을 제어합니다. │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌── 권한 목록 ──────────────────────────────────── [권한 편집] ┐  │
│  │                                                              │  │
│  │  ── 조회 모드 ──────────────────────────────────────────── │  │
│  │  │ 대상(Subject)  │ 액션(Action)  │ 필드         │ 유형    │ │  │
│  │  ├───────────────┼──────────────┼──────────────┼──────────┤ │  │
│  │  │ 사용자        │ 읽기         │ [id] [name]  │ [허용]   │ │  │
│  │  ├───────────────┼──────────────┼──────────────┼──────────┤ │  │
│  │  │ 게시물        │ 생성         │ (전체)        │ [허용]   │ │  │
│  │  └───────────────┴──────────────┴──────────────┴──────────┘ │  │
│  │                                                              │  │
│  │  ── 편집 모드 (isEditingGrants=true) ─────────────────────  │  │
│  │  │ ☐  │ 대상(Subject)  │ 액션(Action)  │ 유형   │ 활성 │우선│ │  │
│  │  ├────┼───────────────┼──────────────┼────────┼──────┼────┤ │  │
│  │  │ ☑  │ 사용자        │ 읽기         │ [허용]  │  ●   │ 10 │ │  │
│  │  ├────┼───────────────┼──────────────┼────────┼──────┼────┤ │  │
│  │  │ ☐  │ 게시물        │ 삭제         │ [거부]  │      │    │ │  │
│  │  └────┴───────────────┴──────────────┴────────┴──────┴────┘ │  │
│  │                  [취소]  [저장]                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌── 추가 정보 ─────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  상태          [ 활성 ]                                      │  │
│  │  생성일        2026-02-01 10:00                              │  │
│  │  수정일        2026-02-15 14:30                              │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ─────── 삭제 확인 모달 ───────────────────────────────────────    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  역할 삭제                                                   │  │
│  │  이 역할을 삭제하시겠습니까?                                  │  │
│  │                          [취소]  [삭제 (danger)]             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ─────── 저장 확인 모달 ───────────────────────────────────────    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  권한 변경 확인                                               │  │
│  │  추가: 2건  /  제거: 1건  /  유지: 3건                        │  │
│  │                          [취소]  [저장 (primary)]            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 특정 역할의 상세 정보를 조회한다.
2. 기본 정보(식별자, 표시명, 설명)와 추가 정보(상태, 생성일, 수정일)를 확인한다.
3. 시스템 역할인 경우 경고 안내가 표시되고, 수정/삭제 버튼이 숨겨진다.
4. 권한 목록 섹션에서 역할에 할당된 Ability(권한)를 확인한다.
5. "권한 편집" 버튼으로 Grant 배치 편집 모드에 진입하여 Ability를 선택/해제할 수 있다.
6. 편집 모드에서 각 Ability에 대해 활성(isActive) 토글과 우선순위(priority) 값을 설정한다.
7. "저장" 버튼 클릭 시 변경사항 요약(추가/제거/유지)이 표시되는 확인 모달이 나타난다.
8. 삭제 버튼 클릭 시 삭제 확인 모달이 나타나고, 확인 시 역할이 삭제된다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="역할 상세", description 동적 |
| 헤더 액션 | Button (목록, 수정, 삭제) | 시스템 역할이 아닌 경우에만 수정/삭제 표시 |
| 시스템 안내 | div (warning) | isSystem일 때만 표시 |
| 기본 정보 | `Section` > dl | 식별자, 표시명, 설명 |
| 권한 목록 | `Section` > Table | 조회/편집 2가지 모드 |
| 추가 정보 | `Section` > dl | 상태, 생성일, 수정일 |
| 삭제 모달 | Modal | 삭제 확인 |
| 저장 모달 | Modal | Grant 배치 저장 확인 (변경사항 요약) |

## 권한 목록 - 조회 모드

| 컬럼 | 설명 |
|------|------|
| 대상 (Subject) | subject.displayName 또는 subject.name |
| 액션 (Action) | action.displayName 또는 action.name |
| 필드 | fields 배열 (최대 3개 Chip + 나머지 +N개) |
| 유형 | inverted: true이면 "거부"(danger), false이면 "허용"(success) |

## 권한 목록 - 편집 모드

| 컬럼 | 설명 |
|------|------|
| 선택 | Checkbox (Ability 선택/해제) |
| 대상 (Subject) | subject.displayName 또는 subject.name |
| 액션 (Action) | action.displayName 또는 action.name |
| 유형 | inverted 여부 (허용/거부 Chip) |
| 활성 | Switch (isActive, 선택된 항목만 표시) |
| 우선순위 | Input type=number (priority, 0~100, 선택된 항목만 표시) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 호출 중 | "로딩 중..." 텍스트 |
| 데이터 없음 | role이 null | "역할을 찾을 수 없습니다." + 목록으로 버튼 |
| 데이터 표시 | 정상 조회 | 기본 정보 + 권한 목록 + 추가 정보 |
| 편집 모드 | isEditingGrants = true | 전체 Ability 목록 + 체크박스 테이블 |
| 삭제 중 | DELETE 호출 중 | 삭제 버튼 isLoading |
| 저장 중 | PUT 호출 중 | 저장 버튼 isLoading |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 초기 렌더 | `useGetRoleById(roleId)` | 역할 상세 첫 조회 |
| 클라이언트 | `useGetRoleById(roleId)` | 역할 상세 조회 (GET /api/v1/roles/:id) |
| 클라이언트 | `useGetAbilitiesByRoleId(roleId)` | 역할별 Ability 목록 조회 |
| 편집 모드 진입 시 | `useQuery (getAllAbilities)` | 전체 Ability 목록 조회 (GET /api/v1/abilities), 임시 customInstance 사용 |
| 삭제 | `useDeleteRole` | 역할 삭제 (DELETE /api/v1/roles/:id) |
| Grant 저장 | `useMutation (batchAssignGrantsToRole)` | Grant 배치 할당 (PUT /api/v1/grants/roles/:roleId), 임시 customInstance 사용 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles`로 이동 |
| onClickEditButton | `/roles/${roleId}/edit`로 이동 |
| deleteModal.onOpen | 삭제 확인 모달 열기 |
| onClickDeleteConfirm | deleteRole 호출, 성공 시 `/roles`로 이동 |
| onClickEditGrants | 편집 모드 진입, 현재 Grant를 초기 선택 상태로 설정 |
| onClickCancelEditGrants | 편집 모드 취소 |
| onToggleAbilityCheckbox | Ability 선택/해제 토글 |
| onToggleGrantActiveSwitch | Grant isActive 토글 |
| onChangeGrantPriorityInput | Grant priority 변경 |
| onClickSaveGrants | 저장 확인 모달 열기 |
| onClickConfirmSaveGrants | batchAssignGrantsToRole 호출, 성공 시 편집 모드 해제 + 권한 목록 재조회 |

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)

## 비고

- 전체 Ability 조회 및 Grant 배치 할당은 Orval 재생성 전 임시 customInstance를 사용 중
- Grant 편집 모드에서 변경 감지는 `hasChanges` 상태로 관리
- 변경사항 요약(added, removed, kept)은 `getChangeSummary()` 함수로 계산


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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
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
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 페이지 이벤트 핸들러를 `on[Event][UI]` 규칙으로 정규화 (`onToggleAbilityCheckbox` 등) | codex |
| 2026-03-03 | 반복 헤더 마크업 제거를 위해 `Page + PageTitleBar + Section` 조합 적용 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure page props를 주입하는 구조로 정리 | codex |
