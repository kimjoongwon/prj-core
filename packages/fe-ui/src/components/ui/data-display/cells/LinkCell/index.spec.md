# LinkCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/LinkCell/

## 역할

클릭 가능한 링크로 값을 표시하는 Cell 컴포넌트. HeroUI Link의 모든 props를 지원한다.

## Props

```typescript
interface LinkCellViewProps extends LinkProps {
  /** 링크 텍스트 */
  value: string;
}
```

## 표시 규칙

| 조건 | 동작 |
|---|---|
| `href` 제공 | 해당 경로로 이동하는 링크 렌더링 |
| `isExternal` | 외부 링크로 동작 |
| `onPress` | 클릭 핸들러 실행 |

## HeroUI 매핑

- `Link` 컴포넌트 - `value`를 children으로 전달하고 나머지 props를 spread

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
