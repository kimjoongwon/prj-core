# TenantAccessRequestReviewListPage 기획서

> 생성일: 2026-04-28
> 수정일: 2026-05-01
> 타입: fe-ui-screen
> 위치: `packages/fe-ui/src/screen/TenantAccessRequestReviewListPage/TenantAccessRequestReviewListPage.tsx`

## 화면 목적

승인자가 자신에게 처리 권한이 있는 테넌트 접근 신청 목록을 확인하고 상세 검토 화면으로 이동한다.

## Props 계약

| prop | 설명 |
|------|------|
| `requests` | `TenantAccessRequestDto[]` optional. 신청자/Space/Role/상태/신청일은 DTO에서 파생 |
| `totalCount` | 조회 가능한 전체 신청 수 |
| `pendingCount` | 승인 대기 신청 수 |
| `isLoading` | 목록/통계 loading 상태 |
| `onClickRequestRow` | 상세 화면 이동 이벤트 |

## 화면 구성

| 영역 | owner | 설명 |
|------|-------|------|
| 제목 | `PageTitleBar` | 접근 승인 화면 제목 |
| 통계 | `PageSurface > SectionSurface` | 전체 신청/승인 대기 수 |
| 목록 | `PageSurface > SectionSurface` | HeroUI Table 기반 검토 목록 |
| 상태/요약 | widget | 상태 badge와 Space/Role/신청자 요약 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| TARP-REVIEW-LIST-001 | 검토 목록 있음 | 화면 진입 | 신청자/Space/Role/상태가 보임 |
| TARP-REVIEW-LIST-002 | 목록 row 있음 | 보기 클릭 | `onClickRequestRow`에 신청 ID 전달 |
| TARP-REVIEW-LIST-003 | 목록 없음 | 화면 진입 | emptyContent가 보임 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | Table aria/empty/action 문구가 런타임 i18n을 사용하도록 반영 | codex |
| 2026-04-28 | 초기 생성 | Codex |
| 2026-04-28 | 목록 row 계약을 Page 전용 ListItem 대신 Orval DTO optional props로 정리 | codex |
