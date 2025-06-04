# @shared/api-client

OpenAPI 스펙으로부터 자동 생성되는 API 클라이언트 및 타입 정의 패키지입니다.

## 개요

이 패키지는 [orval](https://orval.dev/)을 사용하여 OpenAPI 스펙으로부터 다음을 자동 생성합니다:

- TypeScript 타입 정의
- React Query 훅
- Axios 기반 API 클라이언트

## 설치

```bash
pnpm add @shared/api-client
```

## 사용법

### API 훅 사용

```typescript
import { useGetUsers } from '@shared/api-client';

function UserList() {
  const { data, isLoading, error } = useGetUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 타입만 import

```typescript
import type { UserDto, CreateUserDto } from '@shared/api-client/types';

function createUser(userData: CreateUserDto): Promise<UserDto> {
  // implementation
}
```

### 직접 axios 인스턴스 사용

```typescript
import { customInstance } from '@shared/api-client';

const response = await customInstance({
  url: '/custom-endpoint',
  method: 'GET',
});
```

## 코드 생성

### 개발 환경

```bash
pnpm codegen:dev
```

### 스테이징 환경

```bash
pnpm codegen:stg
```

### 프로덕션 환경

```bash
pnpm codegen:prod
```

## 환경별 설정

- **개발**: `http://localhost:3005/api-json`
- **스테이징**: `https://wallyops.com/api-json`
- **프로덕션**: `https://wallyops.com/api-json`

## 구조

```
src/
├── apis.ts          # 생성된 API 클라이언트 훅들
├── index.ts         # 메인 엔트리 포인트
├── types.ts         # 타입 전용 엔트리 포인트
├── libs/
│   └── customAxios.ts # 커스텀 Axios 설정
└── model/           # 생성된 TypeScript 타입들
    ├── userDto.ts
    ├── createUserDto.ts
    └── ...
```

## 주의사항

- `src/apis.ts`와 `src/model/` 폴더의 파일들은 자동 생성되므로 직접 수정하지 마세요
- API 스펙이 변경되면 코드 생성 명령어를 실행하여 최신 상태로 업데이트하세요
- 타입만 필요한 경우 `@shared/api-client/types`에서 import하세요
