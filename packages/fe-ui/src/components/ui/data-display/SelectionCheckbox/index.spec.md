# SelectionCheckbox

## 개요

목록에서 행 선택에 사용되는 체크박스 컴포넌트입니다.

## Props

| 이름          | 타입                 | 필수 | 설명                          |
| ------------- | -------------------- | ---- | ----------------------------- |
| checked       | boolean              | ✅   | 체크 여부                     |
| onChange      | (checked: boolean) => void | ✅   | 체크 변경 핸들러              |
| indeterminate | boolean              | ❌   | 일부 선택 상태 (기본값: false) |
| isDisabled    | boolean              | ❌   | 비활성화 여부 (기본값: false)  |
| className     | string               | ❌   | 추가 클래스명                 |

## 기능

- **일반 선택**: 개별 행 선택
- **부분 선택 (indeterminate)**: 일부 행만 선택되었을 때 헤더 체크박스에 표시
- **비활성화**: 선택 불가능한 행에 사용

## 사용 예시

```tsx
import { SelectionCheckbox } from "@cocrepo/ui";

// 기본 사용
<SelectionCheckbox
  checked={isSelected}
  onChange={handleSelectChange}
/>

// 부분 선택 상태 (헤더용)
<SelectionCheckbox
  checked={isAllSelected}
  indeterminate={isPartialSelected}
  onChange={handleSelectAllChange}
/>

// 비활성화
<SelectionCheckbox
  checked={false}
  onChange={() => {}}
  isDisabled
/>
```

## 의존성

- @heroui/react (Checkbox)
- mobx-react-lite (observer)

## 변경 이력

| 일자       | 내용     | 작성자             |
| ---------- | -------- | ------------------ |
| 2026-02-23 | 초기 생성 | fe-ui-component-builder |
