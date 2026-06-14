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
| `be-command` | `@cocrepo/command` | CQRS Command/Query message contract |
| `be-event` | `@cocrepo/event` | CQRS Event message contract |
| `be-usecase` | `@cocrepo/usecase` | CQRS UseCase/EventHandler/Saga 레이어 |
| `be-aggregate` | `@cocrepo/aggregate` | Aggregate root service provider (`{Domain}AggregateRoot`) |
| `be-client` | `@cocrepo/client` | 외부 시스템 단일 연동 Client |
| `be-facade` | `@cocrepo/facade` | Controller 경계 조정 레이어 (응답 조립, read model, protocol composition) |
| `be-gateway` | `@cocrepo/gateway` | 외부 시스템 Gateway/Client/Adapter 레이어 |
| `be-prisma` | `@cocrepo/prisma` | Prisma 스키마 및 클라이언트 |
| `be-repository` | `@cocrepo/repository` | Repository 레이어 |
| `be-service` | `@cocrepo/service` | Token/Redis/Prisma/Email/ObjectStorage 등 support service 레이어 |
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
- **Task 도구로 적절한 subagent를 활용하여 작업 수행** - 단순 작업보다 전문 subagent 활용 우선
- **프론트엔드 E2E 테스트 작성/수정/안정화 요청은 기본적으로 `qa-fe-e2e-testing` subagent를 우선 사용**
- **기존 프론트엔드 E2E 테스트를 단순 실행만 하는 요청은 메인 Codex가 직접 실행할 수 있음**
- **브라우저를 띄운 headed 실행 요청도 단순 실행 범주로 간주하되, 테스트 수정이 필요해지면 `qa-fe-e2e-testing` subagent로 전환**
- **페이지별 E2E 테스트 코드는 각 route와 함께 관리되는 route-local 형태로 작성**
- **Codex가 페이지 기능을 구현, 수정, 삭제할 때는 관련 E2E 테스트도 같은 작업에서 최신 상태로 함께 갱신**

## Codex orchestration execution

- `orch-delivery`는 승인된 spec 기준으로 직렬/병렬 실행 순서만 배정합니다.
- 실행 subagent는 peer subagent를 직접 호출하거나 다른 subagent 책임 파일을 임의 수정하지 않습니다.
- 실행 결과와 남은 이슈는 각 subagent의 최종 보고와 변경 diff, 테스트 결과를 사람이 검증합니다.

## 프론트엔드 개발 규칙

### 모바일 스타일링 규칙 (Critical)

**모바일(`apps/mobile`, `packages/fe-mo-ui`)은 uniwind와 tailwind-variants를 주 스타일링 수단으로 사용합니다.**

- 신규/수정 모바일 화면과 `@cocrepo/mo-ui` 컴포넌트에서 `StyleSheet`/`StyleSheet.create`를 사용하지 않습니다.
- `@cocrepo/mo-ui` 컴포넌트 작업 전에는 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- reusable class 조합은 `tailwind-variants`의 `tv({ slots, variants })`로 정의합니다.
- 신규 모바일 조합의 간격/정렬은 `@cocrepo/mo-ui`의 `VStack`/`HStack` semantic rhythm preset을 우선 사용합니다.
- 신규/수정 모바일 화면과 `@cocrepo/mo-ui` 컴포넌트의 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive로 감쌉니다.
- Button, Chip, Switch, Checkbox, RadioGroup.Item처럼 텍스트 ownership을 내부에서 소유하는 compound/action primitive도 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화합니다. HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- HeroUI Native compound component를 `return <HeroX {...props} />` 형태로만 재노출하지 않습니다. field 계열은 upstream `TextField`, `Label`, `Description`, `FieldError`, `InputGroup` composition을 먼저 사용하고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot도 함께 노출합니다.
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
- 신규 web 조합에서 `VStack`/`HStack`/`Spacer`는 `packages/fe-ui/src/screen`에서만 사용합니다.
- 신규 mobile 조합에서는 `@cocrepo/mo-ui`의 `VStack`/`HStack` semantic rhythm preset 우선
- 페이지 큰 블록: `gap="page"`
- 섹션 내부 기본 리듬: `gap="section"`
- 제목/본문/작은 블록: `gap="block"`
- 버튼 행/짧은 수평 그룹: `gap="inline"`
- 메타데이터/촘촘한 그룹: `gap="dense"`
- route `page.tsx`, `layout.tsx`, feature, widget, form, detail 내부 정렬은 `div` + Tailwind flex/grid/gap class로 처리합니다.
- 컴포넌트 내부 padding: `p-4` ~ `p-6`

### Layout / Surface / Rhythm 계층 (Critical)

**web 화면 계층은 `root app/layout.tsx = App(header/footer/leftAside/rightAside/main) + shell 직접 조립`, `page.tsx = route wiring`, `Page = children-only content boundary`, `screen = ScreenSurface + SectionSurface + rhythm`, `feature/widget = local Surface`로 고정합니다.**

#### 구조 계층

- web root `app/layout.tsx`는 `Providers > App(header/leftAside/main/footer)` 형태로 root app structure와 공통 shell을 직접 소유합니다.
- `Providers`는 auth refresh, i18n, ability, Space bootstrap/guard, navigation scope checker 같은 전역 side effect를 소유합니다.
- `App`은 root 구조 슬롯(`header`, `footer`, `leftAside`, `rightAside`, `main`)을 받습니다.
- `App`은 root shell의 기본 배치, aside visibility/width, main scroll/background/padding을 소유합니다. `app/layout.tsx`에서 slot을 Tailwind wrapper로 감싸지 않습니다.
- `Page`는 `children`만 받는 페이지 콘텐츠 boundary이며, `App`의 슬롯 시스템을 재사용하지 않습니다.
- admin web route group/domain/auth `layout.tsx`는 만들지 않습니다. 필요한 shell은 root `app/layout.tsx`에서 package UI/feature로 직접 조립합니다.
- `RouteFrame`처럼 pathname으로 route shell을 고르는 package feature를 만들지 않습니다.
- app route 아래 `_layout`, `_components`, `components`, `hooks` 폴더를 만들지 않습니다.
- React hook은 `packages/fe-hook`, React component는 `packages/fe-ui`에 둡니다.
- `layout.tsx`에서 `ScreenSurface`, `SectionSurface`, `Surface`, `VStack`, `HStack`, `Spacer`를 import/use하지 않습니다.
- `Section`, `FormSection`, `DetailSection`, `FormPage`, `DetailPage` 같은 별도 section/page wrapper는 만들거나 export하지 않습니다.
- reusable UI/Hook 이름에는 `Admin`, `Management` 같은 불필요한 도메인 접두사를 붙이지 않습니다. `Admin` 의미가 반드시 필요하면 `packages/fe-ui/src/feature`의 app-specific feature로만 허용합니다.

#### Surface 계층

| 컴포넌트 | owner | 기본 variant | 용도 |
|----------|-------|--------------|------|
| `ScreenSurface` | `packages/fe-ui/src/screen` public screen boundary | `default` | screen outer 작업 영역 |
| `SectionSurface` | `packages/fe-ui/src/screen` screen component | `secondary` | screen 안의 주요 작업 섹션 |
| `Surface` | feature/widget | `tertiary` | 독립 local panel, table shell, console block |

- `Surface`는 `@heroui/react`의 `Surface`를 wrapping하는 public primitive입니다.
- `elevation`, `padding`, `SurfacePadding`, `ElevationLevel`, `Surface.elevation.ts` 기반 스타일 시스템을 다시 만들지 않습니다.
- `ScreenSurface`와 `SectionSurface`는 screen 계층 전용 semantic wrapper입니다.
- route `page.tsx` / route-local `_client.tsx`는 `ScreenSurface`, `SectionSurface`, `Surface`, rhythm primitive를 직접 import/use하지 않습니다.
- screen implementation은 `SectionSurface`와 rhythm을 직접 소유하고, public screen export는 `ScreenSurface`를 소유합니다.
- feature/widget은 local panel이 필요할 때만 `Surface`를 사용합니다. `ScreenSurface`/`SectionSurface`와 rhythm primitive는 사용하지 않습니다.
- 반복 row/item/metric item은 기본적으로 `Surface` 반복 중첩 대신 border/divider/background/spacing으로 구분합니다.
- modal, popover, drawer 같은 overlay는 overlay primitive가 자체 surface를 소유합니다.

#### 사용 예시

```tsx
// apps/admin/web/src/app/layout.tsx
import { AccessGate, App, SideNavigation, TopBar } from "@cocrepo/ui";

export default function RootLayout({ children }) {
  return (
    <Providers>
      <App
        header={<TopBar />}
        leftAside={<SideNavigation />}
        main={<AccessGate contents={children} />}
      />
    </Providers>
  );
}
```

```tsx
// apps/admin/web/src/app/(admin)/courses/page.tsx
import { useCourseData } from "@cocrepo/hook";
import { CourseScreen } from "@cocrepo/ui";

export default function CoursesPageRoute() {
  const data = useCourseData();

  return <CourseScreen {...data} activeSectionId="courses" />;
}
```

```tsx
// packages/fe-ui/src/screen/CourseScreen/CourseScreen.tsx
import { PageTitleBar, SectionSurface, VStack } from "@cocrepo/ui";

export const CourseScreen = () => (
  <VStack gap="section">
    <PageTitleBar title="수강 관리" />
    <SectionSurface>
      <CourseConsole />
    </SectionSurface>
  </VStack>
);
```

```tsx
// packages/fe-ui/src/widget/course/CourseTableShell.tsx
import { Surface } from "@cocrepo/ui";

export const CourseTableShell = ({ children }) => (
  <Surface className="p-5">
    {children}
  </Surface>
);
```

#### Ownership 규칙

- root `app/layout.tsx`: `App`, provider 진입점, 공통 shell 조립을 소유합니다. Slot에는 component만 전달하고 스타일 wrapper를 만들지 않습니다.
- `Providers`: 전역 bootstrap/effect와 전역 overlay를 소유합니다.
- route group/domain/auth `layout.tsx`: 만들지 않습니다. `Page`, surface, rhythm, shell 조립을 분산하지 않습니다.
- `page.tsx` / route-local `_client.tsx`: API/state/router wiring만 소유합니다.
- `screen`: `ScreenSurface`, `SectionSurface`, `VStack`/`HStack`/`Spacer` rhythm을 소유합니다.
- `feature`: store/API/action wiring, shell slot에 들어가는 feature, local `Surface` panel만 소유합니다.
- `widget`: 재사용 UI 조합과 local `Surface` panel만 소유합니다.

### 페이지 개발 규칙 (Critical)

**admin web 페이지는 CSR + `useQuery`를 기본으로 사용하고, page 단위 `SuspenseQuery`는 지양하며, SSR prefetch는 예외적으로만 사용합니다.**

```
기본 CSR 패턴
apps/admin/web/src/app/[route]/
├── page.tsx          # 클라이언트 컴포넌트 ("use client" + Orval hook wiring)
└── page.spec.md      # route/screen mapping contract

SSR 예외 패턴
apps/admin/web/src/app/[route]/
├── page.tsx          # 서버 컴포넌트 (Prefetch + HydrationBoundary)
├── _client.tsx       # 클라이언트 컴포넌트
├── _prefetch.ts      # Prefetch 설정
└── page.spec.md      # SSR 예외 승인 근거 포함
```

| 파일 | 역할 |
|------|------|
| `page.tsx` | 기본값은 클라이언트 컴포넌트이며 Orval `useQuery`/`useInfiniteQuery` 훅으로 UI를 렌더링 |
| `_client.tsx` | SSR 예외 페이지 또는 복잡한 분리 시에만 사용 |
| `_prefetch.ts` | SSR 예외 페이지에서만 Orval 생성 `prefetchGetXXXQuery` 함수 사용 |

route-local `hooks/`, `_components/`, `components` 폴더는 만들지 않습니다. 재사용 가능한 hook은 `packages/fe-hook/src`, React 컴포넌트는 `packages/fe-ui/src`에서 소유합니다.

**판별 기준**
- 기본값은 CSR입니다.
- 목록/검색/필터/페이지네이션/탭 전환 중심 페이지는 CSR을 유지합니다.
- page 단위에서는 `useSuspenseQuery`를 기본 선택지로 사용하지 않습니다.
- 목록/검색/필터/페이지네이션/탭 전환 중심 페이지는 `isLoading`/`isFetching`으로 상태를 제어합니다.
- `loading.tsx` 또는 수동 `<Suspense>`가 있고 전체 fallback이 UX상 허용되는 화면에서만 `useSuspenseQuery`를 예외적으로 검토합니다.
- 서버 쿠키/권한/space bootstrap 없이는 첫 렌더 구조를 결정할 수 없는 경우에만 SSR prefetch를 허용합니다.

**상세 템플릿은 `fe-route-agent`가 사용하는 `.agents/skills/fe-route-creator` skill 지시문을 참고하세요.**

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
- component props/type/mapper/helper도 별도 파일로 분리합니다. 예: `QuickActionList.props.ts`, `quick-action-list.mapper.ts`.
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
| Pure UI | `packages/fe-ui/src/{action,input,selection,data-display,feedback,overlay,navigation}/` | ❌ `apps/*/src/components/**` |
| Widget | `packages/fe-ui/src/widget/` | ❌ `apps/*/src/components/widget/` |
| **Feature** | `packages/fe-ui/src/feature/` | ❌ `apps/*/src/components/feature/` |
| Layout | `packages/fe-ui/src/layout/` | ❌ `apps/*/src/components/layout/` |
| Cell | `packages/fe-ui/src/cell/` | ❌ `apps/*/src/components/cell/` |
| Hook | `packages/fe-hook/src/` | ❌ `apps/*/src/app/**/hooks`, `apps/*/src/hooks` |

**앱(`apps/*`)에서 허용되는 것:**
- `app/` - Next.js App Router 페이지
- `stores/` - 앱별 Store 설정/주입 (공용 Store wiring 전용)
- `providers/` - 앱 전용 Provider

**페이지 단위 상태 규칙 (Critical):**
- 단일 페이지/단일 라우트 도메인에서만 사용하는 상태는 `packages/fe-store`에 만들지 않습니다.
- 이런 상태는 해당 페이지(`app/.../page.tsx`, route-local `_client.tsx`)의 로컬 state(`useState`/`useLocalObservable`)로 처리하거나, 재사용 hook이면 `packages/fe-hook`으로 승격합니다.
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

### 함수 JSDoc 규칙 (Critical)

**직접 작성하는 모든 함수에는 JSDoc을 작성합니다.**

규칙:
- `function`, arrow function, class method, hook, mapper, parser, normalizer, event handler 등 직접 작성한 함수에는 JSDoc을 둡니다.
- JSDoc에는 함수가 수행하는 책임, 주요 파라미터 의미, 반환값 의미를 간결하게 적습니다.
- boolean flag, 외부 시스템 값, ID, state path처럼 오해하기 쉬운 인자는 `@param`으로 원천과 의미를 명시합니다.
- 반환값이 단순하지 않거나 실패/예외 가능성이 있으면 `@returns`와 `@throws`를 작성합니다.
- 컴포넌트 파일의 exported component 함수도 JSDoc으로 역할과 주요 props 계약을 설명합니다.
- `*.stories.tsx`, `*.test.ts(x)`, generated 파일은 예외로 허용합니다.

```typescript
/**
 * 관리자 메뉴 항목 중 현재 경로와 일치하는 항목을 찾습니다.
 *
 * @param items - 탐색할 관리자 메뉴 항목 목록
 * @param pathname - Next.js router에서 전달된 현재 경로
 * @returns 현재 경로와 일치하는 메뉴 항목, 없으면 undefined
 */
export function findActiveAdminMenuItem(
  items: NavItemConfig[],
  pathname: string,
) {
  return items.find((item) => item.href === pathname);
}
```

### Source File 단일 책임 규칙 (Critical)

**source file 하나는 하나의 책임 요소만 소유합니다.**

규칙:
- 하나의 파일에는 하나의 exported class/function/type/interface/enum만 둡니다.
- class 파일에는 top-level helper/mapper 함수, props/interface/type 선언, 보조 class를 함께 두지 않습니다.
- Props/Params/Input/Result/Options 같은 계약 타입은 `{name}.props.ts`, `{name}.input.ts`, `{name}.result.ts`, `{name}.options.ts`처럼 별도 파일로 분리합니다.
- helper/mapper/parser/normalizer/constant도 `{name}.ts`, `{name}.mapper.ts`, `{name}.parser.ts`, `{name}.normalizer.ts`, `{name}.constants.ts`처럼 별도 파일로 분리합니다.
- 같은 도메인에서만 함께 쓰는 파일은 같은 폴더에 가깝게 두고, 여러 도메인/패키지가 공유하면 해당 owner 패키지(`@cocrepo/type`, `@cocrepo/toolkit` 등)로 이동합니다.
- private class method와 private static field는 class 책임 내부이므로 같은 파일에 둘 수 있습니다.
- barrel export 전용 파일(`index.ts` 또는 legacy compatibility barrel), `*.stories.tsx`, `*.test.ts(x)`, generated 파일, Prisma schema 파일은 예외로 허용합니다.

이유:
- 파일 단위가 owner/agent_type 책임 단위로 드러납니다.
- class, 타입 계약, 유틸리티 변경을 독립적으로 추적하고 검증할 수 있습니다.
- 단일 파일에 여러 책임이 숨어 생기는 재사용/마이그레이션 누락을 줄입니다.

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

**실행 기준은 서비스 delivery spec 하나와 여기서 생성된 route delivery spec 실행 slice입니다. Screen/Feature spec은 기획/시각/조합 계약입니다.**

**서비스 Delivery Spec**
- service: `docs/services/**/*.delivery.spec.md`
- 담당 subagent: `orch-delivery`
- 포함: 서비스 목표, 사용자/권한, 도메인 모델/생명주기, 사용자 여정, 필요한 모든 web/mobile route 목록, backend/API/foundation 계약, `DESIGN.md` 기반 서비스 디자인 방향, 생성된 route spec 목록, subagent 배정 매트릭스, 실행 그래프, QA/승인 기준, 승인 로그
- `orch-delivery`는 Codex 질문 도구를 반복 사용해 서비스 목표, 사용자/운영자 journey, 권한, 도메인 모델, API, web/mobile 필요 페이지, 디자인 방향, QA 기준을 확정한 뒤 service delivery spec을 작성합니다.
- service delivery spec 승인 전에는 route/page spec 생성, subagent 실행, QA subagent 실행을 하지 않습니다.

**생성된 Route Delivery Spec**
- web route: `apps/*/web/src/app/**/page.spec.md`
- mobile route: `apps/mobile/src/app/**/index.spec.md`
- 담당 subagent: `orch-delivery`
- 성격: 승인된 service delivery spec에서 파생된 page/route 실행 slice
- 포함: 상위 service spec, 화면 계약, route wiring, component inventory, route-consumed hook/state, story/test/E2E, 해당 route가 소비하는 backend/API/foundation slice, route-level subagent 배정 매트릭스, 실행 그래프, 공유 파일 잠금, 승인 로그
- backend/API/foundation의 최상위 설계와 build order는 service delivery spec이 소유하고 route spec은 관련 slice만 참조합니다.

**Screen / Feature Planning Spec**
- web screen: `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].spec.md`
- web feature: `packages/fe-ui/src/feature/**/[FeatureName].spec.md`
- mobile screen: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md`
- mobile feature: `packages/fe-mo-ui/src/feature/**/[FeatureName].spec.md`
- 포함: 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약
- 제외: subagent 배정 매트릭스, 실행 그래프, backend build order, foundation 세부 실행표, approval gate

**공통 금지**
- `*.stories.spec.md`, `*.test.spec.md`, `*.e2e.spec.md`, `layout.spec.md`, `_client.spec.md`, `_prefetch.spec.md`, barrel `index.spec.md`, `type.spec.md`, hook/toolkit/store/dto/service/repository/controller/entity/vo spec은 신규 작성 금지입니다.
- `app.spec.md`, `package.spec.md`, `tsconfig.spec.md`, `*.toml.spec.md`, `*.json.spec.md`, `*.css.spec.md`, `*.html.spec.md`, `Dockerfile.*.spec.md`, `Jenkinsfile.*.spec.md`는 신규 생성하지 않습니다.
- non-source 문서는 `*.context.md`, `*.guide.md`, `*.ops.md`, `*.notes.md`, `*.template.md`, `README.md`를 사용합니다.
- TOML 설정/subagent 파일의 보조 문서인 `*.toml.guide.md`는 생성하지 않습니다.
- subagent 설명과 실행 guardrail은 해당 `.toml`의 `developer_instructions` 또는 인덱스 `README.md`에 반영하고, 상세 구현 절차는 `.agents/skills/*-creator` skill에 둡니다.

**기존 코드 수정 완료 조건 (Critical):**
- 서비스 전체 설계, backend/API/foundation, route 목록, 권한, journey, 디자인 방향을 변경하면 대응 service delivery spec의 관련 섹션과 `승인 / 실행 로그`를 갱신합니다.
- route/page 코드나 route wiring을 변경하면 대응 generated route delivery spec의 `## 딜리버리`와 `## 변경 이력` 또는 `승인 / 실행 로그`를 갱신하고, 상위 service spec에도 영향 요약을 남깁니다.
- Screen/Feature source를 변경하면 대응 planning spec의 visual/props/story-test 계약과 `## 변경 이력`을 갱신합니다.
- hook/toolkit/type/store/backend/leaf 파일에는 별도 spec을 만들지 않고 service delivery spec의 inventory row와 필요한 route delivery spec의 slice row로 기록합니다.
- 이 정책의 실행 guardrail은 `AGENTS.md`, `.codex/config.toml`, 각 subagent TOML의 내장 지시문에 유지하고, 기술별 상세 구현 절차는 `.agents/skills/*-creator` skill에 유지합니다.
- spec 본문, 섹션명, 표 헤더, 승인 질문은 한글로 작성합니다. `agent_type`, `operationId`, `codegen`, 패키지명, 파일 경로, enum 값, 명령어처럼 고정된 기술 식별자만 원문을 유지합니다.

#### 기획서 파일 구조

```
docs/services/
└── [service-name].delivery.spec.md # 서비스 전체 설계/실행 기준

apps/[app]/web/src/app/(admin)/
├── app.context.md              # 앱 컨텍스트 문서 (L0-L2, non-source)

apps/[app]/web/src/app/(admin)/[도메인]/
├── page.tsx                    # 목록 페이지
├── page.spec.md                # service spec에서 생성된 목록 route 실행 slice
├── page.e2e.ts                 # E2E 테스트 코드 (별도 spec.md 없음)
├── [entityId]/
│   ├── page.tsx                # 상세 페이지
│   ├── page.spec.md            # service spec에서 생성된 상세 route 실행 slice
│   └── page.e2e.ts             # E2E 테스트 코드
├── new/
│   ├── page.tsx                # 등록 페이지
│   ├── page.spec.md            # service spec에서 생성된 등록 route 실행 slice
│   └── page.e2e.ts             # E2E 테스트 코드
└── [entityId]/edit/
    ├── page.tsx                # 수정 페이지
    ├── page.spec.md            # service spec에서 생성된 수정 route 실행 slice
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
| **service-delivery** | `docs/services/**/*.delivery.spec.md` | 서비스 전체 기준, 질문 기반 기획, 도메인/API/foundation, route 목록, 디자인 방향, 실행/QA 계약 |
| **route-delivery** | `page.spec.md`, `index.spec.md` | service spec에서 생성된 route/page 실행 slice, 화면/route wiring/component/E2E 계약 |
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
| **서비스 단위 설계** | 권한, journey, backend/API/foundation, web/mobile route를 한 spec에서 먼저 합의 |
| **발견성** | 서비스 spec은 `docs/services`, route slice는 코드 파일 옆에서 확인 |
| **동기화** | service spec 변경 이력과 route spec 실행 이력을 함께 관리 |
| **실행 일관성** | 승인된 service spec이 전체 실행 기준을 소유하고 route spec은 leaf subagent 실행 범위를 제한 |
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
- **UseCase/Handler**: CQRS Command/Query/EventHandler/Saga 흐름과 사용자 과업 중심 workflow를 조율하는 계층 (Prisma 직접 호출 금지)
- **Facade**: Controller 경계에서 응답 조립, read model shaping, protocol composition을 담당하는 계층
- **Service**: 단일 Aggregate Root 또는 단일 도메인 로직 담당 (Repository를 통해서만 데이터 접근)
- **Gateway/Client/Adapter**: 외부 시스템 또는 복잡한 기술 서브시스템을 단순화해서 노출하는 레이어
- **Repository**: Prisma 쿼리 작성

### UseCase 파일 배치 규칙 (Critical)

**`packages/be-usecase`의 handler class는 반드시 class당 하나의 파일을 가집니다.**

규칙:
- `@CommandHandler`/`@QueryHandler`가 붙은 UseCase class 1개 = `*.usecase.ts` 파일 1개
- `@EventsHandler`가 붙은 EventHandler class 1개 = `*.event-handler.ts` 파일 1개
- `@Saga`를 가진 Saga class 1개 = `*.saga.ts` 파일 1개
- 같은 파일에 여러 handler/EventHandler/Saga class를 선언하지 않습니다.
- `core`, `idp`처럼 여러 aggregate root를 포함하는 namespace 폴더에 handler 파일을 평면으로 모아두지 않습니다.
- `packages/be-usecase/src/core/{domain}/`처럼 provider array 단위의 bounded context 폴더로 묶습니다.
- handler provider array와 barrel export는 domain `index.ts`에서만 조립합니다.
- handler class 파일에는 top-level type/helper/mapper를 함께 두지 않습니다.
- handler 한 개에서만 쓰는 input/result/mapper도 `{handler}.input.ts`, `{handler}.result.ts`, `{handler}.mapper.ts`처럼 별도 파일로 분리합니다.
- 둘 이상의 handler가 공유하는 context/mapper/helper는 `{domain}.context.ts`, `{domain}.mapper.ts`, `{domain}.support.ts`처럼 별도 파일로 분리합니다.
- domain을 넘는 shared type은 `@cocrepo/type`, pure runtime utility는 `@cocrepo/toolkit`에 둡니다.
- pagination처럼 여러 usecase domain이 공유하는 계약/빌더를 `packages/be-usecase/src/common`에 만들지 않습니다.

예시:

```text
packages/be-usecase/src/core/community/
├── get-community-posts.usecase.ts
├── create-community-post.usecase.ts
└── index.ts
```

```typescript
// packages/be-usecase/src/core/community/index.ts
import { CreateCommunityPostUseCase } from "./create-community-post.usecase";
import { GetCommunityPostsUseCase } from "./get-community-posts.usecase";

export const CommunityQueryHandlers = [GetCommunityPostsUseCase];
export const CommunityCommandHandlers = [CreateCommunityPostUseCase];
export const CommunityUseCaseProviders = [
  ...CommunityQueryHandlers,
  ...CommunityCommandHandlers,
];

export * from "./create-community-post.usecase";
export * from "./get-community-posts.usecase";
```

### 백엔드 값 출처 보존 규칙 (Critical)

**백엔드 코드에서 여러 출처의 값을 조합할 때는 값의 원천이 드러나도록 작성합니다.**

적용 범위:
- Controller, UseCase/Handler, Service, Repository, Client 등 모든 backend TypeScript 코드
- Command/Query/DTO/context/entity/config/repository result를 service input, repository input, response로 매핑하는 코드

규칙:
- `const { timelineId } = command.params`처럼 출처가 사라지는 deep destructuring은 짧고 단일 출처인 코드에서만 제한적으로 사용합니다.
- 여러 출처 값이 섞이는 함수에서는 `command.params.timelineId`, `context.userId`, `reservation.id`처럼 원천을 보존합니다.
- 반복이 길어지면 `const params = command.params`, `const actor = context.actor`처럼 출처 이름을 가진 alias까지만 허용하고, bare variable로 풀어내지 않습니다.
- Service/Repository input object를 만들 때는 어떤 값이 command, context, entity, config 중 어디서 왔는지 코드에서 바로 보여야 합니다.
- 단순 중간 계산값, 검증된 파생값, 같은 줄 근처에서만 쓰는 지역 변수는 예외로 허용합니다.

```typescript
// ❌ 금지 - 여러 출처가 섞일 때 값의 원천이 사라짐
const { courseOfferingId, timelineId, memo } = command.params;
const { spaceId, userId } = this.context.requireContext();

return this.reservationService.checkout({
  spaceId,
  userId,
  courseOfferingId,
  timelineId,
  memo: memo ?? null,
});

// ✅ 권장 - input mapping에서 값의 원천 보존
const context = this.context.requireContext();
const params = command.params;

return this.reservationService.checkout({
  spaceId: context.spaceId,
  userId: context.userId,
  courseOfferingId: params.courseOfferingId,
  timelineId: params.timelineId,
  memo: params.memo ?? null,
});
```

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

### 서비스 Spec 개발 플로우 (권장)

**orch-delivery** 하나가 서비스 단위 질문 기획, 서비스 delivery spec 작성, route/page spec 생성, 승인 질문, 백엔드/프론트엔드/모바일/QA 실행을 모두 소유합니다.
별도 Delivery Plan 문서는 만들지 않고, `docs/services/**/*.delivery.spec.md`가 서비스 전체 설계와 실행 계약의 상위 기준입니다.
Route delivery spec은 승인된 service spec에서 생성된 page/route 실행 slice이며, Screen/Feature spec은 planning spec으로 유지하되 실행 그래프와 승인 gate를 소유하지 않습니다.

#### 핵심 개념: 서비스 delivery spec이 전체 서비스 설계와 실행 그래프를 소유

```
1 서비스 delivery spec = 1 서비스/기능 영역 = 질문 기반 기획 + backend/API/foundation + 모든 web/mobile route + 생성된 route spec + QA 실행 그래프
```

- `orch-delivery`는 Codex 질문 도구를 반복 사용해 서비스 목표, 사용자/운영자 journey, 권한, 도메인 모델, API, web/mobile 필요 페이지, 디자인 방향, QA 기준을 확정합니다.
- 서비스 delivery spec은 서비스 목표, 권한, 도메인 생명주기, 사용자 여정, 필요한 모든 페이지/route, backend/API/foundation, 상태, UI 전략, 테스트, 담당 `agent_type`, 실행 순서를 모두 명시합니다.
- 서비스 delivery spec의 기본 위치는 `docs/services/{service-name}.delivery.spec.md`입니다.
- 서비스 delivery spec 승인 전에는 route/page spec 생성, subagent 실행, QA subagent 실행을 하지 않습니다.
- 승인 후 `필수 페이지 / 라우트`와 `생성된 라우트 Spec` 기준으로 모든 필요한 `page.spec.md` 또는 `index.spec.md`를 생성/갱신합니다.
- route delivery spec에는 `상위 서비스 Spec`을 기록하고, 해당 route의 화면 계약, route wiring, component inventory, route-consumed hook/state, E2E, backend/API/foundation slice만 명시합니다.
- Screen/Feature planning spec은 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 명시합니다.
- service spec에는 `DESIGN.md` 기반 서비스 전체 디자인 방향을 작성하고, 각 route spec에는 `디자인 정렬`, `화면 러프`, `리듬 / 레이아웃 계약`을 작성합니다.
- 화면 러프는 component명이 없는 `시각 스냅샷`과 component/계층을 표시하는 `주석 와이어프레임`을 함께 작성합니다.
- `시각 스냅샷`은 배경, surface, border, radius, spacing, typography, 상태색, CTA 위치만 보고도 대략적인 디자인을 떠올릴 수 있어야 합니다.
- 기획 spec의 표 헤더는 한글을 우선 사용합니다. `agent_type`, `operationId`, `codegen`처럼 고정된 기술 식별자만 원문을 유지합니다.
- 렌더링 계약은 component inventory 표로 작성해 `Feature`/`Widget`/`Input`/`Action`/`DataDisplay`/`Layout` 등 계층, 재사용/신규 여부, 대상 파일, 담당 `agent_type`을 드러냅니다.
- component inventory의 `agent_type`은 소스를 만들거나 수정하는 소스 담당 `agent_type`과 화면에 조립하는 소비/Wiring `agent_type`을 분리합니다.
- Storybook/Test 계약은 `Storybook 인벤토리`와 `Unit Test 인벤토리`로 작성하고, 필수 상태/variant와 검증 케이스를 먼저 정합니다.
- 신규/수정 UI component의 story/test 작성은 기본적으로 해당 UI `agent_type` subagent가 같은 작업에서 담당하고, QA subagent는 누락/실패/contract drift를 검증합니다.
- PC/Web은 `packages/fe-ui/src/**` component 소스 담당 subagent가 story/test를 담당하고, Mobile은 `packages/fe-mo-ui/src/**` component 소스 담당 subagent가 story/test를 담당합니다.
- route `page.tsx`, Expo route file, `layout.tsx`, `_layout.tsx`, Store, backend-only step은 Storybook 대상이 아니며 필요한 unit/E2E 검증만 spec에 기록합니다.
- thin re-export나 barrel-only 변경처럼 story/test가 불필요하면 spec의 비고에 불필요 사유를 남깁니다.
- backend/API 계약은 `Prisma / Database`, `Prisma Annotation`, `Common Schema`, `Entity / VO`, `DTO / Query DTO`, `Repository`, `Service`, `Command/Query`, `Event`, `UseCase / Handler / EventHandler / Saga`, `Client / Gateway`, `엔드포인트`, `Module / Bootstrap`, `Seed`, `Codegen / API Client` 인벤토리를 구조별로 작성합니다.
- foundation 계약은 `Hook`, `Toolkit`, `Type`, `Store / State` 인벤토리를 구조별로 작성합니다.
- 각 backend inventory row는 재사용/수정/신규 여부, 대상 파일, 소스 담당 `agent_type`, 호출/Wiring 소비 `agent_type`, 관련 route spec을 드러내야 합니다.
- reusable hook은 `fe-hook-agent`, shared toolkit은 `common-toolkit-builder`, shared type은 `common-type-builder`, shared store는 `fe-store-agent`가 소스 담당입니다.
- app route 아래 hook 파일은 만들지 않습니다. reusable 또는 테스트 대상 hook/helper는 `packages/fe-hook/src`에서 `fe-hook-agent`가 소유하고, 단순 inline route state/wiring만 generated route delivery spec의 `fe-route-agent` slice로 기록합니다.
- endpoint row는 controller endpoint, operationId, DTO/schema, Orval hook/codegen 영향을 보여주고, application/service/repository row는 어떤 workflow/capability/persistence method가 쓰이는지 보여줍니다.
- common schema row는 `common-schema-builder`, DTO row는 `be-dto-builder`/`be-query-dto-builder`, facade/gateway row는 `be-facade-builder`/`be-gateway-builder`처럼 실제 소스 담당 subagent가 보이도록 분리합니다.
- `orch-delivery`는 승인된 service delivery spec과 연결된 route delivery spec에 없는 agent를 호출하지 않고, 허용 파일 범위 밖 파일을 수정하지 않습니다.
- 병렬 실행은 spec에서 `parallel: true`이고 파일 ownership이 겹치지 않는 leaf/component step에만 허용합니다.
- `실행 그래프`는 Mermaid `시각 실행 흐름`, `병렬 그룹 표`, `단계 순서 표`를 함께 작성해 직렬 순서와 병렬 그룹을 시각적으로 보여줍니다.

#### 플로우

```
기획 질문: orch-delivery → 기존 코드/route/API/schema/spec/DESIGN.md 확인 → Codex 질문 도구 반복
서비스 Spec: docs/services/{service-name}.delivery.spec.md 작성
승인 질문: "작성한 서비스 spec 기준으로 route/page spec을 생성하고 개발을 시작할까요?"
라우트 Spec: 승인 후 모든 필요한 page.spec.md/index.spec.md 생성 또는 갱신
백엔드: prisma → annotation → common schema → entity/vo/dto/query-dto → repository → service → command/query/event → usecase → controller/module/bootstrap → seed
Codegen: pnpm --filter=@cocrepo/api codegen, API 변경 시
기반: common-type-builder/common-toolkit-builder/fe-hook-agent/fe-store-agent, 필요한 경우
Web: 생성된 route spec → planning spec 참조 → 필요한 leaf subagent → fe-screen-agent → fe-route-layout-agent(필요 시) → fe-route-agent
Mobile: 생성된 route spec → planning spec 참조 → 필요한 leaf subagent → fe-widget-agent/fe-feature-agent(필요 시) → fe-screen-agent → fe-route-layout-agent(필요 시) → fe-route-agent
QA: qa-be-testing/e2e → qa-fe-testing/e2e → qa-mo-testing/e2e
```

> 화살표는 의존성 순서를 의미합니다. 독립 작업은 service delivery spec과 생성된 route delivery spec의 `subagent 배정 매트릭스`에서만 병렬화할 수 있습니다.

#### Spec 위치

```
docs/services/
└── members.delivery.spec.md     # 서비스 전체 설계/실행 기준

apps/[app]/web/src/app/(admin)/
├── app.context.md              # 앱 컨텍스트 문서 (L0-L2, non-source)

apps/[app]/web/src/app/(admin)/[도메인]/
├── page.tsx                    # 목록 페이지
├── page.spec.md                # service spec에서 생성된 목록 route 실행 slice
├── page.e2e.ts                 # E2E 테스트 코드
├── [entityId]/
│   ├── page.tsx                # 상세 페이지
│   ├── page.spec.md            # service spec에서 생성된 상세 route 실행 slice
│   └── page.e2e.ts             # E2E 테스트 코드
├── new/
│   ├── page.tsx                # 등록 페이지
│   ├── page.spec.md            # service spec에서 생성된 등록 route 실행 slice
│   └── page.e2e.ts             # E2E 테스트 코드
└── [entityId]/edit/
    ├── page.tsx                # 수정 페이지
    ├── page.spec.md            # service spec에서 생성된 수정 route 실행 slice
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

`/orch-delivery`는 새 요청을 받으면 질문 기반 기획으로 service delivery spec을 작성하고 승인 질문을 연 뒤, 승인된 범위에서 route/page spec을 생성하고 실행합니다.

```bash
# 1. 질문 기반 기획 → service spec 작성 후 승인 질문
/orch-delivery app=admin domain=Member feature=member-management requirements="회원 목록/상세/등록/수정/삭제"

# 2. 승인된 service spec 전체 재실행
/orch-delivery spec="docs/services/members.delivery.spec.md" phase=all parallel=auto

# 3. 일부 phase만 재실행
/orch-delivery spec="docs/services/members.delivery.spec.md" phase=web
/orch-delivery spec="docs/services/members.delivery.spec.md" phase=qa

# 4. 특정 generated route slice 재실행
/orch-delivery spec="apps/admin/web/src/app/(admin)/members/page.spec.md" phase=web
```

#### 장점
- **서비스 단위 기획**: 질문 도구로 서비스 목표, 권한, journey, 페이지 목록, 디자인 방향을 먼저 합의
- **기능 단위 백엔드**: API/스키마/foundation이 한 번에 완성되어 일관성 유지
- **페이지별 프론트엔드**: 점진적 개발, 컴포넌트 재사용 가능
- **실행 기준 일관화**: service delivery spec이 전체 승인/실행/QA 기준을 소유하고 route spec은 leaf 실행 범위를 제한
- **기획 spec 보존**: Screen/Feature planning spec으로 시각/조합 의도를 유지
- **phase별 검증**: 사람이 문제를 확인한 뒤 필요한 phase 또는 route slice를 다시 실행

#### 메뉴 업데이트

목록 페이지(List)나 신규 navigation entry가 필요한 경우 service delivery spec의 `필수 페이지 / 라우트`와 `subagent 배정 매트릭스`에 먼저 기록하고, 해당 generated route delivery spec에도 `fe-menu-agent` slice를 명시합니다.

```
spec web phase
├── display/control/widget/feature agents, 필요한 경우
├── fe-store-agent, shared store 필요 시
└── fe-menu-agent, navigation entry 필요 시
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

| Subagent | 역할 |
|----------|------|
| orch-delivery | 기획 질문 → 서비스 Spec → 승인 → 라우트 Spec → 구현 → QA를 단일 흐름으로 소유하는 서비스 delivery 오케스트레이터 |

#### 기획 보조 Skill

| Skill | 역할 |
|----------|------|
| /design-analyze (Skill) | Figma 디자인 분석 및 컴포넌트 매핑 (Figma 있을 때) |
| /route-design (Skill) | 백엔드 엔티티 기반 라우팅 경로 설계 |

#### 프론트엔드 (fe-*)

Web과 Mobile 구현 subagent는 `fe-*agent`로 통합합니다. dual-platform subagent 문서는 `Platform Routing`, `Common`, `React Web`, `React Native` 섹션을 유지합니다. `agent_type`은 대상 경로가 `packages/fe-ui`/`apps/*/web`이면 `Common` + `React Web`, `packages/fe-mo-ui`/`apps/mobile`이면 `Common` + `React Native`만 실행 규칙으로 적용합니다. 대상과 다른 플랫폼 섹션은 참고만 하고 금지/허용/출력 규칙으로 적용하지 않습니다.

React Web only subagent는 `Platform Routing`에 React Native target이 범위 밖임을 명시합니다. Shared subagent는 공용 hook/store 계약만 다루며 UI runtime별 세부 규칙은 소비 owner subagent의 플랫폼 섹션을 따릅니다.

| Subagent | 역할 |
|----------|------|
| fe-data-display-agent | Web/Mobile data-display primitive 생성 |
| fe-feedback-agent | Web/Mobile feedback/status primitive 생성 |
| fe-overlay-agent | Web/Mobile overlay/dialog/popover/tooltip primitive 생성 |
| fe-cell-agent | DataGrid/Table용 Cell 컴포넌트 생성 (계층별) |
| fe-columns-agent | DataGrid column 선언과 cell boundary 정리 |
| fe-control-agent | Web control 및 Mobile action/input/selection/navigation 컴포넌트 생성 |
| fe-widget-agent | Web/Mobile 재사용 가능한 작은 UI 조각 Widget 컴포넌트 생성 |
| fe-feature-agent | Web/Mobile 비즈니스 기능 Feature 컴포넌트 생성 |
| fe-layout-agent | Web/Mobile layout primitive 설계 및 생성 |
| fe-data-grid-agent | DataGrid 렌더러, input, state contract 정리 |
| fe-form-agent | 생성/수정 입력 화면용 reusable form layer 생성 |
| fe-hook-agent | web/mobile 공통 React hook 생성 (`@cocrepo/hook`) |
| fe-screen-agent | Web/Mobile screen visual owner 생성 (`packages/fe-ui`, `packages/fe-mo-ui`) |
| fe-route-agent | Next.js/Expo route file의 route/API/state/navigation thin container 소유 |
| fe-route-layout-agent | Next.js layout 및 Expo Router `_layout.tsx` shell 구현 |
| fe-menu-agent | Web/Mobile 메뉴, 탭, navigation composition 생성 |
| fe-store-agent | MobX 기반 Store 생성 |

#### 백엔드 (be-*)

| Subagent | 역할 |
|----------|------|
| be-prisma-builder | Prisma 스키마 생성 및 유형 분류 |
| common-schema-builder | 프론트엔드와 백엔드에서 공유하는 검증 스키마 생성 |
| common-toolkit-builder | 공용 `@cocrepo/toolkit` utility 생성 |
| common-type-builder | 공용 `@cocrepo/type` 타입 계약 생성 |
| be-entity-builder | 도메인 Entity 클래스 생성 |
| be-dto-builder | Create/Update/Response DTO 클래스 생성 |
| be-query-dto-builder | PrismaQueryDto 기반 목록 조회용 Query DTO 생성 |
| be-vo-builder | Value Object 클래스 생성 |
| be-repository-builder | Prisma 기반 Repository 레이어 생성 |
| be-aggregate-builder | NestJS aggregate root service provider 생성 (`{Domain}AggregateRoot`) |
| be-service-builder | NestJS support service 레이어 생성 |
| be-usecase-builder | NestJS CQRS UseCase/EventHandler/Saga 레이어 생성 (여러 Service 조합 / workflow orchestration) |
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

| Subagent | 역할 |
|----------|------|
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

| Subagent | 역할 |
|----------|------|
| etc-jenkinsfile-builder | Jenkins CI/CD 파이프라인 파일 생성 |

#### 개발 도구 (dev-*)

| Subagent | 역할 |
|----------|------|
| dev-service-starter | 개발 서비스 시작 (admin, server, storybook 등) |

각 Agent의 상세 역할은 `.codex/agents/` 디렉토리를 참고하세요.

### Subagent 실행 규칙 (Critical)

**subagent 호출 시 반드시 아래 규칙을 따릅니다.**

#### 1. 시작/종료 선언 (필수)

**시작 시 출력:**
```
🚀 [subagent명] subagent 시작
📋 작업: [작업 내용 요약]
📂 대상: [대상 파일/폴더]
```

**종료 시 출력:**
```
✅ [subagent명] subagent 완료
📁 생성/수정된 파일:
   - [파일 경로 1]
   - [파일 경로 2]
```

**실패 시 출력:**
```
❌ [subagent명] subagent 실패
⚠️ 원인: [실패 원인]
```

#### 2. Spec 실행 로그 업데이트 (필수)

spec에 실행 로그 섹션이 있으면 subagent 실행 결과를 기록합니다:

```markdown
## Execution Log
- [x] [step id] [agent_type] 실행 완료 (YYYY-MM-DD HH:MM)
  - 생성/수정: `파일경로`
```

#### 3. Subagent 미호출 시 명시

subagent를 호출하지 않고 직접 작업할 경우 반드시 선언:
```
⚡ 직접 작업 (subagent 미사용)
📋 작업: [작업 내용]
```

#### 예시

```
🚀 be-prisma-builder subagent 시작
📋 작업: User 모델 Prisma 스키마 생성
📂 대상: packages/be-prisma/schema/user.prisma

[... subagent 작업 ...]

✅ be-prisma-builder subagent 완료
📁 생성/수정된 파일:
   - packages/be-prisma/schema/user.prisma
   - packages/be-prisma/schema/enums.prisma
```
