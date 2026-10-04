# Admin 웹 애플리케이션

PRJ Core 모노레포의 관리자 웹 애플리케이션입니다.

## 개요

Admin 앱은 피트니스/예약 플랫폼의 관리자 인터페이스를 제공합니다. 테넌트, 스페이스, 사용자, 프로그램, 세션 등을 관리할 수 있습니다.

## 기술 스택

| 카테고리 | 기술 | 버전 |
|----------|------|------|
| **Framework** | React | 19.2 |
| **Meta Framework** | Next.js (App Router, `--turbopack`) | 16.x |
| **State Management** | MobX (`@cocrepo/store`) | 6.x |
| **Data Fetching** | TanStack Query | 5.x |
| **UI Components** | HeroUI | 3.1 |
| **Styling** | Tailwind CSS | 4.x |
| **API Client** | @cocrepo/api (Orval 생성) | - |

## 폴더 구조

```
src/
├── app/                        # Next.js App Router
│   ├── (authenticated)/        # 인증 필요 라우트 그룹
│   │   ├── (admin)/            # 관리자 화면
│   │   └── select-space/       # 스페이스 선택
│   ├── auth/                   # 로그인 등 인증 화면 (login, (flow))
│   ├── layout.tsx              # 루트 레이아웃
│   ├── providers.tsx           # 전역 Provider
│   └── page.tsx                # 진입 페이지
├── runtime-urls.ts             # 런타임 URL 조합
└── test/                       # 앱 단위 테스트 (Vitest)
```

## 시작하기

### 개발 서버 실행

```bash
# 루트 디렉토리에서
pnpm start:admin-web

# 또는 apps/admin/web 디렉토리에서
pnpm dev
```

개발 서버: http://localhost:3000/admin (포트는 `ADMIN_WEB_PORT`로 재정의, basePath `/admin`)

### 빌드

```bash
pnpm build          # next build (컨테이너는 standalone 출력 — devops/Dockerfile.admin-web.ops.md 참고)
pnpm analyze        # 번들 분석 빌드
```

## 주요 기능

### 인증

- 로그인/로그아웃 (OIDC — 자세한 흐름은 `docs/mobile-oidc-flow.guide.md`, `docs/oidc-client-ids.guide.md` 참고)
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
import { useApp } from '@cocrepo/store';

function MyComponent() {
  const app = useApp();

  return (
    <div>
      {app.account.authSession?.isAuthenticated && <Dashboard />}
    </div>
  );
}
```

## API 통신

`@cocrepo/api` 패키지를 통한 API 통신:

```typescript
import { useGetUsers, useCreateUser } from '@cocrepo/api';

function UsersPage() {
  const { data: users, isLoading } = useGetUsers();
  const createUser = useCreateUser();

  // ...
}
```

## 라우팅

Next.js App Router 파일 기반 라우팅:

```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Navigation() {
  const router = useRouter();

  return (
    <nav>
      <Link href="/dashboard">대시보드</Link>
      <Link href="/users">사용자</Link>
    </nav>
  );
}
```

## 환경 변수

`apps/admin/web/.env.local` (dev 스크립트가 source하며 Next.js 표준 로딩 경로):

```env
CORE_API_INTERNAL_URL=http://localhost:3006   # 개발 프록시 → core-api
IDP_API_INTERNAL_URL=http://localhost:3007    # 개발 프록시 → idp-api
NEXT_PUBLIC_WS_URL=ws://localhost:3006        # 브라우저 WebSocket base URL
```

키 설명: [docs/env-reference.md](../../../docs/env-reference.md)

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

- `@cocrepo/api` - API 클라이언트
- `@cocrepo/ui` - 공유 UI 컴포넌트 + 디자인 시스템
CI 라우터 검증(2026-10-04): 이 커밋은 apps/admin/web 경로 변경으로 admin-web-build만 트리거해야 한다.
