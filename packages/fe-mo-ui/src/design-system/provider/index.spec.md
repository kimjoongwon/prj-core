# design-system provider index 기획서

> 생성일: 2026-04-08
> 타입: provider
> 위치: packages/fe-mo-ui/src/design-system/provider/index.ts

## 역할

HeroUI Native provider와 portal host를 `@cocrepo/mo-ui` 이름으로 감싼 명시적 wrapper를 제공해 모바일 앱의 디자인 시스템 진입점을 고정합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `DesignSystemProvider` | HeroUI Native provider를 감싼 앱 공용 provider wrapper입니다. |
| `DesignSystemProviderProps` | provider wrapper의 local props 타입입니다. |
| `PortalHost` | overlay 계층 배치를 위한 portal host wrapper입니다. |
| `PortalHostProps` | portal host wrapper의 local props 타입입니다. |
| `HeroUINativeConfig` | provider config 타입 alias입니다. |

## 비고

- 단순 alias가 아니라 로컬 wrapper 함수로 패키지 경계를 고정합니다.
- mobile app은 `@cocrepo/mo-ui`만 import하도록 유지합니다.
- Expo/Metro 모듈 해석 차이로 named export가 비어도 동작하도록 provider와 portal host는 named/default interop fallback을 함께 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | Expo 런타임에서 provider subpath interop 차이를 흡수하도록 named/default fallback을 추가 | codex |
| 2026-04-13 | provider와 portal host를 명시적 wrapper 구조로 재정의 | codex |
| 2026-04-08 | HeroUI Native provider 공개 계약 신규 생성 | codex |
