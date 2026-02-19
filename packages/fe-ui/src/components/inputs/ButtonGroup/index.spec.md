# ButtonGroup Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/ButtonGroup/

## 역할

좌측/우측에 버튼 그룹을 배치하는 레이아웃 컴포넌트. 각 버튼은 선택적으로 Link 래핑이 가능하다.

## Props

```typescript
interface GroupButton extends ButtonProps {
  href?: LinkProps["href"];
}

interface ButtonGroupProps {
  leftButtons?: GroupButton[];
  rightButtons?: GroupButton[];
}
```

## 동작 규칙

| 조건 | 렌더링 |
|------|------|
| `href` 존재 | Link로 감싸서 color="primary" Button 렌더링 |
| `href` 없음 | size="sm" Button 직접 렌더링 |

## 레이아웃

- `flex flex-1 justify-between`
- 좌측 영역: `leftButtons` 렌더링
- 우측 영역: `rightButtons` 렌더링

## 의존성

- `Button` (내부 컴포넌트)
- HeroUI `Link`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
