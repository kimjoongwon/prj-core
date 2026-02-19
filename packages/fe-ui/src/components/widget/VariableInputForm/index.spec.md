# VariableInputForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/VariableInputForm/

## 역할

미리보기/발송테스트 모달에서 공통으로 사용하는 변수 입력 폼입니다. 템플릿 변수 목록을 받아 각 변수에 대한 Input을 렌더링합니다.

## Props

```typescript
interface VariableInputFormProps {
  variables: TemplateVariable[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

interface TemplateVariable {
  id: string;
  name: string;
  description: string | null;
  defaultValue: string | null;
  isRequired: boolean;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| Input (커스텀) | 각 변수 입력 필드 |

## 상태 관리

**없음** (외부에서 values 상태를 관리)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
