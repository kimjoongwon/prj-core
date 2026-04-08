# manifest.ts Spec

## 목적
- Storybook 안에서 `packages/fe-ui/src/page` 기준 page catalog와 flow lane 데이터를 정적으로 생성합니다.
- admin/idp route page와 pure page story를 연결하는 Storybook-local source of truth를 제공합니다.

## 핵심 동작
- `import.meta.glob`로 `packages/fe-ui/src/page/*/*.stories.tsx`, admin route `page.tsx`, idp route `page.tsx` 소스를 raw text로 수집합니다.
- page story는 folder 이름을 기준으로 component name, `page/[ComponentName]` title, canonical `Default` story id를 계산합니다.
- story source에 `PageStoryScaffold`가 포함되면 `scaffold`, 아니면 `scenario`로 판정합니다.
- route page source는 `@cocrepo/ui` import/export 패턴만 파싱해 연결된 pure page component를 찾습니다.
- admin route는 `ADMIN_PAGE_ACCESS_ITEMS`와 `ADMIN_NAV_ITEMS`를 사용해 lane label, page label, CRUD kind를 유도합니다.
- idp route는 `IDP_NAV_ITEMS`와 path 규칙으로 lane label, page label, page kind를 유도합니다.
- route에 연결되지 않은 page component는 standalone entry로 남깁니다.
- flow edge는 `new/detail/edit` 규칙과 최장 prefix ancestor를 사용해 lane 내부 관계를 자동 생성합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `buildOverviewManifest()` | 실제 repo 소스에서 overview manifest를 조립합니다. |
| `createOverviewManifest()` | 테스트/확장용 순수 조합 함수입니다. |
| `normalizeAppRoutePath()` | route group을 제거한 앱 경로를 계산합니다. |
| `extractPageComponentNames()` | `@cocrepo/ui` import/export에서 page component 이름을 추출합니다. |
| `getStoryMaturity()` | scaffold/scenario 여부를 판정합니다. |
| `createStoryId()` | `Default` story deep-link용 story id를 계산합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | Storybook page overview를 위한 page catalog/flow manifest 생성기 신규 추가 | codex |
