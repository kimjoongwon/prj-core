# Timeline Session Program Create Page

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 상태 / Modal 계약

- route는 Program payload form state와 API wiring만 소유합니다.
- 루틴/강사 전체 후보를 screen에 전달하며 검색/open 상태를 route에 복제하지 않습니다.
- `TimelineSessionProgramForm`이 `ProgramPickerState`를 만들고 `app.modal.open()`을 호출합니다.
