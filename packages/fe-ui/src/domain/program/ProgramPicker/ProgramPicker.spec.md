# ProgramPicker

## 역할

- Program 관련 후보를 검색하고 선택하는 Modal body content입니다.
- `ProgramPickerState`가 옵션, 검색어, 선택 callback을 소유합니다.
- `ModalState<ProgramPickerState>`를 받아 선택 또는 닫기 action에서 Modal을 닫습니다.

## 공개 계약

- `ProgramPicker`
- `ProgramPickerState`
- `ProgramPickerOption`
- `ProgramPickerStateOptions`

## 상태 계약

- 검색은 option name 기준 trim/case-insensitive로 처리합니다.
- 선택된 option은 검색어와 일치하지 않아도 결과 첫 항목에 유지합니다.
- 선택 callback은 선택 ID와 동일한 `ProgramPickerState`를 받습니다.
