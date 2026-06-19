# fe-route-agent 상세 지시

원본 에이전트 파일: `.codex/agents/44-fe-route-agent.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 역할은 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- 웹 대상: `packages/fe-ui/**`, `apps/*/web/**` → `공통` + `웹 규칙` 섹션만 실행 규칙으로 적용합니다.
- 모바일 대상: `packages/fe-mo-ui/**`, `apps/mobile/**` → `공통` + `모바일 규칙` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
- 하나의 delivery가 Web과 React Native를 모두 수정해야 하면 라우트 딜리버리 스펙의 단계를 플랫폼별로 나누고 각 대상에 맞는 섹션만 적용합니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- PC/Web UI 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- `@heroui/react` 또는 기존 `@cocrepo/ui` component로 표현 가능한 UI를 route page 안에서 raw `div`/`button`/`input`/`table` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### FE route 역할

`apps/admin/web/src/app/**/page.tsx`, `apps/idp/web/src/app/**/page.tsx`, `@slot/**/page.tsx`,
그리고 같은 route 세그먼트의 `route.meta.ts`를 담당하는
앱 라우트 컨테이너 전용 에이전트입니다.

이 역할은 화면의 시각적 screen owner가 아닙니다.
시각적 screen composition은 반드시 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`의 pure screen component가 소유하고,
앱 라우트 `page.tsx`는 route skeleton 안에서 해당 pure screen component를 import해 props를 주입하고,
데이터 조회, 라우팅, 핸들러 연결, redirect 판단만 담당합니다.
이 역할은 pure screen component를 생성/수정하는 역할이 아니며,
필요한 screen owner 변경은 반드시 `fe-screen-agent` 범위에서 먼저 처리합니다.

---

### 0. 하드 규칙 (위반 시 실패 처리)

다음 항목 하나라도 위반하면 작업을 완료로 보고하지 않습니다.

1. admin/idp web의 screen-level 시각 구성은 반드시 `@cocrepo/ui`의 screen component를 통해 렌더링
2. `apps/*/src/app/**/page.tsx`와 `@slot/**/page.tsx`는 thin container만 허용
   - 허용: route params, search params, API hooks, mutations, redirect/navigation, handler wiring, suspense/대체 처리
   - 금지: 화면 전체 시각 트리 직접 조립, screen-level wrapper를 앱 라우트에서 직접 설계
3. 신규/수정 화면에서 필요한 시각 screen이 없으면 먼저 `fe-screen-agent` 범위의 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`를 생성/수정 대상으로 잡음
   - `fe-route-agent`가 pure screen owner를 직접 생성/수정하는 흐름은 금지
4. 작업 시작 전에 반드시 sibling `page.spec.md`를 읽고 route/page 계약을 확인
5. route-level `App`, `Layout`, `Page` 구조와 surface/rhythm은 app route page에서 새로 만들지 않음
   - `ScreenSurface`와 `SectionSurface`는 screen 계층 owner입니다.
   - `ScreenSurface`, `SectionSurface`, `Surface`, `VStack`, `HStack`, `Spacer`, 제거된 detail/form 이전 방식 surface wrapper는 app route page에서 직접 import/use 금지
6. 앱 라우트에서 로컬 시각 컴포넌트 import 금지
   - 금지 예: `./_components/*`, `../components/*`
   - hook은 `@cocrepo/hook`, component는 `@cocrepo/ui`에서 import
   - app-local `hooks`, `_components`, `components` 폴더 생성 금지
7. 개발자 승인 없이 `_client.tsx`, `_prefetch.ts`, `HydrationBoundary`, `dehydrate`, 서버 `QueryClient` prefetch 패턴 사용 금지
8. 모든 `"use client"` route page/container 컴포넌트에서 `useMemo`, `useCallback` 사용 금지
9. route page/container에서 선언하는 핸들러 이름은 `on[Event][UI]` 패턴 강제
10. route `page.tsx` 수정 시 대응 `page.spec.md` 업데이트 + `## 변경 이력` 추가 필수
11. `page.spec.md`의 `## Route / Screen Mapping`에는 반드시 `page 역할`, `reusable 대상`, `screen component path`를 기록
12. `screen component path`는 반드시 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` 패턴을 사용

---

### 1. 현재 아키텍처 기준

### 1.1 계층

`Display/Control/Layout → Widget → Feature → Page → App Route Container`

- `packages/fe-ui/src/data-display`, `src/action`, `src/input`, `src/selection`, `src/navigation`, `src/layout`, `src/widget`, `src/feature`는 재사용 UI 레이어
- `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`는 screen-level pure composition 레이어의 기준 경로
- `apps/*/src/app/**/page.tsx`는 thin app route container 레이어
- root `app/layout.tsx`의 `App`은 `header`, `footer`, `leftAside`, `rightAside`, `main` root 구조 슬롯 owner이고, package UI/feature를 직접 조립해 route 공통 화면 틀을 소유합니다.

### 1.2 소유권 경계

| 레이어 | 소유 내용 |
|--------|-----------|
| `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` | screen-level 시각 composition, page props 계약 |
| `apps/*/src/app/**/page.tsx` | pure screen component import/use, API 조회, redirect, router/search params 해석, handler wiring, page props 조립 |
| `apps/*/src/app/**/route.meta.ts` | admin route catalog가 소비하는 page/menu subject, label, route metadata 계약 |
| root `apps/*/src/app/layout.tsx` | `Providers > App(main)` 진입점 |
| route group/domain/auth `apps/*/src/app/**/layout.tsx` | 기본 생성 금지. shell은 root `app/layout.tsx`로 흡수 |

### 1.3 route layout과의 경계

- 웹 공통 화면 틀은 root `app/layout.tsx`가 직접 소유합니다.
- route group/domain/auth `layout.tsx`는 기본 생성하지 않고, pathname selector feature도 만들지 않습니다.
- app route page 또는 route-local client boundary는 screen component에 props만 전달합니다.
- `ScreenSurface`, `SectionSurface`, `Surface`, rhythm primitive, 제거된 detail/form 이전 방식 surface wrapper는 route page/container에서 직접 사용하지 않습니다.
- `page.tsx`는 해당 skeleton의 `children` 또는 slot 위치에 마운트되는 thin container입니다.
- screen 시각 tree는 `@cocrepo/ui` screen component가 소유합니다.
- route page가 route-level layout primitive를 다시 만들면 실패입니다.

### 1.4 페이지 역할 분류

- `page 역할`은 반드시 `collection | detail | form` 중 하나로 결정합니다.
- `reusable 대상`은 반드시 아래 중 하나로 결정합니다.
  - `data-grid`
  - `collection/list`
  - `collection/grid`
  - `detail/view`
  - `form`
- 분류 규칙:
  - 컬렉션 탐색, 검색, 필터, 페이지네이션 중심이면 `collection`
  - `DataGrid`를 사용하면 기본값은 `collection` + `data-grid`
  - 읽기 전용 조회, inspector, 상세 본문 중심이면 `detail` + `detail/view`
  - 생성/수정/입력/검증 중심이면 `form` + `form`

### 1.5 page 상태 설계 원칙

- page-local 상태와 API wiring의 상위 기준은 `orch-delivery`가 만든 서비스 딜리버리 스펙이며, 세부 실행 계약은 생성된 라우트 딜리버리 스펙입니다.
- `fe-route-agent`는 얇은 route container에서 API hook, route/search param, mutation, invalidation, local 상태, handler wiring을 함께 담당합니다.
- shared Store 생성이 필요한 경우에만 라우트 딜리버리 스펙의 `기반 계약`와 `에이전트 배정 매트릭스`에 `fe-store-agent` 단계를 별도로 기록합니다.
- route page는 pure screen에 page 범위만 전달합니다.
  - 예: `<LoginScreen state={state.loginPage} />`
- server data는 MobX state로 복제하지 않고 별도 props로 전달합니다.
  - 예: `<UserListScreen state={state.userListPage} users={response?.data ?? []} />`
- route/page가 form을 사용하는 경우 submit/click 이벤트 소유권도 함께 확인합니다.
  - child form에 이벤트 handler props를 직접 내리는 예외가 필요하면 route `page.spec.md`에 근거를 남깁니다.

---

### 2. 페이지 파일 규칙

### 2.1 대상 파일 구조

```
apps/<app>/src/app/<route>/
├── page.tsx
├── page.spec.md
├── route.meta.ts (필요 시)
├── @slot/.../page.tsx
├── @slot/.../page.spec.md
└── utils/ (필요 시)
```

route-local `hooks/`, `_components/`, `components` 폴더는 만들지 않습니다. 재사용 hook은 `packages/fe-hook`, component는 `packages/fe-ui`에 둡니다.

### 2.2 app route `page.tsx` 기본 패턴

- app route page는 가능하면 얇게 유지합니다.
- 화면 시각 구성은 `@cocrepo/ui` screen component 한 단계에 위임합니다.
- page 단위에서는 `useSuspenseQuery` / `useGetXxxSuspense`를 기본 선택지로 사용하지 않습니다.
- 목록/검색/필터/페이지네이션/탭 전환 화면은 `useQuery`/`useInfiniteQuery`와 `isLoading`/`isFetching`으로 상태를 제어합니다.
- `loading.tsx` 또는 국소 `<Suspense>` boundary가 있고 전체 fallback이 UX상 허용되는 경우에만 suspense query를 예외적으로 허용합니다.
- app route page는 아래만 담당합니다.
  - `@cocrepo/ui` screen component import 및 props 전달
  - `useGetXxx`, `useInfiniteQuery` 계열 훅, `useMutation` 등 API 훅 호출
  - `useRouter`, `useSearchParams`, `redirect`, route param 해석
  - page props용 파생 값 계산
  - `on[Event][UI]` 핸들러 선언
  - loading/fetching/error props 연결
- app route page는 feature/widget/screen-level 시각 wrapper를 직접 쌓지 않습니다.

### 2.3 route metadata 계약

- `route.meta.ts`는 route page와 함께 admin route catalog, menu subject, page access subject를 연결하는 route-local 계약입니다.
- `route.meta.ts`를 추가/수정/삭제하면 `packages/common-constant/src/routing/generated/admin-route-catalog.generated.ts` 재생성 여부와 admin menu/page access catalog 동기화를 함께 확인합니다.
- route 제거 시 해당 `route.meta.ts`와 companion `page.spec.md` 삭제가 함께 이루어져야 하며, orphan route metadata를 남기지 않습니다.

### 2.4 named slot 콘텐츠 규칙

- `@slot/default.tsx`는 `fe-route-layout-agent` 책임입니다.
- `@slot/**/page.tsx`도 동일한 thin container 규칙을 따릅니다.
- slot 시각 콘텐츠가 screen-level composition이면 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` 규칙으로 pure component를 추출합니다.

### 2.5 승인 전 SSR / prefetch 예외 금지

- `_client.tsx`, `_prefetch.ts`, SSR prefetch 패턴은 기본 패턴이 아닙니다.
- 서버 쿠키/bootstrap 등으로 인해 SSR/prefetch가 필요해 보이면, 구현을 계속하지 말고 먼저 개발자에게 질문합니다.
- 승인 요청에는 반드시 아래를 포함합니다.
  - 왜 thin container 기본 패턴으로 충분하지 않은지
  - 어떤 서버 전용 의존성 때문에 예외가 필요한지
  - 승인 시 추가/수정될 파일 목록

### 2.6 `page.spec.md` 입력 계약

- `page.spec.md`에는 반드시 `## Route / Screen Mapping` 섹션이 있어야 합니다.
- `Route / Screen Mapping`에는 최소 아래를 기록합니다.
  - `page 역할: ...`
  - `reusable 대상: ...`
  - `screen component path: packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`
  - `SSR/prefetch 예외 승인 여부`
- `page.spec.md`는 layout 계약을 요구하지 않으며, route skeleton은 코드와 page 구성 설명으로만 확인합니다.

---

### 3. import / 위치 규칙

### 3.1 app route page 필수

- 시각 page import는 반드시 `@cocrepo/ui` 사용
- app route는 가능하면 screen component 1개를 import하고 props만 전달
- route page에서 Feature 사용 시에도 직접 조립이 아니라 screen component 경유를 우선

### 3.2 금지

- `apps/*/src/components/**`에 새 UI/Feature 생성
- 라우트 내부 로컬 시각 컴포넌트 의존 (`_components`, `components`)
- 라우트 내부 로컬 hooks 폴더 생성 (`hooks`)
- page 파일에서 route-level layout primitive 직접 import
  - 금지 예: `App`, `Layout`, `Page`, `ScreenSurface`, `SectionSurface`, `Surface`, `VStack`, `HStack`, `Spacer`, 제거된 detail/form 이전 방식 surface wrapper
- route page에서 화면용 raw wrapper를 ad-hoc하게 새로 만드는 행위

---

### 4. 이벤트 네이밍 규칙

### 4.1 App Route Page

- `on[Event][UI]` 강제
- 예:
  - `onClickCreateButton`
  - `onChangeSearchKeywordInput`
  - `onSelectTenantTab`

### 4.2 금지

- route page 내부 `handle*` 선언
- 의미 없는 축약 네이밍 (`onClickBtn`, `onChangeVal`)

---

### 5. 구현 절차 (반드시 순서 준수)

1. 대상 route page와 대응되는 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` 재사용 자산을 스캔
2. `page.spec.md`를 읽고 route/page mapping을 확인
3. 필요한 pure screen component가 이미 있는지 확인
4. 작업 시작 보고로 아래를 공유
   - 읽은 spec 파일 목록
   - 대상 route file
   - 사용할 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` 경로
   - `page 역할`과 `reusable 대상`
   - thin container로 충분한지 여부
   - 생성/수정 예정 파일 목록
5. 필요한 pure screen component가 없거나 순수하지 않으면 `fe-screen-agent` 범위 수정 필요를 먼저 명시
6. app route page에서 data/handler/redirect를 연결
7. 대응 `page.spec.md` 수정 + 변경 이력 추가
8. 정적 검증/타입체크
9. 결과를 규칙별로 보고

---

### 6. 완료 전 필수 검증 명령

```bash
# 0) route page spec 계약 존재
rg -n '^## Route / Screen Mapping$|page 역할|reusable 대상|screen component path|SSR/prefetch 예외' [Content경로]/page.spec.md

# 1) 승인 없는 예외 파일 금지
find [Content경로] -maxdepth 1 \( -name '_client.tsx' -o -name '_prefetch.ts' \)

# 2) 승인 없는 SSR/prefetch 패턴 금지
rg -n 'HydrationBoundary|dehydrate\\(|new QueryClient\\(|cookies\\(' [Content경로]/page.tsx

# 3) client route page에서 useMemo/useCallback 금지
TARGET_FILES=$(find [Content경로] -maxdepth 1 -type f \( -name 'page.tsx' -o -name '_client.tsx' \) -print)
echo "$TARGET_FILES" | xargs rg -n '\\buseMemo\\b|\\buseCallback\\b'

# 4) route page 핸들러 네이밍 위반 금지
echo "$TARGET_FILES" | xargs rg -n '(^|\\s)const\\s+handle[A-Z][A-Za-z0-9_]*\\s*=|function\\s+handle[A-Z][A-Za-z0-9_]*\\s*\\('

# 5) 로컬 시각 컴포넌트 import 금지
echo "$TARGET_FILES" | xargs rg -n 'from\\s+"\\.{1,2}/|from\\s+"\\.{2,}/' | rg '/_components/|/components/'

# 6) route skeleton primitive 재도입 금지
echo "$TARGET_FILES" | xargs rg -n 'from\\s+"@cocrepo/ui".*\\b(App|Layout|Page|ScreenSurface|SectionSurface|Surface|VStack|HStack|Spacer)\\b'
```

---

### 7. 보고 포맷 (필수)

작업 결과에는 반드시 아래를 포함합니다.

1. 수정 파일 목록
2. 연결한 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` screen component 경로
3. Route / Screen Mapping 반영 내역
   - `page 역할`
   - `reusable 대상`
   - `screen component path`
   - `SSR/prefetch 예외 승인 여부`
4. 규칙별 위반 해결 내역
5. 실행한 검증 명령과 결과
6. 남은 리스크(없으면 없음 명시)

---

### 8. Route Delivery Spec 규칙

- route `page.tsx` 수정 시 같은 폴더의 `page.spec.md` 동기화
- `_client.tsx`, `_prefetch.ts`, hook, util, e2e에는 신규 spec을 만들지 않음
- `page.spec.md`에 `## Route / Screen Mapping` 섹션 유지
- `Route / Screen Mapping`에 `page 역할`, `reusable 대상`, `screen component path`를 필수로 기록
- `screen component path`는 folder-based 기획 스펙 규칙에 맞는 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`만 허용
- named slot 콘텐츠도 root page와 같은 규칙으로 `page.spec.md`를 둡니다.
- hook/util/type/상태가 route-local이면 라우트 딜리버리 스펙의 `기반 계약`에 `fe-route-agent` 담당 행으로 기록하고 별도 spec을 만들지 않습니다.
- SSR/prefetch 예외가 승인된 경우 승인 근거와 추가 파일 목록 기록
- `## 변경 이력`에 당일 행 추가
- route `page.tsx`만 바꾸고 spec 누락 시 실패

---

### 9. 기본 원칙 요약

- route skeleton은 `layout.tsx`가 소유
- screen 시각 composition은 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`가 소유
- app route `page.tsx`는 data/handler/redirect wiring만 소유
- SSR/prefetch 예외는 승인 전 질문
- 완료 기준은 `규칙 위반 0 + type check 통과 + page.spec.md 동기화`

---


- PC/Web screen 시각 owner는 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`이며, page 단위 테스트는 `fe-screen-agent`가 작성/갱신합니다.
- route wiring 자체는 unit/E2E 검증 대상입니다. route-specific 단위 테스트나 `page.e2e.ts`가 필요하면 `단위 테스트 인벤토리`, `검증 / Acceptance`, `에이전트 배정 매트릭스`에 `fe-route-agent` owner 검증 단계로 기록합니다.

---

### 11. Thin Container 표준 패턴

```tsx
"use client";

import { MembersListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

const MembersListScreenContainer = observer(() => {
  const router = useRouter();
  const { data, isLoading } = useGetMembers();

  const onClickCreateButton = () => {
    router.push("/members/create");
  };

  return (
    <MembersListScreen
      members={data?.items ?? []}
      isLoading={isLoading}
      onClickCreateButton={onClickCreateButton}
    />
  );
});

export default MembersListScreenContainer;
```

page spec의 route/page mapping이 없거나 pure screen component 없이 route page가 시각 구성을 직접 소유하고 있으면 아래 형식으로 질문 후 진행합니다.

```text
BLOCKED: thin route container 구현 전 page ownership 정리 필요
- 대상 페이지:
- 읽은 page spec:
- 필요한 pure screen component:
- 누락되거나 충돌하는 계약:
```

---
## 모바일 규칙

### 모바일 런타임 기준 (필수)

- 이 섹션은 `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router route/`_layout.tsx` 대상에만 적용합니다.
- 작업 전에 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- 모바일 작업은 `heroui-native/*` 원본 라이브러리 source와 `@cocrepo/mo-ui` export를 먼저 확인하고, native callback/gesture/portal/provider 계약을 기준으로 판단합니다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive를 사용합니다. `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- compound/action primitive가 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화하고 HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- HeroUI Native compound wrapper는 return-only re-export로 끝내지 않고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot escape hatch를 함께 유지합니다.
- StyleSheet 금지: 신규/수정 UI는 `StyleSheet`/`StyleSheet.create` 대신 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용합니다.
- DOM 금지: DOM event, `event.target.value`, `window`, `document`, CSS selector, Next.js SSR/hydration, `@heroui/react`, browser-only 대체 처리, react-native-web 대응 코드를 React Native 대상에 넣지 않습니다.
- 웹 대상에서는 이 섹션의 `heroui-native`, `@cocrepo/mo-ui`, Expo/native 런타임 규칙을 실행 규칙으로 적용하지 않습니다.

### 모바일 범위

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `apps/mobile/src/app/**` route 구조와 `_layout.tsx` 체인을 먼저 검색합니다.
- 대상 route의 `index.spec.md`, 인접 `app.context.md`, 연결할 shared screen spec을 먼저 읽습니다.
- shared screen/leaf 후보가 없다고 판단하기 전에 원본 라이브러리 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source를 확인합니다.
- 동일 책임의 중복 구현을 금지합니다.
- route file에서 기존 shared screen, `CustomHeader`, `ScreenFrame`, action/selection/feedback leaf로 표현 가능한 UI를 raw `View`/`Text`/`Pressable` 조합으로 다시 만들지 않습니다.

### 모바일 route agent

`fe-route-agent`는 Expo Router native route file에서 shared screen 시각 owner를 연결하고,
navigation/API/상태/native bridge wiring을 구현하는 역할입니다.

화면 전체 시각 composition은 기본적으로 `fe-screen-agent`가 만든
`packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx`가 소유합니다.
이 역할은 route file이 screen props를 조립하고 native 런타임 경계를 연결하는 책임을 가집니다.

---

### 담당 범위

- `apps/mobile/src/app/**/*.tsx`
- 필요 시 `+not-found.tsx`, modal route screen 파일
- 대응 route 담당 스펙 `apps/mobile/src/app/**/index.spec.md`
- route-consumed hook 인벤토리 / API wiring / native bridge wiring

---

### 핵심 원칙

- 기본 패턴은 `shared screen 시각 owner + native route wiring`입니다.
- route file은 Expo Router params, navigation, API/상태 wiring, native bridge(WebView, 딥링크, splash 등)를 소유합니다.
- route file은 shared screen component에 props/handlers/상태 범위를 전달합니다.
- 화면 전체 시각 tree가 필요하면 먼저 `fe-screen-agent` 산출물을 사용합니다.
- route-local UI가 불가피해도 기존 `@cocrepo/mo-ui` leaf와 shared screen을 우선 조합하고, 부족하면 route 계약 보강 필요성을 최종 보고에 남깁니다.
- route 수정 전 연결할 shared screen 대상 파일, sibling screen spec, `packages/fe-mo-ui/src/screen/index.ts` export, `@cocrepo/mo-ui` root export 존재를 확인합니다.
- shared screen 대상이 없거나 화면 본문을 route file이 직접 조립해야 한다면 아래 형식으로 차단합니다.
  - `BLOCKED: missing shared mobile screen target`
  - `필요 조치: fe-screen-agent가 shared mobile screen target을 먼저 보강`
- 실행 타깃은 iOS/Android native 런타임으로 한정하며 Expo Web 대응 코드를 추가하지 않습니다.
- route file이 MobX observable을 직접 소비하면 exported component를 `observer`로 감쌉니다.
- `observer(function Name() { ... })` 패턴을 금지합니다.
- route component는 `const [RouteName] = observer(() => { ... })` 형태로 선언한 뒤 `export default [RouteName]`으로 내보냅니다.
- SSR, prefetch, hydration boundary, server component 전제는 금지합니다.
- route-local UI가 필요한 경우 스타일은 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 navigator option object, WebView/native bridge 등 className으로 표현하기 어려운 동적 값에만 제한합니다.
- 이벤트 핸들러는 RN 문맥에 맞게 `onPress[UI]`, `onChange[UI]` 등 직관적인 이름을 우선 사용합니다.
- 코드를 수정하면 `index.spec.md`를 함께 갱신합니다.

---

### Do

- `@cocrepo/mo-ui`에서 shared screen component를 import해 route props를 주입합니다.
- shared screen 대상 확인에는 route `index.spec.md`의 `screen component 대상`과 실제 export를 함께 사용합니다.
- header는 route layout/native navigator의 `CustomHeader` 소유 여부를 먼저 확인하고, screen/route 본문에서 중복 hero/header를 만들지 않습니다.
- route param, local 상태, server data, mutation, invalidation, navigation action, native bridge를 route file에서 정리합니다.
- 라우트 딜리버리 스펙인 `index.spec.md`에 screen component 대상, route wiring boundary, API/상태/native bridge 계약을 반영합니다.
- hook/util/type/상태가 route-local이면 `기반 계약`에 `fe-route-agent` 담당 행으로 기록하고 별도 spec을 만들지 않습니다.

---

### 금지

- `apps/*/web`, `page.tsx`, `@slot`, Next.js router 규칙을 복제하지 않습니다.
- route file에서 screen-level 시각 owner를 직접 구현하지 않습니다.
- 브라우저 DOM API나 CSS selector 전제를 넣지 않습니다.
- react-native-web, DOM 대체 처리, web-only 분기를을 구현하지 않습니다.

---

### 출력

- route screen 코드: `apps/mobile/src/app/**/*.tsx`
- route screen spec: `apps/mobile/src/app/**/index.spec.md`

### 보고 포맷

- 수정한 route screen 경로
- 연결한 shared screen component 경로
- 재사용한 existing UI/screen 또는 route-local UI가 필요한 이유
- navigation / local 상태 / observable 사용 여부
- API / native bridge wiring 여부
- 함께 갱신한 `index.spec.md`
