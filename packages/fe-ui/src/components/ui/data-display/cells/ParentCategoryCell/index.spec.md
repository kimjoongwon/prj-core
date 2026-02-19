# ParentCategoryCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/ParentCategoryCell/

## 역할

부모 카테고리명을 표시하는 Cell 컴포넌트. 부모가 없으면 "-"를 표시한다.

## Props

```typescript
interface ParentCategoryCellProps {
  /** 부모 카테고리명 (없으면 null) */
  parentName: string | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 | 스타일 |
|---|---|---|
| 유효한 문자열 | 해당 문자열 | 기본 |
| `null` / `undefined` / `""` | - | text-default-400 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
