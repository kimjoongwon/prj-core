# AdminRolesRoleIdPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminRolesRoleIdPage/AdminRolesRoleIdPage.tsx

## 역할

이 파일은 역할 상세의 pure page 레이어를 담당하며, route가 계산한 역할 정보와 메뉴/화면/CRUD/고급 권한 편집 상태를 props로 받아 렌더링합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `AdminRolesRoleIdPage` | 역할 상세 pure page 컴포넌트 |
| `AdminRolesRoleIdPageRole` | 역할 기본 정보 계약 |
| `AdminRolesRoleIdPageAbility` | raw Ability 표시 계약 |
| `AdminRolesRoleIdPageGrantItem` | 편집 세션의 Grant payload 계약 |
| `AdminRolesRoleIdPagePermissionIssue` | 운영자용 진단/경고 공통 계약 |
| `AdminRolesRoleIdPageRelatedAbility` | 중복/정리 대상 raw ability 이동 계약 |
| `AdminRolesRoleIdPageMenuPermission` | leaf-first menu editor row 계약 |
| `AdminRolesRoleIdPageMenuDiagnostic` | 우측 진단 카드 계약 |
| `AdminRolesRoleIdPagePagePermission` | page access editor row 계약 |
| `AdminRolesRoleIdPagePageDiagnostic` | 화면 접근 진단 카드 계약 |
| `AdminRolesRoleIdPageCrudBundle` | entity CRUD bundle 계약 |

## 화면 구조

| 섹션 | 설명 |
|------|------|
| 기본 정보 | 역할 식별자, 표시명, 설명, 상태, 생성/수정일 |
| 메뉴 권한 | 메뉴 leaf 카드, 편집 요약, 구성 진단, 저장/취소 액션 |
| 화면 접근 | page:* direct access 카드와 진단 |
| 데이터 권한 | entity CRUD bundle 카드 |
| 고급 권한 목록 | menu/page/CRUD 외 non-surface ability 조회/편집 테이블 |
| 삭제 모달 | 삭제 확인 |
| 저장 모달 | added / removed / kept 요약과 저장 확인 |

## 메뉴 권한 렌더링 규칙

| 항목 | 설명 |
|------|------|
| 그룹화 | `groupId`, `groupLabel` 기준으로 카드 그룹화 |
| 상태 표시 | `isSelected` 로 `노출` / `숨김` Chip 표시 |
| 차단 이슈 | `severity=blocking` 이면 `지금은 변경할 수 없음` Chip 표시, 신규 선택 비활성화 |
| 경고 이슈 | `severity=warning` 이면 `주의` Chip 표시 |
| 전역 권한 | `hasGlobalAccess=true` 이면 전체 권한 안내를 표시하고 Checkbox를 잠금 |
| 기술 정보 | 기본 문구는 운영자용으로 유지하고 내부 key는 `TechnicalDetails`에서만 펼쳐 표시 |
| 중복 정리 경로 | `duplicateAbility` 이슈가 있으면 관련 ability 상세로 이동하는 버튼을 함께 노출 |
| 요약 카드 | 선택 leaf 수, 전체 leaf 수, 진단 수 표시 |
| 저장 버튼 | `!hasChanges || hasBlockingPermissionDiagnostics` 면 비활성화 |

## 화면 접근 렌더링 규칙

| 항목 | 설명 |
|------|------|
| 그룹화 | `groupId`, `groupLabel` 기준으로 카드 그룹화 |
| 상태 표시 | `isSelected` 로 `접근 허용` / `접근 차단` Chip 표시 |
| 편집 규칙 | blocking issue가 있으면 신규 허용 토글을 막음 |
| 전역 권한 | `hasGlobalAccess=true` 이면 모든 row를 허용 상태로 표시하고 토글을 잠금 |
| 진단 | 메뉴 진단 패널과 동일한 운영자용 카드 UI를 재사용 |
| 중복 정리 경로 | 관련 duplicate ability가 있으면 상세 화면으로 이동하는 버튼을 함께 노출 |

## 데이터 권한 렌더링 규칙

| 항목 | 설명 |
|------|------|
| 그룹화 | `groupLabel` 기준으로 CRUD bundle 카드 그룹화 |
| 액션 표시 | 생성 / 조회 / 수정 / 삭제 / 전체 관리 5개 액션을 고정 순서로 노출 |
| 미등록 상태 | canonical ability가 없으면 `미등록` Chip과 안내 문구를 표시 |
| 편집 규칙 | 편집 모드에서만 각 액션 Checkbox를 노출 |
| 전역 권한 | `hasGlobalAccess=true` 이면 모든 action을 허용/사용 가능으로 표시하고 Checkbox를 잠금 |

## 고급 권한 렌더링 규칙

| 모드 | 설명 |
|------|------|
| 조회 모드 | `grantedAdvancedAbilities` 만 표시 |
| 편집 모드 | `allAdvancedAbilities` + Checkbox + active Switch + priority Input 표시 |
| 범위 | `menu:` / `page:` subject와 canonical CRUD ability를 제외한 raw ability만 표시 |
| 구분 정보 | 각 row는 `ability.name`, `description`, `conditions`, `reason` 정보를 함께 표시해 예외 권한 차이를 드러냄 |

## 상태 계약

| prop | 설명 |
|------|------|
| `isLoading` | 역할 자체 로딩 |
| `isLoadingAbilities` | 현재 역할의 non-menu 조회 로딩 |
| `isLoadingAllAbilities` | 전체 non-menu 편집용 목록 로딩 |
| `isLoadingMenuPermissions` | subjects/all abilities 기반 menu editor 구성 로딩 |
| `isLoadingPagePermissions` | subjects/all abilities 기반 page editor 구성 로딩 |
| `isLoadingCrudBundles` | all abilities 기반 CRUD bundle 구성 로딩 |
| `isEditingGrants` | 메뉴 권한/고급 권한 동시 편집 모드 |
| `hasChanges` | 저장 필요 여부 |
| `hasGlobalAccess` | `manage all` 이 선택돼 메뉴/화면/CRUD를 전역 허용으로 보여줘야 하는지 여부 |
| `hasBlockingPermissionDiagnostics` | menu/page drift로 저장을 막아야 하는지 여부 |
| `role?.isSystem` | 수정/삭제 버튼 숨김, 시스템 안내 표시 |

## 인터랙션 계약

| 이벤트 | 설명 |
|--------|------|
| `onClickEditGrantsButton` | 메뉴 편집 또는 고급 편집 진입 |
| `onClickCancelEditGrantsButton` | 공통 편집 세션 취소 |
| `onToggleMenuPermission` | leaf menu 토글 |
| `onTogglePagePermission` | page access 토글 |
| `onToggleCrudAction` | CRUD bundle action 토글 |
| `onToggleAbilityCheckbox` | raw ability 선택/해제 |
| `onToggleGrantActiveSwitch` | 선택된 raw grant 활성 상태 변경 |
| `onChangeGrantPriorityInput` | 선택된 raw grant priority 변경 |
| `onClickOpenSaveGrantsModal` | 공통 저장 확인 모달 열기 |
| `onClickConfirmSaveGrantsButton` | 공통 저장 실행 |
| `onClickOpenAbilityDetail` | duplicate/catalog mismatch에 연결된 ability 상세 화면으로 이동 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@cocrepo/ui` | detail/layout primitive 재사용 |
| `@heroui/react` | Button, Modal, Table, Checkbox, Switch, Input, Chip |
| `lucide-react` | 아이콘 |
| `mobx-react-lite` | observer 래핑 |
| `react` | `ReactNode` 타입 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | FULL_ACCESS의 `manage all` 상태에서 전체 권한 안내와 세부 토글 잠금 UI를 문서화 | codex |
| 2026-04-06 | `hasGlobalAccess` prop과 전체 권한 안내/세부 토글 잠금 규칙을 문서화 | codex |
| 2026-04-06 | pure page를 메뉴/화면/CRUD/고급 4섹션 구조로 확장하고 운영자용 진단/technical details 계약을 반영 | codex |
| 2026-04-06 | 역할 상세 pure page를 메뉴 leaf 편집기 + non-menu 고급 권한 목록 2섹션 구조로 재정의하고 menu diagnostic 계약을 추가 | codex |
| 2026-04-08 | 고급 권한 목록에서 canonical CRUD를 제외하고 raw ability 식별/조건 정보를 노출하도록 갱신 | codex |
| 2026-04-08 | duplicate ability 이슈를 화면에서 안전하게 합치고 관련 ability 상세 이동 버튼 계약을 추가 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route runtime ownership에 맞춰 page를 props 기반 pure contract로 정리 | codex |
