# ThemeToggleButton feature 기획서

> 생성일: 2026-03-23
> 타입: feature
> 위치: packages/fe-ui/src/feature/ThemeToggleButton/ThemeToggleButton.tsx

## 역할

- 공용 shell과 인증 화면에서 light/dark theme 전환 버튼을 제공합니다.
- `DesignSystemProvider`가 관리하는 테마 상태와 `heroui-theme` 저장 키를 재사용합니다.
- 앱별 header/auth layout은 동일한 토글 구현을 `@cocrepo/ui`를 통해 공유합니다.

## 입력 계약

| 이름 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `className` | `string` | `undefined` | 배치 위치와 외형 보정을 위한 추가 클래스 |
| `compact` | `boolean` | `false` | `true`면 아이콘 전용 버튼으로 렌더링 |

## 렌더링 규칙

- mount 전에는 `테마 전환` 공통 라벨을 사용해 hydration 시 라벨 튐을 줄입니다.
- mount 후 `resolvedTheme`를 기준으로 다음 전환 대상(`라이트 모드`, `다크 모드`)을 표시합니다.
- compact 모드가 아니면 아이콘과 텍스트를 함께 노출합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | IDP 로컬 구현을 `fe-ui` 공용 feature로 승격 | codex |
