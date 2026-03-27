# NameCell 기획서

> 생성일: 2026-03-27
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/NameCell/NameCell.tsx

## 역할

목록형 테이블에서 이름 계열 값을 일관된 톤으로 표시하는 공용 cell입니다.
기본 이름, 식별자 이름, 클릭 가능한 이름을 하나의 primitive로 통합합니다.

## Props

```typescript
interface NameCellProps {
  value?: string | null;
  variant?: "plain" | "identifier" | "clickable";
  onPress?: () => void;
}
```

## 표시 규칙

| variant      | 표시                            |
| ------------ | ------------------------------- |
| `plain`      | 굵은 이름 텍스트, truncate 처리 |
| `identifier` | monospace 식별자 텍스트         |
| `clickable`  | 링크 스타일 버튼 텍스트         |

## 변경 이력

| 일자       | 내용                                                                             | 작성자 |
| ---------- | -------------------------------------------------------------------------------- | ------ |
| 2026-03-27 | `columns` 레이어의 이름 컬럼 기본 렌더링을 공통 cell로 끌어올리기 위해 신규 생성 | codex  |
