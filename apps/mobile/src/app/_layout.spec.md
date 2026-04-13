# mobile root layout 기획서

> 생성일: 2026-04-08
> 타입: layout
> 위치: apps/mobile/src/app/_layout.tsx

## 역할

Expo Router 루트 레이아웃에서 HeroUI Native Provider와 Gesture Handler root를 연결합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `GestureHandlerRootView` | HeroUI Native 필수 gesture 루트 |
| `DesignSystemProvider` | `@cocrepo/mo-ui`가 재노출한 HeroUI Native 전역 provider |
| `Stack` | 단일 화면 라우팅 컨테이너, 기본 헤더 숨김 |
| `global.css` import | Uniwind + HeroUI Native 스타일 로드 |

## 규칙

- 루트 레이아웃은 샘플 탭 네비게이션을 만들지 않고 단일 stack만 유지합니다.
- DesignSystemProvider는 GestureHandlerRootView 안쪽에서 렌더링합니다.
- 앱은 provider를 직접 `heroui-native`가 아니라 `@cocrepo/mo-ui`에서 import합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | HeroUI Native Provider 기반의 최소 루트 레이아웃으로 단순화 | codex |
| 2026-04-08 | 공용 모바일 UI 패키지의 DesignSystemProvider를 사용하도록 연결 | codex |
