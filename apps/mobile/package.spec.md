# mobile-app package 기획서

> 생성일: 2026-04-08
> 타입: package
> 위치: apps/mobile/package.json

## 역할

Expo 기반 모바일 앱의 실행 스크립트와 HeroUI Native/Uniwind, dev client 의존성 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| scripts | Expo 실행, lint, doctor, type-check 진입점 |
| dependencies | Expo Router, Expo Dev Client, HeroUI Native, Uniwind, React Native, MobX 런타임, @cocrepo/mo-ui 런타임 의존성 |

## 규칙

- HeroUI Native는 `heroui-native` 본체와 quick start에서 요구하는 peer dependency를 함께 유지합니다.
- 모바일 앱은 공용 모바일 UI 패키지 `@cocrepo/mo-ui`를 통해 provider와 공용 컴포넌트를 소비합니다.
- 모바일 앱은 Expo Metro가 workspace 공용 UI 내부 import를 안정적으로 해상할 수 있도록 `mobx`와 `mobx-react-lite`를 앱 의존성에도 명시합니다.
- 모바일 앱은 `pnpm start`의 local build(`--dev-client`) 실행 경로를 지원하기 위해 `expo-dev-client` 의존성을 유지합니다.
- 모바일 앱은 Expo SDK 55가 기대하는 patch range에 맞춰 `expo`, `expo-linking`, `expo-router`, `expo-splash-screen`, `react-native-svg` 버전을 `expo install --check` 기준으로 정렬합니다.
- Expo Router peer dependency 계약에 맞춰 `expo-constants`를 앱 직접 의존성으로 유지합니다.
- Expo Autolinking은 모바일 앱의 직접 의존성을 우선 링크하도록 `legacy_shallowReactNativeLinking`을 활성화해 nested peer installation 중복 경고를 줄입니다.
- 모바일 앱은 Expo Router 단일 엔트리를 사용하고, 샘플 탭 화면을 추가하지 않습니다.
- Expo 템플릿의 `reset-project` 같은 일회성 초기화 스크립트는 유지하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | `expo-constants` 직접 의존성과 shallow RN autolinking 규칙을 추가하고 `react-native-worklets`를 SDK 55 권장 patch로 정렬 | codex |
| 2026-04-14 | Expo SDK 55 dependency validation 경고를 막기 위해 핵심 Expo 패키지 patch version 정합성 규칙을 추가 | codex |
| 2026-04-14 | `pnpm start` local build 경로를 위해 `expo-dev-client` 의존성 계약을 추가 | codex |
| 2026-04-13 | Expo Metro 해상 안정성을 위해 `mobx`와 `mobx-react-lite`를 모바일 앱 직접 의존성으로 명시 | codex |
| 2026-04-08 | HeroUI Native + Uniwind 설정을 위한 모바일 패키지 계약 문서 신규 생성 | codex |
| 2026-04-08 | 공용 모바일 UI 패키지 `@cocrepo/mo-ui` 의존성과 소비 규칙을 반영 | codex |
