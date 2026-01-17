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

```typescript
// ✅ 올바른 사용
import { useGetGrounds, useLogin } from "@cocrepo/api";

// ❌ 금지 - 직접 axios/fetch 호출
const response = await axios.get("/api/v1/grounds");
```

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

**stage-orchestrator**를 사용하여 각 단계별 사용자 리뷰를 받으며 개발합니다.

```
Stage 1: 데이터 설계     → planner → technical-designer → [사용자 리뷰]
Stage 2: 스키마 구현     → schema → entity → dto → seed → [사용자 리뷰]
Stage 3: 백엔드 로직     → repository → service → controller → [사용자 리뷰]
Stage 4: 컴포넌트 구현   → ui → widget → feature → [사용자 리뷰]
Stage 5: 페이지 통합     → page-builder → page-reviewer → [사용자 리뷰]
```

**실행 방법:**
```bash
# 전체 실행 (Stage 1부터)
/stage-orchestrator full

# 특정 단계부터 시작
/stage-orchestrator start stage=3

# 특정 단계만 실행
/stage-orchestrator run stage=2
```

**장점:**
- 각 단계별 사용자 리뷰로 품질 향상
- 변경 발생 시 영향 범위 최소화 (해당 단계부터 재시작)
- 단계별 산출물 문서화 (`-design.md`, `-schema.md`, `-backend.md`, `-components.md`, `-complete.md`)

### 레거시 오케스트레이터 (Deprecated)

- ~~**page-orchestrator**~~: `stage-orchestrator`로 대체됨

### 개별 Agent

| 카테고리 | Agent | 역할 |
|---------|-------|------|
| **기획/분석** | planner | 요구사항 → 화면 기획서 작성 (Figma 없을 때) |
| | design-analyzer | Figma 디자인 분석 및 컴포넌트 매핑 (Figma 있을 때) |
| | technical-designer | 기획 문서 개발적 강화 및 Entity/API 상세 설계 |
| | route-designer | 백엔드 엔티티 기반 라우팅 경로 설계 |
| **프론트엔드** | ui-component-builder | Pure UI 컴포넌트 생성 (components/ui) |
| | input-component-builder | Input 컴포넌트 생성 (components/inputs) |
| | page-builder | 페이지 컴포넌트 생성 (useHandlers 분리) |
| | frontend-architect | React 컴포넌트 아키텍처 설계 |
| **백엔드** | repository-builder | Prisma Repository 레이어 생성 |
| | service-builder | NestJS Service 레이어 생성 |
| | facade-builder | NestJS Facade 레이어 생성 (여러 Service 조합) |
| | controller-builder | NestJS Controller 레이어 생성 |
| | backend-architect | NestJS API 설계 |
| | backend-service-builder | 복합 백엔드 서비스 구현 |
| **데이터** | schema-builder | Prisma 스키마 생성 및 유형 분류 |
| | entity-builder | 도메인 Entity 클래스 생성 |
| | dto-builder | Request/Response DTO 클래스 생성 |
| | database-expert | Prisma 스키마 설계 및 최적화 |
| | seed-maker | 현실 세계와 연결된 시드 데이터 생성 |
| **품질** | page-reviewer | 페이지 생성 결과 규칙 검증 (필수) |
| | code-reviewer | 코드 리뷰 및 개선 제안 |
| | test-engineer | 테스트 코드 작성 |
| | refactoring-expert | 코드 리팩토링 |
| | performance-optimizer | 성능 최적화 |
| | security-auditor | 보안 취약점 분석 |
| **인프라** | devops-engineer | 배포 및 인프라 설정 |
| | jenkinsfile-builder | Jenkins 파이프라인 파일 생성 |

각 Agent의 상세 역할은 `.claude/agents/` 디렉토리를 참고하세요.
