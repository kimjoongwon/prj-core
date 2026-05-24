# `fe-ui` 분류 감사 리포트

기준일: 2026-03-25  
대상: `packages/fe-ui/src/**`, `.codex/agents/fe-*.toml`, `.codex/agents/orch-stage.toml`

## 요약

- 재사용 page-role 축은 `packages/fe-ui/src/collection`, `packages/fe-ui/src/detail`, `packages/fe-ui/src/form`으로 정리되며 `feature`와 같은 위계를 가집니다.
- `feature`는 비즈니스 기능 컴포넌트만 유지합니다. `collection/detail/form` 전용 자산은 `feature/*` 하위에 두지 않습니다.
- 루트 공개 배럴 `packages/fe-ui/src/index.ts`는 `control`, `detail`, `display`, `feature`, `form`, `layout`, `collection`, `page`, `surface`, `widget`을 직접 공개합니다.
- `src` 바로 아래 공개 축만 그룹 폴더로 허용하고, 그 아래의 단순 묶음용 중간 depth는 신규 추가를 금지합니다.
- Stage 5 전용 builder 소유는 `fe-data-grid-builder`, `fe-form-builder` 중심으로 두고, collection list/grid 및 detail/view 성격의 순수 UI 조합은 `fe-widget-builder` 기준으로 관리합니다.
- `src/screen`는 route mirror 레이어가 아니라 semantic app-facing screen asset 레이어로 운영합니다.

## 현재 공개 축

| 축 | 공개 경로 | 용도 |
| --- | --- | --- |
| `feature` | `packages/fe-ui/src/feature` | 비즈니스 로직, 상태, 라우터 이동이 포함된 기능 컴포넌트 |
| `collection` | `packages/fe-ui/src/collection` | 테이블/그리드 중심 재사용 계층 |
| `detail` | `packages/fe-ui/src/detail` | 읽기 전용 상세 본문 재사용 계층 |
| `form` | `packages/fe-ui/src/form` | 생성/수정/입력 중심 재사용 계층 |
| `surface` | `packages/fe-ui/src/surface` | `collection/detail/form`이 공통으로 쓰는 시각 wrapper |
| 나머지 공통 축 | `control`, `display`, `layout`, `page`, `widget` | 기존 공통 UI 계층 |

## page role 매핑

| page role | reusable target | 실제 경로 | 전담 agent |
| --- | --- | --- | --- |
| `collection` | `data-grid` | `packages/fe-ui/src/data-grid` | `fe-data-grid-builder` |
| `collection` | `collection/grid` | `packages/fe-ui/src/collection/grid` | `fe-widget-builder` |
| `detail` | `detail/view` | `packages/fe-ui/src/detail/view` | `fe-widget-builder` |
| `form` | `form` | `packages/fe-ui/src/form` | `fe-form-builder` |

## 이번 정리 결과

| 이전 경로 | 현재 경로 |
| --- | --- |
| `src/feature/form/**` | `src/form/**` |
| `src/feature/table/**` | `src/data-grid/**` |
| `src/feature/grid/**` | `src/collection/grid/**` |
| `src/feature/view/**` | `src/detail/view/**` |
| `src/widget/**` 또는 도메인 하위 form 계열 | `src/form/**` |

## 운영 규칙

- `DataGrid` 기반 목록 화면은 기본적으로 `data-grid`을 사용합니다.
- 읽기 전용 상세 본문은 `detail/view`을 사용합니다.
- `detail`은 `feature` 하위가 아니라 `collection`, `form`과 같은 app-facing 재사용 축으로 둡니다. 다만 단순히 `Page`, `Section`, `Surface`를 이름만 바꾸는 thin alias에 머문다면 장기적으로는 `layout`/`surface` 직접 사용으로 접고 `detail` 축을 제거합니다.
- 생성/등록/수정/입력 중심 화면은 `form`을 사용합니다.
- `AiForm`은 보조 `feature`로 유지할 수 있지만 실제 폼 본문 소유는 `form`입니다.
- `collection/detail/form`이 복수의 시각 블록을 묶을 때는 별도 thin wrapper보다 `packages/fe-ui/src/surface/Surface`를 우선 검토합니다.
- `src/screen` 이름은 route segment 직렬화 대신 semantic 이름을 우선합니다.
  - 기본 CRUD 어휘: `ListPage`, `DetailPage`, `CreatePage`, `EditPage`
  - shared create/edit pure screen는 `FormPage`
  - task flow는 `SelectPage`, `VerifyPage`, `InteractionPage` 같은 task 이름 유지
  - 충돌 시 가장 작은 domain qualifier만 추가

## 폴더 평탄화 규칙

- 허용되는 그룹 폴더는 `src` 바로 아래 공개 축뿐입니다.
- 공개 축 아래에는 실제 컴포넌트/엔트리만 두고, `idp`, `user`, `message-template`, `ability`, `feedback`, `common` 같은 단순 묶음 폴더를 추가하지 않습니다.
- 금지 예: `src/feature/idp/IdpLogin`, `src/feature/user/UserList`
- 목표 경로 예: `src/feature/IdpLogin`, `src/feature/UserList`
- 현재 존재하는 중간 묶음 폴더는 신규 허용이 아니라 마이그레이션 부채입니다.

## 참고 문서

- [src/index.spec.md](./src/index.spec.md)
- [src/feature/index.spec.md](./src/feature/index.spec.md)
- [src/collection/index.spec.md](./src/collection/index.spec.md)
- [src/detail/index.spec.md](./src/detail/index.spec.md)
- [src/form/index.spec.md](./src/form/index.spec.md)
- [fe-data-grid-builder.toml](../../.codex/agents/fe-data-grid-builder.toml)
- [fe-widget-builder.toml](../../.codex/agents/fe-widget-builder.toml)
- [fe-form-builder.toml](../../.codex/agents/fe-form-builder.toml)
- [orch-stage.toml](../../.codex/agents/orch-stage.toml)
