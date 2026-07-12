# Timeline Session Program Detail Page

## Route / Screen Mapping

- page 역할: detail
- reusable 대상: detail/view
- screen component path: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 상태 / Modal 계약

- route는 저장된 Program을 readOnly form state로 변환합니다.
- readOnly state에는 Modal 검색어와 open 상태를 포함하지 않습니다.
- ProgramPicker는 detail 화면에서 열리지 않습니다.
