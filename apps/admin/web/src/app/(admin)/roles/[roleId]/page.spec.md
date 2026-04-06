# 역할 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/[roleId]`

## 디자인 목업

```
┌────────────────────────────────────────────────────────────────────┐
│ 역할 상세: FULL_ACCESS           [← 목록]                          │
│ FULL_ACCESS 역할의 상세 정보입니다.                                │
├────────────────────────────────────────────────────────────────────┤
│ ⚠ 시스템 역할: 이름 변경과 삭제는 제한되지만, 메뉴 및 권한 배치는 │
│   조정할 수 있습니다.                                              │
│ ℹ 전체 권한: `manage all`이 있으면 모든 메뉴/화면/데이터 권한이     │
│   자동 허용되며 세부 토글은 고급 권한에서 전체 권한을 해제해야 함  │
│                                                                    │
│ ┌── 기본 정보 ───────────────────────────────────────────────────┐ │
│ │ 역할 식별자 / 표시명 / 설명 / 상태 / 생성일 / 수정일          │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ ┌── 메뉴 권한 ─────────────────────────────────── [메뉴 편집] ──┐ │
│ │ 그룹 카드(회원, 에셋, 권한 관리...)                           │ │
│ │  - leaf row: 라벨 / path / 상태 Chip                          │ │
│ │  - 편집 시 Checkbox 표시                                      │ │
│ │ 우측: 편집 요약 / 구성 진단                                    │ │
│ │  - 운영자용 문구 + technical details 펼침                      │ │
│ │ [취소] [저장]                                                  │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ ┌── 화면 접근 ───────────────────────────────────────────────────┐ │
│ │ 메뉴 노출과 별개로 URL 직접 접근을 허용할 page:*를 편집       │ │
│ │ 그룹 카드 + 접근 허용/차단 Chip + 구성 진단                   │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ ┌── 데이터 권한 ─────────────────────────────────────────────────┐ │
│ │ entity:* CRUD ability를 운영자용 bundle로 묶어 편집           │ │
│ │ 생성 / 조회 / 수정 / 삭제 / 전체 관리                         │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ ┌── 고급 권한 목록 ────────────────────────────── [고급 편집] ──┐ │
│ │ menu/page/CRUD로 다루지 않는 Ability를 raw subject/action 단위 │ │
│ │ 편집 모드에서는 Checkbox + active + priority 입력 제공         │ │
│ │ 저장은 메뉴/화면/CRUD 섹션과 같은 세션에서 수행                │ │
│ └───────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ ─────── 삭제 확인 모달 ─────────────────────────────────────────   │
│ ─────── 권한 저장 확인 모달 (added / removed / kept 요약) ─────   │
└────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 특정 역할의 기본 정보를 조회한다.
2. 메뉴 권한 섹션에서 실제 admin 메뉴 leaf 기준 노출 상태를 확인한다.
3. 화면 접근 섹션에서 메뉴와 별도로 URL 직접 접근 허용 범위를 조정한다.
4. 데이터 권한 섹션에서 엔티티별 CRUD 묶음을 빠르게 조정한다.
5. 메뉴 편집 모드에 들어가 특정 leaf를 선택하거나 해제한다.
6. leaf 토글 시 route는 parent `menu:*` 와 child `menu:*:list` canonical ability를 함께 계산한다.
7. 구성 진단 카드에서 menu/page drift를 즉시 확인한다.
8. 저장 시 menu/page grant와 기존 CRUD/non-menu grant를 합쳐 전체 동기화 API에 전달한다.
9. 필요하면 고급 권한 목록에서 bundle로 다루지 않는 Ability를 raw 단위로 추가/제거한다.
10. 시스템 역할은 수정/삭제 버튼은 숨기되 메뉴/권한 편집은 허용한다.
11. `manage all` 이 연결된 역할은 메뉴/화면/CRUD 섹션을 전역 허용 상태로 읽고 세부 토글을 잠근다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `DetailPage` | 상세 화면 레이아웃 |
| 페이지 헤더 | `PageTitleBar` | title="역할 상세", description 동적 |
| 헤더 액션 | Button (목록, 수정, 삭제) | 시스템 역할은 목록만 표시 |
| 시스템 안내 | warning panel | 이름/삭제 제한, 메뉴/권한 편집 허용 안내 |
| 기본 정보 | `DetailSectionCard` | 역할 식별자, 표시명, 설명, 상태, 생성/수정일 |
| 메뉴 권한 | `DetailSectionCard` | leaf-first menu editor + diagnostics |
| 화면 접근 | `DetailSectionCard` | page:* direct access editor + diagnostics |
| 데이터 권한 | `DetailSectionCard` | entity CRUD bundle editor |
| 고급 권한 목록 | `DetailSectionCard` | menu/page/CRUD 외 raw ability 조회/편집 |
| 삭제 모달 | Modal | 삭제 확인 |
| 저장 모달 | Modal | 현재 선택 Grant 전체 동기화 확인 |

## 메뉴 권한 계약

| 항목 | 설명 |
|------|------|
| SOT | `ADMIN_MENU_PERMISSION_LEAFS` |
| 편집 단위 | leaf menu (`users-list`, `assets-list` 등) |
| 선택 판단 | leaf가 요구하는 `requiredSubjects` 의 canonical ability가 모두 선택되어야 함 |
| canonical 규칙 | `subject startsWith("menu:")` + `action.name === "manage"` |
| 부모 처리 | child leaf가 하나라도 선택되면 parent `menu:*` grant 유지 |
| 전역 예외 | `manage all` 이 선택돼 있으면 모든 leaf를 `노출`로 간주하고 개별 토글은 잠금 |
| 저장 차단 | `missingSubject`, `missingAbility` |
| 경고 | `duplicateAbility`, `catalogMismatch` |

## 고급 권한 계약

## 화면 접근 계약

| 항목 | 설명 |
|------|------|
| SOT | `ADMIN_PAGE_ACCESS_ITEMS` |
| 편집 단위 | route/page 단위 (`roles:detail`, `assets:list` 등) |
| canonical 규칙 | `subject startsWith("page:")` + `action.name === "access"` |
| 역할 | 메뉴 노출과 분리된 URL 직접 접근 제어 |
| 전역 예외 | `manage all` 이 선택돼 있으면 모든 page를 `접근 허용`으로 간주하고 개별 토글은 잠금 |
| 저장 차단 | `missingSubject`, `missingAbility` |
| 경고 | `duplicateAbility`, `catalogMismatch` |

## 데이터 권한 계약

| 항목 | 설명 |
|------|------|
| SOT | `ADMIN_CRUD_BUNDLES` |
| 편집 단위 | entity CRUD action (`create`, `read`, `update`, `delete`, `manage`) |
| canonical 규칙 | `subject startsWith("entity:")` + CRUD action |
| 표시 목적 | 운영자가 raw ability 대신 업무 단위로 CRUD를 조정할 수 있게 함 |
| 전역 예외 | `manage all` 이 선택돼 있으면 모든 CRUD action을 허용/사용 가능으로 간주하고 개별 토글은 잠금 |
| 비등록 처리 | ability가 없으면 `미등록` 상태와 안내 문구를 표시 |

## 고급 권한 계약

| 항목 | 설명 |
|------|------|
| 조회 범위 | `subject.name` 이 `menu:` 또는 `page:` 로 시작하지 않는 Ability |
| 편집 단위 | raw Ability + Grant metadata(`isActive`, `priority`) |
| 저장 방식 | 메뉴/화면/CRUD와 같은 `selectedGrantItems` 세션 공유 |
| 목적 | surface bundle로 다루지 않는 예외 권한의 세밀한 배치 편집 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | 역할 상세 조회 중 | "로딩 중..." |
| 데이터 없음 | role이 없음 | "역할을 찾을 수 없습니다." |
| 메뉴 구성 로딩 | subjects/all abilities 조회 중 | 메뉴 권한 섹션 spinner |
| 메뉴 구성 오류 | subjects/all abilities 조회 실패 | blocking diagnostic 표시 |
| 화면 구성 로딩 | subjects/all abilities 조회 중 | 화면 접근 섹션 spinner |
| 화면 구성 오류 | subjects/all abilities 조회 실패 | blocking diagnostic 표시 |
| CRUD 구성 로딩 | all abilities 조회 중 | 데이터 권한 섹션 spinner |
| 조회 모드 | 기본 상세 조회 | 메뉴 권한 + 고급 권한 목록 조회형 렌더 |
| 편집 모드 | `isEditingGrants = true` | 메뉴 leaf checkbox + page toggle + CRUD checkbox + raw table |
| 삭제 중 | DELETE 호출 중 | 삭제 버튼 loading |
| 저장 중 | PUT 호출 중 | 저장 버튼 loading |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 초기 렌더 | `useGetRoleById(roleId)` | 역할 상세 조회 |
| 클라이언트 초기 렌더 | `useGetAbilitiesByRoleId(roleId)` | 현재 역할에 부여된 Ability 조회 |
| 클라이언트 초기 렌더 | `useGetAbilities()` | menu/page/CRUD canonical resolver 및 고급 권한 편집용 전체 Ability 조회 |
| 클라이언트 초기 렌더 | `useGetSubjects()` | menu/page subject drift 진단용 Subject catalog 조회 |
| 삭제 | `useDeleteRole` | 역할 삭제 |
| 권한 저장 | `useBatchAssignGrantsToRole` | `selectedGrantItems` 전체 동기화 (`roleGrants` payload) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles`로 이동 |
| onClickEditButton | `/roles/${roleId}/edit`로 이동 |
| onClickEditGrantsButton | 현재 granted ability 전체를 선택 상태로 복제하고 편집 모드 진입 |
| onToggleMenuPermission | leaf on/off 시 parent/child canonical menu grant를 함께 조정 |
| onTogglePagePermission | page access ability 선택/해제 |
| onToggleCrudAction | CRUD bundle action 선택/해제 |
| onToggleAbilityCheckbox | surface bundle에 포함되지 않는 raw ability 선택/해제 |
| onToggleGrantActiveSwitch | 선택된 raw grant의 활성 상태 변경 |
| onChangeGrantPriorityInput | 선택된 raw grant의 priority 변경 |
| onClickOpenSaveGrantsModal | 저장 확인 모달 열기 |
| onClickConfirmSaveGrantsButton | `selectedGrantItems` 전체를 `roleGrants` payload로 저장 |
| onClickDeleteConfirm | deleteRole 호출 후 `/roles`로 이동 |

## 구현 메모

- `/grants/roles/:roleId` 는 전체 동기화 API이므로 메뉴 편집만 저장하면 non-menu grant가 삭제됩니다.
- 따라서 route는 메뉴/화면/CRUD/고급 편집이 같은 `selectedGrantItems` 를 공유해야 합니다.
- FULL_ACCESS는 `manage all` 단일 grant만으로도 모든 권한을 가져야 하므로, route는 전역 권한을 감지해 세부 섹션을 override해야 합니다.
- duplicate canonical ability가 있으면 최신 `createdAt` 항목을 우선 선택하되, 해제 시에는 해당 subject의 duplicate ability를 모두 정리합니다.
- 운영자 기본 문구에서는 subject/ability 내부 키를 숨기고, 필요할 때만 technical details로 펼쳐 보여줍니다.

## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 기본 정보, 메뉴 권한, 고급 권한 목록, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.tsx` |
| page가 소유하지 않는 skeleton | `DetailPage`, `DetailPageSurface`, `DetailSection`, `DetailSectionCard` |

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 역할 권한 저장 요청 본문을 generic `grants` 대신 `roleGrants` 계약으로 명시 | codex |
| 2026-04-06 | FULL_ACCESS의 `manage all` 전역 권한 안내와 세부 섹션 잠금 규칙을 추가 | codex |
| 2026-04-06 | FULL_ACCESS의 `manage all` 전역 권한을 반영해 메뉴/화면/CRUD 섹션을 전역 허용 상태로 해석하는 규칙을 추가 | codex |
| 2026-04-06 | 역할 상세를 메뉴/화면/CRUD/고급 4섹션 권한 편집기로 확장하고 운영자용 진단 문구를 반영 | codex |
| 2026-04-06 | 역할 상세를 메뉴 leaf 중심 권한 편집기 + non-menu 고급 편집 구조로 재정의하고 full-sync save 제약을 문서화 | codex |
| 2026-03-31 | 전체 Ability 조회/Grant 저장 흐름을 `useGetAbilities`, `useBatchAssignGrantsToRole` 기준으로 갱신 | codex |
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
