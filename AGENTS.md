# 프로젝트 개발 가이드

## 기술 스택

### 프론트엔드
- **프레임워크**: Next.js (App Router)
- **상태 관리**: MobX (Zustand 사용 안 함)
- **UI 라이브러리**: HeroUI (NextUI 기반)
- **스타일링**: Tailwind CSS
- **API 클라이언트**: Orval (자동 생성) + React Query

### 모바일
- **프레임워크**: Expo Router + React Native
- **UI 라이브러리**: heroui-native + `@cocrepo/mo-ui`
- **스타일링**: uniwind + tailwind-variants

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
| `be-app` | `@cocrepo/app` | ApplicationService 레이어 |
| `be-facade` | `@cocrepo/facade` | Controller 경계 조정 레이어 (응답 조립, read model, protocol composition) |
| `be-gateway` | `@cocrepo/gateway` | 외부 시스템 Gateway/Client/Adapter 레이어 |
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
| `fe-mo-ui` | `@cocrepo/mo-ui` | 모바일 UI 컴포넌트 |

## Claude Code 버그 회피

- **TodoWrite 도구의 content, activeForm은 영어로 작성** (한글 UTF-8 멀티바이트 문자열 처리 버그 회피)
- Task 도구의 description도 영어로 작성

## Claude Code 작업 원칙

- **AskUserQuestion 도구로 요구사항이나 선택지가 애매할 때 질문** - 추측하지 않고 사용자에게 확인
- **Task 도구로 적절한 에이전트를 활용하여 작업 수행** - 단순 작업보다 전문 에이전트 활용 우선
- **프론트엔드 E2E 테스트 작성/수정/안정화 요청은 기본적으로 `qa-fe-e2e-testing` role의 `agent`를 우선 사용**
- **기존 프론트엔드 E2E 테스트를 단순 실행만 하는 요청은 메인 Codex가 직접 실행할 수 있음**
- **브라우저를 띄운 headed 실행 요청도 단순 실행 범주로 간주하되, 테스트 수정이 필요해지면 `qa-fe-e2e-testing` role의 `agent`로 전환**
- **페이지별 E2E 테스트 코드는 각 route와 함께 관리되는 route-local 형태로 작성**
- **Codex가 페이지 기능을 구현, 수정, 삭제할 때는 관련 E2E 테스트도 같은 작업에서 최신 상태로 함께 갱신**

## Codex 용어 규칙

- **`.codex/config.toml`에 정의된 항목은 `role`로 부릅니다**
- **에이전트 생성 도구로 생성되는 실행 주체는 `agent`로 부릅니다**
- **에이전트 생성 도구 호출 시 사용하는 파라미터명은 `agent_type`으로 표기합니다**
- **`subagent`, `서브에이전트` 같은 비공식 용어는 사용하지 않습니다**
- **설명 시에는 `role`, `agent`, `agent_type`을 구분해서 사용합니다**

## Codex orchestration feedback loop

- `orch-delivery`가 승인된 spec 기준으로 실행 agent finding을 수집하고 재배치합니다.
- 실행 agent는 peer role을 직접 호출하거나 다른 role 책임 파일을 임의 수정하지 않고, 최종 보고에 `Feedback:` packet을 포함합니다.
- finding이 없으면 `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 보고합니다.
- orchestrator는 packet 기준으로 `send_input` follow-up, re-entry, blocked/pending을 결정합니다.

## 프론트엔드 개발 규칙

### 모바일 스타일링 규칙 (Critical)

**모바일(`apps/mobile`, `packages/fe-mo-ui`)은 uniwind와 tailwind-variants를 주 스타일링 수단으로 사용합니다.**

- 신규/수정 모바일 화면과 `@cocrepo/mo-ui` 컴포넌트에서 `StyleSheet`/`StyleSheet.create`를 사용하지 않습니다.
- reusable class 조합은 `tailwind-variants`의 `tv({ slots, variants })`로 정의합니다.
- 신규 모바일 조합의 간격/정렬은 `@cocrepo/mo-ui`의 `VStack`/`HStack` semantic rhythm preset을 우선 사용합니다.
- 신규/수정 모바일 화면과 `@cocrepo/mo-ui` 컴포넌트의 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive로 감쌉니다.
- Button, Chip, Switch, Checkbox, RadioGroup.Item처럼 텍스트 ownership을 내부에서 소유하는 compound/action primitive도 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화합니다. HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- HeroUI Native compound component를 `return <HeroX {...props} />` 형태로만 재노출하지 않습니다. `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props로 기본 조합을 미리 제공하고, 필요한 경우 dot-slot도 함께 노출합니다.
- RN 기본 컴포넌트에는 `className`, `contentContainerClassName`, `colorClassName`, `placeholderTextColorClassName` 등 uniwind class prop을 우선 사용합니다.
- `style` 객체는 safe-area inset, navigator option object, third-party native bridge 값처럼 className으로 표현하기 어려운 동적 값에만 제한합니다.
- `react-native-web`, DOM Tailwind class 전제, web-only fallback을 모바일 UI 구현에 끌어오지 않습니다.

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
- 신규 web 조합에서는 `@cocrepo/ui`의 `VStack`/`HStack`/`Spacer` semantic rhythm preset 우선
- 신규 mobile 조합에서는 `@cocrepo/mo-ui`의 `VStack`/`HStack` semantic rhythm preset 우선
- 페이지 큰 블록: `gap="page"`
- 섹션 내부 기본 리듬: `gap="section"`
- 제목/본문/작은 블록: `gap="block"`
- 버튼 행/짧은 수평 그룹: `gap="inline"`
- 메타데이터/촘촘한 그룹: `gap="dense"`
- raw `gap-*`, `space-y-*`, `space-x-*`는 legacy 유지나 CSS grid 같은 예외에서만 사용
- 컴포넌트 내부 padding: `p-4` ~ `p-6`

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
import { Button } from "@heroui/react";
import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";

// 목록 페이지
<Page
  top={
    <PageTitleBar
      title="회원 목록"
      description="시스템에 등록된 회원을 관리합니다."
      actions={<Button>회원 등록</Button>}
    />
  }
>
  <PageSurface>
    <SectionSurface>
      <DataGrid ... />
    </SectionSurface>
  </PageSurface>
</Page>
```

#### 중첩 규칙

- 최대 2단계 중첩: `PageSurface` > `SectionSurface`
- 내부 Surface는 외부보다 높은 elevation 사용
- 동일 elevation 중첩 금지

#### PageSurface 사용 위치 규칙

**PageSurface는 Page 컴포넌트에서만 사용합니다. Layout에서 사용 금지!**

**중요:** `Layout`, `Page`, `Section`, `DataGrid`의 슬롯에 검색/필터/액션 컴포넌트를 배치해도 배경이나 elevation은 자동 생성되지 않습니다. 화면에서 시각적 묶음이 필요하면 호출부에서 `PageSurface`, `SectionSurface` owner를 명시해야 합니다.

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
    <Page
      top={
        <PageTitleBar
          title="회원 목록"
          description="시스템에 등록된 회원을 관리합니다."
          actions={<Button>회원 등록</Button>}
        />
      }
    >
      <PageSurface>
        <SectionSurface>...</SectionSurface>
      </PageSurface>
    </Page>
  );
}
```

**이유:**
- Layout과 Page 모두에서 PageSurface를 사용하면 타이틀이 중복됨
- Layout은 구조적 래핑만 담당 (인증 체크, 공통 Provider 등)
- 페이지별 title, description, actions는 각 Page 컴포넌트에서 처리
- 하위 페이지(상세/수정/등록)가 다른 타이틀을 가질 때 유연하게 대응 가능

### 페이지 개발 규칙 (Critical)

**admin web 페이지는 CSR + `useQuery`를 기본으로 사용하고, page 단위 `SuspenseQuery`는 지양하며, SSR prefetch는 예외적으로만 사용합니다.**

```
기본 CSR 패턴
apps/admin/web/src/app/[route]/
├── page.tsx          # 클라이언트 컴포넌트 ("use client" + useQuery/useInfiniteQuery)
└── hooks/            # 통합 훅 (필요 시)

SSR 예외 패턴
apps/admin/web/src/app/[route]/
├── page.tsx          # 서버 컴포넌트 (Prefetch + HydrationBoundary)
├── _client.tsx       # 클라이언트 컴포넌트
├── _prefetch.ts      # Prefetch 설정
└── hooks/            # 통합 훅 (필요 시)
```

| 파일 | 역할 |
|------|------|
| `page.tsx` | 기본값은 클라이언트 컴포넌트이며 Orval `useQuery`/`useInfiniteQuery` 훅으로 UI를 렌더링 |
| `_client.tsx` | SSR 예외 페이지 또는 복잡한 분리 시에만 사용 |
| `_prefetch.ts` | SSR 예외 페이지에서만 Orval 생성 `prefetchGetXXXQuery` 함수 사용 |

**판별 기준**
- 기본값은 CSR입니다.
- 목록/검색/필터/페이지네이션/탭 전환 중심 페이지는 CSR을 유지합니다.
- page 단위에서는 `useSuspenseQuery`를 기본 선택지로 사용하지 않습니다.
- 목록/검색/필터/페이지네이션/탭 전환 중심 페이지는 `isLoading`/`isFetching`으로 상태를 제어합니다.
- `loading.tsx` 또는 수동 `<Suspense>`가 있고 전체 fallback이 UX상 허용되는 화면에서만 `useSuspenseQuery`를 예외적으로 검토합니다.
- 서버 쿠키/권한/space bootstrap 없이는 첫 렌더 구조를 결정할 수 없는 경우에만 SSR prefetch를 허용합니다.

**상세 템플릿은 `fe-route-builder` role 지시문을 참고하세요.**

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

### Create/Update Form Bootstrap + AiForm 패턴 (Critical)

**`@cocrepo/schema`는 검증 전용이며, 폼 렌더링 데이터는 Controller가 제공합니다.**

Create/Update 화면의 표준 응답 계약:

```typescript
{
  data: {
    mode: "CREATE" | "UPDATE",
    defaultObject: Record<string, unknown>,
    options: Record<string, Array<{ value: string; label: string }>>,
    ui: {
      readOnlyPaths: string[],
      hiddenPaths: string[],
      disabledPaths: string[],
    },
    fieldMeta: Record<string, {
      ai?: {
        fillable: boolean;
        defaultChecked?: boolean;
        reason?: string;
      };
    }>,
    aiSchemas: Array<{
      key: string;
      label: string;
      paths: string[];
    }>,
  }
}
```

규칙:
- 모든 키는 `state path` 기준으로 정의합니다.
- `defaultObject[path]`와 `options[path].value`는 타입/값이 일치해야 합니다.
- UI 우선순위는 `hidden > readOnly > disabled`입니다.
- Create/Update 페이지 상단에 `AiForm` Feature를 배치합니다.
- `AiForm`에서 스키마 선택 + 체크박스 선택 + `채우기` 버튼으로 AI 적용 대상을 프론트에서 최종 결정합니다.
- AI patch 적용 후 검증(schema)을 재실행합니다.

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

### One Component Per File 규칙 (Critical)

**source file 하나는 하나의 exported UI component만 소유합니다.**

규칙:
- 파일명과 exported component 이름은 일치해야 합니다.
- route/page/screen/feature/widget 파일 안에 private JSX subcomponent를 추가하지 않습니다.
- 반복되거나 이름 붙일 만한 JSX 조각은 적절한 계층의 별도 component 파일로 분리합니다.
- JSX를 반환하지 않는 mapper/helper 함수와 타입 선언은 같은 파일에 둘 수 있습니다.
- `*.stories.tsx`, `*.test.tsx`의 fixture/test-only component는 예외로 허용합니다.
- compound primitive는 예외적으로 같은 폴더에서 구성할 수 있지만, 공개 component는 파일별로 분리합니다.

예시:
```tsx
// ✅ 올바른 예시
// packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx
export const QuickActionList = observer((props: QuickActionListProps) => {
  return <ListGroup>{/* ... */}</ListGroup>;
});

// ❌ 금지 - 하나의 파일에 여러 JSX component 선언
const QuickActionRow = () => <ListGroup.Item />;
export const QuickActionList = () => <QuickActionRow />;
```

이유:
- component 단위가 파일 단위로 드러나야 `agent_type` ownership이 명확해집니다.
- page/screen/feature가 내부 component를 품고 비대해지는 것을 방지합니다.
- Storybook/test owner 추적이 쉬워집니다.

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
- `stores/` - 앱별 Store 설정/주입 (공용 Store wiring 전용)
- `hooks/` - 앱 전용 훅 (페이지 핸들러 등)
- `providers/` - 앱 전용 Provider

**페이지 단위 상태 규칙 (Critical):**
- 단일 페이지/단일 라우트 도메인에서만 사용하는 상태는 `packages/fe-store`에 만들지 않습니다.
- 이런 상태는 해당 페이지(`app/.../_client.tsx`, `hooks/`)의 로컬 state(`useState`/`useLocalObservable`)로 처리합니다.
- `packages/fe-store`는 여러 도메인/여러 페이지에서 재사용되는 공용 상태만 포함합니다.

```typescript
// ✅ 올바른 예시 - packages/fe-ui에서 import
import { SideNav, UserMenu } from "@cocrepo/ui";

// ❌ 금지 - apps 내부에 Feature 생성
// apps/admin/web/src/components/features/HeaderSpaceSelector.tsx  ← 금지!
```

### SSR/Hydration 관련 주의사항

**`"use client"` 컴포넌트도 서버에서 한 번 렌더되므로, 첫 클라이언트 렌더 결과는 서버 HTML과 같아야 합니다.**

- 첫 렌더 구조를 `localStorage`/`sessionStorage`, `window`/`document`, `Date.now()`, `Math.random()`, locale 기반 포맷팅 결과로 결정하지 않습니다.
- 서버가 알아야 하는 초기값은 cookie, headers, SSR prefetch data로 내려보냅니다.
- 브라우저 전용 상태는 render 중이나 Store constructor에서 hydrate하지 않고 `useEffect` 이후에 반영합니다.
- `PersistStore` 같은 공용 Store는 constructor를 순수하게 유지하고, localStorage hydrate는 Provider/effect에서 수행합니다.
- React Aria/HeroUI의 `id` mismatch는 대개 원인이 아니라 서버/클라이언트 트리 순서가 달라진 결과로 간주합니다.
- SSR 이점이 없고 첫 렌더 구조를 안정적으로 맞추기 어려운 순수 브라우저 위젯은 `dynamic(..., { ssr: false })` 또는 hydration 후 렌더링을 검토합니다.

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
- 서버가 모르는 브라우저 전용 스냅샷을 hydration 이후에만 읽어야 하는 경우

**불필요한 경우 (대부분):**
- 서버/클라이언트가 동일한 초기 스냅샷을 공유하는 MobX + Context Provider 패턴
- useState/React Query

**이유:** `"use client"` 컴포넌트도 서버에서 SSR됩니다. Store/provider가 render 중 브라우저 전용 값을 읽지 않으면 서버/클라이언트 첫 렌더가 동일해지고 Hydration mismatch를 피할 수 있습니다.
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

**공용 Store 범위 규칙 (Critical):**
- `@cocrepo/store`는 **교차 페이지/교차 도메인 재사용 상태**만 다룹니다.
- 페이지 전용 상태(`inquiries` 상세 화면 상태, 단일 폼 임시 상태 등)는 공용 Store로 승격하지 않습니다.
- 페이지 전용 상태가 필요하면 페이지 로컬 state로 구현하고, 필요한 UI에는 props로 주입합니다.

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
- 승인된 spec의 phase와 QA gate로 변경 영향을 관리

### Spec 정책 (Critical)

**실행 기준은 Route Delivery Spec 하나이고, Screen/Feature spec은 기획/시각/조합 계약입니다.**

**Route Delivery Spec**
- web route: `apps/*/web/src/app/**/page.spec.md`
- mobile route: `apps/mobile/src/app/**/index.spec.md`
- owner: `orch-delivery`
- 포함: backend/API, route wiring, foundation contract, component inventory, story/test/E2E, `Agent Assignment Matrix`, `Execution Graph`, shared file lock, approval log
- builder/QA agent는 route delivery spec 승인 전 실행하지 않습니다.

**Screen / Feature Planning Spec**
- web screen: `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].spec.md`
- web feature: `packages/fe-ui/src/feature/**/[FeatureName].spec.md`
- mobile screen: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md`
- mobile feature: `packages/fe-mo-ui/src/feature/**/[FeatureName].spec.md`
- 포함: 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약
- 제외: `Agent Assignment Matrix`, `Execution Graph`, backend build order, foundation 세부 실행표, approval gate

**공통 금지**
- `*.stories.spec.md`, `*.test.spec.md`, `*.e2e.spec.md`, `layout.spec.md`, `_client.spec.md`, `_prefetch.spec.md`, barrel `index.spec.md`, `type.spec.md`, hook/toolkit/store/dto/service/repository/controller/entity/vo spec은 신규 작성 금지입니다.
- `app.spec.md`, `package.spec.md`, `tsconfig.spec.md`, `*.toml.spec.md`, `*.json.spec.md`, `*.css.spec.md`, `*.html.spec.md`, `Dockerfile.*.spec.md`, `Jenkinsfile.*.spec.md`는 신규 생성하지 않습니다.
- non-source 문서는 `*.context.md`, `*.guide.md`, `*.ops.md`, `*.notes.md`, `*.template.md`, `README.md`를 사용합니다.
- TOML 설정/role 파일의 보조 문서인 `*.toml.guide.md`는 생성하지 않습니다.
- agent/role 설명은 해당 `.toml`의 `developer_instructions` 또는 인덱스 `README.md`에 직접 반영합니다.

**기존 코드 수정 완료 조건 (Critical):**
- route/page 코드나 route wiring을 변경하면 대응 route delivery spec의 `## Delivery`와 `## 변경 이력` 또는 `Approval / Execution Log`를 갱신합니다.
- Screen/Feature source를 변경하면 대응 planning spec의 visual/props/story-test 계약과 `## 변경 이력`을 갱신합니다.
- hook/toolkit/type/store/backend/leaf 파일에는 별도 spec을 만들지 않고 route delivery spec의 inventory row로 기록합니다.
- 이 정책은 별도 문서로 분리하지 않고 `AGENTS.md`, `.codex/config.toml`, 각 role TOML의 내장 지시문에 직접 유지합니다.

#### 기획서 파일 구조

```
apps/[app]/web/src/app/(admin)/
├── app.context.md              # 앱 컨텍스트 문서 (L0-L2, non-source)

apps/[app]/web/src/app/(admin)/[도메인]/
├── page.tsx                    # 목록 페이지
├── page.spec.md                # 목록 페이지 기획서 ← 코드 옆에 위치
├── page.e2e.ts                 # E2E 테스트 코드 (별도 spec.md 없음)
├── [entityId]/
│   ├── page.tsx                # 상세 페이지
│   ├── page.spec.md            # 상세 페이지 기획서
│   └── page.e2e.ts             # E2E 테스트 코드
├── new/
│   ├── page.tsx                # 등록 페이지
│   ├── page.spec.md            # 등록 페이지 기획서
│   └── page.e2e.ts             # E2E 테스트 코드
└── [entityId]/edit/
    ├── page.tsx                # 수정 페이지
    ├── page.spec.md            # 수정 페이지 기획서
    └── page.e2e.ts             # E2E 테스트 코드

packages/fe-ui/src/screen/
├── [ScreenName]/
│   ├── [ScreenName].tsx
│   ├── [ScreenName].spec.md
│   └── [ScreenName].stories.tsx

packages/fe-ui/src/feature/[FeatureName]/
├── [FeatureName].tsx
├── [FeatureName].spec.md       # Feature component 기획서
├── index.ts
└── [FeatureName].stories.tsx

packages/fe-mo-ui/src/feature/[FeatureName]/
├── [FeatureName].tsx
├── [FeatureName].spec.md       # Mobile Feature planning spec
├── index.ts
└── [FeatureName].stories.tsx
```

#### 기획서 타입별 내용

| 타입 | 파일 | 핵심 내용 |
|------|------|----------|
| **app-context** | `app.context.md` | 앱 컨텍스트, 사용자, 목표, 도메인 목록 (L0-L2, non-source) |
| **route-delivery** | `page.spec.md`, `index.spec.md` | 실행 source of truth, backend/API/foundation/route wiring/QA 실행 계약 |
| **screen-planning** | `[ScreenName].spec.md` | Screen props, 시각 composition, 상태별 렌더링, 하위 Feature/Widget 조합 |
| **feature-planning** | `[FeatureName].spec.md` | Feature props/event/state, Store/API/router 연결 의도, 실패/권한/로딩 상태 |

#### 기획서 변경 이력 관리

각 기획서 하단에 변경 이력을 기록합니다:

```markdown
## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-delivery |
| 2026-02-19 | 검색 기능 추가 | orch-delivery |
```

#### 장점

| 항목 | 설명 |
|------|------|
| **발견성** | 코드 파일만 보면 기획서도 바로 옆에 있음 |
| **동기화** | 기획서와 코드가 같은 폴더에 있어 버전 관리 용이 |
| **실행 단일화** | route delivery spec 하나가 승인/실행/QA 기준을 소유 |
| **기획 보존** | Screen/Feature planning spec으로 화면 의도를 보존 |

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

- **Controller**: 라우팅, DTO 검증, 인증 컨텍스트 수집만 담당
- **ApplicationService**: 사용자 과업 중심의 usecase workflow를 조율하는 계층 (Prisma 직접 호출 금지)
- **Facade**: Controller 경계에서 응답 조립, read model shaping, protocol composition을 담당하는 계층
- **Service**: 단일 Aggregate Root 또는 단일 도메인 로직 담당 (Repository를 통해서만 데이터 접근)
- **Gateway/Client/Adapter**: 외부 시스템 또는 복잡한 기술 서브시스템을 단순화해서 노출하는 레이어
- **Repository**: Prisma 쿼리 작성

### Aggregate Root / Entity 규칙

- 쓰기(command)는 Aggregate Root 기준으로 시작합니다.
- Child 엔티티 변경은 Root 또는 Root를 다루는 Service를 통해 수행합니다.
- Controller가 child service를 직접 호출해 Aggregate 내부 정합성을 우회하는 패턴은 금지합니다.
- Prisma가 생성한 타입은 **persistence model/entity**로 취급합니다.
- `packages/be-entity/src/*.entity.ts`는 **domain-facing entity**이며, 실제 Domain Entity 여부는 도메인 메서드/불변식 보유 여부로 판단합니다.
- `extends PrismaUser` 같은 상속형 패턴은 지양하고, Prisma 타입 shape를 참고한 구현 또는 rehydrate/mapper 방식을 기본으로 합니다.

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

### 단일 Spec 개발 플로우 (권장)

**orch-delivery** 하나가 요청 단위 spec 작성, 승인 질문, 백엔드/프론트엔드/모바일/QA 실행을 모두 소유합니다.
별도 Delivery Plan 문서는 만들지 않고, route delivery spec 안의 `## Delivery` 섹션으로 실행 계약까지 통일합니다.
Screen/Feature spec은 planning spec으로 유지하되 실행 그래프와 승인 gate를 소유하지 않습니다.

#### 핵심 개념: route delivery spec 하나가 전체 실행 그래프를 소유

```
1 route delivery spec = 1 요청/기능 = backend + foundation + route wiring + web/mobile 화면 + QA 실행 그래프
```

- route delivery spec은 화면, 백엔드, API, foundation, 상태, UI 요소, 테스트, 담당 `agent_type`, 실행 순서를 모두 명시합니다.
- Screen/Feature planning spec은 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 명시합니다.
- route delivery spec에는 `Planning Spec References` 표를 두어 소비/갱신할 Screen/Feature planning spec을 연결합니다.
- 화면 러프는 component명이 없는 `Visual Snapshot`과 component/계층을 표시하는 `Annotated Wireframe`을 함께 작성합니다.
- `Visual Snapshot`은 배경, surface, border, radius, spacing, typography, 상태색, CTA 위치만 보고도 대략적인 디자인을 떠올릴 수 있어야 합니다.
- 기획 spec의 표 헤더는 한글을 우선 사용합니다. `agent_type`, `operationId`, `codegen`처럼 고정된 기술 식별자만 원문을 유지합니다.
- 렌더링 계약은 component inventory 표로 작성해 `Feature`/`Widget`/`Input`/`Action`/`DataDisplay`/`Layout` 등 계층, 재사용/신규 여부, 대상 파일, 담당 `agent_type`을 드러냅니다.
- component inventory의 `agent_type`은 소스를 만들거나 수정하는 소스 담당 `agent_type`과 화면에 조립하는 소비/Wiring `agent_type`을 분리합니다.
- Storybook/Test 계약은 `Storybook 인벤토리`와 `Unit Test 인벤토리`로 작성하고, 필수 상태/variant와 검증 케이스를 먼저 정합니다.
- 신규/수정 UI component의 story/test 작성은 기본적으로 해당 UI builder `agent_type`이 같은 작업에서 담당하고, QA role은 누락/실패/contract drift를 검증합니다.
- PC/Web은 `packages/fe-ui/src/**` component source owner builder가 story/test를 담당하고, Mobile은 `packages/fe-mo-ui/src/**` component source owner builder가 story/test를 담당합니다.
- route `page.tsx`, Expo route file, `layout.tsx`, `_layout.tsx`, Store, backend-only step은 Storybook 대상이 아니며 필요한 unit/E2E 검증만 spec에 기록합니다.
- thin re-export나 barrel-only 변경처럼 story/test가 불필요하면 spec의 비고에 불필요 사유를 남깁니다.
- backend/API 계약은 `Prisma / Database`, `Prisma Annotation`, `Common Schema`, `Entity / VO`, `DTO / Query DTO`, `Repository`, `Service`, `ApplicationService`, `Facade / Gateway`, `엔드포인트`, `Module / Bootstrap`, `Seed`, `Codegen / API Client` 인벤토리를 구조별로 작성합니다.
- foundation 계약은 `Hook`, `Toolkit`, `Type`, `Store / State` 인벤토리를 구조별로 작성합니다.
- 각 backend inventory row는 재사용/수정/신규 여부, 대상 파일, 소스 담당 `agent_type`, 호출/Wiring 소비 `agent_type`을 드러내야 합니다.
- reusable hook은 `fe-hook-builder`, shared toolkit은 `common-toolkit-builder`, shared type은 `common-type-builder`, shared store는 `fe-store-builder`가 소스 담당입니다.
- route-local hook/util/type/state는 `fe-route-builder` 또는 `fe-mo-route-builder`가 처리하고 별도 spec을 만들지 않습니다.
- endpoint row는 controller endpoint, operationId, DTO/schema, Orval hook/codegen 영향을 보여주고, application/service/repository row는 어떤 workflow/capability/persistence method가 쓰이는지 보여줍니다.
- common schema row는 `common-schema-builder`, DTO row는 `be-dto-builder`/`be-query-dto-builder`, facade/gateway row는 `be-facade-builder`/`be-gateway-builder`처럼 실제 source owner role이 보이도록 분리합니다.
- `orch-delivery`는 승인된 route delivery spec에 없는 agent를 호출하지 않고, 허용 파일 범위 밖 파일을 수정하지 않습니다.
- 구현 대상의 spec 작성 후 Codex 질문 도구로 사용자 승인을 받기 전에는 builder/QA agent를 실행하지 않습니다.
- 병렬 실행은 spec에서 `parallel: true`이고 파일 ownership이 겹치지 않는 leaf/component step에만 허용합니다.
- `Execution Graph`는 Mermaid `Visual Execution Flow`, `Parallel Group Table`, `Step Order Table`을 함께 작성해 직렬 순서와 병렬 그룹을 시각적으로 보여줍니다.

#### 플로우

```
Spec: orch-delivery → route delivery spec + ## Delivery
Ask: "작성한 spec 기준으로 개발을 시작할까요?"
Backend: prisma → annotation → common schema → entity/vo/dto/query-dto → repository → service → app/facade/gateway → controller/module/bootstrap → seed
Codegen: pnpm --filter=@cocrepo/api codegen, API 변경 시
Foundation: common-type-builder/common-toolkit-builder/fe-hook-builder/fe-store-builder, 필요한 경우
Web: planning spec references → 필요한 leaf builders → fe-screen-builder → fe-route-layout-builder(필요 시) → fe-route-builder
Mobile: planning spec references → 필요한 leaf builders → fe-mo-widget-builder/fe-mo-feature-builder(필요 시) → fe-mo-screen-builder → fe-mo-route-layout-builder(필요 시) → fe-mo-route-builder
QA: qa-be-testing/e2e → qa-fe-testing/e2e → qa-mo-testing/e2e
```

> 화살표는 의존성 순서를 의미합니다. 독립 작업은 route delivery spec의 `Agent Assignment Matrix`에서만 병렬화할 수 있습니다.

#### Spec 위치

```
apps/[app]/web/src/app/(admin)/
├── app.context.md              # 앱 컨텍스트 문서 (L0-L2, non-source)

apps/[app]/web/src/app/(admin)/[도메인]/
├── page.tsx                    # 목록 페이지
├── page.spec.md                # 목록 route delivery spec
├── page.e2e.ts                 # E2E 테스트 코드
├── [entityId]/
│   ├── page.tsx                # 상세 페이지
│   ├── page.spec.md            # 상세 route delivery spec
│   └── page.e2e.ts             # E2E 테스트 코드
├── new/
│   ├── page.tsx                # 등록 페이지
│   ├── page.spec.md            # 등록 route delivery spec
│   └── page.e2e.ts             # E2E 테스트 코드
└── [entityId]/edit/
    ├── page.tsx                # 수정 페이지
    ├── page.spec.md            # 수정 route delivery spec
    └── page.e2e.ts             # E2E 테스트 코드

packages/fe-ui/src/screen/
├── [ScreenName]/
│   ├── [ScreenName].tsx
│   ├── [ScreenName].spec.md
│   └── [ScreenName].stories.tsx

packages/fe-ui/src/feature/[FeatureName]/
├── [FeatureName].tsx
├── [FeatureName].spec.md       # Feature planning spec
├── index.ts
└── [FeatureName].stories.tsx
```

#### 실행 방법

`/orch-delivery`는 새 요청을 받으면 spec을 작성하고 승인 질문을 연 뒤, 승인된 범위만 실행합니다.

```bash
# 1. spec 작성 후 승인 질문
/orch-delivery app=admin domain=Member feature=member-management requirements="회원 목록/상세/등록/수정/삭제"

# 2. 승인된 spec 재실행
/orch-delivery spec="apps/admin/web/src/app/(admin)/members/page.spec.md" phase=all parallel=auto

# 3. 일부 phase만 재실행
/orch-delivery spec="apps/admin/web/src/app/(admin)/members/page.spec.md" phase=web
/orch-delivery spec="apps/admin/web/src/app/(admin)/members/page.spec.md" phase=qa
```

#### 장점
- **기능 단위 백엔드**: API/스키마가 한 번에 완성되어 일관성 유지
- **페이지별 프론트엔드**: 점진적 개발, 컴포넌트 재사용 가능
- **실행 spec 단일화**: route delivery spec 하나가 승인/실행/QA 기준을 소유
- **기획 spec 보존**: Screen/Feature planning spec으로 시각/조합 의도를 유지
- **phase별 검증**: 문제 발견 시 spec의 해당 step부터 재진입

#### 메뉴 업데이트

목록 페이지(List)나 신규 navigation entry가 필요한 경우 route delivery spec의 `Agent Assignment Matrix`에 `fe-menu-builder` step을 명시합니다.

```
spec web phase
├── display/control/widget/feature builders, 필요한 경우
├── fe-store-builder, shared store 필요 시
└── fe-menu-builder, navigation entry 필요 시
    - admin-menu.ts 업데이트
    - 경로, Subject, 아이콘 설정
    - 엔티티 관계 기반 경로 구조 적용
```

**실행 조건:**
- spec에 menu/navigation step이 있을 때만 실행
- 목록 페이지가 도메인의 첫 진입점이면 보통 포함
- Detail, Create, Edit 페이지는 route catalog 변경이 필요할 때만 포함

이 기준으로 메뉴 변경도 spec의 파일 ownership과 shared lock 아래에서 처리합니다.

### 개별 Agent

#### 오케스트레이터 (orch-*)

| Agent | 역할 |
|-------|------|
| orch-delivery | Spec → Ask → Build → QA를 단일 흐름으로 소유하는 delivery 오케스트레이터 |

#### 기획 보조 Skill

| Skill | 역할 |
|-------|------|
| /design-analyze (Skill) | Figma 디자인 분석 및 컴포넌트 매핑 (Figma 있을 때) |
| /route-design (Skill) | 백엔드 엔티티 기반 라우팅 경로 설계 |

#### 프론트엔드 (fe-*)

| Agent | 역할 |
|-------|------|
| fe-display-builder | Display UI 컴포넌트 생성 (packages/fe-ui/src/display) |
| fe-cell-builder | DataGrid/Table용 Cell 컴포넌트 생성 (계층별) |
| fe-control-builder | Control 컴포넌트 생성 (packages/fe-ui/src/control) |
| fe-widget-builder | 재사용 가능한 작은 UI 조각 Widget 컴포넌트 생성 |
| fe-feature-builder | 비즈니스 기능을 담당하는 Feature 컴포넌트 생성 |
| fe-layout-builder | Layout 컴포넌트 설계 및 생성 |
| fe-hook-builder | web/mobile 공통 React hook 생성 (`@cocrepo/hook`) |
| fe-screen-builder | `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` web screen visual owner 생성 |
| fe-route-builder | `apps/*/src/app/**/page.tsx` thin container와 route/API/state wiring 소유 |
| fe-menu-builder | 메뉴 시스템 컴포넌트 생성 |
| fe-store-builder | MobX 기반 Store 생성 |

#### 모바일 프론트엔드 (fe-mo-*)

| Agent | 역할 |
|-------|------|
| fe-mo-screen-builder | 모바일 `fe-screen-builder` 대응 screen visual owner 생성 (`packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx`) |
| fe-mo-route-builder | Expo Router route file에서 shared screen을 연결하고 navigation/API/state/native wiring 구현 (`apps/mobile/src/app/**/*.tsx`) |
| fe-mo-route-layout-builder | Expo Router native `_layout.tsx` shell 구현 |
| fe-mo-widget-builder | 모바일 순수 UI 조합 Widget 구현 (`packages/fe-mo-ui/src/widget/**`) |
| fe-mo-feature-builder | 모바일 reusable Feature composition 구현 (`packages/fe-mo-ui/src/feature/**`) |

#### 백엔드 (be-*)

| Agent | 역할 |
|-------|------|
| be-prisma-builder | Prisma 스키마 생성 및 유형 분류 |
| common-schema-builder | 프론트엔드와 백엔드에서 공유하는 검증 스키마 생성 |
| common-toolkit-builder | 공용 `@cocrepo/toolkit` utility 생성 |
| common-type-builder | 공용 `@cocrepo/type` 타입 계약 생성 |
| be-entity-builder | 도메인 Entity 클래스 생성 |
| be-dto-builder | Create/Update/Response DTO 클래스 생성 |
| be-query-dto-builder | PrismaQueryDto 기반 목록 조회용 Query DTO 생성 |
| be-vo-builder | Value Object 클래스 생성 |
| be-repository-builder | Prisma 기반 Repository 레이어 생성 |
| be-service-builder | NestJS Service 레이어 생성 |
| be-app-builder | NestJS ApplicationService 레이어 생성 (여러 Service 조합) |
| be-facade-builder | NestJS Facade 레이어 생성 (Controller 경계 응답 조립 / protocol composition) |
| be-gateway-builder | 외부 시스템 Gateway/Client/Adapter 레이어 생성 |
| be-module-builder | aggregate root 기준 NestJS Module + Router wiring 생성 |
| be-controller-builder | NestJS REST Controller 생성 |
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

각 Agent의 상세 역할은 `.codex/agents/` 디렉토리를 참고하세요.

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

#### 2. Spec 실행 로그 업데이트 (필수)

spec에 실행 로그 섹션이 있으면 agent 실행 결과를 기록합니다:

```markdown
## Execution Log
- [x] [step id] [agent_type] 실행 완료 (YYYY-MM-DD HH:MM)
  - 생성/수정: `파일경로`
```

#### 3. 에이전트 미호출 시 명시

에이전트를 호출하지 않고 직접 작업할 경우 반드시 선언:
```
⚡ 직접 작업 (에이전트 미사용)
📋 작업: [작업 내용]
```

#### 예시

```
🚀 be-prisma-builder 에이전트 시작
📋 작업: User 모델 Prisma 스키마 생성
📂 대상: packages/be-prisma/schema/user.prisma

[... 에이전트 작업 ...]

✅ be-prisma-builder 에이전트 완료
📁 생성/수정된 파일:
   - packages/be-prisma/schema/user.prisma
   - packages/be-prisma/schema/enums.prisma
```
