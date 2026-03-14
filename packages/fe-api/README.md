# @cocrepo/api

OpenAPI 스펙으로부터 자동 생성되는 API 클라이언트 패키지입니다.

## 🚀 기능

- **OpenAPI → TypeScript**: OpenAPI 스펙으로부터 타입 안전한 API 클라이언트 자동 생성
- **React Query 통합**: `useQuery`, `useMutation` 등 React Query 훅 자동 생성
- **환경별 설정**: 개발/스테이징/프로덕션 환경별 API 엔드포인트 자동 선택

## 📁 구조

```
src/
├── core/
│   ├── actions/
│   ├── categories/
│   └── model/
├── idp/
│   ├── auth/
│   ├── oidc-clients/
│   └── model/
└── libs/
    ├── customAxios.ts      # core API용 Axios 설정
    └── customIdpAxios.ts   # IDP API용 Axios 설정
```

## 🛠️ 사용법

### API 클라이언트 생성

```bash
# 기본 (development 환경)
pnpm codegen

# 또는 빌드 명령어 사용
pnpm build

# 환경별 생성
pnpm codegen:local      # 로컬 개발 환경
pnpm codegen:stg        # 스테이징 환경
pnpm codegen:prod       # 프로덕션 환경
```

### 환경별 API 엔드포인트

| 환경 변수 값           | 스크립트             | API URL                             |
| ---------------------- | -------------------- | ----------------------------------- |
| `development` (기본값) | `pnpm codegen`       | `http://localhost:3006/api-json`    |
| `local`                | `pnpm codegen:local` | `http://localhost:3006/api-json`    |
| `staging`              | `pnpm codegen:stg`   | `https://stg.cocdev.co.kr/api-json` |
| `production`           | `pnpm codegen:prod`  | `https://cocdev.co.kr/api-json`     |

### 생성된 API 사용 예시

```typescript
import { useGetUsers, useCreateUser } from "@cocrepo/api/core/users";

function UserList() {
  const { data: response, isLoading } = useGetUsers();

  const createUser = useCreateUser();
  const users = response?.data ?? [];

  const handleCreateUser = (userData: CreateUserDto) => {
    createUser.mutate(userData, {
      onSuccess: () => {
        console.log('사용자 생성 성공!');
      }
    });
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## ⚙️ 설정

### Orval 설정 (`orval.config.js`)

- **모드**: `tags-split` - OpenAPI 태그별로 파일 분할
- **클라이언트**: `react-query` - React Query 훅 생성
- **커스텀 Axios**: `customInstance` 사용
- **생성 방식**: Orval 산출물을 직접 사용, 후처리 스크립트 없음
- **배럴 정책**: 태그 경로는 훅/함수와 최소 DTO/enum만 노출, 전체 모델은 재export하지 않음
- **환경별 API URL**: `ORVAL_ENV` 또는 localhost 자동 감지 기반 선택
- **지원 환경**: `development`, `local`, `staging`, `production`
- **에러 처리**: 지원되지 않는 환경 입력 시 자동 종료 및 가이드 메시지 표시

### 생성되는 React Query 훅

- ✅ `useQuery` - 기본 쿼리 훅
- ❌ `useInfiniteQuery` - 무한 스크롤 (비활성화)
- ❌ `useSuspenseQuery` - 현재 소비처 없음으로 비활성화
- ❌ `useSuspenseInfiniteQuery` - 현재 소비처 없음으로 비활성화
- ✅ `prefetchQuery`용 helper - 서버 prefetch/HydrationBoundary 패턴 지원

## 🔧 개발

```bash
# 의존성 설치
pnpm install

# API 클라이언트 생성 (기본: development 환경)
pnpm build
# 또는
pnpm codegen

# 개발 모드 시작 (codegen:dev와 동일)
pnpm start:dev

# 타입 검사
pnpm type-check

# 린트 검사
pnpm lint

# 정리
pnpm clean
```

## 📝 참고사항

- OpenAPI 스펙이 변경되면 `pnpm codegen` 또는 `pnpm build` 명령어로 API 클라이언트를 재생성하세요
- 생성된 파일들(`src/core/*`, `src/idp/*`)은 직접 수정하지 마세요
- 커스텀 Axios 설정이 필요한 경우 `src/libs/customAxios.ts`를 수정하세요
- DTO/enum이 태그 배럴에 없으면 `@cocrepo/api/model/*`, `@cocrepo/api/idp-model/*`에서 직접 import 하세요
- 환경 변수 `ORVAL_ENV`가 설정되지 않으면 localhost를 먼저 확인하고, 없으면 staging으로 fallback 합니다
- Suspense 기반 화면이 필요하면 generated suspense 훅 대신 일반 query 옵션과 React Suspense 경계를 조합해 사용하세요
- 지원되지 않는 환경을 설정하면 콘솔에 에러 메시지와 함께 지원 가능한 환경 목록이 표시됩니다

## 🚨 트러블슈팅

### 환경 설정 오류

```bash
❌ 지원되지 않는 환경입니다: test
✅ 지원 가능한 환경: development, staging, production
```

위와 같은 메시지가 나타나면 지원되는 환경 중 하나를 선택하여 다시 실행하세요.

### 네트워크 연결 오류

- 로컬 개발 환경(`development`, `local`)의 경우 백엔드 서버가 `localhost:3006`에서 실행 중인지 확인하세요
- 스테이징/프로덕션 환경의 경우 해당 서버가 정상 작동하는지 확인하세요
