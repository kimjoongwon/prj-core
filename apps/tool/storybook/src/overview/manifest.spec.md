# manifest.ts Spec

## 목적
- Storybook 안에서 `packages/fe-ui/src/page` 기준 page catalog와 flow lane 데이터를 정적으로 생성합니다.
- admin/idp route page와 pure page story를 연결하는 Storybook-local source of truth를 제공합니다.
- page story별 planning sidecar spec를 찾아 우측 패널과 overview detail이 재사용할 수 있는 index를 제공합니다.

## 핵심 동작
- Storybook/Vitest가 주입하는 `__STORYBOOK_OVERVIEW_MANIFEST_SOURCES__` define에서 `packages/fe-ui/src/page/*/*.stories.tsx`, pure page `*.spec.md`, admin/idp route `page.tsx`, admin/idp route `page.spec.md` raw source map을 읽습니다.
- page story는 folder 이름을 기준으로 component name, `page/[ComponentName]` title, canonical `Default` story id와 모든 export story id, autodocs `Docs` story id 목록을 계산합니다.
- story source에 `PageStoryScaffold`가 포함되면 `scaffold`, 아니면 `scenario`로 판정합니다.
- route page source는 `@cocrepo/ui` import/export 패턴만 파싱해 연결된 pure page component를 찾습니다.
- admin route는 `ADMIN_PAGE_ACCESS_ITEMS`와 `ADMIN_NAV_ITEMS`를 사용해 lane label, page label, CRUD kind를 유도합니다.
- idp route는 `IDP_NAV_ITEMS`와 path 규칙으로 lane label, page label, page kind를 유도합니다.
- route에 연결되지 않은 page component는 standalone entry로 남깁니다.
- flow edge는 `new/detail/edit` 규칙과 최장 prefix ancestor를 사용해 lane 내부 관계를 자동 생성하고, `flow-overrides.ts`의 수동 edge를 병합합니다.
- planning markdown은 heading 단위 section과 metadata/preamble로 분해되어 summary panel과 raw panel에서 모두 재사용됩니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `buildOverviewManifest()` | 실제 repo 소스에서 overview manifest를 조립합니다. |
| `OverviewManifestSourceMaps` | overview manifest에 필요한 raw source map six-pack 타입입니다. |
| `createOverviewManifest()` | 테스트/확장용 순수 조합 함수입니다. |
| `normalizeAppRoutePath()` | route group을 제거한 앱 경로를 계산합니다. |
| `extractPageComponentNames()` | `@cocrepo/ui` import/export에서 page component 이름을 추출합니다. |
| `getStoryMaturity()` | scaffold/scenario 여부를 판정합니다. |
| `createStoryId()` | `Default` story deep-link용 story id를 계산합니다. |
| `findCatalogEntryForStory()` | 현재 story id가 어떤 page entry를 가리키는지 찾습니다. |
| `getPlanningDocument()` | planning document id를 실제 markdown document로 해석합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | browser 번들에서 `import.meta.glob`를 제거하고 Storybook/Vitest define source map을 소비하도록 변경 | codex |
| 2026-04-15 | autodocs 진입에서도 planning panel이 보이도록 page `Docs` story id 매핑 규칙 추가 | codex |
| 2026-04-15 | page story planning panel을 위해 pure/route spec index와 manual flow override 병합 계약 추가 | codex |
| 2026-04-08 | Storybook page overview를 위한 page catalog/flow manifest 생성기 신규 추가 | codex |
