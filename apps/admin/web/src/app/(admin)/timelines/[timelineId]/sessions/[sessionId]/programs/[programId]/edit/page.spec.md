# Timeline Session Program Edit Page

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 상태 / Modal 계약

- route는 기존 Program hydrate, update API, dirty/validation 상태를 소유합니다.
- Picker 후보 조회와 검색 상태는 `domain/program/ProgramPicker`가 자체 API로 소유합니다.
- 선택 결과는 ProgramPicker callback이 route-local form state에 반영합니다.
