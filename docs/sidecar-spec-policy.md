# Sidecar Spec Policy

## 목적

`*.spec.md`는 화면 구현 흐름을 붙잡아 두는 최소 문서에만 사용합니다.
모든 코드에 sidecar spec을 붙이면 개발 속도가 느려지고, AI가 로컬 문서를 읽을 때 실제 화면 의사결정과 무관한 spec까지 같은 중요도로 해석해 맥락이 흐려집니다.

## 허용 범위

신규 작성/갱신 대상은 아래 다섯 가지뿐입니다.

| 대상 | spec 위치 | 목적 |
|------|-----------|------|
| Next.js route page | `apps/*/web/src/app/**/page.spec.md` | route `page.tsx`의 데이터 조회, 라우팅, 이벤트 wiring, pure page 연결 계약 |
| Expo Router native route owner | `apps/mobile/src/app/**/index.spec.md` | mobile route layout/API/state/test/native wiring과 shared screen 연결 계약 |
| fe-ui Page component | `packages/fe-ui/src/page/[PageName]/[PageName].spec.md` | page-level visual composition, props contract, 하위 Feature/Widget 조합 |
| fe-ui Feature component | `packages/fe-ui/src/feature/**/[FeatureName].spec.md` 또는 component owner가 `index.tsx`인 경우 `index.spec.md` | Store/API/router가 연결되는 Feature의 책임, 상태, 이벤트 계약 |
| fe-mo-ui Screen component | `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md` | 모바일 screen-level visual composition, props contract, route wiring boundary |

허용 대상의 source 파일은 기본적으로 `.tsx`입니다. Next.js route page는 반드시 파일명이 `page.tsx`여야 합니다. 모바일 route owner spec은 Expo Router route 묶음의 owner 문서이며, shared visual screen source는 `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx`입니다.

## 금지 범위

- 위 허용 범위 밖의 모든 코드 파일
- `layout.spec.md`, `_client.spec.md`, `_prefetch.spec.md`
- `*.stories.spec.md`, `*.test.spec.md`, `*.e2e.spec.md`
- `index.spec.md`가 barrel, namespace, 디렉터리 설명을 가리키는 경우
- `type.spec.md`, `types.spec.md`, `use*.spec.md`, hook/util/lib/store/dto/service/repository/controller/entity/vo spec
- `packages/fe-mo-ui/src/action|input|selection|navigation|data-display|feedback|layout|surface|design-system` leaf spec
- `package.spec.md`, `tsconfig.spec.md`, `app.spec.md`
- `*.toml.spec.md`, `*.json.spec.md`, `*.css.spec.md`, `*.html.spec.md`
- `*.toml.guide.md`
- `*.prisma.spec.md`, `packages/be-prisma/**/*.spec.md`
- `Dockerfile.*.spec.md`, `Jenkinsfile.*.spec.md`
- 템플릿, agent 설정, 운영 메모처럼 코드와 1:1 대응하지 않는 문서

## 권장 대체 이름

| 문서 성격 | 기존 예시 | 권장 이름 |
|------|------|------|
| 앱/도메인 컨텍스트 | `app.spec.md` | `app.context.md` |
| 디렉터리/모듈 개요 | `index.spec.md` | `README.md`, `*.guide.md` |
| 설정 설명 | `package.spec.md`, `vitest.config.spec.md` | `package.guide.md`, `vitest.config.guide.md` |
| 배포/운영 설명 | `Dockerfile.*.spec.md`, `Jenkinsfile.*.spec.md` | `*.ops.md` |
| agent / tool 규칙 | `*.toml.spec.md`, `*.toml.guide.md` | 해당 `*.toml`의 `developer_instructions`, `README.md` |
| 템플릿 문서 | `page.spec.md` template 파일 | `page.template.md` |
| 테스트 의도 | `*.test.spec.md`, `*.e2e.spec.md` | 테스트 코드 주석, `*.test-notes.md` |

## 운영 원칙

- `*.spec.md`를 새로 만들기 전에 허용 범위에 속하는지 먼저 확인합니다.
- 허용 범위 밖의 source code를 수정해도 spec을 생성하거나 갱신하지 않습니다.
- 허용 대상 source file이 삭제되면 sidecar도 같이 삭제하거나 일반 문서 이름으로 바꿉니다.
- source file이 아닌 설명 문서는 `context`, `guide`, `ops`, `notes`, `template` suffix 중 하나를 사용합니다.
- 단, TOML 설정/agent role 파일은 보조 sidecar 문서를 두지 않고 해당 `.toml` 또는 인덱스 `README.md`에 직접 설명을 둡니다.
- `scripts/spec-audit.js`는 허용 범위 밖의 `*.spec.md`를 orphan으로 보고합니다.
- 기존 legacy spec은 즉시 동기화 대상이 아니며, 별도 정리 작업에서 삭제하거나 일반 문서로 이관합니다.

## 권장 spec 내용

### Next.js route `page.spec.md`

- 화면 목적과 사용자 시나리오
- route path, `page.tsx` path, 연결할 `packages/fe-ui/src/page/[PageName]/[PageName].tsx`
- `page role`: `collection`, `detail`, `form` 중 하나
- `reusable target`: `data-grid`, `collection/list`, `collection/grid`, `detail/view`, `form`
- Orval hook/API, search params, route params, redirect/navigation 책임
- loading/error/empty 상태 전달 방식
- `on[Event][UI]` 이벤트 handler와 이동/ mutation 결과
- E2E에서 검증할 핵심 흐름

### fe-ui Page component spec

- page-level visual composition 책임
- props contract와 이벤트 props
- 조합하는 Feature/Widget/Form/Collection/Detail 목록
- loading/error/empty/disabled 상태별 렌더링
- Surface owner와 elevation 경계
- 접근성, 반응형, 테스트 관점

### fe-ui Feature component spec

- Feature가 연결하는 Store/API/router 책임
- props contract, observable state, mutation/refetch 흐름
- Widget/UI에 주입하는 값과 이벤트
- 실패/권한/disabled/loading 상태
- 이 Feature를 소비하는 Page 목록

### Expo Router native route `index.spec.md`

- route path, route file, layout shell, shared screen 연결 계약
- Expo Router params, navigation, API/state/native bridge owner 경계
- `screen component target`과 route가 주입할 `screen props contract`
- loading/error/empty 상태 전달 방식
- unit/E2E에서 검증할 핵심 흐름

### fe-mo-ui Screen component spec

- 모바일 screen-level visual composition 책임
- props contract와 event handler props
- 조합하는 `@cocrepo/mo-ui` primitive/action/input/selection/navigation/menu 목록
- 상태별 렌더링과 route/native wiring boundary
- React Native 접근성, 테스트 관점

## 마이그레이션 순서

1. `spec:audit:list`로 허용 범위 밖 legacy spec 목록을 확인합니다.
2. 의미 있는 운영/설정 문서는 `*.guide.md`, `*.ops.md`, `*.notes.md`, `README.md`로 이관합니다.
3. 자동 생성 흔적만 있는 legacy spec은 삭제합니다.
4. route page, mobile route, fe-ui Page, fe-ui Feature, fe-mo-ui Screen spec은 새 포맷에 맞춰 실제 화면 계약 중심으로 정리합니다.
5. 마지막으로 `spec:audit`를 돌려 orphan 목록이 남지 않는지 확인합니다.
