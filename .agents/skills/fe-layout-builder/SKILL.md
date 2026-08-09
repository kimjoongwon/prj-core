---
name: "fe-layout-builder"
description: "이 skill은 `fe-layout-agent` 역할로 일할 때 사용합니다. layout 기본 컴포넌트를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# fe-layout-builder

## 플랫폼 라우팅

- 이 하위 에이전트는 웹/모바일 layout primitive를 담당합니다.
- Next.js App Router의 `apps/**/layout.tsx`와 Expo Router `_layout.tsx`는 `fe-route-layout-agent` 책임이며, 이 하위 에이전트가 직접 작성하지 않습니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.

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

- Layout 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 기존 `Page`, layout primitive 또는 `@heroui/react` component로 표현 가능한 구조를 raw `div` + className scaffold로 재구현하지 않습니다.

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

---

### 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| Layout 타입 | O | `Layout` |
| 사용 시나리오 | O | 어떤 route skeleton에서 어떤 슬롯이 필요한지 |
| 관련 surface 규칙 | △ | `PageSurface`/`ScreenSurface`, `SectionSurface`, `Surface`와의 조합 제약 |

### 출력

| 항목 | 경로 |
|------|------|
| Layout 컴포넌트 | `packages/fe-ui/src/layout/Layout.tsx` 또는 `packages/fe-mo-ui/src/layout/[Name]/index.tsx` |
| 공용 타입 | 담당 layout 폴더의 같은 위치 props/type 파일 |
| Export 정리 | owner layout 폴더의 `index.ts`, 상위 barrel |

---

### 3. 핵심 책임

- `Layout`은 전역/세그먼트 레이아웃의 큰 구조 슬롯을 제공합니다.
- `Layout`은 flat primitive이며 내부에 `layout/Layout` 같은 중첩 폴더를 만들지 않습니다.
- `HeaderBar`, `BottomNav`, `ActionFab`, `OverlayMenu`는 widget 계층이며 이 하위 에이전트 범위가 아닙니다. `NavigationPanel`은 domain 계층입니다.
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

2. route 문서가 요구하는 구조가 기존 primitive 조합으로 해결되는지 판단합니다.
3. 신규 primitive가 필요하면 가장 작은 공통 구조만 추가합니다.
4. props/slot 이름을 구조 의미로 정리합니다.
6. `@cocrepo/ui` 배럴에서 재사용 가능하게 정리합니다.

---

### 7. 검증 체크리스트

- [ ] 출력 파일이 `packages/fe-ui/src/layout/**` 또는 `packages/fe-mo-ui/src/layout/**` 아래에만 생성되었는가?
- [ ] `apps/**/layout.tsx`를 직접 수정하지 않았는가?
- [ ] Layout primitive가 router/store/fetch에 의존하지 않는가?
- [ ] 구조 슬롯과 surface 책임이 섞이지 않았는가?
---

### 8. 연관 하위 에이전트

| 하위 에이전트 | 관계 | 설명 |
|----------|------|------|
| `orch-delivery` | 선행 | 재사용 Layout primitive와 route `layout.tsx` 구조 계약 |
| `fe-route-layout-agent` | 후행 소비자 | 실제 `apps/**/layout.tsx`에서 primitive 조합 |
| `fe-route-agent` | 후행 소비자 | route layout이 제공한 skeleton 안의 콘텐츠 구현 |

- 단위 테스트는 slot rendering, class/variant 분기, accessibility landmark가 있으면 해당 accessibility 역할을 검증합니다.

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
