# RoleNameCell 기획서

> 생성일: 2026-03-28
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/RoleNameCell/

## 역할

역할 식별자(`font-mono`)와 시스템 여부 배지를 한 셀 안에서 함께 표현하는 공용 셀입니다.

## Props

```typescript
interface RoleNameCellProps {
  value?: string | null;
  isSystem?: boolean;
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | `columns/raw` 제거 후 역할 목록 `MetaDataGrid`에서도 재사용되도록 용도 설명을 공용 셀 기준으로 정리 | codex |
| 2026-03-28 | 역할 컬럼의 이름+시스템 배지 조합을 columns 내부 구현에서 cell 레이어로 이동 | codex |
