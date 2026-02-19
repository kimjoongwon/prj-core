# RoleChipCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/RoleChipCell/

## 역할

역할(Role) 객체를 Chip으로 표시하는 Cell 컴포넌트. 역할 이름에 따라 색상이 달라진다.

## Props

```typescript
interface Role {
  name?: string;
  displayName?: string;
}

interface RoleChipCellProps {
  /** 역할 객체 */
  role?: Role | null;
}
```

## 표시 규칙

| 역할 name | Chip color | 표시 텍스트 |
|---|---|---|
| `FULL_ACCESS` | primary | displayName 또는 name |
| `MANAGE` | primary | displayName 또는 name |
| `PROJECT` | secondary | displayName 또는 name |
| 기타 | default | displayName 또는 name |
| `null` / `undefined` | (없음) | - (text-default-400) |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
