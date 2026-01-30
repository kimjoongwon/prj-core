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
apps/admin/app/[route]/
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

### 컴포넌트 작성

- ui 컴포넌트를 만들 때는 mobx를 사용합니다

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

const { data, isLoading } = useGetUsers({ page: 1, limit: 10 });

// ❌ 금지 - 직접 axios/fetch 호출
const response = await axios.get("/api/v1/users");

// ❌ 금지 - useQuery 직접 구성 (Orval 훅이 이미 존재함)
const { data } = useQuery({
  queryKey: getGetUsersQueryKey({ page: 1, limit: 10 }),
  queryFn: () => getUsers({ page: 1, limit: 10 }),
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
// packages/store - 범용 Store 정의
export class PersistStore {
  constructor(config: { storageKey: string }) { }
}

// apps/admin/src/stores - 앱별 설정 주입
rootStore.persistStore = new PersistStore({
  storageKey: "admin-persist",
});

// apps/coin/src/stores - 다른 앱에서 재사용
rootStore.persistStore = new PersistStore({
  storageKey: "coin-persist",
});
```

### 공통 타입 선언 규칙

**여러 패키지에서 공통으로 사용되는 타입은 반드시 `@cocrepo/type`에 선언합니다.**

```typescript
// ✅ 올바른 예시 - @cocrepo/type에 타입 정의
// packages/type/src/navigation.ts
export interface NavItemConfig { ... }
export interface TabConfig { ... }
export interface FABAction { ... }

// 사용하는 곳에서 import
import type { NavItemConfig, TabConfig } from "@cocrepo/type";
```

```typescript
// ❌ 금지 - 다른 패키지에서 타입 정의 후 re-export
// packages/store/src/navItem.ts
export interface NavItemConfig { ... }  // 여기서 정의하면 안 됨

// packages/constant/src/admin-menu.ts
export type { NavItemConfig } from "@cocrepo/store";  // re-export 금지
```

**규칙:**
- 2개 이상의 패키지에서 사용되는 타입 → `@cocrepo/type`에 선언
- 단일 패키지 내부에서만 사용되는 타입 → 해당 패키지에 선언
- 타입 re-export 금지 → 항상 원본 패키지에서 직접 import

**@cocrepo/type 패키지 구조:**
```
packages/type/src/
├── index.ts          # 모든 타입 export
├── navigation.ts     # 네비게이션 관련 (NavItemConfig, TabConfig, FABAction)
├── config.types.ts   # 설정 관련
├── json.ts           # JSON 관련
└── page-meta.ts      # 페이지 메타 관련
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
- 5단계 플로우에서 각 단계별 리뷰로 변경 영향을 관리

## 백엔드 개발 규칙

### DTO 위치 규칙

- **DTO는 반드시 `packages/dto`에 위치**
- ❌ `apps/server/src/module/**/dto/` 에 DTO 생성 금지
- ✅ `packages/dto/src/` 에 DTO 생성
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

- `packages/prisma/seed-data.ts` - 시드 데이터 정의
- `packages/prisma/seed.ts` - 시드 실행 로직

**영향을 주는 변경 예시:**
- Prisma 스키마에 새로운 모델 추가
- 기존 모델의 필수 필드 추가/변경
- Enum 타입 변경
- 관계(relation) 구조 변경

### Multi-Tenancy 및 System Space

**X-Space-ID 헤더는 모든 인증된 사용자에게 필수입니다.**

```typescript
// ❌ 금지 - SUPER_ADMIN도 헤더 없이 요청 불가
fetch('/api/users', { headers: { Authorization: '...' } });

// ✅ 필수 - 모든 요청에 X-Space-ID 포함
fetch('/api/users', {
  headers: {
    Authorization: '...',
    'X-Space-ID': spaceId  // System Space 또는 일반 Space
  }
});
```

**System Space (seq=1):**
- SUPER_ADMIN 전용 Space로 시드 데이터에서 가장 먼저 생성됨
- `SYSTEM_SPACE.SEQ` 상수로 정의 (`@cocrepo/constant`)
- 전체 데이터 접근 권한은 Role 기반으로 Service 레이어에서 확인

**권한 유틸리티 (`@cocrepo/be-common`):**
```typescript
import { canAccessAllSpaces, isSystemSpace, isSystemTenant } from "@cocrepo/be-common";

// Service에서 전체 접근 권한 확인
if (canAccessAllSpaces(tenant)) {
  return this.repository.findAll();  // SUPER_ADMIN: 전체 조회
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

### 5단계 분할 개발 플로우 (권장)

**orch-stage**를 사용하여 각 단계별 사용자 리뷰를 받으며 개발합니다.

#### 핵심 개념: 기능 단위 기획

```
1 기획 = 1 기능(도메인) = 1 백엔드 + N 페이지
```

- **Stage 1-3**: 기능 전체를 한 번에 처리 (기획, 스키마, 백엔드)
- **Stage 4-5**: 페이지별로 반복 실행 (컴포넌트, 페이지)

#### 플로우

```
Stage 1: 기획 (기능 전체)    → orch-requirement (L0~L10) → [리뷰]
Stage 2: 스키마 (기능 전체)  → schema → entity → dto → seed → [리뷰]
Stage 3: 백엔드 (기능 전체)  → repository → service → controller → [리뷰]
Stage 4: 컴포넌트 (페이지별) → ui → widget → feature → [리뷰] ← page 파라미터 필요
Stage 5: 페이지 (페이지별)   → fe-page-builder → [리뷰] ← page 파라미터 필요
```

#### 기획서 폴더 구조

```
apps/proposal/plans/
└── [project]/              # 프로젝트 (수주 단위)
    └── [app]/              # 앱 (admin-web, admin-mobile, service-web 등)
        └── YYYY-MM-DD-[feature]/  # 기능 (Member, Order 등)
```

#### 실행 방법

```bash
# 1. 전체 기능 기획 시작 (프로젝트/앱을 질문으로 선택)
/orch-stage full
# 📌 프로젝트 선택? → project-alpha
# 📌 앱 선택? → admin-web
# 📌 기능명? → Member
# 📌 요구사항? → 회원 목록/상세/등록/수정/삭제

# → Stage 1~3 순차 진행 (기능 전체)

# 2. 페이지별 프론트엔드 개발
/orch-stage run stage=4 plan=project-alpha/admin-web/2026-01-30-Member page=MemberList
/orch-stage run stage=5 plan=project-alpha/admin-web/2026-01-30-Member page=MemberList

/orch-stage run stage=4 plan=project-alpha/admin-web/2026-01-30-Member page=MemberDetail
/orch-stage run stage=5 plan=project-alpha/admin-web/2026-01-30-Member page=MemberDetail

# ... MemberCreate, MemberEdit 반복
```

#### 장점
- **기능 단위 백엔드**: API/스키마가 한 번에 완성되어 일관성 유지
- **페이지별 프론트엔드**: 점진적 개발, 컴포넌트 재사용 가능
- **각 단계별 리뷰**: 문제 발견 시 해당 단계부터 재시작

### 개별 Agent

#### 오케스트레이터 (orch-*)

| Agent | 역할 |
|-------|------|
| orch-stage | 5단계 분할 개발 플로우를 조율하는 메타 에이전트 |
| orch-requirement | L0-L10 레이어별 기획 에이전트를 총괄 조율하는 오케스트레이터 |

#### 기획/분석 (req-*)

| Agent | 역할 |
|-------|------|
| req-L0L2-planner | 시스템 컨텍스트, 사용자(Actor), 사용자 목표(Goal) 레이어 기획 |
| req-L3L4-planner | 기능(Feature)과 화면(Screen) 레이어 기획 |
| req-L5L6-planner | 인터랙션(Action)과 API 레이어 기획 |
| req-L7L8-planner | 데이터 모델(Entity)과 UI 컴포넌트 레이어 기획 |
| req-L9L10-planner | 비즈니스 로직과 테스트 레이어 기획 |
| /design-analyze (Skill) | Figma 디자인 분석 및 컴포넌트 매핑 (Figma 있을 때) |
| /route-design (Skill) | 백엔드 엔티티 기반 라우팅 경로 설계 |

#### 프론트엔드 (fe-*)

| Agent | 역할 |
|-------|------|
| fe-ui-component-builder | Pure UI 컴포넌트 생성 (packages/ui/src/components/ui) |
| fe-cell-builder | DataGrid/Table용 Cell 컴포넌트 생성 (계층별) |
| fe-input-component-builder | Input 컴포넌트 생성 (packages/ui/src/components/inputs) |
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
| be-dto-builder | Request/Response DTO 클래스 생성 |
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
📂 대상: packages/prisma/schema/user.prisma

[... 에이전트 작업 ...]

✅ schema-builder 에이전트 완료
📁 생성/수정된 파일:
   - packages/prisma/schema/user.prisma
   - packages/prisma/schema/enums.prisma
```
