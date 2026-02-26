# 프로젝트 개발 가이드

## 기술 스택

### 프론트엔드
- **프레임워크**: Next.js (App Router)
- **상태 관리**: MobX (Zustand 사용 안 함)
- **UI 라이브러리**: HeroUI (NextUI 기반)
- **스타일링**: Tailwind CSS
- **API 클라이언트**: Orval (자동 생성) + React Query

### 백엔드
- **프레임워크**: NestJS
- **ORM**: Prisma 7.0
- **데이터베이스**: PostgreSQL
- **캐싱/세션**: Redis

### 공통
- **모노레포**: Turborepo (pnpm workspace)
- **패키지 매니저**: pnpm
- **런타임**: Node.js

## 모노레포 구조

### 앱 (apps/)

| 앱 | 설명 | 포트 |
|----|------|------|
| `admin/web` | 관리자 프론트엔드 (Next.js) | 3000 |
| `core/api` | 코어 API 서버 (NestJS) | 4000 |
| `idp/api` | IDP API 서버 | 4008 |
| `idp/web` | IDP 프론트엔드 | 3008 |
| `idp-server` | OIDC 서버 (oidc-provider) | 4009 |
| `server` | 메인 API 서버 (NestJS) | 4001 |
| `proposal/web` | 제안서 프론트엔드 | 3001 |
| `test/e2e` | E2E 테스트 (Playwright) | - |
| `tool/storybook` | UI 컴포넌트 스토리북 | 6006 |

### 패키지 (packages/)

| 패키지 | npm명 | 설명 |
|--------|-------|------|
| `be-common` | `@cocrepo/be-common` | 백엔드 공통 유틸리티 |
| `be-context` | `@cocrepo/be-context` | 백엔드 컨텍스트 |
| `be-decorator` | `@cocrepo/decorator` | NestJS 데코레이터 |
| `be-dto` | `@cocrepo/dto` | Request/Response DTO |
| `be-entity` | `@cocrepo/entity` | 도메인 Entity |
| `be-facade` | `@cocrepo/facade` | Facade 레이어 |
| `be-prisma` | `@cocrepo/prisma` | Prisma 스키마 및 클라이언트 |
| `be-repository` | `@cocrepo/repository` | Repository 레이어 |
| `be-service` | `@cocrepo/service` | Service 레이어 |
| `be-vo` | `@cocrepo/vo` | Value Object |
| `common-constant` | `@cocrepo/constant` | 공통 상수 |
| `common-enum` | `@cocrepo/enum` | 공통 Enum |
| `common-schema` | `@cocrepo/schema` | 공통 스키마 |
| `common-toolkit` | `@cocrepo/toolkit` | 공통 유틸리티 |
| `common-type` | `@cocrepo/type` | 공통 타입 |
| `fe-api` | `@cocrepo/api` | Orval 생성 API 클라이언트 |
| `fe-hook` | `@cocrepo/hook` | React 커스텀 훅 |
| `fe-store` | `@cocrepo/store` | MobX Store |
| `fe-ui` | `@cocrepo/ui` | UI 컴포넌트 |

## Claude Code 버그 회피

- **TodoWrite 도구의 content, activeForm은 영어로 작성** (한글 UTF-8 멀티바이트 문자열 처리 버그 회피)
- Task 도구의 description도 영어로 작성

## Claude Code 작업 원칙

- **AskUserQuestion 도구로 요구사항이나 선택지가 애매할 때 질문** - 추측하지 않고 사용자에게 확인
- **Task 도구로 적절한 에이전트를 활용하여 작업 수행** - 단순 작업보다 전문 에이전트 활용 우선

## 프론트엔드 개발 규칙

### UI 디자인 가이드 (HeroUI 공식 스타일)

HeroUI 공식 문서(https://heroui.com) 스타일을 따릅니다.

#### 테마
- 다크 모드 기본 (`dark` 클래스)
- 배경: `bg-black` 또는 `bg-background`

#### 배경 효과
페이지에 블러 그라데이션 오브 효과 적용:
```tsx
{/* 좌측 하단 블러 오브 */}
<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

{/* 우측 상단 블러 오브 */}
<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />
```

#### 레이아웃
- 컨테이너: `max-w-7xl mx-auto px-6`
- 섹션 간격: `py-16` 또는 `gap-8`
- 카드 내부: `p-6`

#### 컴포넌트 스타일
| 컴포넌트 | 스타일 |
|---------|--------|
| 카드 | `bg-content1 shadow-sm rounded-xl` |
| 버튼 | HeroUI 기본 + `variant="flat"` 선호 |
| 테두리 | `border-divider` |
| 둥근 모서리 | `rounded-xl` (큰 요소), `rounded-lg` (작은 요소) |

#### 타이포그래피
- 대제목: `text-3xl font-bold`
- 소제목: `text-xl font-semibold`
- 본문: `text-default-600`
- 강조 텍스트: 그라데이션 사용 가능
  ```tsx
  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
    강조 텍스트
  </span>
  ```

#### 간격 규칙
- 섹션 간: `gap-8` 또는 `mt-8`
- 요소 간: `gap-4`
- 컴포넌트 내부: `p-4` ~ `p-6`

### Surface/엘리베이션 시스템 (Critical)

**페이지 콘텐츠는 반드시 Surface 컴포넌트로 감싸야 합니다.**

#### 엘리베이션 레벨

| 레벨 | 이름 | Shadow | Background | 용도 |
|------|------|--------|------------|------|
| 0 | `flat` | none | bg-background | 페이지 배경 |
| 1 | `raised` | sm | bg-content1 | 페이지 섹션 (PageSurface 기본) |
| 2 | `elevated` | md | bg-content1 + border | 카드, DataGrid (SectionSurface 기본) |
| 3 | `floating` | lg | bg-content2 | 드롭다운, 팝오버 |
| 4 | `overlay` | xl | bg-content2 | 모달, 다이얼로그 |

#### Surface 컴포넌트

| 컴포넌트 | 용도 | 기본 elevation |
|----------|------|----------------|
| `Surface` | 기본 Surface | elevated |
| `PageSurface` | 페이지 래퍼 (title, actions) | raised |
| `SectionSurface` | 섹션 래퍼 (collapsible) | elevated |

#### 사용 예시

```tsx
import { PageSurface, SectionSurface } from "@cocrepo/ui";

// 목록 페이지
<PageSurface
  title="회원 목록"
  description="시스템에 등록된 회원을 관리합니다."
  actions={<Button>회원 등록</Button>}
>
  <SectionSurface padding="none">
    <DataGrid ... />
  </SectionSurface>
</PageSurface>
```

#### 중첩 규칙

- 최대 2단계 중첩: `PageSurface` > `SectionSurface`
- 내부 Surface는 외부보다 높은 elevation 사용
- 동일 elevation 중첩 금지

#### PageSurface 사용 위치 규칙

**PageSurface는 Page 컴포넌트에서만 사용합니다. Layout에서 사용 금지!**

```typescript
// ❌ 금지 - Layout에서 PageSurface 사용
// users/layout.tsx
function UsersLayout({ children }) {
  return (
    <PageSurface title="회원 목록">  {/* Layout에서 사용 금지 */}
      {children}
    </PageSurface>
  );
}

// ✅ 올바른 예시 - Page에서 PageSurface 사용
// users/page.tsx (또는 _client.tsx)
function UsersPage() {
  return (
    <PageSurface
      title="회원 목록"
      description="시스템에 등록된 회원을 관리합니다."
      actions={<Button>회원 등록</Button>}
    >
      <SectionSurface>...</SectionSurface>
    </PageSurface>
  );
}
```

**이유:**
- Layout과 Page 모두에서 PageSurface를 사용하면 타이틀이 중복됨
- Layout은 구조적 래핑만 담당 (인증 체크, 공통 Provider 등)
- 페이지별 title, description, actions는 각 Page 컴포넌트에서 처리
- 하위 페이지(상세/수정/등록)가 다른 타이틀을 가질 때 유연하게 대응 가능

### 페이지 개발 규칙 (Critical)

**모든 페이지는 반드시 서버 사이드 Prefetch 패턴을 사용해야 합니다.**

```
apps/admin/web/src/app/[route]/
├── page.tsx          # 서버 컴포넌트 (Prefetch + HydrationBoundary)
├── _client.tsx       # 클라이언트 컴포넌트
├── _prefetch.ts      # Prefetch 설정
└── hooks/            # 통합 훅 (필요 시)
```

| 파일 | 역할 |
|------|------|
| `page.tsx` | 서버 컴포넌트 - `"use client"` 없음, Prefetch 실행 |
| `_client.tsx` | 클라이언트 컴포넌트 - `"use client"` 선언, UI 렌더링 |
| `_prefetch.ts` | Orval 생성 `prefetchGetXXXQuery` 함수 사용 |

**상세 템플릿은 `fe-page-builder` 에이전트의 섹션 9를 참고하세요.**

### 라우팅 규칙 (Critical)

#### 동적 경로 파라미터 네이밍

**동적 경로 파라미터는 축약하지 않고 전체 엔티티 이름을 명시합니다.**

```typescript
// ❌ 금지 - 축약된 파라미터명
"/users/[id]"
"/roles/[id]/edit"
"/timelines/[id]/sessions"

// ✅ 올바른 예시 - 명확한 엔티티명
"/users/[userId]"
"/roles/[roleId]/edit"
"/timelines/[timelineId]/sessions"
```

**이유:**
- 중첩 경로에서 어떤 ID인지 명확히 구분 (`/roles/[roleId]/abilities/[abilityId]`)
- 코드 가독성 향상
- 타입 안정성 강화

**적용 위치:**
- `packages/common-constant/src/routing/admin-menu.ts`의 모든 경로 정의
- Next.js 파일 시스템 라우팅 폴더명 (`src/app/(admin)/users/[userId]/`)

### 컴포넌트 작성

- ui 컴포넌트를 만들 때는 mobx를 사용합니다

### 폼 스키마 패턴

**@cocrepo/schema를 활용한 검증 규칙 재사용**

```typescript
// 1. 백엔드 DTO에서 스키마 상속
import { LoginSchema } from "@cocrepo/schema";

export class OidcLoginPayloadDto extends LoginSchema {
  @IsBoolean()
  @IsOptional()
  remember?: boolean;  // 추가 필드만 정의
}

// 2. 프론트엔드에서 검증 메시지 활용
import { VALIDATION_MESSAGES } from "@cocrepo/schema";

const error = VALIDATION_MESSAGES.EMAIL_FORMAT;
```

**장점**:
- 프론트엔드/백엔드 검증 규칙 일관성
- 중복 코드 감소
- 검증 메시지 통일

### observer 필수 규칙

**`"use client"` 컴포넌트는 반드시 `observer`로 감싸야 합니다.**

```typescript
// ❌ 금지 - observer 없음
"use client";
export const MyComponent = ({ items }: Props) => {
  return <div>{items.map(...)}</div>;
};

// ✅ 올바른 예시 - observer 사용
"use client";
import { observer } from "mobx-react-lite";

export const MyComponent = observer(({ items }: Props) => {
  return <div>{items.map(...)}</div>;
});
```

**이유:**
- MobX observable 변경을 자동 추적하여 리렌더링
- observer가 내부적으로 memo 처리하므로 별도 memo 불필요
- props로 전달받은 observable 객체의 변경도 감지

### useMemo/useCallback 사용 금지

**`useMemo`와 `useCallback`은 사용하지 않습니다.**

```typescript
// ❌ 금지
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a), [a]);

// ✅ 그냥 사용
const value = computeExpensive(a, b);
const callback = () => doSomething(a);
```

**이유:**
- React 19+ 및 React Compiler가 자동 최적화 수행
- 수동 메모이제이션은 오히려 버그 유발 가능성
- 코드 가독성 저하
- MobX 사용 시 `observer`가 자동으로 필요한 리렌더링만 처리

### 컴포넌트 계층 구조와 개발 원칙 (Critical)

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

**개발 순서 원칙:**
1. **항상 Pure UI부터 시작** - 재사용 가능한 최소 단위를 먼저 만들어 자원화
2. **최대한 Widget으로 분리** - 순수 UI 조합은 Widget으로, Store 연결만 Feature에
3. **Feature는 Widget + Store 연결** - Widget에 데이터/핸들러 주입하는 역할

**네이밍 규칙:**

| 유형 | 패턴 | 설명 | 예시 |
|------|------|------|------|
| **Pure UI** | `[역할/형태]` | 최소 단위 | Button, Card, Badge |
| **Widget** | `[기능][UI형태]` | "무엇을 보여주는가" | NavTreePanel, TabBar, MenuList |
| **Feature** | `[위치/역할][기능]` | "어디서 어떻게 사용되는가" | SideNav, BottomTab, UserMenu |

**Widget → Feature 분리 예시:**

```
Widget (순수 UI)              Feature (비즈니스 로직)
─────────────────────────────────────────────────────
NavTreePanel                  → SideNav (NavigationStore 연결)
TabBar                        → BottomTab (NavigationStore 연결)
MenuList                      → SubMenuList (NavigationStore 연결)
UserCard                      → UserMenu (AuthStore 연결)
```

**분리의 장점:**
- Widget은 Storybook에서 독립 테스트 가능
- Feature 없이 Widget만 다른 곳에서 재사용 가능
- Store 교체 시 Feature만 수정

### 컴포넌트 위치 규칙 (Critical)

**UI 컴포넌트는 반드시 `packages/fe-ui`에만 생성합니다. `apps/*/src`에 생성 금지!**

| 컴포넌트 유형 | 올바른 위치 | 금지 위치 |
|--------------|-------------|-----------|
| Pure UI | `packages/fe-ui/src/components/ui/` | ❌ `apps/*/src/components/ui/` |
| Widget | `packages/fe-ui/src/components/widget/` | ❌ `apps/*/src/components/widget/` |
| **Feature** | `packages/fe-ui/src/components/feature/` | ❌ `apps/*/src/components/features/` |
| Input | `packages/fe-ui/src/components/inputs/` | ❌ `apps/*/src/components/inputs/` |
| Layout | `packages/fe-ui/src/components/layout/` | ❌ `apps/*/src/components/layout/` |
| Cell | `packages/fe-ui/src/components/cell/` | ❌ `apps/*/src/components/cell/` |

**앱(`apps/*`)에서 허용되는 것:**
- `app/` - Next.js App Router 페이지
- `stores/` - 앱별 Store 설정/주입
- `hooks/` - 앱 전용 훅 (페이지 핸들러 등)
- `providers/` - 앱 전용 Provider

```typescript
// ✅ 올바른 예시 - packages/fe-ui에서 import
import { SideNav, UserMenu } from "@cocrepo/ui";

// ❌ 금지 - apps 내부에 Feature 생성
// apps/admin/web/src/components/features/HeaderSpaceSelector.tsx  ← 금지!
```

### SSR/Hydration 관련 주의사항

**`isMounted` 패턴이 필요한 경우와 불필요한 경우를 명확히 구분해야 합니다.**

```typescript
// ❌ 불필요한 isMounted 패턴 - MobX/Context 기반 store
const store = useNavigationStore(); // Context Provider에서 주입됨
const isMounted = useIsMounted();
const items = isMounted ? store.items : []; // 불필요!

// ✅ 올바른 사용 - 그냥 바로 사용
const store = useNavigationStore();
const items = store.items;
```

**isMounted 패턴이 필요한 경우 (드뭄):**
- `localStorage`/`sessionStorage` 직접 접근
- `window`/`document` 객체 의존

**불필요한 경우 (대부분):**
- MobX + Context Provider 패턴 (프로젝트 표준)
- useState/React Query

**이유:** `"use client"` 컴포넌트도 서버에서 SSR됩니다. 하지만 Context Provider로 주입되는 store는 서버/클라이언트 모두 동일한 초기값을 가지므로 Hydration mismatch가 발생하지 않습니다.
- **이벤트 핸들러 네이밍 규칙**:
  - **일반 컴포넌트**: `handle` 접두어 사용 (예: `handleClick`, `handleChange`)
  - **Page 컴포넌트**: `on[Event][UI]` 형태로 직관적 표현 (예: `onClickLoginButton`, `onChangeEmail`)
    - Page는 직관적이어야 하므로 어떤 UI를 눌렀는지 명확히 드러나야 함
- 컴포넌트 내에서 함수를 인라인으로 선언하지 않습니다

### API 클라이언트 (Orval 기반)

- **API 클라이언트는 직접 작성하지 않습니다!**
- 백엔드 Swagger에서 **Orval**로 자동 생성합니다
- 생성된 함수는 `@cocrepo/api`에서 import하여 사용
- **Orval이 생성한 React Query 훅을 반드시 사용** (직접 useQuery 구성 금지)

```typescript
// ✅ 올바른 사용 - Orval 생성 훅 사용
import { useGetUsers, useLogin } from "@cocrepo/api";

const { data, isLoading } = useGetUsers({ skip: 0, take: 10 });

// ❌ 금지 - 직접 axios/fetch 호출
const response = await axios.get("/api/v1/users");

// ❌ 금지 - useQuery 직접 구성 (Orval 훅이 이미 존재함)
const { data } = useQuery({
  queryKey: getGetUsersQueryKey({ skip: 0, take: 10 }),
  queryFn: () => getUsers({ skip: 0, take: 10 }),
});
```

**예외 케이스 (직접 useQuery 허용):**
- Orval 훅으로 커버할 수 없는 복잡한 `select` 변환
- 조건부 `enabled` 로직이 필요한 경우
- 여러 API를 조합하는 커스텀 훅 작성 시

**API 생성 명령어:**
```bash
pnpm --filter=@cocrepo/api codegen
```

### 타입/인터페이스 네이밍 규칙

**불필요한 접미사를 붙이지 않습니다.**

```typescript
// ❌ 금지 - 불필요한 접미사
interface NavTreeItemData { }
interface UserInfoData { }
type ButtonPropsType = { }

// ✅ 올바른 예시 - 간결하게
interface NavTreeItem { }
interface UserInfo { }
type ButtonProps = { }
```

**피해야 할 접미사:**
- `Data` - 대부분 불필요
- `Type` - 이미 타입임이 명확
- `Interface` - 이미 interface 키워드 사용
- `Info` - 구체적인 이름 사용 권장

### 타입 의존성 방향 (Widget ↔ Store)

**Widget이 Store 타입을 기반으로 자신의 타입을 정의합니다.**

```typescript
// ❌ 잘못된 구조 - Store가 UI 타입에 의존
// @cocrepo/type
export interface NavTreeItem { ... }

// @cocrepo/store
import { NavTreeItem } from "@cocrepo/type";
export class NavItem implements NavTreeItem { }  // Store가 UI 계약에 종속

// ✅ 올바른 구조 - Widget이 Store 타입을 활용
// @cocrepo/store (독립적)
export class NavItem { ... }

// @cocrepo/ui (Widget)
import type { NavItem } from "@cocrepo/store";
type NavTreeItem = NavItem & {};  // Widget이 Store 타입 기반으로 정의
```

**원칙:**
- Store는 UI를 모름 (독립적)
- Widget이 Store 타입을 import하여 활용
- 변환 코드 없이 직접 전달 가능

### 공용 패키지 작성 규칙

`packages/*` 디렉토리의 공용 패키지는 **특정 앱에 종속된 이름을 사용하지 않습니다**.

```typescript
// ✅ 올바른 예시 (범용적인 이름)
export class PersistStore { }
export function useAppStore() { }
export function useNavigationStore() { }

// ❌ 금지 (앱 이름이 포함된 이름)
export class AdminPersistStore { }
export function useAdminStore() { }
export function useAdminNavigationStore() { }
```

**이유:**
- 공용 패키지는 여러 앱(admin, coin 등)에서 재사용됩니다
- 앱별 설정은 각 앱의 `stores/` 디렉토리에서 주입합니다

**올바른 패턴:**
```typescript
// packages/fe-store - 범용 Store 정의
export class PersistStore {
  constructor(config: { storageKey: string }) { }
}

// apps/admin/web/src/stores - 앱별 설정 주입
rootStore.persistStore = new PersistStore({
  storageKey: "admin-persist",
});

// apps/proposal/web/src/stores - 다른 앱에서 재사용
rootStore.persistStore = new PersistStore({
  storageKey: "proposal-persist",
});
```

### 공통 타입 선언 규칙

**여러 패키지에서 공통으로 사용되는 타입은 반드시 `@cocrepo/type`에 선언합니다.**

```typescript
// ✅ 올바른 예시 - @cocrepo/type에 타입 정의
// packages/common-type/src/navigation.ts
export interface NavItemConfig { ... }
export interface TabConfig { ... }
export interface FABAction { ... }

// 사용하는 곳에서 import
import type { NavItemConfig, TabConfig } from "@cocrepo/type";
```

```typescript
// ❌ 금지 - 다른 패키지에서 타입 정의 후 re-export
// packages/fe-store/src/navItem.ts
export interface NavItemConfig { ... }  // 여기서 정의하면 안 됨

// packages/common-constant/src/admin-menu.ts
export type { NavItemConfig } from "@cocrepo/store";  // re-export 금지
```

**규칙:**
- 2개 이상의 패키지에서 사용되는 타입 → `@cocrepo/type`에 선언
- 단일 패키지 내부에서만 사용되는 타입 → 해당 패키지에 선언
- 타입 re-export 금지 → 항상 원본 패키지에서 직접 import

**@cocrepo/type 패키지 구조:**
```
packages/common-type/src/
├── index.ts          # 모든 타입 export
├── navigation.ts     # 네비게이션 관련 (NavItemConfig, TabConfig, FABAction)
├── config.types.ts   # 설정 관련
├── json.ts           # JSON 관련
├── page-meta.ts      # 페이지 메타 관련
├── table.ts          # 테이블 관련 타입
├── action-config.ts  # 액션 설정 타입
└── user-stats.ts     # 사용자 통계 타입
```

## 기획/설계 원칙

### 하위호환성 미고려 (Critical)

**모든 기획/설계 변경은 전체 마이그레이션 방식으로 진행합니다.**

```
❌ 금지:
- 기존 API 유지하면서 새 API 추가
- deprecated 마킹 후 나중에 제거
- 하위호환 래퍼/어댑터 함수 추가
- 이전 버전 지원 코드

✅ 권장:
- 기존 코드 삭제 → 새 코드로 전체 교체
- 호출하는 모든 코드를 한 번에 수정
- 마이그레이션 완료 후 이전 코드 흔적 없음
```

**이유:**
- 이 프로젝트는 내부 사용 목적으로 외부 API 제공 없음
- 하위호환 코드는 기술 부채가 됨
- 7단계 플로우에서 각 단계별 리뷰로 변경 영향을 관리

### 코드 옆 기획서 (Sidecar Spec) (Critical)

**모든 코드 파일 옆에 .spec.md 기획서가 존재합니다.**

```
모든 코드 파일 옆에 .spec.md가 존재
기획서와 코드가 같은 폴더에 있어 발견성/동기화 용이
이미 있으면 스킵, 개선 필요하면 업데이트 + 변경 이력 기록
```

#### 기획서 파일 구조

```
apps/[app]/web/src/app/(admin)/
├── app.spec.md                 # 앱 기획서 (L0-L2: 컨텍스트, Actor, Goal)

apps/[app]/web/src/app/(admin)/[도메인]/
├── page.tsx                    # 목록 페이지
├── page.spec.md                # 목록 페이지 기획서 ← 코드 옆에 위치
├── page.e2e.ts                 # E2E 테스트 ← sidecar
├── [entityId]/
│   ├── page.tsx                # 상세 페이지
│   ├── page.spec.md            # 상세 페이지 기획서
│   └── page.e2e.ts             # E2E 테스트 ← sidecar
├── new/
│   ├── page.tsx                # 등록 페이지
│   ├── page.spec.md            # 등록 페이지 기획서
│   └── page.e2e.ts             # E2E 테스트 ← sidecar
└── [entityId]/edit/
    ├── page.tsx                # 수정 페이지
    ├── page.spec.md            # 수정 페이지 기획서
    └── page.e2e.ts             # E2E 테스트 ← sidecar

packages/fe-ui/src/components/
├── feature/[FeatureName]/
│   ├── index.tsx
│   └── index.spec.md           # Feature 기획서
├── widget/[WidgetName]/
│   ├── index.tsx
│   └── index.spec.md           # Widget 기획서
└── ui/[UIName]/
    ├── index.tsx
    └── index.spec.md           # UI 기획서

packages/fe-store/src/stores/
├── [StoreName].ts
└── [StoreName].spec.md         # Store 기획서

packages/be-entity/src/
├── [name].entity.ts
└── [name].entity.spec.md       # Entity 기획서

packages/be-vo/src/[domain]/
├── [name].vo.ts
└── [name].vo.spec.md           # VO 기획서

apps/core/api/src/[module]/
├── [name].service.ts
├── [name].service.spec.md      # Service 기획서
├── repositories/
│   ├── [name].repository.ts
│   └── [name].repository.spec.md
└── controllers/
    ├── [name].controller.ts
    └── [name].controller.spec.md
```

#### 기획서 타입별 내용

| 타입 | 파일 | 핵심 내용 |
|------|------|----------|
| **app** | `app.spec.md` | 앱 컨텍스트, 사용자, 목표, 도메인 목록 (L0-L2) |
| **page** | `page.spec.md` | 시나리오, 레이아웃, API, 이벤트 |
| **feature** | `index.spec.md` | Store 연결, Props, 이벤트 |
| **widget** | `index.spec.md` | Props, 하위 UI, 슬롯, 디자인 토큰 |
| **ui** | `index.spec.md` | Props, 상태, 변형, 접근성 |
| **store** | `.spec.md` | 상태, 액션, 비동기 흐름 |
| **entity** | `.entity.spec.md` | 필드, 관계, Enum, 도메인 메서드, 비즈니스 규칙 |
| **vo** | `.vo.spec.md` | 역할, Props, validate 규칙, 팩토리 메서드, 도메인 메서드 |
| **service** | `.spec.md` | 메서드, 비즈니스 규칙, 권한 |
| **repository** | `.spec.md` | 메서드, Prisma 매핑 |
| **controller** | `.spec.md` | 엔드포인트, 인증/인가 |

#### 기획서 템플릿 위치

```
.claude/templates/spec/
├── page.spec.md        # 페이지 기획서 템플릿
├── feature.spec.md     # Feature 기획서 템플릿
├── widget.spec.md      # Widget 기획서 템플릿
├── ui.spec.md          # UI 기획서 템플릿
├── store.spec.md       # Store 기획서 템플릿
├── entity.spec.md      # Entity 기획서 템플릿
├── vo.spec.md          # VO 기획서 템플릿
├── service.spec.md     # Service 기획서 템플릿
├── repository.spec.md  # Repository 기획서 템플릿
└── controller.spec.md  # Controller 기획서 템플릿
```

#### 기획서 변경 이력 관리

각 기획서 하단에 변경 이력을 기록합니다:

```markdown
## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
| 2026-02-19 | 검색 기능 추가 | orch-requirement |
```

#### 장점

| 항목 | 설명 |
|------|------|
| **발견성** | 코드 파일만 보면 기획서도 바로 옆에 있음 |
| **동기화** | 기획서와 코드가 같은 폴더에 있어 버전 관리 용이 |
| **점진적** | 한 번에 다 만들지 않고, 필요한 것부터 |
| **역설계 호환** | 기존 코드 분석 → .spec.md만 생성하면 됨 |

## 백엔드 개발 규칙

### DTO 위치 규칙

- **DTO는 반드시 `packages/be-dto`에 위치**
- ❌ `apps/core/api/src/module/**/dto/` 에 DTO 생성 금지
- ✅ `packages/be-dto/src/` 에 DTO 생성
- Controller에서는 `@cocrepo/dto`에서 import

```typescript
// ❌ 금지 - 서버 모듈 내 DTO
import { CreateAbilityDto } from "./dto";

// ✅ 권장 - 패키지에서 import
import { CreateAbilityDto, AbilityResponseDto } from "@cocrepo/dto";
```

### 레이어 분리 규칙

- **Controller**: 라우팅, DTO 검증만 담당
- **Facade**: 여러 Service 조합 (Prisma 직접 호출 금지)
- **Service**: 단일 도메인 로직 (Repository를 통해서만 데이터 접근)
- **Repository**: Prisma 쿼리 작성

### 시드 데이터 관리 규칙

**seed-data에 영향을 주는 모든 변경이 발생하면 반드시 아래 파일들을 함께 업데이트해야 합니다:**

- `packages/be-prisma/seed-data.ts` - 시드 데이터 정의
- `packages/be-prisma/seed.ts` - 시드 실행 로직

**영향을 주는 변경 예시:**
- Prisma 스키마에 새로운 모델 추가
- 기존 모델의 필수 필드 추가/변경
- Enum 타입 변경
- 관계(relation) 구조 변경

### Multi-Tenancy 및 System Space

**X-Space-ID 헤더는 모든 인증된 사용자에게 필수입니다.**

```typescript
// ❌ 금지 - FULL_ACCESS도 헤더 없이 요청 불가
fetch('/api/users', { headers: { Authorization: '...' } });

// ✅ 필수 - 모든 요청에 X-Space-ID 포함
fetch('/api/users', {
  headers: {
    Authorization: '...',
    'X-Space-ID': spaceId  // System Space 또는 일반 Space
  }
});
```

**System Space (SpaceCategory ROOT로 식별):**
- FULL_ACCESS 전용 Space로 SpaceClassification을 통해 ROOT Category가 연결됨
- `isRootSpaceCategory(tenant)` 함수로 식별 (`@cocrepo/be-common`)
- 전체 데이터 접근 권한은 Role 기반으로 Service 레이어에서 확인

**권한 유틸리티 (`@cocrepo/be-common`):**
```typescript
import { canAccessAllSpaces, isRootSpaceCategory } from "@cocrepo/be-common";

// Service에서 전체 접근 권한 확인
if (canAccessAllSpaces(tenant)) {
  return this.repository.findAll();  // FULL_ACCESS: 전체 조회
}
return this.repository.findBySpaceId(spaceId);  // 일반: Space 필터링
```

### API 응답 구조 규칙 (Critical)

모든 API는 `ResponseEntity`로 래핑되어 **Flat + 확장 가능** 구조로 응답합니다.

#### 표준 응답 형식

```typescript
{
  httpStatus: 200,           // HTTP 상태 코드
  message: "성공",           // 한글 응답 메시지
  data: [...],               // 실제 데이터 (배열 또는 객체)
  meta?: { ... },            // 페이지네이션 정보 (리스트 응답만)

  // 확장 필드들 (필요한 API만 선택적 사용)
  stats?: { ... },           // 통계 정보 (활성/비활성 수 등)
  filters?: [ ... ],         // 적용 가능한 필터 옵션
  actions?: [ ... ],         // 권한 기반 가능한 액션
  aggregations?: { ... },    // 집계 데이터 (차트 등)
  summary?: { ... }          // 요약 정보
}
```

#### 프론트엔드 접근 패턴

```typescript
const { data: response } = useGetUsers(params);

// 직접 접근 (중첩 없음)
const users = response?.data ?? [];
const totalCount = response?.meta?.total ?? 0;

// 확장 필드 접근
const stats = response?.stats;
const filters = response?.filters;
```

#### 컨트롤러 작성 패턴

```typescript
// 리스트 응답 (확장 필드 포함)
@ApiResponseEntity(UserDto, HttpStatus.OK, {
  isArray: true,
  metaDto: UserPaginationMetaDto,
  statsDto: UserStatsDto
})
@ResponseMessage("회원 목록 조회 성공")
async getUsers() {
  return wrapResponse(users, { meta, stats });
}

// 리스트 응답 (확장 필드 없음)
@ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
async getRoles() {
  return roles;  // 인터셉터가 자동 래핑
}

// 단일 객체 응답
@ApiResponseEntity(UserDto, HttpStatus.OK)
async getUserById() {
  return user;  // 인터셉터가 자동 래핑
}
```

#### 특수 케이스

```typescript
// DELETE (204 No Content) - body 없음
@Delete(":id")
@HttpCode(HttpStatus.NO_CONTENT)
@ResponseMessage("삭제 성공")
async delete(): Promise<void> {
  // 인터셉터가 자동으로 body 제거
}

// Pagination 없는 리스트 - meta 생략
@ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
async getAll() {
  return roles;  // meta 없이 반환 가능
}
```

#### 금지 사항

- **`*ListResponseDto` 같은 래퍼 DTO 생성 금지** - Flat 구조 사용
- **`response?.data?.data` 같은 중첩 접근 금지** - 직접 접근
- **컨트롤러에서 ResponseEntity 직접 생성 금지** - 인터셉터 사용

## 테스트 작성 규칙

- 테스트 코드의 설명(describe, it)은 한글로 작성합니다
- 테스트는 Given-When-Then 패턴을 따릅니다

## 코드 품질 검사

### TypeScript 타입 체킹

자세한 실행 방법 및 규칙은 [type-check skill](./skills/type-check/SKILL.md)을 참고하세요.

### 린트 & 포맷 체킹

자세한 실행 방법 및 규칙은 [lint-format skill](./skills/lint-format/SKILL.md)을 참고하세요.

## 커밋 메시지 규칙

```
<타입>(<범위>): <제목>

<본문>

<푸터>
```

### 타입

- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 추가/수정
- chore: 빌드 작업, 패키지 매니저 설정 등

### 예시

```
feat(coin): 멀티시그 지갑 서비스 초기 구현

- 지갑 생성 API 추가
- 트랜잭션 승인 로직 구현
- 테스트 코드 작성
```

## Agent 활용 가이드

### 7단계 분할 개발 플로우 (권장)

**orch-stage**를 사용하여 각 단계별 사용자 리뷰를 받으며 개발합니다。

#### 핵심 개념: 기능 단위 기획

```
1 기획 = 1 기능(도메인) = 1 백엔드 + N 페이지
```

- **Stage 1-3**: 기능 전체를 한 번에 처리 (기획, 스키마, 백엔드)
- **Stage 4-6**: 페이지별로 반복 실행 (화면 기획, 컴포넌트, 페이지)
- **Stage 7**: E2E 검증 (선택)

#### 플로우

```
Stage 1: 도메인 기획        → orch-requirement (L0~L4 + BE/Store 스펙) → [리뷰]
Stage 2: 스키마 구현        → schema → entity → dto → query-dto → seed → [리뷰]
Stage 3: 백엔드 구현        → repository → service → controller → [리뷰]
Stage 4: 화면 기획 (페이지별) → orch-screen-planner (L5~L12) → [리뷰] ← page 파라미터 권장 (미지정 시 자연어 추론, 불명확 시 확인)
Stage 5: 컴포넌트 (페이지별) → ui → input → cell → widget → layout → feature → store → menu → [리뷰] ← page 파라미터 권장 (미지정 시 자연어 추론, 불명확 시 확인)
Stage 6: 페이지 (페이지별)   → fe-page-builder → fe-api-integrator → [리뷰] ← page 파라미터 권장 (미지정 시 자연어 추론, 불명확 시 확인)
Stage 7: E2E 검증 (선택)    → qa-be-e2e-testing → qa-fe-e2e-testing → [리뷰]
```

> 화살표는 의존성 순서를 의미합니다. 동일 Stage 내부의 독립 작업은 `parallel=auto`에서 병렬 fan-out 가능합니다.

#### 기획서 폴더 구조

```
apps/[app]/web/src/app/(admin)/
├── app.spec.md                 # 앱 기획서 (L0-L2: 컨텍스트, Actor, Goal)

apps/[app]/web/src/app/(admin)/[도메인]/
├── page.tsx                    # 목록 페이지
├── page.spec.md                # 목록 페이지 기획서
├── page.e2e.ts                 # E2E 테스트 (sidecar)
├── [entityId]/
│   ├── page.tsx                # 상세 페이지
│   ├── page.spec.md            # 상세 페이지 기획서
│   └── page.e2e.ts             # E2E 테스트 (sidecar)
├── new/
│   ├── page.tsx                # 등록 페이지
│   ├── page.spec.md            # 등록 페이지 기획서
│   └── page.e2e.ts             # E2E 테스트 (sidecar)
└── [entityId]/edit/
    ├── page.tsx                # 수정 페이지
    ├── page.spec.md            # 수정 페이지 기획서
    └── page.e2e.ts             # E2E 테스트 (sidecar)

packages/fe-ui/src/components/
├── feature/[FeatureName]/
│   ├── index.tsx
│   └── index.spec.md           # Feature 기획서
├── widget/[WidgetName]/
│   ├── index.tsx
│   └── index.spec.md           # Widget 기획서
└── ui/[UIName]/
    ├── index.tsx
    └── index.spec.md           # UI 기획서

packages/fe-store/src/stores/
├── [StoreName].ts
└── [StoreName].spec.md         # Store 기획서

apps/core/api/src/[module]/
├── [name].service.ts
├── [name].service.spec.md      # Service 기획서
├── repositories/
│   ├── [name].repository.ts
│   └── [name].repository.spec.md
└── controllers/
    ├── [name].controller.ts
    └── [name].controller.spec.md
```

#### 실행 방법

`/orch-stage`는 구조화 파라미터와 자연어 실행을 모두 지원합니다.

```bash
# 1. 도메인 기획 시작
/orch-stage full
# 📌 앱 선택? → admin
# 📌 도메인명? → Member
# 📌 요구사항? → 회원 목록/상세/등록/수정/삭제

# → Stage 1~3은 리뷰 게이트 기준 순차 진행
# → Stage 내부는 parallel=auto로 fan-out 가능

# 2. 화면별 프론트엔드 개발
/orch-stage run stage=4 app=admin domain=Member page=List
/orch-stage run stage=5 app=admin domain=Member page=List
/orch-stage run stage=6 app=admin domain=Member page=List

/orch-stage run stage=4 app=admin domain=Member page=Detail
/orch-stage run stage=5 app=admin domain=Member page=Detail
/orch-stage run stage=6 app=admin domain=Member page=Detail

# ... Create, Edit 반복

# 자연어로도 실행 가능
/orch-stage admin 회원 관리 기능 처음부터 진행해줘
/orch-stage 회원 목록 화면 기획해줘
/orch-stage 회원 목록 컴포넌트 구현해줘
/orch-stage 회원 목록 페이지 통합해줘

# 병렬 실행 예시
/orch-stage run stage=3 app=admin domain=Member targets=User,Post parallel=auto maxConcurrency=2
/orch-stage run stage=5 app=admin domain=Member pages=List,Detail parallel=auto maxConcurrency=2
```

#### 장점
- **기능 단위 백엔드**: API/스키마가 한 번에 완성되어 일관성 유지
- **페이지별 프론트엔드**: 점진적 개발, 컴포넌트 재사용 가능
- **화면별 기획서**: 코드 옆에 기획서가 있어 참조 용이
- **각 단계별 리뷰**: 문제 발견 시 해당 단계부터 재시작

#### Stage 5: 자동 메뉴 업데이트

**Stage 5에서는 목록 페이지(List) 개발 시 `fe-menu-builder` 에이전트가 자동으로 실행됩니다。**

```
Stage 5: 컴포넌트 (페이지별)
├── ui-component-builder
├── input-component-builder
├── widget-builder
├── feature-builder
├── store-builder
└── menu-builder (자동) ← 목록 페이지 개발 시만 실행
    - admin-menu.ts 업데이트
    - 경로, Subject, 아이콘 설정
    - 엔티티 관계 기반 경로 구조 적용
```

**자동 실행 조건:**
- 페이지 타입이 "List" (목록 페이지)인 경우에만 실행
- MemberList, UserList 등 첫 페이지 개발 시 메뉴 자동 생성
- Detail, Create, Edit 페이지는 메뉴 업데이트 없음

이 자동화로 메뉴 시스템이 항상 최신 상태로 유지됩니다。

### 개별 Agent

#### 오케스트레이터 (orch-*)

| Agent | 역할 |
|-------|------|
| orch-stage | 7단계 분할 개발 플로우를 조율하는 메타 에이전트 |
| orch-requirement | 코드 옆 기획서(Sidecar Spec) 방식으로 기획서와 코드를 함께 관리하는 오케스트레이터 |
| orch-screen-planner | 단일 화면 기획(L5-L12)을 조율하는 오케스트레이터 |

#### 기획/분석 (req-*)

| Agent | 역할 |
|-------|------|
| req-context-planner | 시스템 컨텍스트, 사용자(Actor), 사용자 목표(Goal) 기획 → `app.spec.md` 업데이트 |
| req-screen-planner | 도메인 기능/화면 구조 기획 → 각 `page.spec.md` 초안 생성 |
| req-page-planner | 페이지 통합 기획(SSR/Prefetch/핸들러) → `page.spec.md` 통합 섹션 업데이트 |
| req-api-planner | 인터랙션(Action)과 API 기획 → `controller.spec.md` + 페이지 API 섹션 |
| req-entity-planner | Entity/Enum/VO 기획 → `entity.spec.md`, `enum.spec.md`, `vo.spec.md` |
| req-ui-planner | 화면 UI 기획(L8) → `ui/index.spec.md` |
| req-input-planner | 입력 컴포넌트 기획 → `inputs/index.spec.md` |
| req-cell-planner | DataGrid/Table Cell 기획 → `cells/index.spec.md` |
| req-widget-planner | 화면 Widget 기획(L9) → `widget/index.spec.md` |
| req-layout-planner | 레이아웃 기획 → `layout/index.spec.md` |
| req-feature-planner | 화면 Feature 기획(L10) → `feature/index.spec.md` |
| req-menu-planner | 메뉴/경로/권한 기획 → `admin-menu.spec.md` |
| req-store-planner | 도메인 Store 기획(L11) → `[domain]Store.spec.md` |
| req-logic-planner | 비즈니스 로직/테스트 기획 → `service/repository.spec.md` + 테스트 케이스 |
| req-test-planner | 테스트 케이스 기획(L12) → 기존 `.spec.md` 테스트 섹션 업데이트 |
| req-api-integration-planner | Orval API 연동 기획 → `hooks/index.spec.md` |
| req-reverse-engineer | 기존 코드를 분석하여 `.spec.md` 역생성 |
| /design-analyze (Skill) | Figma 디자인 분석 및 컴포넌트 매핑 (Figma 있을 때) |
| /route-design (Skill) | 백엔드 엔티티 기반 라우팅 경로 설계 |

#### 프론트엔드 (fe-*)

| Agent | 역할 |
|-------|------|
| fe-ui-component-builder | Pure UI 컴포넌트 생성 (packages/fe-ui/src/components/ui) |
| fe-cell-builder | DataGrid/Table용 Cell 컴포넌트 생성 (계층별) |
| fe-input-component-builder | Input 컴포넌트 생성 (packages/fe-ui/src/components/inputs) |
| fe-widget-builder | 재사용 가능한 작은 UI 조각 Widget 컴포넌트 생성 |
| fe-feature-builder | 비즈니스 기능을 담당하는 Feature 컴포넌트 생성 |
| fe-layout-builder | Layout 컴포넌트 설계 및 생성 |
| fe-page-builder | 페이지 컴포넌트 생성 (useHandlers 분리) |
| fe-menu-builder | 메뉴 시스템 컴포넌트 생성 |
| fe-store-builder | MobX 기반 Store 생성 |
| fe-api-integrator | Orval 생성 React Query 훅을 사용하여 더미 데이터를 실제 API 호출로 교체 |

#### 백엔드 (be-*)

| Agent | 역할 |
|-------|------|
| be-schema-builder | Prisma 스키마 생성 및 유형 분류 |
| be-entity-builder | 도메인 Entity 클래스 생성 |
| be-dto-builder | Create/Update/Response DTO 클래스 생성 |
| be-query-dto-builder | PrismaQueryDto 기반 목록 조회용 Query DTO 생성 |
| be-vo-builder | Value Object 클래스 생성 |
| be-repository-builder | Prisma 기반 Repository 레이어 생성 |
| be-service-builder | NestJS Service 레이어 생성 |
| be-facade-builder | NestJS Facade 레이어 생성 (여러 Service 조합) |
| be-controller-builder | NestJS REST Controller 생성 |
| be-backend-service-builder | 복합 백엔드 서비스 구현 |
| be-database-expert | PostgreSQL/Prisma 데이터베이스 설계 및 최적화 |
| be-seed-maker | 현실 세계와 연결된 시드 데이터 생성 |
| be-bootstrap-integrator | AppModule 부트스트랩에 서비스를 통합 |
| be-prisma-annotator | Prisma 스키마에 @displayName 한글 주석 추가 |
| be-dmmf-parser-builder | Prisma DMMF 파싱 유틸리티 생성 |

#### 품질/테스트 (qa-*)

| Agent | 역할 |
|-------|------|
| qa-be-testing | Jest 기반 백엔드 및 공용 패키지 테스트 코드 작성 |
| qa-fe-testing | Vitest 기반 프론트엔드 패키지 테스트 코드 작성 |
| qa-be-e2e-testing | Jest+Supertest 기반 백엔드 E2E 테스트 작성 |
| qa-fe-e2e-testing | Playwright 기반 프론트엔드 E2E 테스트 작성 |
| qa-type-checker | TypeScript 타입 에러를 근본 원인까지 추적하여 해결 |
| /fe-review (Skill) | 프론트엔드 코드 규칙 검증 (리포트만) |
| /be-review (Skill) | 백엔드 코드 규칙 검증 (리포트만) |
| /type-check (Skill) | TypeScript 타입 에러 정확히 검사 및 보고 |
| /lint-format (Skill) | Biome으로 린트 및 포맷 검사/수정 |
| /vitest (Skill) | Vitest 테스트 프레임워크 패턴 |
| /testing-best-practices (Skill) | JavaScript 테스팅 모범 사례 제공 |
| /nestjs-best-practices (Skill) | NestJS 베스트 프랙티스 및 아키텍처 패턴 |

#### 인프라 (etc-*)

| Agent | 역할 |
|-------|------|
| etc-jenkinsfile-builder | Jenkins CI/CD 파이프라인 파일 생성 |

#### 개발 도구 (dev-*)

| Agent | 역할 |
|-------|------|
| dev-service-starter | 개발 서비스 시작 (admin, server, storybook 등) |

각 Agent의 상세 역할은 `.claude/agents/` 디렉토리를 참고하세요.

### 에이전트 실행 규칙 (Critical)

**에이전트 호출 시 반드시 아래 규칙을 따릅니다.**

#### 1. 시작/종료 선언 (필수)

**시작 시 출력:**
```
🚀 [에이전트명] 에이전트 시작
📋 작업: [작업 내용 요약]
📂 대상: [대상 파일/폴더]
```

**종료 시 출력:**
```
✅ [에이전트명] 에이전트 완료
📁 생성/수정된 파일:
   - [파일 경로 1]
   - [파일 경로 2]
```

**실패 시 출력:**
```
❌ [에이전트명] 에이전트 실패
⚠️ 원인: [실패 원인]
```

#### 2. PROGRESS.md 업데이트 (필수)

기획 폴더에 `PROGRESS.md`가 있으면 에이전트 실행 결과를 기록합니다:

```markdown
## Stage X: [단계명]
- [x] [에이전트명] 에이전트 실행 완료 (YYYY-MM-DD HH:MM)
  - 생성: `파일경로`
```

#### 3. 에이전트 미호출 시 명시

에이전트를 호출하지 않고 직접 작업할 경우 반드시 선언:
```
⚡ 직접 작업 (에이전트 미사용)
📋 작업: [작업 내용]
```

#### 예시

```
🚀 schema-builder 에이전트 시작
📋 작업: User 모델 Prisma 스키마 생성
📂 대상: packages/be-prisma/schema/user.prisma

[... 에이전트 작업 ...]

✅ schema-builder 에이전트 완료
📁 생성/수정된 파일:
   - packages/be-prisma/schema/user.prisma
   - packages/be-prisma/schema/enums.prisma
```
