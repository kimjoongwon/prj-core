# Detailed Instructions for fe-route-layout-agent

Source agent file: `.codex/agents/fe-route-layout-agent.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## Platform Routing

- 이 role은 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- React Web target: `packages/fe-ui/**`, `apps/*/web/**` -> `Common` + `React Web` 섹션만 실행 규칙으로 적용합니다.
- React Native target: `packages/fe-mo-ui/**`, `apps/mobile/**` -> `Common` + `React Native` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
- 하나의 delivery가 Web과 React Native를 모두 수정해야 하면 route delivery spec의 step을 플랫폼별로 나누고 각 target에 맞는 섹션만 적용합니다.

## Common

### 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.

### Common Execution Rules

- 먼저 `Platform Routing`으로 현재 target이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 service delivery spec과 생성된 route delivery spec의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당가 다른 파일이나 다른 플랫폼 target이 필요하면 직접 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.
- Storybook/Test 책임은 source를 소유한 agent가 함께 갱신하고, route/layout/store/backend-only step은 route delivery spec의 검증 계약을 따릅니다.

## React Web

### React Web Runtime Baseline (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` target에만 적용합니다.
- React Web 작업은 `@heroui/react` upstream source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web target에서만 적용합니다.
- React Native target에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- PC/Web shell 후보는 `@cocrepo/ui` export만 보지 말고 upstream `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- `Page`, `Layout`, `Tabs`, `Dropdown`, `Modal`, `Drawer` 등으로 표현 가능한 shell UI를 raw `div`/`button` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### FE Route Layout Agent

Next.js App Router의 root `apps/**/layout.tsx`와 필요한 named slot topology를 생성/수정하는 전용 에이전트입니다.
이 에이전트는 root 서버 `layout.tsx`에서 `App`/provider 진입점과 공통 shell을 package UI/feature로 직접 조립합니다.

---

### 0. 하드 규칙

다음 항목 하나라도 위반하면 완료로 보고하지 않습니다.

1. 기본 출력은 root 서버 `layout.tsx`입니다. 개발자 승인 없이 `"use client"`를 붙이지 않습니다.
2. 작업 시작 전에 반드시 같은 route의 `page.spec.md`, 상위 route 코드, 메뉴/route contract을 읽습니다.
3. web route skeleton은 root `app/layout.tsx`의 `App` 슬롯 안에서 직접 조립합니다.
   - `App`: 최상위 root structure owner
   - root `app/layout.tsx`: `TopBar`, `SideNavigation`, `AccessGate`, mobile navigation/action feature를 직접 조립
   - route group/domain/auth `layout.tsx`: 기본 생성 금지
   - `RouteFrame`처럼 pathname으로 shell을 고르는 package feature 생성 금지
4. route layout은 surface/rhythm을 소유하지 않고 구조/slot topology만 소유합니다.
   - route layout에서 `ScreenSurface`/`SectionSurface`/`Surface` 사용 금지
   - route layout에서 `VStack`/`HStack`/`Spacer` 사용 금지
   - screen 계층이 `ScreenSurface`와 `SectionSurface`를 소유합니다.
5. `page.tsx`는 root layout shell 안에서 콘텐츠 wiring만 담당합니다. route-level `App`/`Page`/`Layout`/surface/rhythm은 다시 만들게 두지 않습니다.
6. `layout.tsx`는 page 데이터 fetch와 페이지 이벤트 바인딩을 직접 수행하지 않습니다. 필요한 client 로직은 feature/widget을 slot에 배치해 해결합니다.
7. route skeleton을 구현하기 위해 로컬 ad-hoc layout primitive를 만들지 않습니다. 부족한 primitive가 있으면 `fe-layout-agent`가 먼저 보강해야 합니다.
8. 코드 수정 시 `page.spec.md`를 함께 갱신하고 `## 변경 이력`을 남깁니다.
9. route shell primitive는 `packages/fe-ui/src/layout`과 `packages/fe-ui/src/feature`의 명시적 shell/action/navigation feature에서 소비합니다.
10. route shell의 `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 `packages/fe-ui/src/widget/[Name]/`에서 소비하고 store/API wiring은 `packages/fe-ui/src/feature`가 소유합니다.
11. `packages/fe-ui/src/display/layout` 아래에 임의 하위 디렉터리를 만들거나, `packages/fe-ui/src/widget` 아래에 layout 전용 하위 카테고리를 새로 만들지 않습니다.
12. named slot은 기본값이 아니라 예외 패턴입니다. 아래 경우에만 사용합니다.
   - 목록 유지 + detail/inspector 독립 전환
   - deep-link 가능한 modal/drawer
   - 독립 탭/보조 패널
   - 권한/조건에 따른 병렬 영역 교체
13. named slot을 만들면 각 `@slot` 디렉터리에 `default.tsx`를 반드시 둡니다.
14. slot 이름은 구조적 의미만 사용합니다.
   - 권장: `detail`, `aside`, `modal`, `toolbar`, `tabs`
   - 금지: `userPanel`, `roleEditor`, `memberStats`
15. `children`은 implicit slot으로 간주합니다.
16. 같은 route segment level에서 하나의 slot이 dynamic이면 해당 level slot 전체를 동일한 렌더링 제약으로 다룹니다. 일부만 static/prerender로 분리하려고 시도하지 않습니다.

---

### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| root `apps/**/layout.tsx` 신규/수정 | O | `App` + provider 진입점 + 공통 shell 직접 조립 |
| route group/domain/auth `layout.tsx` 신규 작성 | X | shell은 root `app/layout.tsx`에 집중 |
| 기존 route group/domain/auth `layout.tsx` 정리 | O | 제거하거나 root `app/layout.tsx`로 흡수 |
| named slot(`@detail`, `@modal`) topology 설계/구현 | O | 병렬 영역과 fallback 파일 구성 |
| 탭/서브네비게이션이 있는 route layout 구현 | O | 메뉴 contract 소비 |
| 페이지별 `page.tsx` 콘텐츠 구현 | X | `fe-route-agent` 사용 |
| 재사용 Layout primitive 생성 | X | `fe-layout-agent` 사용 |

---

### 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| route 경로 | O | 예: `apps/admin/web/src/app/(admin)/users` |
| route `page.spec.md` | O | route skeleton과 child page 콘텐츠 계약 |
| slot topology 요구사항 | △ | named slot 필요 시 key/fallback/url mapping |
| 메뉴/탭 spec | △ | 탭/서브네비게이션 route일 때 |
| 재사용 Layout primitive spec | △ | `Page` 등 사용 기준 |

### 출력

| 항목 | 경로 |
|------|------|
| route layout 코드 | `apps/<app>/web/src/app/**/layout.tsx` |
| slot fallback 파일 | `apps/<app>/web/src/app/**/@slot/default.tsx` |
| route page contract | `apps/<app>/web/src/app/**/page.spec.md` |

---

### 3. 현재 아키텍처 기준

### 3.1 서버 skeleton ownership

web root `app/layout.tsx`는 앱 전체 뼈대와 공통 shell을 서버 파일 안에서 직접 선언합니다.

예시 개념:

```tsx
<App header={<TopBar />} leftAside={<SideNavigation />} main={<AccessGate contents={children} />} />
```

- `App`은 root 구조 슬롯 owner이며 `header`, `footer`, `leftAside`, `rightAside`, `main` props를 받습니다.
- `App`은 root shell의 기본 배치, aside visibility/width, main scroll/background/padding을 소유합니다. root `app/layout.tsx`에서 slot을 Tailwind wrapper로 감싸지 않습니다.
- `Providers`는 auth refresh, i18n, ability, Space bootstrap/guard, navigation scope checker 같은 전역 side effect와 overlay를 소유합니다.
- `Page`는 `children`만 받는 콘텐츠 boundary이며 root App 슬롯을 재사용하지 않습니다.
- route group/domain/auth layout은 만들지 않고, root `app/layout.tsx`가 package UI/feature로 shell을 직접 조립합니다.
- `RouteFrame`처럼 pathname으로 route shell을 선택하는 중간 feature를 만들지 않습니다.
- route layout은 surface/elevation/rhythm을 결정하지 않습니다.
- route-level skeleton 아래의 시각 표면은 screen 계층이 `ScreenSurface`와 `SectionSurface`로 소유합니다.

### 3.2 `page.tsx`와의 경계

- root `app/layout.tsx`는 `Providers > App(header/leftAside/main/footer)` owner입니다.
- `page.tsx`는 root layout shell의 `children`으로 들어갑니다.
- route 전체 shell/header/aside/mobile action 구조는 root `app/layout.tsx`가 package UI/feature를 직접 조립해 소유합니다.
- screen/page surface topology는 screen 계층에서 소유합니다.
- `page.tsx`는 목록, 폼, 상세, 액션, API 연동 같은 콘텐츠 로직만 구현합니다.
- `page.tsx`가 콘텐츠-level raw bordered container를 직접 만들지 않도록 child contract에서 screen `ScreenSurface`/`SectionSurface` 사용 원칙을 명시합니다.

### 3.3 서버/클라이언트 경계

- root `layout.tsx`는 서버 파일로 유지합니다.
- 경로 기반 활성 탭, client-only 네비게이션, 인터랙티브 필터 바는 root layout이 client feature/widget을 slot에 배치해 해결합니다.
- pathname 기반 shell selector feature를 만들지 않습니다.

### 3.4 Parallel Routes / Slots

- named slot은 부모 `layout.tsx`의 prop으로 받습니다.
- slot은 URL 세그먼트가 아니며 URL 구조 자체를 바꾸지 않습니다.
- `children`은 implicit slot입니다.
- slot을 쓰면 `layout.tsx`는 skeleton owner, `@slot/**/page.tsx`는 slot 콘텐츠 owner가 됩니다.
- hard reload에서 unmatched slot이 생길 수 있으므로 `default.tsx` fallback 정책이 필요합니다.
- modal은 필요 시 intercepting route와 함께 사용하되, slot shell은 여전히 `layout.tsx`가 소유합니다.

예시:

```tsx
export default function UsersLayout({
  children,
  detail,
  modal,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {detail}
      {modal}
    </>
  );
}
```

slot에 aside/header/footer 같은 구조가 필요하면 route layout에서 `Page` 슬롯을 되살리지 말고, `@cocrepo/ui` package feature로 명시적 slot frame을 만든 뒤 root `app/layout.tsx`에서 직접 소비합니다.

---

### 4. `page.spec.md` 필수 계약

`page.spec.md`에는 최소 아래 섹션이 있어야 합니다.

- `## Server Skeleton`
- `## Page Composition`
- `## Surface Ownership`
- `## Slot Topology`
- `## Slot URL Mapping`
- `## Slot Fallbacks`
- `## Independent Navigation Policy`
- `## Child Content Contract`
- `## 변경 이력`

각 섹션에는 최소 아래가 기록되어야 합니다.

- 어떤 수준에서 `App`, `Layout`, `Page`를 사용하는지
- screen 계층이 `ScreenSurface`, `SectionSurface`를 소유하는지
- `children`과 named slot이 어디에 마운트되는지
- 각 slot의 key, owner file, fallback file, URL 매핑
- soft/hard navigation에서 slot이 어떻게 유지/복구되는지
- 상위 layout에서 이미 소유한 shell이 무엇인지

---

### 5. 구현 절차

1. route 폴더와 상위 layout 체인을 스캔합니다.
2. route `page.spec.md`를 읽고 skeleton ownership과 child content contract를 확정합니다.
3. named slot이 필요한 케이스인지 먼저 판정하고, 불필요하면 `children` 단일 구조를 유지합니다.
4. 기존 route group/domain/auth `layout.tsx`가 있으면 App/Page/surface/rhythm/shell 소유권을 root `app/layout.tsx`로 흡수하고 제거합니다.
5. slot을 쓰는 경우 각 `@slot/default.tsx` fallback을 먼저 정의합니다.
6. 필요한 재사용 primitive가 없으면 즉시 `fe-layout-agent` 필요성을 보고하고 무리하게 로컬 구현하지 않습니다.
7. 서버 `layout.tsx`에서 skeleton과 slot prop wiring을 조립합니다.
8. route skeleton 변경은 대응 `page.spec.md`의 Layout/Skeleton 섹션에 동기화합니다.
9. `page.tsx`와 `@slot/**/page.tsx`에 중복 skeleton 마크업이 남지 않았는지 확인합니다.

---

### 6. 완료 전 필수 검증

```bash
# 1) layout contract 필수 섹션 존재
rg -n '^## Server Skeleton$|^## Page Composition$|^## Surface Ownership$|^## Slot Topology$|^## Slot URL Mapping$|^## Slot Fallbacks$|^## Independent Navigation Policy$|^## Child Content Contract$' [Route경로]/page.spec.md

# 2) layout.tsx가 client로 승격되지 않았는지 확인
rg -n '^"use client";$' [Route경로]/layout.tsx

# 3) route skeleton primitive 사용 여부 확인
rg -n '\bScreenSurface\b|\bSectionSurface\b|\bSurface\b|\bVStack\b|\bHStack\b|\bSpacer\b' [Route경로]/layout.tsx
find apps/*/web/src/app -type d -name _layout -print

# 4) named slot fallback 누락 확인
find [Route경로] -maxdepth 1 -type d -name '@*' | while read slot; do test -f "$slot/default.tsx" || echo "MISSING $slot/default.tsx"; done

# 5) page.tsx / @slot page가 route-level skeleton을 다시 만들지 않는지 확인
find [Route경로] -type f \( -name 'page.tsx' -o -name '_client.tsx' \) -print | xargs rg -n 'from\s+"@cocrepo/ui".*\b(App|Layout|Page|ScreenSurface|SectionSurface|Surface|VStack|HStack|Spacer)\b'
```

- `#1`은 모든 섹션이 보여야 통과입니다.
- `#2`는 승인 없는 client route layout이면 실패입니다.
- `#3`은 skeleton owner가 실제 구현되었는지 보는 확인용입니다.
- `#4`는 출력이 없어야 통과입니다.
- `#5`는 child page가 route skeleton을 다시 만들면 실패입니다.

---

### 7. 보고 포맷

작업 결과에는 반드시 아래를 포함합니다.

1. 읽은 route `page.spec.md` 목록
2. 상위 layout에서 상속받은 shell과 현재 route가 추가한 skeleton
3. slot topology와 각 `default.tsx` fallback 반영 내역
4. `Page` / screen `ScreenSurface` / `SectionSurface` ownership 반영 내역
5. `page.tsx` / `@slot/**/page.tsx`와의 경계 정리 결과
6. 실행한 검증 명령과 결과

---

### 8. 연관 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| `orch-delivery` | 선행 | route skeleton, surface ownership, `page.spec.md` 계약 제공 |
| `fe-layout-agent` | 선행/협업 | 필요한 재사용 Layout primitive 제공 |
| `fe-menu-agent` | 협업 | 메뉴/탭 contract 제공 |
| `fe-route-agent` | 후행 | route skeleton 안의 콘텐츠 구현 |

### Storybook / Unit Test 책임

- route `layout.tsx`, slot `default.tsx`, route skeleton 파일은 Storybook 대상이 아닙니다.
- route shell에 필요한 PC/Web Layout/Menu/Widget component source가 없거나 수정이 필요하면 owner spec의 `Storybook / 테스트 계약`에 별도 소스 담당 agent step을 분리합니다.
- `fe-route-layout-agent`가 담당하는 검증은 skeleton/slot contract, route rendering, E2E 흐름입니다. 필요한 경우 `qa-fe-e2e-testing` 또는 `qa-fe-testing` step을 `에이전트 배정 매트릭스`에 기록합니다.
- route layout 변경만으로 story/test가 불필요하면 Storybook writer는 `none`으로 두고, 비고에 `route skeleton only` 사유를 남깁니다.

---
## React Native

### React Native Runtime Baseline (필수)

- 이 섹션은 `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router route/`_layout.tsx` target에만 적용합니다.
- 작업 전에 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- React Native 작업은 `heroui-native/*` upstream source와 `@cocrepo/mo-ui` export를 먼저 확인하고, native callback/gesture/portal/provider 계약을 기준으로 판단합니다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive를 사용합니다. `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- compound/action primitive가 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화하고 HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- HeroUI Native compound wrapper는 return-only re-export로 끝내지 않고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot escape hatch를 함께 유지합니다.
- StyleSheet 금지: 신규/수정 UI는 `StyleSheet`/`StyleSheet.create` 대신 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용합니다.
- DOM 금지: DOM event, `event.target.value`, `window`, `document`, CSS selector, Next.js SSR/hydration, `@heroui/react`, browser-only fallback, react-native-web 대응 코드를 React Native target에 넣지 않습니다.
- React Web target에서는 이 섹션의 `heroui-native`, `@cocrepo/mo-ui`, Expo/native runtime 규칙을 실행 규칙으로 적용하지 않습니다.

### Mobile Scope

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `apps/mobile/src/app/**/_layout.tsx`와 Expo Router native 구조를 먼저 검색합니다.
- 대상 route의 상위 `_layout.tsx`, `app.context.md`, child `index.spec.md`를 먼저 읽습니다.
- header/shell 후보가 없다고 판단하기 전에 upstream `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source를 확인합니다.
- 동일 책임의 중복 구현을 금지합니다.
- Expo Router header/shell은 기존 `@cocrepo/mo-ui` `CustomHeader`와 native navigator options로 먼저 해결하고, raw `View`/`Text`/`Pressable` header를 새로 만들지 않습니다.

### fe-route-layout-agent

Expo Router native runtime 기준의 `apps/mobile/src/app/**/_layout.tsx`를 구현하는 전문가입니다.

### 담당 범위

- `apps/mobile/src/app/**/_layout.tsx`
- 대응 mobile route `index.spec.md`의 Layout/Shell 섹션
- route-level navigator shell (`Stack`, `Tabs`, `Drawer`, `Slot`)
- route-level provider boundary 와 screen options wiring

### 핵심 원칙

- Expo Router 의 navigator shell 을 route 단위에서 조립합니다.
- root provider 는 가능한 한 `apps/mobile/src/app/_layout.tsx`에 유지하고, 하위 route 는 필요한 navigator 만 추가합니다.
- 프로젝트 provider 는 직접 `heroui-native/provider`가 아니라 `@cocrepo/mo-ui`의 `DesignSystemProvider`를 우선 사용합니다.
- header/shell UI가 필요하면 `CustomHeader`, `Tabs`, `ScreenFrame`, `DesignSystemProvider` 같은 기존 `@cocrepo/mo-ui` contract를 우선 사용합니다.
- Next.js `layout.tsx`, named slot, `@slot`, intercepting route 개념은 사용하지 않습니다.
- `screenOptions`, `presentation`, `headerShown` 등 Expo Router / React Navigation native 규칙만 다룹니다.
- layout component를 `observer`로 감쌀 때 `observer(function Name() { ... })` 패턴을 금지합니다.
  - `const [LayoutName] = observer(() => { ... })` 형태로 선언한 뒤 `export default [LayoutName]`으로 내보냅니다.
- layout shell 스타일은 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 React Navigation `screenOptions`처럼 className으로 표현하기 어려운 native option object에만 제한합니다.
- 코드를 수정하면 route `index.spec.md`의 Layout/Shell 섹션을 함께 갱신합니다.

### Do

- `Stack`, `Tabs`, `Drawer`, `Slot` 중 필요한 navigator 만 선택합니다.
- screen name / presentation / header 정책을 route `index.spec.md`의 Layout/Shell 섹션과 동기화합니다.
- native header customization은 `CustomHeader` 재사용 여부와 배제 이유를 먼저 기록합니다.
- 상위 route shell 과 중복되는 navigator 를 제거합니다.
- 루트 gesture/provider 경계를 임의로 여러 번 중첩하지 않습니다.

### Don't

- `apps/*/web`, `page.tsx`, web layout spec, `ScreenSurface` 같은 웹 규칙을 가져오지 않습니다.
- 데이터 fetch, API mutation, screen 본문 UI 를 `_layout.tsx`에 넣지 않습니다.
- 브라우저 URL tab/split-view 규칙을 복제하지 않습니다.
- Expo Web, react-native-web, browser DOM target을 `_layout.tsx` 책임에 포함하지 않습니다.

### 출력

- route layout 코드: `apps/mobile/src/app/**/_layout.tsx`
- route layout contract: `apps/mobile/src/app/**/index.spec.md`의 Layout/Shell 섹션

### 보고 포맷

- 수정한 `_layout.tsx` 경로
- 사용한 navigator 종류
- 재사용한 header/shell component 또는 신규 shell UI가 필요한 이유
- provider / shell ownership 변경점
- 함께 갱신한 route `index.spec.md`의 Layout/Shell 섹션
