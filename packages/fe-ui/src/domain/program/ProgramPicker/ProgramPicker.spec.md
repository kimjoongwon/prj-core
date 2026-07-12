# ProgramPicker

## 역할

- Program 관련 후보를 API에서 검색하고 선택하는 Modal body content입니다.
- `ProgramPicker`가 routines/users API 호출, 검색어, 후보 변환, 로딩·오류·빈 상태 렌더링을 소유합니다.
- `ProgramPickerState`는 조회 종류, 선택 ID, 검색어, 선택 callback만 소유합니다.
- `ModalState<ProgramPickerState>`를 받아 선택 또는 닫기 action에서 Modal을 닫습니다.

## 공개 계약

- `ProgramPicker`
- `ProgramPickerState`
- `ProgramPickerOption`
- `ProgramPickerStateOptions`

## 상태 계약

- 검색어는 routines API의 `search` 또는 users API의 `name`으로 전달하며 화면에서도 대소문자 무관하게 보정합니다.
- 선택된 option은 검색어와 일치하지 않아도 결과 첫 항목에 유지합니다.
- 선택 callback은 선택 ID, API 후보, 동일한 `ProgramPickerState`를 받습니다.
