# 07. 구현 체크리스트 및 참고 자료

## 1. 타입 정의

- [ ] TablePageConfig 인터페이스
- [ ] TableColumnConfig 인터페이스 (ColumnDef 확장)
- [ ] InputConfig 인터페이스
- [ ] SelectionConfig 인터페이스
- [ ] ResponsiveConfig 인터페이스
- [ ] TanStack Table 메타 타입 확장 (table.d.ts)

---

## 2. 유틸리티 함수

- [ ] toColumnDef (TableColumnConfig -> ColumnDef 변환)
- [ ] toColumnDefs (배열 일괄 변환)

---

## 3. 컴포넌트 구현

- [ ] TablePage 메인 컴포넌트
- [ ] TablePageContext Provider
- [ ] TablePageHeader (leftInputs, rightInputs)
- [ ] TablePageBody (DataGrid 연동)
- [ ] TablePageFooter (Pagination 연동)
- [ ] TablePageCard (모바일)
- [ ] TablePageActionBar
- [ ] TablePageSkeleton
- [ ] TablePageEmpty

---

## 4. 입력 컴포넌트 (nuqs 연동)

- [ ] SearchInput (nuqs)
- [ ] SelectInput (nuqs)
- [ ] MultiSelectInput (nuqs)
- [ ] DateRangeInput (nuqs)
- [ ] ButtonInput
- [ ] DropdownInput
- [ ] InputRenderer

---

## 5. 훅 구현

- [ ] useTableQueryStates (nuqs 통합)
- [ ] useTableColumns (컬럼 가시성)
- [ ] useTableResponsive

---

## 6. 연동

- [ ] 기존 DataGrid 컴포넌트 활용
- [ ] 기존 Pagination 컴포넌트 활용
- [ ] 컬럼 가시성 시스템 연동
- [ ] CASL 권한 연동

---

## 참고 자료

- [nuqs](https://nuqs.47ng.com/) - URL querystring 상태 관리
- [TanStack Table](https://tanstack.com/table/v8)
- 기존 컴포넌트: `components/ui/data-display/DataGrid`
- 기존 컴포넌트: `components/inputs/Pagination`
- 컬럼 가시성: `2025-12-30-CASL-Permission-System.md` (12장)
