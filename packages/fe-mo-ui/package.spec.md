# @cocrepo/mo-ui package 기획서

> 생성일: 2026-04-08
> 타입: package
> 위치: packages/fe-mo-ui/package.json

## 역할

HeroUI Native 기반 모바일 공용 UI 패키지의 의존성, 공개 엔트리, 개발 스크립트 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `dependencies` | `heroui-native` 런타임 의존성 |
| `devDependencies` | React / React Native / TypeScript 타입체크 의존성 |
| `exports` | 루트 엔트리와 `package.json` 공개 계약 |

## 규칙

- 패키지는 source-direct export 방식을 사용하며 별도 build 산출물을 만들지 않습니다.
- 모바일 앱은 `@cocrepo/mo-ui` 루트 import만 사용합니다.
- 컴포넌트 구현은 HeroUI Native 공개 API를 thin wrapper 형태로 재노출합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | 모바일 공용 UI 패키지 `@cocrepo/mo-ui` 신규 생성 | codex |
