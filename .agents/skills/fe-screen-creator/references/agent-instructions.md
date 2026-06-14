# Detailed Instructions for fe-screen-agent

Source agent file: `.codex/agents/fe-screen-agent.toml`

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
- PC/Web UI 후보는 `@cocrepo/ui` export만 보지 말고 upstream `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- `@heroui/react` 또는 기존 `@cocrepo/ui` component로 표현 가능한 UI를 page 안에서 raw `div`/`button`/`input`/`table` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### FE Screen Agent

`packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` 기준의 web screen visual owner를 생성/수정하는 전용 role입니다.

이 role이 만드는 screen은 앱 라우트가 아닙니다.
`apps/admin/web`, `apps/idp/web`의 `page.tsx`에서 데이터를 받고, 핸들러를 주입받아,
widget/feature/form/collection/detail 등 하위 재사용 계층을 조합해 screen-level 시각 구성을 담당합니다.
`src/screen`의 이름은 route segment를 직렬화하지 않고, semantic app-facing screen 이름을 우선 사용합니다.

---

### 0. 하드 규칙 (위반 시 실패 처리)

다음 항목 하나라도 위반하면 작업을 완료로 보고하지 않습니다.

1. screen-level 시각 owner는 반드시 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`
2. screen component는 pure presentational contract를 유지
   - 데이터, 파생 상태, 빈 상태 메시지, CTA 상태, 핸들러는 props로 받음
3. screen component 내부에서 직접 API/라우팅/스토어/runtime context를 읽지 않음
   - 금지 예: Orval hooks, React Query hooks, `useRouter`, `useSearchParams`, `redirect`, `cookies`, `headers`, MobX store 직접 참조
4. screen component는 `widget`, `feature`, `collection`, `detail`, `form`, `layout`, `rhythm`, `display`, `control` 등 하위 재사용 계층만 조합
   - screen 구현은 `SectionSurface`와 `VStack`/`HStack`/`Spacer` rhythm을 소유합니다.
   - screen public export boundary는 `ScreenSurface`를 소유합니다.
   - page 파일 안에 flow rail, metric grid, tab group, table, form section 같은 lower-layer JSX 컴포넌트를 직접 정의하면 실패 처리
   - 새 lower-layer 책임이 필요하면 해당 `feature`/`widget`/`form` 계층 파일로 먼저 분리하고 page는 import해서 조합
   - page 파일의 top-level JSX component 선언은 exported Screen component 1개만 허용
   - `const Xxx = observer(...)`, `function Xxx(...)`, `const Xxx = (...) => <...>` 형태의 보조 visual component가 page 파일 안에 있으면 완료 금지
   - 순수 계산 helper는 JSX를 반환하지 않는 경우에만 허용하며, helper가 2개 이상 필요하면 feature/widget로 승격을 재검토
   - One Component Per File 규칙을 따라 page 파일은 exported Screen component 하나만 소유합니다.
5. `packages/fe-ui/src/screen` 아래에는 단순 namespace depth를 만들지 않음
   - 금지 예: `src/screen/admin/MemberListScreen.tsx`, `src/screen/idp/LoginScreen.tsx`
   - 허용 예: `src/screen/MemberListScreen/MemberListScreen.tsx`
6. `packages/fe-ui/src/screen`의 screen component와 planning spec은 반드시 동일 이름 폴더에 함께 둠
   - 허용 예: `src/screen/AddressEmailVerifyScreen/AddressEmailVerifyScreen.tsx`
   - 허용 예: `src/screen/AddressEmailVerifyScreen/AddressEmailVerifyScreen.spec.md`
   - 허용 예: `src/screen/AddressEmailVerifyScreen/AddressEmailVerifyScreen.stories.tsx`
   - 금지 예: `src/screen/AddressEmailVerifyScreen.tsx`
   - 금지 예: `src/screen/AddressEmailVerifyScreen.spec.md`
7. screen component props의 이벤트 이름은 `on[Event][UI]` 패턴 강제
8. screen component가 route shell primitive를 직접 소유하지 않음
   - 금지 예: route `Page`, `Surface` 책임 침범
   - 신규 screen implementation에서 `Surface`, 제거된 detail/form legacy surface wrapper 사용 금지
   - `ScreenSurface`는 `packages/fe-ui/src/screen/index.ts`의 public screen export boundary에서만 적용
9. screen component export는 named export만 허용
   - 허용 예: `export const MembersListScreen = observer(() => { ... })`
   - 허용 예: `export const MembersListScreen = observer((props: MembersListScreenProps) => { ... })`
   - 금지 예: `export default MembersListScreen`
   - 금지 예: `export const MembersListScreen = MembersListScreenClient;`
10. `observer(function Name() { ... })` 패턴 금지
   - screen component는 반드시 `export const [ScreenName] = observer(() => { ... })` 또는 props를 받는 `observer((props) => { ... })` 형태로 선언
11. `*Client`, `*Inner`, `*Base` 같은 trivial pass-through wrapper 금지
   - 단순히 props/params를 받아 바로 하위 컴포넌트에 전달하는 중간 component를 같은 page 파일 안에 두지 않음
   - page 파일 안에서 wrapper 없이 최종 exported component가 바로 렌더 책임을 가짐
12. Screen component 수정 시 대응 `[ScreenName].spec.md` planning spec 업데이트 + `## 변경 이력` 추가 필수
   - spec에는 `## 화면 러프` 섹션을 반드시 두고 Markdown text/ASCII wireframe으로 Desktop/Tablet/Mobile 또는 해당 화면의 주요 responsive 상태를 그립니다.
   - 화면 러프 없이 props/의존성 표만 남기면 실패 처리
   - planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, backend build order, foundation 세부 실행표, approval gate를 쓰지 않습니다.
13. `packages/fe-ui/src/screen/index.ts` export 동기화 필수
14. screen 이름은 semantic app-facing 이름을 우선 사용
   - 기본 CRUD 어휘: `ListScreen`, `DetailScreen`, `CreateScreen`, `EditScreen`
   - create/edit route가 같은 pure screen를 공유하면 `FormScreen`을 허용
   - 선택/검증/상호작용 화면은 `SessionCheckScreen`, `TenantSelectScreen`, `OidcInteractionScreen` 같은 task 이름을 유지
   - 충돌 시 가장 작은 domain qualifier만 추가
   - 금지 예: `AdminAssetsAssetIdPage`, `IdpConsoleOidcClientsOidcClientIdPage`
   - 허용 예: `AssetDetailScreen`, `OidcClientDetailScreen`, `RoleAbilityActionListScreen`

---

### 1. 현재 아키텍처 기준

### 1.1 계층

`Display/Control/Layout -> Widget -> Feature -> Page -> App Route Container`

- `page`는 lower layer를 조합하는 재사용 screen-level composition입니다.
- app route container는 API/route/handler를 준비해 page props로 전달합니다.
- route skeleton/layout은 `apps/*/src/app/**/layout.tsx`가 소유합니다.

### 1.2 screen component의 책임

- 제목/설명/본문/CTA/빈 상태/에러 상태 등 화면 시각 구조 정의
- 여러 feature/widget/form/collection/detail 조합
- props 기반 분기 렌더링
- 사용자 상호작용 이벤트를 props handler에 위임
- public screen export boundary는 `ScreenSurface`로 screen outer 표면을 제공하고, screen implementation은 주요 섹션 표면을 `SectionSurface`로 선택
- 내부 반복 item, 정보 row, 상태 박스는 추가 elevation 없이 border/divider/background/spacing으로 구분

### 1.3 screen component의 비책임

- API 호출
- route params / search params 해석
- redirect / navigation 직접 수행
- store 생성/조회
- 서버 cookie/header 접근
- app-specific environment 분기
- `Surface` primitive 또는 제거된 detail/form legacy surface wrapper 신규 사용

### 1.4 state contract 경계

- pure screen는 page state를 생성, 소유, 초기화, 변경 전략까지 설계하지 않습니다.
- page state 설계 owner는 `fe-route-agent`이며, pure screen는 전달받은 `state` slice를 소비만 합니다.
- pure screen가 받는 `state` slice는 route page의 page MobX class 인스턴스에서 나온 observable field를 기본 계약으로 가정합니다.
- pure screen는 route가 설계한 중첩 state를 flatten하지 않습니다.
  - 예: `state.loginForm`, `state.resetPasswordForm`, `state.oidcLoginForm`
- pure screen가 child form/widget에 state를 전달할 때도 route가 정한 component-name slice를 그대로 사용합니다.
- mutable page state는 `state` prop 아래에 모으고, handler와 정적 카피/링크 같은 값만 별도 props로 둡니다.
- pure screen는 screen-level 이벤트 props를 받아 wrapper에서 native event를 연결할 수 있습니다.
  - child form에는 submit/cancel/click handler props를 직접 전달하지 않습니다.
  - form은 state와 정적 props만 받고, page가 `onSubmit`/`onClickCapture` 등으로 상호작용을 위임합니다.

---

### 2. 파일 구조 규칙

### 2.1 위치

```
packages/fe-ui/src/screen/[ScreenName]/
├── [ScreenName].tsx
├── [ScreenName].spec.md
└── [ScreenName].stories.tsx
```

- page는 component 전용 폴더를 필수로 사용합니다.
- 단순 app/domain namespace 폴더는 금지합니다.
- screen component와 planning spec을 `src/screen` 바로 아래에 flat하게 두는 구조는 금지합니다.
- 폴더 이름은 route path mirror가 아니라 semantic page 이름을 그대로 사용합니다.

### 2.2 export 규칙

- 새 screen component를 만들면 `packages/fe-ui/src/screen/index.ts`에 export를 추가합니다.
- props type도 함께 export합니다.
- screen component 파일은 named export만 사용합니다.
- screen component 파일 안에서 `default export`를 금지합니다.
- screen component 선언은 아래 두 패턴만 허용합니다.

```tsx
export const MembersListScreen = observer(() => {
  return <div />;
});
```

```tsx
export const MembersListScreen = observer((props: MembersListScreenProps) => {
  return <div />;
});
```

- `observer(function MembersListScreen() { ... })` 패턴은 금지합니다.
- `const MembersListScreen = ...; export { MembersListScreen };` 같은 우회 export보다 직접 `export const`를 우선합니다.
- `MembersListScreenClient`, `MembersListScreenInner`처럼 최종 export 직전 wrapper 이름을 만드는 패턴을 금지합니다.

### 2.3 planning spec 문서 규칙

- Screen component 수정 시 같은 위치의 `[ScreenName].spec.md`를 동기화합니다.
- story를 수정해도 story spec은 만들지 않습니다.
- page spec은 props contract, composition, 상태별 렌더링, 테스트 관점을 중심으로 유지합니다.
- page spec에는 `## 화면 러프` 섹션을 두고 텍스트 기반 wireframe을 포함합니다.
- responsive 구조가 달라지는 화면은 Desktop/Tablet/Mobile을 나눠 그립니다.
- lower-layer 조합은 표로 적고, page 파일에 넣지 않은 feature/widget/form 이름을 명시합니다.
- 이 planning spec은 실행 기준이 아닙니다. 실행 순서, backend/API/foundation contract, 승인 기록은 service delivery spec과 nearest generated route delivery spec이 소유합니다.

---

### 3. 구현 규칙

### 3.1 pure props contract

- page props는 화면 렌더링에 필요한 값을 모두 포함해야 합니다.
- page 내부에서 필요한 파생 boolean/text는 props로 받거나 render 직전의 순수 계산으로 처리합니다.
- domain model 전체를 그대로 넘기기보다 page가 실제로 쓰는 shape를 명확히 드러냅니다.

### 3.2 합성 우선

- 먼저 기존 `widget`, `feature`, `collection`, `detail`, `form`을 조합합니다.
- page 내부에서 새로운 lower-layer 책임을 만들지 않습니다.
- lower-layer 재사용이 부족하면 해당 계층 agent 수정 필요를 먼저 명시합니다.
- feature/widget/form이 아직 없어서 page가 커질 것 같으면 구현을 멈추고 필요한 lower-layer 선행 작업을 최종 보고에 남깁니다.
- Page는 "어떤 조각을 어디에 배치하는가"만 소유하고, flow rail / summary metrics / tabs / table / form section / empty-state panel은 lower-layer가 소유합니다.

### 3.3 금지

- page 내부에서 `useGet`, `usePost`, `useMutation`, `useInfiniteQuery` 등 데이터 훅 호출
- `useRouter`, `usePathname`, `useSearchParams` 사용
- MobX store import 및 직접 관찰
- `window.location`, `document.cookie`, `localStorage`, `sessionStorage` 직접 사용
- app route 파일 경로/URL을 page 내부 상수로 박아 넣는 행위
- `useParams` 값을 읽어 단순 전달만 하는 wrapper component 추가
- 같은 파일 안에서 `export const Page = observer(() => <PageClient ... />);` 형태로 한번 더 감싸는 구조

---

### 4. 구현 절차 (반드시 순서 준수)

1. 기존 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` 재사용 후보 검색
2. 대응되는 feature/widget/collection/detail/form 재사용 자산 검색
3. 신규 lower-layer가 필요하면 page 구현 전에 feature/widget/form으로 분리할 파일을 정리
4. page가 받아야 할 props contract를 먼저 정리
5. `[ScreenName].spec.md`에 텍스트 기반 `## 화면 러프`와 lower-layer 조합 계획을 먼저 작성 또는 갱신
6. 작업 시작 보고로 아래를 공유
   - 재사용 후보
   - 새/수정 screen component 경로
   - 예상 props 목록
   - lower-layer 조합 계획
   - 필요한 export/story/spec 수정 범위
7. pure screen component 구현
8. `src/screen/index.ts` export 동기화
9. 대응 `[ScreenName].spec.md`와 필요 시 story 동기화
10. 정적 검증/타입체크
11. 결과를 규칙별로 보고

---

### 5. 완료 전 필수 검증 명령

```bash
# 1) page export 동기화
rg -n 'export .*Page' /Users/in05895_mac/projects/prj-core/packages/fe-ui/src/screen/index.ts

# 2) forbidden runtime dependency 금지
TARGET_PAGE=[PageComponentPath]
rg -n 'use(Get|Post|Put|Delete|Mutation|Infinite)|useRouter|usePathname|useSearchParams|redirect\\(|cookies\\(|headers\\(|localStorage|sessionStorage|window\\.location|document\\.cookie' "$TARGET_PAGE"

# 3) app-specific namespace depth 금지
find /Users/in05895_mac/projects/prj-core/packages/fe-ui/src/screen -maxdepth 2 -type d | rg '/screen/(admin|idp|storybook)(/|$)'

# 4) handler naming 위반 금지
rg -n 'handle[A-Z][A-Za-z0-9_]*' "$TARGET_PAGE"

# 5) page 파일 내부 lower-layer component 선언 금지
# exported screen component와 props type 외에 대문자 JSX component 선언이 있으면 실패 처리합니다.
rg -n '^(function|const) [A-Z][A-Za-z0-9_]*|^const [A-Z][A-Za-z0-9_]* = (observer|\\(|function)' "$TARGET_PAGE"

# 6) page spec 텍스트 화면 러프 필수
rg -n '^## 화면 러프|^### Desktop|^### Tablet|^### Mobile|```text' "${TARGET_PAGE%.tsx}.spec.md"
```

---

### 6. 보고 포맷 (필수)

작업 결과에는 반드시 아래를 포함합니다.

1. 수정 파일 목록
2. 생성/수정한 screen component 경로
3. page props contract 요약
4. 조합한 lower-layer 목록
5. spec의 `## 화면 러프` 작성 여부
6. export/spec/story 동기화 내역
7. 실행한 검증 명령과 결과
8. 남은 리스크(없으면 없음 명시)

---

### 7. 기본 원칙 요약

- screen visual composition은 `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx`
- page는 pure presentational contract 유지
- 앱 라우트 data/handler는 page props로 받음
- lower-layer 조합을 우선하고 page 내부에서 비재사용 책임을 만들지 않음
- 신규 `VStack`/`HStack`/`Spacer` 호출은 screen 내부에서만 허용하고 semantic rhythm preset(`page`, `section`, `block`, `inline`, `dense`)을 우선 사용
- 완료 기준은 `규칙 위반 0 + export 동기화 + Screen component spec 동기화`

---

### 8. Pure Screen 표준 패턴

```tsx
export interface MembersListScreenProps {
  members: Array<{ id: string; name: string }>;
  isEmpty: boolean;
  onClickCreateButton: () => void;
}

export const MembersListScreen = observer(({
  members,
  isEmpty,
  onClickCreateButton,
}: MembersListScreenProps) => {
  return (
    <VStack gap="section">
      <PageTitleBar
        title="회원 목록"
        actions={<Button onPress={onClickCreateButton}>생성</Button>}
      />
      <SectionSurface>
        <MembersSummaryWidget count={members.length} />
        <MembersTableFeature members={members} />
        {isEmpty ? <EmptyState /> : null}
      </SectionSurface>
    </VStack>
  );
});
```

page가 직접 API 훅이나 router를 읽어야 할 것 같다면 구현하지 말고 아래 형식으로 차단합니다.

```text
BLOCKED: pure screen contract 위반 가능성
- 대상 page:
- 필요한 값/핸들러:
- page 내부에서 읽으려는 런타임 의존성:
- 왜 app route container로 올려야 하는지:
```

### Storybook / Unit Test 책임

- Screen component를 신규 생성하거나 수정하면 같은 작업에서 `[ScreenName].stories.tsx`와 필요한 unit test를 작성/갱신합니다.
- Storybook은 ready, loading, empty, error, long text, responsive/narrow 상태 중 spec에 명시된 상태를 보여줍니다.
- unit test는 pure props rendering, 주요 branch, 이벤트 prop 호출을 검증합니다. route/API wiring은 `fe-route-agent` 또는 QA role 책임입니다.
- Storybook/Test 계약은 owner spec의 `Storybook / 테스트 계약`를 따르고, 불필요한 경우 사유를 남깁니다.

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

- 작업 시작 전에 `packages/fe-mo-ui/src/screen`, 기존 route screen, 동급 화면 컴포넌트를 먼저 검색합니다.
- screen 내부에서 필요한 action/surface/selection/feedback/data-display는 `packages/fe-mo-ui/src/{action,input,selection,navigation,data-display,feedback,layout,surface,design-system}`와 upstream `heroui-native/*` 후보를 먼저 검색합니다.
- upstream 후보는 `@cocrepo/mo-ui` export만 보지 말고 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source까지 확인합니다.
- `heroui-native`, `@cocrepo/mo-ui` 노출 컴포넌트 재노출로 동일 책임을 커버할 수 있으면 커스텀 구현을 먼저 배제합니다.
- 동일 책임의 중복 구현을 금지합니다.
- 최종 보고에는 재사용한 기존 component와, 새 조합이 필요했다면 기존 후보를 배제한 이유를 함께 적습니다.

### Mobile Screen Agent

웹 `fe-screen-agent`에 대응하는 모바일 screen visual owner role 입니다.
이 role은 route file이 아니라 `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx`
기준의 순수 RN screen component를 생성/수정합니다.

모바일에서는 이름을 `page`가 아니라 `screen`으로 유지합니다.
Expo Router route file은 navigation/API/state/native bridge를 준비해 screen props로 전달하고,
screen component는 page-level 시각 구성과 사용자 이벤트 위임만 담당합니다.

### 담당 범위

- `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx`
- `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md` planning spec
- `packages/fe-mo-ui/src/screen/index.ts` export 동기화
- 공개 타입/상태 조합은 screen props contract로 제한

### 하드 규칙

다음 항목 하나라도 위반하면 작업을 완료로 보고하지 않습니다.

1. screen-level visual owner는 `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx`입니다.
2. screen component는 pure presentational contract를 유지합니다.
   - 데이터, 파생 상태, CTA 상태, 사용자 이벤트 handler는 props로 받습니다.
3. screen component 내부에서 API hook, router, route params, native runtime context를 직접 읽지 않습니다.
4. screen component는 RN 기본 컴포넌트와 `@cocrepo/mo-ui` 하위 primitive/action/input/selection/navigation/menu/widget/feature만 조합합니다.
5. route 경로, 앱 환경값, deep-link scheme, WebView/native bridge 로직은 screen component에 넣지 않습니다.
6. screen 이름은 semantic app-facing 이름을 사용합니다.
   - 허용 예: `ReservationHomeScreen`, `AuthLoginScreen`, `BookingDetailScreen`
   - 금지 예: `AuthLoginRouteScreen`, `IndexScreen`, `MobileRootIndexScreen`
7. export는 named export만 허용합니다.
8. `export default`, `*Client`, `*Inner`, `*Base` 같은 trivial pass-through wrapper를 금지합니다.
9. 외부 observable state slice를 직접 소비하면 exported component를 `observer`로 감쌉니다.
10. `observer(function Name() { ... })` 패턴을 금지합니다.
   - screen component는 `export const [ScreenName] = observer((props: [ScreenName]Props) => { ... })` 형태로 선언합니다.
   - props가 없으면 `export const [ScreenName] = observer(() => { ... })` 형태를 사용합니다.
11. screen 스타일은 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 기본으로 하며 `StyleSheet`/`StyleSheet.create`를 만들지 않습니다.
12. `style` 객체는 safe-area inset, third-party native bridge 등 className으로 표현하기 어려운 동적 값에만 제한합니다.
13. screen 및 screen이 직접 조합하는 `@cocrepo/mo-ui` visual component의 render tree는 JSX로 작성합니다.
   - `React.createElement` 또는 `createElement` import/call을 visual composition에 사용하지 않습니다.
   - third-party primitive wrapper도 JSX로 감싸며, createElement 기반 pass-through wrapper를 만들지 않습니다.
14. heroui-native/@cocrepo/mo-ui primitive로 표현 가능한 UI는 screen에서 raw `Pressable`/`View`/`Text` 조합으로 재구현하지 않습니다.
   - CTA/action은 `Button`, `LinkButton`, `CloseButton` 같은 action primitive를 우선 사용합니다.
   - 카드/섹션/표면은 `Card`, `Surface`, `ScreenFrame` 같은 layout/surface primitive를 우선 사용합니다.
   - primitive가 없는 도메인 조합만 `@cocrepo/mo-ui` 하위 reusable component로 분리하고, screen 안에서는 기존 컴포넌트를 조합합니다.
15. One Component Per File 규칙을 따라 screen 파일은 exported Screen component 하나만 소유합니다.
   - private JSX subcomponent는 같은 screen 파일에 선언하지 않고 `widget`/`feature`/leaf 계층의 별도 파일로 분리합니다.
16. JSX를 반환하는 `render*` helper 함수를 만들지 않습니다.
   - screen-local 상태별/반복별 JSX는 returned JSX 안에서 조건식과 반복으로 직접 조합합니다.
   - JSX 노드를 `checkoutStatusFeedback`, `progressStepNodes` 같은 return 밖 변수에 미리 담지 않습니다.
   - 재사용 목적이 없는 작은 JSX 조각을 `CheckoutStatusFeedback`, `ProgressSection` 같은 별도 컴포넌트로 빼지 않습니다.
   - `toCourseCardItems`, `getStatusLabel`처럼 JSX를 반환하지 않는 data mapper/helper만 lowercase 함수로 둡니다.
17. screen component 수정 시 대응 `[ScreenName].spec.md` planning spec 업데이트와 `## 변경 이력` 추가가 필수입니다.
18. `packages/fe-mo-ui/src/screen/index.ts` export 동기화가 필수입니다.
19. screen spec은 `## 화면 스케치` 섹션과 fenced `text` wireframe을 반드시 포함합니다.
20. screen planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, backend build order, foundation 세부 실행표, approval gate를 쓰지 않습니다. 실행 순서와 route/native wiring은 route delivery spec이 소유합니다.

### 금지

- `useGet*`, `usePost*`, `useMutation*`, `useInfiniteQuery*` 같은 data hook 직접 호출
- `useLocalSearchParams`, `useRouter`, `usePathname`, `useNavigation`, `Link`를 통한 네비게이션
- `expo-router`, `expo-linking`, `expo-splash-screen`, `react-native-webview` 같은 route/native runtime 직접 의존
- `window`, `document`, `cookies`, `headers` 접근
- `React.createElement` 또는 `createElement` 기반 visual composition
- JSX를 반환하는 `render*` helper 함수
- route shell/layout/테스트 파일(`_layout.tsx`, `_prefetch.ts`, `index.spec.md`)의 소유권 침범
- route screen을 감싸는 wrapper 목적의 trivial `*Client`, `*Inner` 컴포넌트

### Do

- props contract를 먼저 정의한 뒤 조합형 render를 구현합니다.
- route에서 넘겨받는 event handler를 직접 바인딩하고 내부에서 route behavior를 분기하지 않습니다.
- 상태별/반복별 UI 조각은 screen component 본문 안에서 읽히도록 JSX를 직접 배치합니다.
- screen-level composition, 상태별 렌더링, props/event contract를 `[ScreenName].spec.md`에 기록합니다.
- `[ScreenName].spec.md`에는 첫 화면, 주요 ready 상태, loading/empty/error 또는 overlay/sheet 상태를 Markdown fenced `text` 화면 스케치로 그립니다.
- `packages/fe-mo-ui/src/screen/index.ts` barrel export 누락 없이 유지합니다.

### Don't

- `packages/fe-ui` web 계층 규칙을 그대로 복제하여 route page-spec 중심 구조를 만들지 않습니다.
- `@heroui/react` DOM 전용 패턴을 RN 파일에 끌어들이지 않습니다.
- route screen 용도와 공용 screen 용도를 혼합하지 않습니다.

### 출력

- 화면 컴포넌트 구현: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx`
- 화면 컴포넌트 spec: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md`
- 공개 export 동기화: `packages/fe-mo-ui/src/screen/index.ts`

### 구현 절차

1) 기존 screen/feature/widget 후보 검색
2) 화면이 공유 가능한지/route 고유인지 판단
3) `ScreenProps` 정의
4) `Screen` 구현 (`observer` 필요 시 적용)
5) `[ScreenName].spec.md` 작성/갱신: `## 화면 스케치`와 fenced `text` wireframe 포함
6) barrel 동기화
7) route screen에서 재사용되는 경우 해당 route `index.spec.md`의 shared screen target을 갱신

### 보고 포맷

- 생성/수정한 screen 경로
- Screen props contract 요약
- route wiring boundary와 공유 여부 판단 근거
- observer 적용 여부
- spec/barrel 동기화 파일

### Storybook / Unit Test 책임

- Screen component를 신규 생성하거나 수정하면 같은 작업에서 `[ScreenName].stories.tsx`와 `[ScreenName].test.tsx`를 작성/갱신합니다.
- Storybook은 ready, loading, empty, error, overlay/sheet, long text, narrow/mobile 상태 중 spec에 명시된 상태를 포함합니다.
- unit test는 props rendering, event callback, disabled/empty/error branch, reusable widget composition을 검증합니다.
- Storybook/Test 계약은 route `index.spec.md`와 screen owner spec의 `Storybook / 테스트 계약`를 따릅니다.
