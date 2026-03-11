# icon util 기획서

> 생성일: 2026-03-11
> 타입: util
> 위치: packages/common-type/src/icon.ts

## 역할

런타임 문자열로 선택하는 앱 아이콘 이름을 유한 집합으로 고정합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AppIconName | 네비게이션/FAB/AppLogo에서 허용하는 Lucide 아이콘 이름 union |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | 루트 UI 배럴 최적화를 위해 앱에서 허용하는 아이콘 이름 계약을 `AppIconName` union으로 고정 | codex |
