# IdpConsoleIcon 기획서

> 생성일: 2026-03-23
> 수정일: 2026-03-23
> 타입: client component
> 위치: apps/idp/web/src/components/console/IdpConsoleIcon.tsx

## 역할

- IDP 콘솔 전용 브랜드 마크와 좌측 메뉴 아이콘을 SVG로 제공합니다.
- 공용 `AppIcon` registry를 건드리지 않고 `idp-web` 콘솔 visual만 별도로 제어합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `IdpConsoleIconName` | 브랜드/콘솔 메뉴 전용 아이콘 이름 |
| `IdpConsoleIconProps` | `name`, `size`, 기본 SVG 속성 |
| `IdpConsoleIcon` | 정적 SVG 아이콘 렌더러 |
| `getIdpConsoleIconName` | nav item id를 콘솔 아이콘 이름으로 변환하는 helper |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | IDP 콘솔 전용 SVG 아이콘 세트 추가 | codex |
