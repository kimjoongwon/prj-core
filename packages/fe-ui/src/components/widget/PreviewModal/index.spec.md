# PreviewModal Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/PreviewModal/

## 역할

메시지 템플릿 미리보기 모달입니다. 변수 입력 폼으로 값을 설정한 후 미리보기를 실행하여 EMAIL(HTML)/SMS(텍스트+바이트)/PUSH(카드) 결과를 확인합니다.

## Props

```typescript
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  type: "EMAIL" | "SMS" | "PUSH";
  variables: TemplateVariable[];
  onPreview: (templateId: string, variables: Record<string, string>) => Promise<PreviewResult>;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Modal | 모달 컨테이너 |
| VariableInputForm | 변수 입력 폼 |
| HtmlContentRenderer | EMAIL HTML 렌더링 |
| ByteCounter | SMS 바이트 수 표시 |
| HeroUI Chip | 미치환 변수 경고 |
| HeroUI Spinner | 로딩 표시 |

## 상태 관리

로컬: variableValues, previewResult, previewState("idle"/"loading"/"success"/"error"), errorMessage

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
