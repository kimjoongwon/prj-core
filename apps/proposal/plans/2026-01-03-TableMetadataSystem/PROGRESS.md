# MetaDataGrid 진행 상황

## 구현 현황

| 항목 | 상태 | 완료일 |
|------|:----:|--------|
| 타입 정의 | ✅ | 2026-01-30 |
| MetaDataGrid 컴포넌트 | ✅ | 2026-01-30 |
| 입력 컴포넌트 (nuqs 연동) | ✅ | 2026-01-30 |
| useMetaDataGridQueryStates 훅 | ✅ | 2026-01-30 |
| 기존 DataGrid 연동 | ✅ | 2026-01-30 |
| 기존 Pagination 연동 | ✅ | 2026-01-30 |
| CASL 권한 연동 | ⬜ | - |

---

## Stage 4: 컴포넌트 구현

### 생성된 파일

#### 타입 정의 (`@cocrepo/type`)
- `packages/type/src/table.ts` - MetaDataGridConfig, MetaDataGridColumnConfig, InputConfig 등

#### 패키지 레벨 훅/유틸 (`@cocrepo/ui`)

```
packages/ui/src/
├── hooks/
│   ├── index.ts
│   ├── useDebouncedCallback.ts    # Debounce 훅
│   └── useMetaDataGridQueryStates.ts  # nuqs 통합 훅
└── utils/
    ├── index.ts
    └── toColumnDef.ts             # 컬럼 변환 유틸
```

#### MetaDataGrid Feature 컴포넌트 (`@cocrepo/ui`)

```
packages/ui/src/components/feature/MetaDataGrid/
├── MetaDataGrid.tsx           # 메인 컴포넌트
├── MetaDataGridHeader.tsx     # 상단 영역 (검색, 필터, 버튼)
├── MetaDataGridBody.tsx       # DataGrid 래퍼
├── MetaDataGridFooter.tsx     # Pagination 래퍼
├── MetaDataGridSkeleton.tsx   # 로딩 스켈레톤
├── MetaDataGridEmpty.tsx      # 빈 상태
├── MetaDataGridActionBar.tsx  # 선택 시 하단 액션바
├── SearchInput.tsx            # 검색 (nuqs 연동)
├── SelectInput.tsx            # 셀렉트 (nuqs 연동)
├── ButtonInput.tsx            # 버튼
├── DropdownInput.tsx          # 드롭다운
├── InputRenderer.tsx          # 입력 컴포넌트 렌더러
└── index.ts
```

---

## 사용 예시

```tsx
import { MetaDataGrid, useMetaDataGridQueryStates } from "@cocrepo/ui";
import type { MetaDataGridConfig, InputConfig } from "@cocrepo/type";

// Input 설정
const leftInputs: InputConfig[] = [
  { type: "search", id: "search", placeholder: "검색" },
  { type: "select", id: "status", placeholder: "상태", props: { options: [...] } },
];

function UsersPage() {
  // 1. queryStates 관리
  const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

  // 2. API 호출
  const { data, isLoading } = useGetUsers({
    search: queryStates.search,
    status: queryStates.status,
    take: queryStates.take,
    skip: queryStates.skip,
  });

  // 3. MetaDataGrid 설정
  const config: MetaDataGridConfig<User> = {
    entity: "User",
    data: data?.data ?? [],
    totalCount: data?.meta?.total ?? 0,
    isLoading,
    queryStates,
    setQueryStates,
    columns: [
      { field: "name", label: "이름", isRequired: true },
      { field: "email", label: "이메일" },
    ],
    leftInputs,
    rightInputs: [
      { type: "button", id: "create", label: "등록", props: { color: "primary" } },
    ],
  };

  return <MetaDataGrid config={config} />;
}
```

---

## 미구현 항목

- [ ] DateRangeInput (date-range 타입)
- [ ] MultiSelectInput (multi-select 타입)
- [ ] ChipGroupInput (chip-group 타입)
- [ ] CASL 권한 연동 (permission 필드)
- [ ] 모바일 카드 뷰 (MetaDataGridCard)
- [ ] 컬럼 가시성 연동 (useColumnVisibility)

---

## 리팩토링 이력

### 컴포넌트 폴더 구조 정리 (2026-01-30)

**변경 사유:** packages/ui 컴포넌트 폴더 내 hooks/, utils/, inputs/ 하위 폴더 생성 금지 규칙 적용

**변경 내용:**
- `hooks/` → `packages/ui/src/hooks/`로 이동
- `utils/` → `packages/ui/src/utils/`로 이동
- `inputs/` → MetaDataGrid 폴더로 평탄화 (하위 폴더 제거)
- 관련 에이전트 문서 업데이트 (fe-feature-builder, fe-widget-builder, fe-ui-component-builder, fe-input-component-builder)
- fe-review skill에 검증 규칙 추가

### TablePage → MetaDataGrid 리네이밍 (2026-01-30)

**변경 사유:** Feature 명명 규칙 `[위치/역할][기능]` 적용 및 Table vs DataGrid 개념 정리

- **DataGrid**: 인터랙티브 기능 (정렬, 필터링, 선택, 페이지네이션) 포함하는 상위 개념
- **Meta**: 메타데이터 기반 선언적 구성을 의미

**변경 내용:**
- 폴더명: `TablePage` → `MetaDataGrid`
- 컴포넌트: `TablePage*` → `MetaDataGrid*`
- 타입: `TablePageConfig` → `MetaDataGridConfig`, `TableColumnConfig` → `MetaDataGridColumnConfig`
- 훅: `useTableQueryStates` → `useMetaDataGridQueryStates`

### Context API 제거 (2026-01-30)

**변경 사유:** packages/ui에서 Context API 사용 금지 규칙 적용

**변경 내용:**
- `TablePageContext.tsx` 삭제
- 모든 하위 컴포넌트가 props로 config 전달받도록 수정
- `MetaDataGridHeader`, `MetaDataGridBody`, `MetaDataGridFooter`, `MetaDataGridActionBar` 리팩토링

---

## 다음 단계

1. 미구현 입력 컴포넌트 추가 (필요 시)
2. CASL 권한 연동
3. 실제 페이지에 적용 테스트
