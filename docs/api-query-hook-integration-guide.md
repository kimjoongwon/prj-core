# API Query Hook 통합 가이드

## 개요

기존의 3개의 개별 쿼리 훅(`useGetTableQuery`, `useGetListQuery`, `useGetResourceQuery`)을 하나의 통합된 `useApiQuery` 훅으로 통합했습니다.

## 변경 사항

### 새로운 통합 훅: `useApiQuery`

하나의 훅으로 모든 API 쿼리 타입을 처리:
- **Table**: 페이지네이션이 있는 테이블 데이터 조회
- **List**: 옵션 변환이 필요한 리스트 데이터 조회  
- **Resource**: URL 라우팅 기반 리소스 데이터 조회

### 새로운 타입 시스템

```typescript
// 통합 쿼리 빌더
interface ApiQueryBuilder {
  type: 'table' | 'list' | 'resource';
  query: Query;
  
  // 테이블 전용
  pagination?: {
    enabled: boolean;
    defaultTake?: number;
  };
  
  // 리스트 전용
  listOptions?: {
    valueField: string;
    labelField: string;
  };
  
  // 리소스 전용
  resourceName?: string;
}
```

## 마이그레이션 가이드

### 1. Table Query 마이그레이션

**기존:**
```typescript
import { useGetTableQuery } from '@shared/frontend';

const { data, meta, isLoading, skip, take, setSkip, setTake } = useGetTableQuery(tableBuilder);
```

**새로운 방식:**
```typescript
import { useApiQuery } from '@shared/frontend';

const { data, meta, isLoading, skip, take, setSkip, setTake } = useApiQuery({
  type: 'table',
  query: tableBuilder.query || { name: '', params: {} },
  pagination: {
    enabled: true,
    defaultTake: 10,
  },
});
```

### 2. List Query 마이그레이션

**기존:**
```typescript
import { useGetListQuery } from '@shared/frontend';

const { options, isLoading } = useGetListQuery(query);
```

**새로운 방식:**
```typescript
import { useApiQuery } from '@shared/frontend';

const { options, isLoading } = useApiQuery({
  type: 'list',
  query: { name: query.apiKey, params: query.params },
  listOptions: {
    valueField: query.valueField,
    labelField: query.labelField,
  },
});
```

### 3. Resource Query 마이그레이션

**기존:**
```typescript
import { useGetResourceQuery } from '@shared/frontend';

const { data, isLoading, error, id, type } = useGetResourceQuery(resourceBuilder);
```

**새로운 방식:**
```typescript
import { useApiQuery } from '@shared/frontend';

const { data, isLoading, error, id, type } = useApiQuery({
  type: 'resource',
  query: resourceBuilder.query || { name: '', params: {} },
  resourceName: resourceBuilder.resourceName,
});
```

## 호환성

기존 훅들은 **deprecated**로 표시되었지만 여전히 사용 가능합니다. 내부적으로 새로운 `useApiQuery`를 사용하도록 리팩토링되었습니다.

## 장점

1. **코드 중복 제거**: 공통 로직이 통합되어 유지보수가 쉬워짐
2. **일관된 API**: 모든 쿼리 타입에 대해 일관된 인터페이스 제공
3. **타입 안전성**: TypeScript를 통한 강력한 타입 체킹
4. **확장성**: 새로운 쿼리 타입 추가가 쉬워짐

## 테스트

새로운 통합 훅에 대한 포괄적인 테스트 커버리지를 제공합니다:
- Table query 테스트
- List query 테스트  
- Resource query 테스트
- 에러 처리 테스트

## 다음 단계

1. 기존 컴포넌트들을 점진적으로 새로운 API로 마이그레이션
2. 기존 deprecated 훅들을 완전히 제거하는 계획 수립
3. 추가적인 쿼리 타입 지원 검토
