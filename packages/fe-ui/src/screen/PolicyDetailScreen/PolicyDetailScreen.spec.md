# PolicyDetailScreen 기획서

> 생성일: 2026-04-28
> 타입: fe-ui-screen

## Props 계약

| prop | 설명 |
|------|------|
| `policy` | 정책 상세 데이터 |
| `abilities` | 선택 가능한 Ability 목록 |
| `selectedAbilityIds` | 현재 연결 또는 편집 중인 Ability ID |
| `isEditingAbilities` | Ability 편집 모드 |
| `onToggleAbility` | Ability 선택 토글 |
| `onClickSaveAbilitiesButton` | Ability 동기화 요청 |

## 시각 Composition

- `ScreenSurface + screen SectionSurface` 구조로 기본 정보와 Ability 연결 섹션을 분리합니다.
- 기본 정보에는 Space ID와 시스템 정책 여부를 표시합니다.
- 편집 모드에서만 Checkbox를 노출합니다.
- 삭제 확인은 HeroUI `Modal`로 표시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 정책 상세 pure screen 컴포넌트 추가 | codex |
| 2026-04-28 | Space scoped Policy 필드와 PolicyAbility 기반 선택 상태 반영 | codex |
