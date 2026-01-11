# 01. 개요 및 기존 컴포넌트 분석

## 1. 목적

테이블 화면을 **메타데이터 기반 선언적 시스템**으로 구성합니다.
메타데이터만 제공하면 테이블 전체가 자동으로 구성됩니다.

## 2. 기존 컴포넌트 활용

| 컴포넌트 | 위치 | 역할 |
|---------|------|------|
| **DataGrid** | `components/ui/data-display/DataGrid` | TanStack Table 래퍼 |
| **Table** | `components/ui/data-display/Table` | 기본 테이블 |
| **Pagination** | `components/inputs/Pagination` | nuqs 기반 페이지네이션 |

## 3. 핵심 원칙

```
메타데이터 = columns + data + leftInputs + rightInputs
     ↓
TablePage 컴포넌트 (기존 DataGrid, Pagination 활용)
     ↓
완성된 테이블 UI (URL querystring 자동 연동)
```

- **선언적 구성**: 메타데이터로 테이블 정의
- **nuqs 연동**: 페이지네이션, 필터가 URL querystring과 자동 동기화
- **기존 컴포넌트 재사용**: DataGrid, Pagination, Table 활용
- **Admin 접두어 없음**: 범용 컴포넌트로 설계

---

## 4. 기존 컴포넌트 분석

### 4.1 Pagination (nuqs 연동)

```typescript
// packages/ui/src/components/inputs/Pagination/Pagination.tsx
// 이미 nuqs로 URL querystring 연동됨

const [{ take, skip }, setQueryStates] = useQueryStates({
  take: parseAsInteger.withDefault(10),
  skip: parseAsInteger.withDefault(0),
});

// URL: ?take=10&skip=0
```

### 4.2 DataGrid (TanStack Table 래퍼)

```typescript
// packages/ui/src/components/ui/data-display/DataGrid/DataGrid.tsx

export type DataGridProps<T> = {
  state: { selectedKeys: Key[] | null };
  columns: ColumnDef<T, any>[];
  data: (T & { id: Key })[];
};
```
