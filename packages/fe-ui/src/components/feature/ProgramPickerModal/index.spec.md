# ProgramPickerModal Feature 기획서

> 생성일: 2026-03-03
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/ProgramPickerModal/

## 역할

프로그램 등록/수정 페이지에서 루틴 또는 강사를 선택할 때 사용하는 검색형 선택 모달입니다.
페이지는 옵션 목록과 검색 상태만 주입하고, 선택 결과를 받아 폼 상태를 갱신합니다.

## Props

```ts
interface ProgramPickerOption {
  id: string;
  name: string;
  subtitle?: string;
}

interface ProgramPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  options: ProgramPickerOption[];
  onSelect: (id: string) => void;
  selectedId?: string;
}
```

## 이벤트

| 이벤트 | 동작 |
|--------|------|
| 옵션 클릭 | `onSelect(option.id)` 실행 후 `onClose()` |
| 검색 입력 | `onSearchValueChange(value)` |
| 닫기 버튼 | `onClose()` |

## 구현 체크리스트

- [x] `observer` 래핑
- [x] 선택형 리스트 + 검색 입력 제공
- [x] `@cocrepo/ui` 루트 export 연결

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | programs 페이지 로컬 `_components`에서 feature로 이관 | codex |
