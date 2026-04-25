# MetaDataGrid Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/master/table/MetaDataGrid/

## 역할

메타데이터 기반 선언적 DataGrid 시스템입니다.
MetaDataGridConfig 설정 객체, MetaDataGridState 상태 객체, 서버 render props로 DataGrid의 컬럼, 검색, 필터, 페이지네이션, 선택 모드를 구성합니다.
페이지가 소유한 query/selection state를 `state` prop으로 주입받아 검색, 필터, 페이지네이션 UI를 갱신합니다.
`state` prop은 plain object literal이 아니라 `useLocalObservable`로 만든 `MetaDataGridStateModel` class instance를 사용합니다.
서버 조회 결과인 rows/totalCount/isLoading은 config에 섞지 않고 별도 props로 전달합니다.
공개 재사용 진입점은 `packages/fe-ui/src/master/table/index.ts`가 소유하고, 이 폴더는 그 구현을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────┐
│ MetaDataGrid                                                        │
│                                                                     │
│  ┌─── MetaDataGridHeader ────────────────────────────────────────┐  │
│  │  leftInputs:                      rightInputs:               │  │
│  │  [검색어 입력...  🔍]  [상태 ▼]   [+ 등록]  [삭제]          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─── MetaDataGridBody ──────────────────────────────────────────┐  │
│  │ DataGrid                                                      │  │
│  │ ┌──┬──────────┬───────────┬──────────┬────────┬───────────┐  │  │
│  │ │☐ │  이름    │   이메일  │  역할    │  상태  │  등록일   │  │  │
│  │ ├──┼──────────┼───────────┼──────────┼────────┼───────────┤  │  │
│  │ │☐ │ 홍길동   │hong@a.com │ MANAGE   │[활성]  │2026-01-01 │  │  │
│  │ ├──┼──────────┼───────────┼──────────┼────────┼───────────┤  │  │
│  │ │☑ │ 김철수   │kim@b.com  │ VIEW     │[비활성]│2026-01-15 │  │  │
│  │ ├──┼──────────┼───────────┼──────────┼────────┼───────────┤  │  │
│  │ │☐ │ 이영희   │lee@c.com  │ FULL     │[활성]  │2026-02-01 │  │  │
│  │ └──┴──────────┴───────────┴──────────┴────────┴───────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─── MetaDataGridFooter ────────────────────────────────────────┐  │
│  │              ← 1  2  3  4  5 →          총 48건              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─── MetaDataGridActionBar (선택 시 표시) ──────────────────────┐  │
│  │  2개 선택됨    [삭제]  [상태변경 ▼]  [내보내기]   [✕ 취소]  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

 로딩 상태 (MetaDataGridSkeleton)
┌──┬──────────────┬───────────────┬────────────┬──────────────────┐
│  │ ░░░░░░░░░░   │ ░░░░░░░░░░░░  │ ░░░░░░░░   │ ░░░░░░░░░░░░░░   │
├──┼──────────────┼───────────────┼────────────┼──────────────────┤
│  │ ░░░░░░░░░░   │ ░░░░░░░░░░░░  │ ░░░░░░░░   │ ░░░░░░░░░░░░░░   │
└──┴──────────────┴───────────────┴────────────┴──────────────────┘

 빈 상태 (MetaDataGridEmpty)
┌─────────────────────────────────────────┐
│                                         │
│         📭  데이터가 없습니다.           │
│                                         │
└─────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 데이터 정상 표시 | Header + Body(DataGrid) + Footer 렌더링 |
| 로딩 | 데이터 로드 중 | MetaDataGridSkeleton으로 Body 대체 |
| 빈 상태 | 조회 결과 없음 | MetaDataGridEmpty 표시 |
| 행 선택 | 체크박스 선택 시 | MetaDataGridActionBar 하단 고정 표시 |
| 검색/필터 | text filter Enter 또는 discrete filter 선택 시 | 주입된 state.query.setValues로 page-owned query state 갱신 |
| 페이지 변경 | 페이지네이션 클릭 시 | 주입된 state.query.setValues로 skip 상태 갱신 |
| 컬럼 헤더 필터 | `column.filter` 또는 `placement: "column-header"` input 제공 시 | 컬럼 헤더 라벨 아래 input/select 렌더링 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Type | `@cocrepo/type` > `MetaDataGridConfig` | DataGrid 설정 타입 |
| UI | `DataGrid` (Pure UI) | 테이블 본문 렌더링 |
| Input | `Pagination` | 페이지네이션 UI |
| Library | `@tanstack/react-table` | 컬럼 정의 (ColumnDef) |

## Props

```typescript
interface MetaDataGridProps<T> {
  config: MetaDataGridConfig<T>;
  state: MetaDataGridState;
  rows: T[];
  totalCount: number;
  isLoading?: boolean;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| page-owned grid state | `state.query.values`, `state.query.setValues` | 검색/필터/페이지네이션 query 상태를 소비 |
| page-owned grid state | `state.selection` | 선택 상태가 필요할 때 소비 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (state 내부) | text 검색에서 Enter 입력 시 | state.query.setValues 호출 |
| (state 내부) | select 필터 변경 시 | state.query.setValues 호출 |
| (state 내부) | 페이지 변경 시 | state.query.setValues 호출 |
| (config 내부) | 버튼 입력 시 | config.leftInputs/rightInputs의 개별 핸들러 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `MetaDataGridHeader` | 내부 | 상단 영역 (검색, 필터, 버튼) |
| `MetaDataGridBody` | 내부 | 본문 영역 (DataGrid 래퍼) |
| `MetaDataGridFooter` | 내부 | 하단 영역 (Pagination) |
| `MetaDataGridActionBar` | 내부 | 선택 시 표시되는 하단 액션바 |
| `MetaDataGridSkeleton` | 내부 | 로딩 스켈레톤 |
| `MetaDataGridEmpty` | 내부 | 빈 상태 표시 |
| `InputRenderer` | 내부 | 입력 요소 렌더러 (search, button, dropdown, select) |

## 구현 체크리스트

- [x] MetaDataGrid.tsx (메인 컴포넌트)
- [x] MetaDataGridHeader.tsx
- [x] MetaDataGridBody.tsx
- [x] MetaDataGridFooter.tsx
- [x] MetaDataGridActionBar.tsx
- [x] MetaDataGridSkeleton.tsx
- [x] MetaDataGridEmpty.tsx
- [x] InputRenderer.tsx
- [x] SearchInput.tsx
- [x] ButtonInput.tsx
- [x] DropdownInput.tsx
- [x] SelectInput.tsx
- [x] index.ts (component re-export)
- [x] observer 적용 (모든 하위 컴포넌트)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | MetaDataGrid 사용처가 useLocalObservable 기반 MetaDataGridStateModel을 넘기도록 계약 보강 | codex |
| 2026-04-25 | 컬럼 헤더 아래 filter input/select 렌더링 계약을 추가 | codex |
| 2026-04-25 | rows/totalCount/isLoading을 config에서 분리해 server render props로 전달하도록 변경 | codex |
| 2026-04-25 | query/selection interaction state를 `MetaDataGridState` prop으로 분리하고 text 검색 Enter commit 정책을 반영 | codex |
| 2026-04-24 | MetaDataGrid가 page-owned query state props를 소비하도록 정리 | codex |
| 2026-03-21 | `master/table` 공식 재사용 엔트리의 구현 백엔드 역할을 명시 | codex |
| 2026-03-06 | MetaDataGrid 훅 re-export 경로를 fe-ui 내부 hook에서 @cocrepo/hook으로 이관 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src 레이어 상향에 맞춰 util/hook 상대 import 깊이를 보정 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-06 | toColumnDef 계열 외부 공개를 제거하고 MetaDataGridBody 내부 helper로 한정 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
