# admin-web 패키지 기획서

> 생성일: 2026-04-07
> 타입: package
> 위치: apps/admin/web/package.json

## 역할

Admin Next.js 앱의 실행/빌드 스크립트와 workspace 의존성 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| scripts | dev/build/start/type-check/lint 진입점 |
| dependencies | admin web이 직접 import하는 workspace/package 의존성 |

## 규칙

- 앱이 직접 import하는 workspace 패키지는 `dependencies` 에 명시해 Turbo task graph가 실제 의존 관계를 추론할 수 있게 유지합니다.
- `@cocrepo/constant` 는 admin route meta generated catalog와 page/menu 권한 카탈로그를 함께 제공하므로 admin-web direct dependency로 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | `@cocrepo/constant` direct dependency를 명시해 Turbo dev/build graph와 실제 import 관계를 정렬 | codex |
