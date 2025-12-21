# Admin 웹 애플리케이션

PRJ Core 모노레포의 관리자 웹 애플리케이션입니다.

## 개요

Admin 앱은 피트니스/예약 플랫폼의 관리자 인터페이스를 제공합니다. 테넌트, 스페이스, 사용자, 프로그램, 세션 등을 관리할 수 있습니다.

## 기술 스택

| 카테고리 | 기술 | 버전 |
|----------|------|------|
| **Framework** | React | 19.0 |
| **Build Tool** | Vite | 6.0 |
| **Routing** | TanStack Router | 1.x |
| **State Management** | MobX | 6.x |
| **Data Fetching** | TanStack Query | 5.x |
| **UI Components** | HeroUI | 2.8 |
| **Styling** | Tailwind CSS | 4.x |
| **API Client** | @cocrepo/api-client | - |

## 폴더 구조

```
src/
├── routes/              # TanStack Router 라우트
│   ├── __root.tsx       # 루트 레이아웃
│   ├── _auth/           # 인증 필요 라우트
│   └── _public/         # 공개 라우트
├── components/          # 공유 컴포넌트
│   ├── layouts/         # 레이아웃 컴포넌트
│   ├── ui/              # UI 컴포넌트
│   └── features/        # 기능별 컴포넌트
├── hooks/               # 커스텀 훅
├── stores/              # MobX 스토어
├── providers/           # Context Providers
├── lib/                 # 유틸리티 함수
└── styles/              # 전역 스타일
```

## 시작하기

### 개발 서버 실행

```bash
# 루트 디렉토리에서
pnpm start:admin

# 또는 apps/admin 디렉토리에서
pnpm dev
```

개발 서버: http://localhost:5173

### 빌드

```bash
pnpm build
```

### 프리뷰

```bash
pnpm preview
```

## 주요 기능

### 인증

- 로그인/로그아웃
- JWT 기반 인증
- 자동 토큰 갱신

### 테넌트 관리

- 테넌트 목록/생성/수정/삭제
- 테넌트 전환

### 스페이스 관리

- 스페이스(지점) 관리
- 스페이스별 설정

### 사용자 관리

- 사용자 CRUD
- 역할 할당
- 권한 관리

### 프로그램/세션 관리

- 프로그램 생성 및 관리
- 세션 스케줄링
- 타임라인 관리

## 상태 관리

MobX를 사용한 상태 관리:

```typescript
import { useStore } from '@/stores';

function MyComponent() {
  const { authStore, uiStore } = useStore();

  return (
    <div>
      {authStore.isAuthenticated && <Dashboard />}
    </div>
  );
}
```

## API 통신

`@cocrepo/api-client` 패키지를 통한 API 통신:

```typescript
import { useGetUsers, useCreateUser } from '@cocrepo/api-client';

function UsersPage() {
  const { data: users, isLoading } = useGetUsers();
  const createUser = useCreateUser();

  // ...
}
```

## 라우팅

TanStack Router를 사용한 타입 안전 라우팅:

```typescript
import { Link, useNavigate } from '@tanstack/react-router';

function Navigation() {
  return (
    <nav>
      <Link to="/dashboard">대시보드</Link>
      <Link to="/users">사용자</Link>
    </nav>
  );
}
```

## 환경 변수

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=PRJ Admin
```

## 개발 가이드

### 컴포넌트 작성 규칙

1. UI 컴포넌트는 MobX observer로 감싸서 사용
2. 이벤트 핸들러는 `handle` 접두어 사용
3. 인라인 함수 선언 지양
4. 모든 텍스트는 Text 컴포넌트로 감싸서 사용

### 코드 스타일

```typescript
// 좋은 예
const handleClick = () => {
  // ...
};

return <Button onClick={handleClick}>클릭</Button>;

// 나쁜 예
return <Button onClick={() => doSomething()}>클릭</Button>;
```

## 관련 패키지

- `@cocrepo/api-client` - API 클라이언트
- `@cocrepo/ui` - 공유 UI 컴포넌트
- `@cocrepo/design-system` - 디자인 시스템
- `@cocrepo/store` - 공유 상태 관리
- `@cocrepo/hooks` - 공유 훅
- `@cocrepo/constants` - 공유 상수
