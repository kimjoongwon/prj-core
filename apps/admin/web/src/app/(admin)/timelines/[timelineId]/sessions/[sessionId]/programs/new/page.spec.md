# Timeline Session Program Create Page

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 상태 / Modal 계약

- route는 Program payload form state와 API wiring만 소유합니다.
- Picker 후보 조회와 검색 상태는 `domain/program/ProgramPicker`가 자체 API로 소유합니다.
- `TimelineSessionProgramForm`이 `ProgramPickerState`를 만들고 `app.modal.open()`을 호출합니다.
