# SendTestModal Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/SendTestModal/

## 역할

메시지 템플릿 상세 화면에서 테스트 발송을 수행하는 모달입니다. 유형(EMAIL/SMS/PUSH)에 따라 적절한 수신자 입력 필드를 표시하고, 변수 입력과 발송 결과를 렌더링합니다.

## Props

```typescript
interface SendTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  type: "EMAIL" | "SMS" | "PUSH";
  variables: TemplateVariable[];
  onSendTest: (templateId: string, recipient: string, variables: Record<string, string>) => Promise<SendTestResult>;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Modal | 모달 컨테이너 |
| HeroUI Input | 수신자 입력 |
| VariableInputForm | 변수 값 입력 폼 |
| CheckCircle/AlertCircle (Lucide) | 성공/실패 아이콘 |

## 상태 관리

로컬: recipient, variableValues, result(SendTestResult), status("idle"/"loading"/"success"/"error")

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
