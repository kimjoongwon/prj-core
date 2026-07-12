# Timeline Session Program Edit Page

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 상태 / Modal 계약

- route는 기존 Program hydrate, update API, dirty/validation 상태를 소유합니다.
- 현재 선택된 루틴과 강사를 포함한 전체 후보를 전달하고 검색/open 상태는 갖지 않습니다.
- 선택 결과는 ProgramPicker callback이 route-local form state에 반영합니다.
