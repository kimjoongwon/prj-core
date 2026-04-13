# mobile-app package 기획서

> 생성일: 2026-04-08
> 타입: package
> 위치: apps/mobile/package.json

## 역할

Expo 기반 모바일 앱의 실행 스크립트와 HeroUI Native/Uniwind 의존성 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| scripts | Expo 실행, lint, doctor, type-check 진입점 |
| dependencies | Expo Router, HeroUI Native, Uniwind, React Native, @cocrepo/mo-ui 런타임 의존성 |

## 규칙

- HeroUI Native는 `heroui-native` 본체와 quick start에서 요구하는 peer dependency를 함께 유지합니다.
- 모바일 앱은 공용 모바일 UI 패키지 `@cocrepo/mo-ui`를 통해 provider와 공용 컴포넌트를 소비합니다.
- 모바일 앱은 Expo Router 단일 엔트리를 사용하고, 샘플 탭 화면을 추가하지 않습니다.
- Expo 템플릿의 `reset-project` 같은 일회성 초기화 스크립트는 유지하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | HeroUI Native + Uniwind 설정을 위한 모바일 패키지 계약 문서 신규 생성 | codex |
| 2026-04-08 | 공용 모바일 UI 패키지 `@cocrepo/mo-ui` 의존성과 소비 규칙을 반영 | codex |
