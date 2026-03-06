# Button Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/input/Button/

## 역할

HeroUI Button의 래퍼 컴포넌트. HeroUI의 `ButtonProps`를 그대로 전달하며, 프로젝트 전반에서 일관된 Button 사용을 보장한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[color 변형]
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│   기본     │  │  primary  │  │  danger   │  │  success  │
│  (default) │  │  (파란색) │  │  (빨간색) │  │  (녹색)   │
└───────────┘  └───────────┘  └───────────┘  └───────────┘

[variant 변형]
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  solid      │  │  flat       │  │  bordered   │
│  (배경색)   │  │  (연배경)   │  │  (테두리)   │
└─────────────┘  └─────────────┘  └─────────────┘

[size 변형]
┌──┐  ┌────────┐  ┌────────────────┐
│sm│  │   md   │  │       lg       │
└──┘  └────────┘  └────────────────┘

[상태 변형]
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  ◌ 로딩 중   │  │  비활성화      │  │ 🔍 아이콘전용 │
│  (isLoading)  │  │  (isDisabled) │  │  (isIconOnly) │
└───────────────┘  └───────────────┘  └───────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| solid (기본) | 색상 배경 + 흰색 텍스트 |
| flat | 연한 배경 + 색상 텍스트 |
| bordered | 투명 배경 + 색상 테두리 + 색상 텍스트 |
| light | 배경 없음 + 색상 텍스트 (hover 시 배경) |
| isLoading | 스피너 아이콘 + 버튼 비활성화 |
| isDisabled | 전체적으로 흐릿하게 표시 |
| isIconOnly | 정사각형 버튼, 아이콘만 표시 |

## Props

```typescript
// HeroUI ButtonProps 그대로 사용
interface ButtonProps extends HeroUI.ButtonProps {}
```

주요 props:
- `onPress`: 클릭 핸들러
- `color`: primary, danger, success 등
- `variant`: flat, bordered, light 등
- `size`: sm, md, lg
- `isIconOnly`: 아이콘 전용 모드
- `isLoading`: 로딩 상태
- `isDisabled`: 비활성화

## HeroUI 매핑

- `@heroui/react`의 `Button` 직접 래핑

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
