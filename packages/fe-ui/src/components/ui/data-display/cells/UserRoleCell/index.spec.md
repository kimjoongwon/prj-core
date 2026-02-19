# UserRoleCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/UserRoleCell/

## 역할

사용자의 테넌트 목록에서 첫 번째 역할을 RoleChipCell로 표시하는 Cell 컴포넌트. DataGrid에서 사용자 행의 역할 칼럼에 사용된다.

## Props

```typescript
interface TenantLike {
  role?: { name?: string; displayName?: string } | null;
}

interface UserRoleCellProps {
  /** 사용자의 테넌트 배열 (API TenantDto 호환) */
  tenants?: TenantLike[] | null;
}
```

## 표시 규칙

| 조건 | 표시 |
|---|---|
| `tenants[0].role` 존재 | RoleChipCell로 역할 표시 |
| tenants 비어있음 / null | - (RoleChipCell의 null 처리) |

## 의존성

- `RoleChipCell` - 내부적으로 위임

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
