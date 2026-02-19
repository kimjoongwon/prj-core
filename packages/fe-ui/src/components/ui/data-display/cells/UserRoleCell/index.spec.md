# UserRoleCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/UserRoleCell/

## 역할

사용자의 테넌트 목록에서 첫 번째 역할을 RoleChipCell로 표시하는 Cell 컴포넌트. DataGrid에서 사용자 행의 역할 칼럼에 사용된다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시:

┌──────────────────────┐
│ 역할                  │
├──────────────────────┤
│ ╔══════════════╗     │
│ ║ 슈퍼관리자   ║     │  ← tenants[0].role = FULL_ACCESS (primary)
│ ╚══════════════╝     │
├──────────────────────┤
│ ╔════════╗           │
│ ║ 관리자 ║           │  ← tenants[0].role = MANAGE (primary)
│ ╚════════╝           │
├──────────────────────┤
│ ╔══════╗             │
│ ║ 일반 ║             │  ← tenants[0].role = 기타 (default)
│ ╚══════╝             │
├──────────────────────┤
│ -                    │  ← tenants 비어있음 / null
└──────────────────────┘

내부 구조:
  UserRoleCell
    └─ RoleChipCell (tenants[0].role 전달)
         └─ Chip (size="sm", variant="flat")
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| FULL_ACCESS | `[ 슈퍼관리자 ]` (primary, 파란 계열) |
| MANAGE | `[ 관리자 ]` (primary, 파란 계열) |
| PROJECT | `[ 프로젝트 ]` (secondary, 보라 계열) |
| 기타 역할 | `[ 일반 ]` (default, 회색 계열) |
| 역할 없음 | `-` (text-default-400) |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
