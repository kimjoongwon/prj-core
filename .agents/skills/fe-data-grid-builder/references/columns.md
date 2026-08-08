# DataGrid Column 규칙

`fe-data-grid-agent`가 DataGrid/Table Column builder를 만들거나 고칠 때 적용합니다.

## 플랫폼 라우팅

- 이 역할은 웹 전용 agent입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native 런타임 작업은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 `data-grid/columns`, `cell`, `page`, `DataGrid`, 허용 대상 Screen/Feature 스펙, 테스트를 먼저 검색합니다.
- Column/cell 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 cell/column/helper 생성 전에 기존 구현을 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 `DataGrid`, `data-grid/columns`, `cell` 또는 `@heroui/react` Table/Chip/Button 등으로 표현 가능한 table UI를 raw `<table>`/`div`/`button` + className 조합으로 재구현하지 않습니다.
- 동일 책임의 중복 column helper / cell / page table 구현을 금지합니다.

### FE DataGrid Column 역할

당신은 `packages/fe-ui/src/data-grid/columns` 레이어를 정리하는 DataGrid 보조 규칙을 따릅니다.
목표는 **column은 선언만 담당하고, 실제 셀 UI는 반드시 `packages/fe-ui/src/data-grid/cell`에 두는 것**입니다.

---

### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| `packages/fe-ui/src/data-grid/columns/**`에 새 컬럼 조합이 필요할 때 | ✅ | `data-grid`/`internal` 기준으로 정리 |
| page 내부 inline table column을 `data-grid/columns` 레이어로 이동할 때 | ✅ | 공용 조합으로 승격 |
| `data-grid/columns` 안에 직접 JSX 마크업이 들어가 있을 때 | ✅ | `cell` 추출 대상 |
| `raw` table와 `DataGrid` 사이 경계를 정리할 때 | ✅ | 마지막 raw 소비처 제거 포함 |
| 새로운 Cell 컴포넌트가 필요할 때 | ⚠️ | 같은 `fe-data-grid-agent` owner 안에서 `fe-data-grid-builder` 보조 규칙을 함께 적용합니다. |
| 일반 Widget/Feature만 만들면 되는 작업 | ❌ | 다른 프론트엔드 agent 사용 |
| page route thin container만 수정하는 작업 | ❌ | `fe-route-agent` 중심으로 진행 |

---

### 2. 책임 범위

### 2.1 `data-grid/columns` 레이어

- `packages/fe-ui/src/data-grid/columns/data-grid/**`
  - `DataGridColumnConfig` 조합
  - 도메인별 collection table column 공개 계약
- `packages/fe-ui/src/data-grid/columns/internal/**`
  - 공용 preset/helper/factory
  - page가 직접 import하지 않는 내부 구현
- `packages/fe-ui/src/data-grid/columns/index.ts`
  - 공개 배럴

### 2.2 `cell` 레이어

- `packages/fe-ui/src/data-grid/cell/**`
  - 실제 표시 책임
  - 값 포맷팅 / 상태 배지 / 액션 버튼 / 복합 셀 UI
  - 소유 owner는 `fe-data-grid-agent`입니다. Column builder는 조합/소비만 기본으로 합니다.

### 2.3 필요 시 함께 수정하는 레이어

- `packages/fe-ui/src/screen/**`
  - 아직 custom `<table>`를 직접 그리고 있다면 `DataGrid` 전환
- 대응 route `page.spec.md` 또는 fe-ui Screen/Feature 스펙
  - 코드 변경 시 반드시 갱신

---

### 3. 하드 규칙 (위반 시 실패)

1. `packages/fe-ui/src/data-grid/columns/**` 안에서 직접 커스텀 셀 마크업을 만들지 않습니다.
2. `data-grid/columns` 안에서 아래 계열 JSX를 직접 렌더링하지 않습니다.
   - `div`, `span`, `p`, `button`
   - `Button`, `Chip`, `Badge`, `Switch`, `Link`
3. `data-grid/columns`는 반드시 `packages/fe-ui/src/data-grid/cell`에서 공개한 셀 컴포넌트만 조합합니다.
4. 단순 값 표시도 가능하면 `DefaultCell`, `BooleanCell`, `DateTimeCell`, `ActionButtonCell` 같은 기존 cell을 우선 사용합니다.
5. `raw` table 전용 columns/helper는 신규 생성하지 않습니다.
6. `DataGrid`로 옮길 수 있는 page는 page 내부 custom `<table>`를 유지하지 않습니다.
7. `data-grid/columns` 폴더 내부에 새 helper/factory 함수를 만들면 **한글 주석**으로 역할을 짧게 설명합니다.
8. 컬럼 변경이 route page/Page/Feature 계약을 바꾸면 허용 대상 spec을 함께 갱신합니다. columns 자체 spec은 만들지 않습니다.

---

### 4. 작업 기준

### 4.1 Cell 추출 기준

다음 중 하나라도 해당하면 `data-grid/columns` 안에 두지 말고 `src/data-grid/cell`로 이동합니다.

- 2개 이상의 element를 조합한다
- 색상/variant/status 매핑이 있다
- 버튼/링크/Chip/Badge/Switch가 들어간다
- `className`이 필요한 JSX가 나온다
- 같은 렌더링이 여러 column/page에서 재사용될 가능성이 있다

### 4.2 `data-grid/columns`에 남아도 되는 것

- `createPresetColumn(...)`
- `createCreatedAtColumn(...)`
- `createActionsColumn(...)`
- `cell: ({ getValue }) => <ExistingCell ... />`
- field / label / size / align / accessorKey 같은 선언 메타데이터

### 4.3 `raw` 제거 기준

- 마지막 raw 소비자까지 `DataGrid` 또는 `collection` column 조합으로 옮길 수 있으면
  - `data-grid/columns/raw/**` 삭제
  - `data-grid/columns/internal/rawFactory.*` 삭제
  - 상위 배럴 export 제거
- 더 이상 raw가 필요 없는데 문서만 남아 있으면 관련 담당 스펙도 같이 정리합니다.

---

### 5. 구현 절차

1. `rg`로 기존 `data-grid/columns`, `cell`, `page`, `DataGrid` 사용처를 먼저 검색
2. 이미 있는 cell/preset/helper로 해결 가능한지 우선 판단
3. 부족한 셀은 `fe-data-grid-agent` 산출물로 요청하거나, 같은 승인 slice에서만 `packages/fe-ui/src/data-grid/cell`에 최소 범위로 추가/보강
4. `data-grid/columns/data-grid` 또는 `data-grid/columns/internal`에서 공용 조합으로 승격
5. page가 custom `<table>`를 직접 그리고 있으면 `DataGrid`로 전환
6. 더 이상 쓰지 않는 `raw` export/helper/file 제거
7. 대응 route `page.spec.md` 또는 fe-ui Screen/Feature 스펙 갱신
8. `biome format` + 타입 체크/검색 검증 수행

---

### 6. 완료 전 필수 검증

```bash
# 1) columns 안에 직접 마크업이 남아 있는지 점검
rg -n "<(div|span|p|button)\\b|<(Button|Chip|Badge|Switch|Link)\\b" packages/fe-ui/src/data-grid/columns

# 2) raw 경로가 남아 있는지 점검
rg -n "data-grid/columns/raw|columns/raw|rawFactory|from \\\"\\./raw\\\"" packages/fe-ui apps/admin/web

# 3) 변경된 columns/page/cell 타입 체크
pnpm exec tsc -p packages/fe-ui/tsconfig.json --noEmit --pretty false
```

---

### 7. 산출물 예시

- `packages/fe-ui/src/data-grid/cell/RoleNameCell/RoleNameCell.tsx`
- `packages/fe-ui/src/data-grid/columns/data-grid/adminColumns.tsx`
- `packages/fe-ui/src/screen/RoleListScreen/RoleListScreen.tsx`
- `packages/fe-ui/src/data-grid/columns/index.ts`

핵심은 **column 파일이 UI를 소유하지 않게 만드는 것**입니다.


- 이 역할이 불가피하게 cell 소스를 함께 수정한 경우에는 같은 작업에서 해당 cell의 같은 위치 단위 테스트도 갱신하고, 최종 보고에 왜 `fe-data-grid-agent` 인계 없이 함께 처리했는지 적습니다.
- columns 변경으로 연결된 cell/단위 테스트 누락과 DataGrid 계약 drift는 이 agent가 자체 검증하고, cell owner 범위가 필요하면 `fe-data-grid-agent` 인계로 보고합니다.
