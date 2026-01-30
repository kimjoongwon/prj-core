# Admin 테이블 메타데이터 시스템

**작성일:** 2026-01-03
**플랫폼:** Admin Web (Desktop + Tablet + Mobile)
**버전:** 1.0

---

## 5단계 개발 플로우 현황

```
Stage 1: 데이터 설계     ⏳ 대기
Stage 2: 스키마 구현     ⏳ 대기
Stage 3: 백엔드 로직     ⏳ 대기
Stage 4: 컴포넌트 구현   ⏳ 대기
Stage 5: 페이지 통합     ⏳ 대기
```

**다음 단계:**
```bash
/orch-stage start stage=1 plan=2026-01-03-AdminTableMetadataSystem
```

---

## 문서 구조

```
2026-01-03-AdminTableMetadataSystem/
├── README.md                 ← 현재 문서 (개요 + 목차 + 체크리스트)
│
├── 01-overview.md            ← 개요 및 핵심 원칙
├── 02-examples.md            ← 사용 예시
├── 03-components.md          ← 컴포넌트 구조 및 반응형
│
└── design/                   ← 기술 설계 (인터페이스 정의)
    └── interfaces.md         ← 메타데이터 인터페이스 설계
```

---

## 문서 목차

### 기획 문서 (이 폴더)

| 문서 | 설명 |
|------|------|
| [01-overview.md](./01-overview.md) | 목적, 핵심 원칙, 참조 문서 |
| [02-examples.md](./02-examples.md) | 기본/간단한 사용 예시 |
| [03-components.md](./03-components.md) | 컴포넌트 구조, 반응형, 레이아웃, Store 연동 |

### 기술 설계서 (design 폴더)

| 문서 | 설명 |
|------|------|
| [design/interfaces.md](./design/interfaces.md) | AdminTableConfig, ColumnConfig, InputConfig 등 인터페이스 정의 |

---

## 핵심 개념

### 메타데이터 기반 선언적 시스템

```
메타데이터 = 컬럼 + 데이터 + 입력컴포넌트 + 로직
     ↓
AdminTable 컴포넌트
     ↓
완성된 테이블 UI (반응형 자동 대응)
```

### 주요 원칙

| 원칙 | 설명 |
|------|------|
| **선언적 구성** | JSON/객체 형태의 메타데이터로 테이블 정의 |
| **컴포넌트 주입** | leftInputs, rightInputs에 컴포넌트 메타데이터 정의 |
| **로직 바인딩** | onClick, onChange 등 핸들러를 메타데이터에 포함 |
| **동적 컬럼** | 컬럼 가시성 시스템과 연동 (디바이스/역할별) |
| **반응형 자동 대응** | 모바일에서 카드 뷰 자동 전환 |

---

## 체크리스트

### 타입 정의
- [ ] AdminTableConfig 인터페이스 정의
- [ ] ColumnConfig 인터페이스 정의
- [ ] InputConfig 인터페이스 정의
- [ ] SelectionConfig 인터페이스 정의
- [ ] PaginationConfig 인터페이스 정의
- [ ] ResponsiveConfig 인터페이스 정의

### 컴포넌트 구현
- [ ] AdminTable 메인 컴포넌트
- [ ] AdminTableContext Provider
- [ ] AdminTableHeader (leftInputs, rightInputs 렌더링)
- [ ] AdminTableBody (TanStack Table 연동)
- [ ] AdminTableFooter (페이지네이션)
- [ ] AdminTableCard (모바일 카드 뷰)
- [ ] AdminTableActionBar (선택 시 액션바)
- [ ] AdminTableSkeleton (로딩 상태)
- [ ] AdminTableEmpty (빈 상태)

### 입력 컴포넌트 렌더러
- [ ] InputRenderer (타입별 분기)
- [ ] SearchInput
- [ ] SelectInput
- [ ] MultiSelectInput
- [ ] DateRangeInput
- [ ] ButtonInput
- [ ] ButtonGroupInput
- [ ] DropdownInput
- [ ] ChipGroupInput

### 훅 구현
- [ ] useAdminTable
- [ ] useTableColumns (컬럼 가시성 연동)
- [ ] useTableResponsive (반응형 처리)

### 연동
- [ ] 컬럼 가시성 시스템 연동 (useColumnVisibility)
- [ ] CASL 권한 연동 (Can 컴포넌트)
- [ ] TanStack Table 연동

### 테스트
- [ ] Storybook 스토리 작성
- [ ] 단위 테스트 작성
- [ ] 반응형 테스트 (Desktop/Tablet/Mobile)

---

## 참고 자료

- [TanStack Table](https://tanstack.com/table/v8)
- [HeroUI Table](https://heroui.com/docs/components/table)
- 컬럼 가시성 시스템: `2025-12-30-CASL-Permission-System.md` (12장)

---

## 관련 문서

- [CASL 권한 시스템](../2025-12-30-CASL-Permission-System/README.md)
- [Admin 레이아웃](../2025-12-30-AdminLayoutAndMenuSystem.md)
- [모바일 반응형](../2025-12-30-AdminLayoutAndMenuSystem-Mobile.md)
