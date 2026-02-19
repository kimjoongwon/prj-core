# Button Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/Button/

## 역할

HeroUI Button의 래퍼 컴포넌트. HeroUI의 `ButtonProps`를 그대로 전달하며, 프로젝트 전반에서 일관된 Button 사용을 보장한다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
