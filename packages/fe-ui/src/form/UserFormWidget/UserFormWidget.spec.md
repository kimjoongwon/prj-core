# UserFormWidget widget 기획서

> 생성일: 2026-03-21
> 타입: widget
> 위치: packages/fe-ui/src/form/UserFormWidget/UserFormWidget.tsx

## 역할

이용자 생성/수정 화면이 재사용하는 표준 폼 위젯입니다.
`page role = form` 화면에서 `form` 계층을 소비할 때 사용하는 기본 입력 조합입니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `RoleOption` | 역할 선택 옵션 타입 |
| `UserFormData` | 이용자 폼 데이터 타입 |
| `UserFormWidgetProps` | 이용자 폼 위젯 Props |
| `UserFormWidget` | 이용자 생성/수정 폼 위젯 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@heroui/react` | 입력 필드와 액션 버튼 |
| `mobx-react-lite` | observer와 local observable |
| `react` | effect와 폼 이벤트 처리 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `UserFormWidget` 소유를 `form`으로 이동하고 form 표준 위젯으로 재정의 | codex |
