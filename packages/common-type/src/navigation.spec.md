# navigation util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-type/src/navigation.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AppIconName | 네비게이션과 FAB에서 공통으로 쓰는 허용 아이콘 이름 계약 |
| ScreenScopeKind | 화면/메뉴를 `space`, `tenant-user`, `global-full-access-only`로 구분하는 공용 스코프 계약 |
| TabConfig | 공개 계약 요소 |
| NavItemConfig | `icon`을 자유 문자열이 아니라 `AppIconName`으로 제한하고 `scopeKind`를 포함할 수 있는 네비게이션 계약 |
| FABAction | `icon`을 `AppIconName`으로 제한한 FAB 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | admin/idp 공통 화면 정책을 위해 `ScreenScopeKind`와 `NavItemConfig.scopeKind` 계약을 추가 | codex |
| 2026-03-11 | 네비게이션/FAB 아이콘 계약을 자유 문자열에서 `AppIconName` 유한 집합으로 고정 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
