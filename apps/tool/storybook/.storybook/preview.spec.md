# preview.jsx Spec

## 목적
- Storybook Preview 전역 데코레이터와 파라미터를 정의합니다.
- 기본 배경/정렬 규칙과 공통 Provider를 제공합니다.

## 핵심 동작
- 모든 스토리에 Storybook-local runtime provider를 적용해 `QueryClient`, `NuqsAdapter`, `RootStoreContext`, `DesignSystemProvider`를 제공합니다.
- 기본 배경을 `plate-dark`로 설정하고 Plate 색상 팔레트를 제공합니다.
- 스토리 정렬 시 루트 카테고리 순서를 실제 컴포넌트 폴더 축(`Features > Inputs > Layouts > Page > Ui > Widget > Widgets`)에 가깝게 맞춥니다.
- 레거시 루트(`inputs`, `Layout`, `UI`, `ui`, `Cell`, `Form`)는 대응 카테고리 옆에 인접 배치합니다.
- 자동 생성 스토리(`Auto`)는 수동 큐레이션 스토리 뒤로 배치해 사이드바 노이즈를 줄입니다.
- `overview` 루트는 Page Catalog/Flow Map 같은 Storybook 전용 탐색 진입면을 최상단에 배치합니다.
- 전역 `parameters.nextjs.appDirectory = true`를 적용해 `next/navigation` 기반 App Router 훅(`useParams`, `useRouter`, `useSearchParams`)을 모든 스토리에서 사용할 수 있게 합니다.
- 스토리 정렬 루트는 `packages/fe-ui/src` 실제 디렉토리 축(`cell`, `control`, `display`, `feature`, `form`, `layout`, `master`, `page`, `rhythm`, `surface`, `widget`)과 맞춥니다.
- runtime resolver의 기본 realm은 `none`이며, preview 기본 `parameters.storybookRuntime`는 `requiresSpace: false`만 시드합니다.
- 인증형 스토리는 개별 story parameter로 `admin` 또는 `idp` realm을 켭니다.
- preview toolbar의 `storybookRealm` global은 story parameter에 `realm`이 없는 스토리에서만 `auto | admin | idp | none` 런타임을 임시 오버라이드합니다.
- 로컬 dev auth 모드에서는 preview bootstrap이 세션 만료를 감지하면 top-level Storybook 전체를 `/__storybook_auth/login`으로 돌려보냅니다.
- `buildOverviewManifest()` 결과를 전역 `parameters.pagePlanningManifest`로 주입해 manager addon이 `import.meta.glob` 없이 현재 story planning 문서를 읽을 수 있게 합니다.
- `page/*` Canvas story는 preview decorator가 우하단 floating `PagePlanningDock` launcher를 붙이고, 필요할 때 planning을 전체 화면 overlay로 펼칠 수 있게 합니다.
- `pagePlanning.codex.enabled = false`를 지정한 story는 canvas dock에서 Codex 수정 액션을 숨깁니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | page canvas planning을 하단 shelf 대신 우하단 floating launcher와 전체 화면 overlay로 전환 | codex |
| 2026-04-15 | story parameter로 page canvas planning dock의 Codex bridge 액션을 opt-out할 수 있도록 조정 | codex |
| 2026-04-15 | inline planning을 하단 shelf 방식으로 바꿔 좌우 이동 없이 카드 단위 문서 탐색이 가능하도록 조정 | codex |
| 2026-04-15 | page canvas planning dock를 floating compact summary 방식으로 바꿔 fullscreen 페이지 폭을 보존하도록 조정 | codex |
| 2026-04-15 | `page/*` Canvas story에 inline planning dock decorator를 추가해 기본 story에서 기획을 바로 노출하도록 확장 | codex |
| 2026-04-15 | page planning manager addon이 사용할 전역 `pagePlanningManifest` parameter를 preview에서 시드하도록 확장 | codex |
| 2026-04-14 | preview toolbar에 `storybookRealm` global을 복원해 parameter-less story에서도 admin/idp runtime을 전환할 수 있도록 갱신 | codex |
| 2026-04-08 | `overview` 루트를 최상단에 배치해 page catalog/flow overview story를 우선 노출하도록 정렬 규칙 갱신 | codex |
| 2026-03-27 | `cell`이 `src` 루트 축으로 올라간 구조에 맞춰 Storybook 루트 정렬 우선순위 갱신 | codex |
| 2026-03-27 | sidebar root 정렬 기준을 fe-ui 실제 디렉토리 축으로 동기화 | codex |
| 2026-03-27 | Next.js App Router story 지원을 위해 전역 `nextjs.appDirectory` 파라미터 계약 추가 | codex |
| 2026-03-16 | toolbar global을 제거하고 story parameter 기반 `storybookRuntime` 기본 계약으로 정리 | codex |
| 2026-03-16 | Storybook-local runtime provider, runtime globals, auth-aware preview bootstrap 계약 추가 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-05 | Plate 소유권 배지, 배경 팔레트, 스토리 정렬 규칙 추가 | codex |
| 2026-03-06 | 전역 브랜드 오버레이 제거, 설명 문구 정리 | codex |
| 2026-03-06 | 컴포넌트 폴더 구조 기준으로 스토리 정렬 우선순위 조정 | codex |
| 2026-03-06 | 레거시 루트 인접 배치와 Auto 후순위 정렬 규칙 반영 | codex |
