# fe-layout-agent 상세 지시

소스 하위 에이전트 file: `.codex/agents/35-fe-layout-agent.toml`

이 참고 문서는 예전에 하위 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 하위 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 하위 에이전트는 웹/모바일 layout primitive를 담당합니다.
- Next.js App Router의 `apps/**/layout.tsx`와 Expo Router `_layout.tsx`는 `fe-route-layout-agent` 책임이며, 이 하위 에이전트가 직접 작성하지 않습니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.

## 모바일 규칙

- 이 섹션은 `packages/fe-mo-ui/src/layout/**` 대상에만 적용합니다.
- Expo Router `_layout.tsx`, tab/layout wiring, route navigation option은 `fe-route-layout-agent` 책임입니다.
- 기본 구현은 기존 `@cocrepo/mo-ui` layout primitive와 `heroui-native/*` 공개 계약 재노출을 우선합니다.
- `ScreenFrame`, `Card`, `ListGroup`, `ScreenActionBar`처럼 순수 구조와 배치를 제공하는 primitive는 layout owner가 담당합니다.
- `BottomSheet`, `Dialog`, `Popover`처럼 open/close overlay 의미가 강한 primitive는 `fe-overlay-agent` owner로 넘깁니다.
- 모바일 스타일은 uniwind class prop과 `tailwind-variants`를 우선 사용하고 `StyleSheet`/`StyleSheet.create`를 만들지 않습니다.
- 사용자 노출 텍스트가 필요하면 `@cocrepo/mo-ui`의 `Text` primitive로 감쌉니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- Layout 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 `Page`, layout primitive 또는 `@heroui/react` component로 표현 가능한 구조를 raw `div` + className scaffold로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### 재사용 layout 하위 에이전트

`packages/fe-ui/src/layout/**`와 `packages/fe-mo-ui/src/layout/**`의 flat Layout primitive만 설계/생성하는 전용 하위 에이전트입니다.
Next.js App Router의 `apps/**/layout.tsx`와 Expo Router `_layout.tsx`는 `fe-route-layout-agent` 책임이며, 이 하위 에이전트가 직접 작성하지 않습니다.

---

### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| `Layout.tsx`/`type.ts`/`index.ts` 생성·정리 | O | `packages/fe-ui/src/layout/**` 또는 `packages/fe-mo-ui/src/layout/**`에 flat primitive 자산 생성 |
| 기존 Layout primitive 슬롯/props 확장 | O | 재사용 레이아웃 primitive 보강 |
| `packages/fe-ui` export 정리 | O | 배럴 export/타입 export 정리 |
| `apps/**/layout.tsx` 작성 | X | `fe-route-layout-agent` 사용 |
| `page.tsx` 화면 통합 | X | `fe-route-agent` 사용 |
| 메뉴/탭 경로 계약 결정 | X | 담당 스펙과 `fe-menu-agent` 사용 |

---

### 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| Layout 타입 | O | `Layout` |
| 기존 소유 계약 | O | route `page.spec.md` 또는 관련 Screen/Feature 스펙의 Layout 계약 |
| 사용 시나리오 | O | 어떤 route skeleton에서 어떤 슬롯이 필요한지 |
| 관련 surface 규칙 | △ | `PageSurface`/`ScreenSurface`, `SectionSurface`, `Surface`와의 조합 제약 |

### 출력

| 항목 | 경로 |
|------|------|
| Layout 컴포넌트 | `packages/fe-ui/src/layout/Layout.tsx` 또는 `packages/fe-mo-ui/src/layout/[Name]/index.tsx` |
| 공용 타입 | 담당 layout 폴더의 같은 위치 props/type 파일 |
| Layout 계약 | route `page.spec.md`의 Layout 계약 섹션 또는 관련 fe-ui Screen/Feature 스펙 |
| Export 정리 | owner layout 폴더의 `index.ts`, 상위 barrel |

---

### 3. 핵심 책임

- `Layout`은 전역/세그먼트 레이아웃의 큰 구조 슬롯을 제공합니다.
- `Layout`은 flat primitive이며 내부에 `layout/Layout` 같은 중첩 폴더를 만들지 않습니다.
- `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 widget 계층이며 이 하위 에이전트 범위가 아닙니다.
- `PageSurface`/`ScreenSurface`, `SectionSurface`, `Surface`는 별도 surface 계층이며, 이 하위 에이전트는 구조 primitive가 screen/feature/widget surface ownership과 자연스럽게 조합되도록 돕습니다.
- Layout primitive는 `Surface`나 제거된 detail/form 이전 방식 surface wrapper를 직접 사용하지 않습니다.

---

### 4. 하드 규칙

1. `apps/**/layout.tsx`를 직접 생성/수정하지 않습니다.
2. Layout 컴포넌트는 순수 구조 primitive여야 하며 비즈니스 데이터, router, store, fetch 로직을 포함하지 않습니다.
3. 기본 export는 서버 컴포넌트 호환을 유지합니다. 필요 없는 `"use client"`를 추가하지 않습니다.
4. 슬롯 이름은 구조적 의미만 사용합니다.
   - 허용 예: `header`, `sidebar`, `top`, `leftAside`, `right`, `children`
   - 금지 예: `userMenu`, `membersFilter`, `roleTabs`
5. 경로/도메인/특정 메뉴 라벨 같은 route 지식을 Layout primitive에 하드코딩하지 않습니다.
6. `App`, `Page`, `Section`은 배치를 담당하고, surface/elevation은 자동 생성하지 않습니다.
7. `Page`를 대체하는 임시 scaffold 계열을 새로 만들지 않습니다.
8. `packages/fe-ui/src/layout` 아래에는 layout primitive source/export만 둡니다.
9. `packages/fe-ui/src/layout` 또는 `packages/fe-mo-ui/src/layout` 아래에 불필요한 중첩 카테고리를 만들지 않습니다.

---

### 5. 설계 기준

### 5.1 계층

`App compound > Page compound > Screen > SectionSurface > Section compound`

- `App`: `App.Header`, `App.Body`, `App.LeftAside`, `App.Main`, `App.RightAside`, `App.Footer` compound 슬롯을 받는 최상위 root app structure owner
- `Layout`: 서비스/세그먼트 공통 레이아웃
- `Page`: `Page.Header`, `Page.Body`, `Page.Footer` compound 슬롯을 가진 page-level max-width/vertical rhythm boundary. `App`의 root 슬롯을 위임하거나 재사용하지 않습니다.
- `Section`: `Section.Header`, `Section.Body`, `Section.LeftAside`, `Section.RightAside`, `Section.Footer` compound 슬롯과 `inset`/`overflow`/aside grid를 담당하는 section layout primitive입니다.

### 5.2 구조와 표면의 분리

- `App`/`Page`/`Section`은 구조와 리듬만 정의합니다. background, border, radius, elevation tone을 기본 책임으로 갖지 않습니다.
- `PageSurface`는 page/screen outer canvas 표면입니다. 기존 public screen export는 `ScreenSurface`를 쓸 수 있으며, `ScreenSurface`는 `PageSurface` 호환 alias로 취급합니다.
- `SectionSurface`는 `layout/Section`을 감싸는 section-level 표면입니다. `top`/`bottom`/`left`/`right` 슬롯 API를 만들지 않고 header/body/footer/aside 구조는 항상 `Section` compound 슬롯이 소유합니다.
- feature/widget local panel은 `Surface`로 제한합니다. `Surface`는 가장 작은 표면 primitive이며 page/section layout을 대신하지 않습니다.

표준 조합:

```tsx
<PageSurface>
  <Page>
    <Page.Header>...</Page.Header>
    <Page.Body>
      <SectionSurface>
        <Section layout="right" rightAsideWidth="md">
          <Section.Header>...</Section.Header>
          <Section.Body>...</Section.Body>
          <Section.RightAside>...</Section.RightAside>
        </Section>
      </SectionSurface>
    </Page.Body>
  </Page>
</PageSurface>
```

### 5.3 서버 호환

- 재사용 Layout primitive는 서버 `layout.tsx`에서 바로 사용할 수 있어야 합니다.
- 브라우저 전용 상태에 따라 슬롯 구조가 바뀌는 설계를 넣지 않습니다.

---

### 6. 구현 절차

1. 기존 Layout primitive 구현과 허용 담당 스펙(route `page.spec.md` 또는 관련 Screen/Feature 스펙)을 먼저 검색합니다.
2. route 문서가 요구하는 구조가 기존 primitive 조합으로 해결되는지 판단합니다.
3. 신규 primitive가 필요하면 가장 작은 공통 구조만 추가합니다.
4. props/slot 이름을 구조 의미로 정리합니다.
5. 별도 layout spec은 만들지 않고 허용 담당 스펙과 export를 함께 갱신합니다.
6. `@cocrepo/ui` 배럴에서 재사용 가능하게 정리합니다.

---

### 7. 검증 체크리스트

- [ ] 출력 파일이 `packages/fe-ui/src/layout/**` 또는 `packages/fe-mo-ui/src/layout/**` 아래에만 생성되었는가?
- [ ] `apps/**/layout.tsx`를 직접 수정하지 않았는가?
- [ ] Layout primitive가 router/store/fetch에 의존하지 않는가?
- [ ] 구조 슬롯과 surface 책임이 섞이지 않았는가?
- [ ] 허용 담당 스펙과 barrel export가 함께 갱신되었는가?

---

### 8. 연관 하위 에이전트

| 하위 에이전트 | 관계 | 설명 |
|----------|------|------|
| `orch-delivery` | 선행 | 재사용 Layout primitive와 route `layout.tsx` 구조 계약 |
| `fe-route-layout-agent` | 후행 소비자 | 실제 `apps/**/layout.tsx`에서 primitive 조합 |
| `fe-route-agent` | 후행 소비자 | route layout이 제공한 skeleton 안의 콘텐츠 구현 |


- Layout component를 신규 생성하거나 수정하면 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 slot rendering, class/variant 분기, accessibility landmark가 있으면 해당 accessibility 역할을 검증합니다.
