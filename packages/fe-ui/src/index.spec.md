# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/fe-ui/src/index.ts

## 역할

이 파일은 `@cocrepo/ui` 컴포넌트 공개 진입점에서 `src/*` 계층 배럴 export를 구성합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `./detail` | Detail 재사용 계층 export |
| `./feature` | Feature 계층 export |
| `./form` | Form 재사용 계층 export |
| `./control` | Control 계층 export |
| `./layout` | Layout 계층 export |
| `./master` | Master 재사용 계층 export |
| `./page` | Page 계층 export |
| `./display` | Display 계층 export |
| `./surface` | Surface 계층 export |
| `./widget` | Widget 계층 통합 export |

## 폴더 깊이 규칙

- `src` 바로 아래의 공개 축(`control`, `detail`, `design-system`, `display`, `feature`, `form`, `layout`, `master`, `page`, `style`, `surface`, `test`, `type`, `widget`, `widget-heavy`)만 그룹 폴더로 허용합니다.
- 공개 축 바로 아래에는 실제 컴포넌트/엔트리만 둡니다.
- `src/feature/idp/IdpLogin`, `src/feature/user/UserList`처럼 중간에 도메인/업무 묶음 폴더를 한 단계 더 두는 구조는 금지합니다.
- 같은 이유로 `table`, `list`, `grid`, `view`, `feedback`, `ability`, `common`처럼 단순 분류 목적의 중간 폴더도 신규 추가를 금지합니다.
- 현재 남아 있는 중간 묶음 폴더는 마이그레이션 부채로 취급하며, 새 컴포넌트는 이 규칙을 기준으로 평탄화된 경로에 추가합니다.
- `src/page`는 예외적으로 page별 동일 이름 폴더를 강제합니다. page component와 `.spec.md`/`.stories.tsx`/`.stories.spec.md`는 모두 `src/page/[PageName]/` 아래에 함께 둡니다.
- 따라서 `src/page/AddressEmailVerifyPage.tsx` 같은 flat page 파일 배치는 금지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | `src/page` 계층은 page별 동일 이름 폴더 안에 component와 sidecar를 함께 두는 규칙을 추가 | codex |
| 2026-03-25 | `src` 바로 아래 공개 축만 그룹 폴더로 허용하고 그 아래 중간 묶음 depth를 금지하는 규칙 추가 | codex |
| 2026-03-25 | `detail`, `form`, `master`를 `feature`와 같은 위계의 루트 배럴로 공개 | codex |
| 2026-03-15 | `Surface`, `PageSurface`, `SectionSurface` 공개를 위해 `./surface` 배럴 export 추가 | codex |
| 2026-03-06 | `./ui` 배럴 export를 `./display`로 변경 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-06 | `widget` 배럴 제거 후 `widgets` 단일 진입점으로 통합 | codex |
| 2026-03-06 | widget 경로를 widgets로 통합 | codex |
| 2026-03-06 | feature 배럴 경로를 features로 통합 | codex |
