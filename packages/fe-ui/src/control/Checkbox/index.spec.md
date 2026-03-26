# Checkbox Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/control/Checkbox/

## 역할

MobX state와 연동하는 체크박스 입력 컴포넌트. `useFormField` 훅을 통해 boolean 값의 양방향 바인딩을 제공한다. 내부적으로 `BaseCheckbox` Pure 컴포넌트를 래핑한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 상태 - 미체크]
☐ 약관에 동의합니다

[체크 상태]
☑ 약관에 동의합니다   (primary 색상)

[비활성화 - 미체크]
☐ 비활성화된 항목      (흐릿하게 표시)

[비활성화 - 체크됨]
☑ 비활성화된 항목      (흐릿하게 표시)

[그룹 사용 예시]
☑ 이용약관에 동의합니다 (필수)
☐ 개인정보 처리방침에 동의합니다 (필수)
☑ 마케팅 정보 수신에 동의합니다 (선택)

[에러 상태]
☐ 필수 동의 항목       ← 체크 필요
⚠ 필수 항목입니다.
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 미체크 | 빈 사각형 + 레이블 텍스트 |
| 체크됨 | 체크 표시 사각형 (primary 색상) + 레이블 |
| 비활성화 | 흐릿하게 표시, 상호작용 불가 |
| 에러 | 하단 빨간색 에러 메시지 |
| 중간 상태 | 일부 선택 시 대시(-) 표시 (indeterminate) |

## Props

```typescript
interface CheckboxProps<T> extends MobxProps<T>,
  Omit<BaseCheckboxProps, "onChange" | "isSelected"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- 나머지 BaseCheckboxProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `tools.get(state, path, false)` (boolean) |
| 변경 시 | `formField.setValue(checked)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
