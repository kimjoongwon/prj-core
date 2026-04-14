# @cocrepo/mo-ui package 기획서

> 생성일: 2026-04-08
> 타입: package
> 위치: packages/fe-mo-ui/package.json

## 역할

HeroUI Native 기반 모바일 공용 UI 패키지의 의존성, 공개 엔트리, 개발 스크립트, Jest 테스트 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `dependencies` | MobX 기반 wrapper 런타임 의존성 |
| `peerDependencies` | 앱이 제공해야 하는 `heroui-native` 런타임 계약 |
| `devDependencies` | React / React Native / TypeScript / `heroui-native` / Jest 모바일 테스트 의존성 |
| `exports` | 루트 엔트리와 `package.json` 공개 계약 |

## 규칙

- 패키지는 source-direct export 방식을 사용하며 별도 build 산출물을 만들지 않습니다.
- 모바일 앱은 `@cocrepo/mo-ui` 루트 import만 사용합니다.
- 컴포넌트 구현은 HeroUI Native 공개 API를 thin wrapper 형태로 재노출합니다.
- `heroui-native`는 앱이 단일 runtime owner가 되도록 peer dependency로 선언하고, 패키지 로컬 개발을 위해서만 dev dependency에도 둡니다.
- 패키지 unit test는 `jest-expo`와 React Native Testing Library 기준으로 실행합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 공용 UI 패키지 Jest test 스크립트와 테스트 의존성 계약을 추가 | codex |
| 2026-04-14 | `heroui-native`를 앱 제공 peer dependency로 전환해 모바일 앱의 중복 native module 해석을 줄이는 규칙을 추가 | codex |
| 2026-04-08 | 모바일 공용 UI 패키지 `@cocrepo/mo-ui` 신규 생성 | codex |
