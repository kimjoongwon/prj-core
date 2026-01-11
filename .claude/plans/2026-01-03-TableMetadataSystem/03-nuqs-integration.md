# 03. nuqs 기반 URL Querystring 연동

## 1. 자동 연동 원칙

모든 필터, 검색, 페이지네이션은 **nuqs를 통해 URL querystring과 자동 동기화**됩니다.

```
URL: /admin/members?search=홍길동&role=ADMIN&take=20&skip=0&startDate=2025-01-01
```

---

## 2. useTableQueryStates 훅

```typescript
// hooks/useTableQueryStates.ts
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function useTableQueryStates(inputs: InputConfig[]) {
  // InputConfig에서 querystring 파서 자동 생성
  const parsers = useMemo(() => {
    const result: Record<string, any> = {
      // 기본 페이지네이션
      take: parseAsInteger.withDefault(10),
      skip: parseAsInteger.withDefault(0),
    };

    for (const input of inputs) {
      const key = input.props?.queryKey ?? input.id;

      switch (input.type) {
        case 'search':
          result[key] = parseAsString.withDefault('');
          break;
        case 'select':
          result[key] = parseAsString.withDefault(input.props?.defaultValue ?? '');
          break;
        case 'multi-select':
          result[key] = parseAsArrayOf(parseAsString).withDefault([]);
          break;
        case 'date-range':
          const keys = input.props?.queryKeys ?? { start: `${key}Start`, end: `${key}End` };
          result[keys.start] = parseAsIsoDateTime;
          result[keys.end] = parseAsIsoDateTime;
          break;
      }
    }

    return result;
  }, [inputs]);

  return useQueryStates(parsers);
}
```

---

## 3. 검색 입력 nuqs 연동

```typescript
// inputs/SearchInput.tsx
function SearchInput({ config }: { config: InputConfig }) {
  const queryKey = config.props?.queryKey ?? config.id;
  const [query, setQuery] = useQueryState(queryKey, parseAsString.withDefault(''));

  const debouncedSetQuery = useDebouncedCallback(
    (value: string) => setQuery(value),
    config.props?.debounceMs ?? 300
  );

  return (
    <Input
      placeholder={config.placeholder}
      defaultValue={query}
      onChange={(e) => debouncedSetQuery(e.target.value)}
      startContent={<Search size={16} />}
    />
  );
}
```

---

## 4. 필터 셀렉트 nuqs 연동

```typescript
// inputs/SelectInput.tsx
function SelectInput({ config }: { config: InputConfig }) {
  const queryKey = config.props?.queryKey ?? config.id;
  const [value, setValue] = useQueryState(queryKey, parseAsString);

  return (
    <Select
      placeholder={config.placeholder}
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setValue(selected || null);
      }}
    >
      {config.props?.options?.map((opt) => (
        <SelectItem key={opt.value}>{opt.label}</SelectItem>
      ))}
    </Select>
  );
}
```

---

## 5. QueryStates 전달 흐름

### 5.1 핵심 원칙

**queryStates는 페이지에서 관리하고, TablePage에 주입합니다.**

```
[페이지]                              [TablePage]
    │                                      │
    ├─ useTableQueryStates() ──────────────┤
    │       │                              │
    │       ▼                              │
    ├─ queryStates ───► API 호출           │
    │       │                              │
    │       ▼                              │
    ├─ data ───────────────────────────────► 렌더링
    │                                      │
    └─ queryStates, setQueryStates ────────► Input 연동
```

### 5.2 useTableQueryStates 훅 (페이지에서 사용)

```typescript
// hooks/useTableQueryStates.ts
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

/**
 * 페이지에서 호출하여 queryStates를 관리
 * - API 호출에 사용
 * - TablePage에 주입
 */
export function useTableQueryStates(inputs: InputConfig[]) {
  const parsers = useMemo(() => {
    const result: Record<string, any> = {
      take: parseAsInteger.withDefault(10),
      skip: parseAsInteger.withDefault(0),
    };

    for (const input of inputs) {
      const key = input.props?.queryKey ?? input.id;
      switch (input.type) {
        case 'search':
          result[key] = parseAsString.withDefault('');
          break;
        case 'select':
          result[key] = parseAsString.withDefault('');
          break;
        // ... 기타 타입
      }
    }
    return result;
  }, [inputs]);

  return useQueryStates(parsers);
}
```
