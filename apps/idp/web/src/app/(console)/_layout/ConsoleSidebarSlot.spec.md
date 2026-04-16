# ConsoleSidebarSlot ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: apps/idp/web/src/app/(console)/_layout/ConsoleSidebarSlot.tsx

## 역할

IDP 콘솔 sidebar와 현재 tenant scope 안내 문구를 렌더링합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| ConsoleSidebarSlot | 공개 계약 요소 |

## 규칙

- `verify-token.hasFullAccess`가 true면 footer에 현재 tenant FULL_ACCESS로 전체 리소스를 확인한다는 안내를 표시합니다.
- 그 외에는 현재 선택 Space 이름(`groundName`) 기준으로 범위가 제한된다는 문구를 표시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | sidebar footer가 current tenant FULL_ACCESS 여부에 따라 scope 안내 문구를 바꾸도록 갱신 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
