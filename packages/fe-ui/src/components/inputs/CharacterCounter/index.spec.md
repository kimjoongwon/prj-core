# CharacterCounter Input 기획서

> 생성일: 2026-02-18
> 타입: input (보조)
> 위치: packages/fe-ui/src/components/inputs/CharacterCounter/

## 역할

텍스트 입력의 현재 글자 수와 최대 글자 수를 "현재 / 최대" 형태로 표시하는 보조 컴포넌트. 80% 이상이면 경고색, 초과하면 위험색으로 표시한다.

## Props

```typescript
interface CharacterCounterProps {
  /** 현재 글자 수 */
  current: number;
  /** 최대 글자 수 */
  max: number;
  /** 경고 표시 여부 @default true */
  showWarning?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 표시 규칙

| 조건 | 색상 |
|------|------|
| `current > max` | text-danger |
| `current >= max * 0.8` (showWarning=true) | text-warning |
| 그 외 | text-default-500 |

## 스타일

- `text-right text-sm text-default-500` 기본
- 조건에 따라 색상 클래스 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
