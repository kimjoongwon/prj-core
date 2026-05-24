# TenantAccessRequestCreatePage 기획서

> 생성일: 2026-04-28
> 수정일: 2026-04-28
> 타입: fe-ui-screen
> 위치: `packages/fe-ui/src/screen/TenantAccessRequestCreatePage/TenantAccessRequestCreatePage.tsx`

## 화면 목적

신청자가 접근이 필요한 Space와 희망 Role을 선택하고 신청 사유를 입력해 접근 신청을 제출한다.

## Props 계약

| prop | 설명 |
|------|------|
| `form` | `spaceId`, `requestedRoleId`, `reason` 입력 상태 |
| `spaceOptions` | `form/create`에서 받은 Space 선택 옵션 |
| `roleOptions` | `form/create`에서 받은 Role 선택 옵션 |
| `isLoading` | bootstrap 조회 loading 상태 |
| `isSubmitting` | 신청 생성 mutation 상태 |
| `onClickBackButton` | 목록으로 돌아가기 |
| `onChangeSpaceSelection` | Space 선택 변경 |
| `onChangeRoleSelection` | Role 선택 변경 |
| `onChangeReasonTextarea` | 신청 사유 변경 |
| `onClickSubmitButton` | 신청 제출 |

## 화면 구성

| 영역 | owner | 설명 |
|------|-------|------|
| 제목/액션 | `PageTitleBar` | 접근 신청 제목과 목록 버튼 |
| 폼 Surface | `PageSurface > SectionSurface` | Space select, Role select, reason textarea |
| 제출 액션 | `HStack` | 취소/신청 제출 버튼 |

## Create 폼 계약

| 항목 | 설명 |
|------|------|
| `defaultObject.spaceId` | 초기 선택 Space ID |
| `defaultObject.requestedRoleId` | 초기 선택 Role ID |
| `defaultObject.reason` | 초기 신청 사유 |
| `options.spaceId` | Space 선택지 |
| `options.requestedRoleId` | Role 선택지 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| TARP-CREATE-001 | bootstrap 완료 | 화면 진입 | Space/Role select와 사유 textarea가 보임 |
| TARP-CREATE-002 | 필수 선택값 없음 | 렌더링 | 제출 버튼이 비활성화됨 |
| TARP-CREATE-003 | 필수 선택값 있음 | 제출 클릭 | `onClickSubmitButton`이 호출됨 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 초기 생성 | Codex |
