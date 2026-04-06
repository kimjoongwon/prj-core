# AdminPageAccessGate ui 기획서

> 생성일: 2026-04-06
> 타입: ui
> 위치: apps/admin/web/src/app/(admin)/_layout/AdminPageAccessGate.tsx

## 역할

Admin 공통 layout 안에서 현재 pathname에 대응하는 `page:*` 권한을 확인하고, 접근 권한이 없으면 안내 화면으로 대체합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AdminPageAccessGate | 공개 계약 요소 |

## 규칙

- 현재 pathname이 `ADMIN_PAGE_ACCESS_ITEMS` 와 매칭되지 않으면 children을 그대로 통과시킵니다.
- 권한이 아직 로드되지 않았으면 "권한 확인 중" placeholder를 렌더링합니다.
- 현재 사용자에게 `manage all` 전역 권한이 있으면 page subject와 무관하게 즉시 통과시킵니다.
- 전역 권한이 없고 `view page:*` 권한도 없으면 안내 화면을 보여주고, dashboard 이동/이전 화면 액션을 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | `manage all` 전역 권한이 있으면 page gate를 즉시 통과시키는 규칙을 반영 | codex |
| 2026-04-06 | admin page access 권한을 runtime에서 소비하는 공통 gate를 신규 추가 | codex |
