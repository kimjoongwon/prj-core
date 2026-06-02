# Detailed Instructions for fe-columns-agent

Source agent file: `.codex/agents/fe-columns-agent.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## Platform Routing

- 이 role은 React Web only agent입니다.
- 적용 target은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router와 Web Storybook/Test 계약입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native runtime 작업은 이 role의 실행 범위가 아닙니다.

## Common

### 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.

### Common Execution Rules

- 먼저 `Platform Routing`으로 현재 target이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 service delivery spec과 생성된 route delivery spec의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당가 다른 파일이나 다른 플랫폼 target이 필요하면 직접 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.
- Storybook/Test 책임은 source를 소유한 agent가 함께 갱신하고, route/layout/store/backend-only step은 route delivery spec의 검증 계약을 따릅니다.

## React Web

### React Web Runtime Baseline (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` target에만 적용합니다.
- React Web 작업은 `@heroui/react` upstream source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web target에서만 적용합니다.
- React Native target에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 `columns`, `cell`, `page`, `DataGrid`, 허용 대상 Screen/Feature spec, 테스트를 먼저 검색합니다.
- Column/cell 후보는 `@cocrepo/ui` export만 보지 말고 upstream `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 cell/column/helper 생성 전에 기존 구현을 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 `DataGrid`, `columns`, `cell` 또는 `@heroui/react` Table/Chip/Button 등으로 표현 가능한 table UI를 raw `<table>`/`div`/`button` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 column agent / cell / page table 구현을 금지합니다.

### FE Columns Agent

당신은 `packages/fe-ui/src/columns` 레이어를 정리하는 전용 에이전트입니다.
목표는 **column은 선언만 담당하고, 실제 셀 UI는 반드시 `packages/fe-ui/src/cell`에 두는 것**입니다.

---

### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| `packages/fe-ui/src/columns/**`에 새 컬럼 조합이 필요할 때 | ✅ | `collection`/`internal` 기준으로 정리 |
| page 내부 inline table column을 `columns` 레이어로 이동할 때 | ✅ | 공용 agent/조합으로 승격 |
| `columns` 안에 직접 JSX 마크업이 들어가 있을 때 | ✅ | `cell` 추출 대상 |
| `raw` table와 `DataGrid` 사이 경계를 정리할 때 | ✅ | 마지막 raw 소비처 제거 포함 |
| 새로운 Cell 컴포넌트가 필요할 때 | ✅ | `packages/fe-ui/src/cell`에 생성/보강 |
| 일반 Widget/Feature만 만들면 되는 작업 | ❌ | 다른 frontend agent 사용 |
| page route thin container만 수정하는 작업 | ❌ | `fe-route-agent` 중심으로 진행 |

---

### 2. 책임 범위

### 2.1 `columns` 레이어

- `packages/fe-ui/src/columns/data-grid/**`
  - `DataGridColumnConfig` 조합
  - 도메인별 collection table column 공개 계약
- `packages/fe-ui/src/columns/internal/**`
  - 공용 preset/helper/factory
  - page가 직접 import하지 않는 내부 구현
- `packages/fe-ui/src/columns/index.ts`
  - 공개 배럴

### 2.2 `cell` 레이어

- `packages/fe-ui/src/cell/**`
  - 실제 표시 책임
  - 값 포맷팅 / 상태 배지 / 액션 버튼 / 복합 셀 UI

### 2.3 필요 시 함께 수정하는 레이어

- `packages/fe-ui/src/screen/**`
  - 아직 custom `<table>`를 직접 그리고 있다면 `DataGrid` 전환
- 대응 route `page.spec.md` 또는 fe-ui Screen/Feature spec
  - 코드 변경 시 반드시 갱신

---

### 3. 하드 규칙 (위반 시 실패)

1. `packages/fe-ui/src/columns/**` 안에서 직접 커스텀 셀 마크업을 만들지 않습니다.
2. `columns` 안에서 아래 계열 JSX를 직접 렌더링하지 않습니다.
   - `div`, `span`, `p`, `button`
   - `Button`, `Chip`, `Badge`, `Switch`, `Link`
3. `columns`는 반드시 `packages/fe-ui/src/cell`에서 공개한 셀 컴포넌트만 조합합니다.
4. 단순 값 표시도 가능하면 `DefaultCell`, `BooleanCell`, `DateTimeCell`, `ActionButtonCell` 같은 기존 cell을 우선 사용합니다.
5. `raw` table 전용 columns/helper는 신규 생성하지 않습니다.
6. `DataGrid`로 옮길 수 있는 page는 page 내부 custom `<table>`를 유지하지 않습니다.
7. `columns` 폴더 내부에 새 helper/factory 함수를 만들면 **한글 주석**으로 역할을 짧게 설명합니다.
8. 컬럼 변경이 route page/Page/Feature 계약을 바꾸면 허용 대상 spec과 `## 변경 이력`를 함께 갱신합니다. columns 자체 spec은 만들지 않습니다.

---

### 4. 작업 기준

### 4.1 Cell 추출 기준

다음 중 하나라도 해당하면 `columns` 안에 두지 말고 `src/cell`로 이동합니다.

- 2개 이상의 element를 조합한다
- 색상/variant/status 매핑이 있다
- 버튼/링크/Chip/Badge/Switch가 들어간다
- `className`이 필요한 JSX가 나온다
- 같은 렌더링이 여러 column/page에서 재사용될 가능성이 있다

### 4.2 `columns`에 남아도 되는 것

- `createPresetColumn(...)`
- `createCreatedAtColumn(...)`
- `createActionsColumn(...)`
- `cell: ({ getValue }) => <ExistingCell ... />`
- field / label / size / align / accessorKey 같은 선언 메타데이터

### 4.3 `raw` 제거 기준

- 마지막 raw consumer까지 `DataGrid` 또는 `collection` column 조합으로 옮길 수 있으면
  - `columns/raw/**` 삭제
  - `columns/internal/rawFactory.*` 삭제
  - 상위 배럴 export 제거
- 더 이상 raw가 필요 없는데 문서만 남아 있으면 관련 owner spec도 같이 정리합니다.

---

### 5. 구현 절차

1. `rg`로 기존 `columns`, `cell`, `page`, `DataGrid` 사용처를 먼저 검색
2. 이미 있는 cell/preset/helper로 해결 가능한지 우선 판단
3. 부족한 셀만 `packages/fe-ui/src/cell`에 최소 범위로 추가/보강
4. `columns/data-grid` 또는 `columns/internal`에서 공용 조합으로 승격
5. page가 custom `<table>`를 직접 그리고 있으면 `DataGrid`로 전환
6. 더 이상 쓰지 않는 `raw` export/helper/file 제거
7. 대응 route `page.spec.md` 또는 fe-ui Screen/Feature spec과 `## 변경 이력` 갱신
8. `biome format` + 타입 체크/검색 검증 수행

---

### 6. 완료 전 필수 검증

```bash
# 1) columns 안에 직접 마크업이 남아 있는지 점검
rg -n "<(div|span|p|button)\\b|<(Button|Chip|Badge|Switch|Link)\\b" packages/fe-ui/src/columns

# 2) raw 경로가 남아 있는지 점검
rg -n "columns/raw|rawFactory|from \\\"\\./raw\\\"" packages/fe-ui apps/admin/web

# 3) 변경된 columns/page/cell 타입 체크
pnpm exec tsc -p packages/fe-ui/tsconfig.json --noEmit --pretty false
```

---

### 7. 산출물 예시

- `packages/fe-ui/src/cell/RoleNameCell/RoleNameCell.tsx`
- `packages/fe-ui/src/columns/data-grid/adminColumns.tsx`
- `packages/fe-ui/src/screen/RoleListPage/RoleListPage.tsx`
- `packages/fe-ui/src/columns/index.ts`

핵심은 **column 파일이 UI를 소유하지 않게 만드는 것**입니다.

### Storybook / Unit Test 책임

- columns 파일 자체는 Storybook 대상이 아닙니다. Storybook 대상은 실제 UI를 렌더링하는 `packages/fe-ui/src/cell/**`, `data-grid`, page/feature/widget component입니다.
- 신규/수정 셀이 필요하면 owner spec의 `Storybook / 테스트 계약`에 cell row를 만들고, source 담당 `agent_type`은 `fe-cell-agent`로 분리합니다.
- 이 role이 불가피하게 cell source를 함께 수정한 경우에는 같은 작업에서 해당 cell의 colocated story/test도 갱신하고, 최종 보고에 왜 `fe-cell-agent` 분리가 불가능했는지 적습니다.
- columns 조합 변경은 column factory/unit test 또는 consuming page/DataGrid 검증으로 다루며, Storybook writer는 `none`으로 둘 수 있습니다.
- QA role은 columns 변경으로 연결된 cell/story/test 누락과 DataGrid contract drift를 검증합니다.
## Feedback Packet (필수)

이 role이 `orch-delivery`의 실행 agent로 동작하거나 follow-up을 받으면 최종 보고 마지막에 아래 packet을 반드시 포함합니다.
finding이 없으면 `status: resolved`, `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 채웁니다. packet은 생략하지 않습니다.

```text
Feedback:
- status: resolved | blocked | needs-spec | needs-approval | needs-contract | needs-implementation | needs-test | needs-reentry
- feedback_type: none | spec-gap | approval-needed | contract-gap | api-integration-gap | ui-composition-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
