# TemplateContentEditor Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/TemplateContentEditor/

## 역할

등록/수정 폼에서 템플릿 유형에 따라 동적으로 콘텐츠 입력 필드를 렌더링합니다. EMAIL: 제목 + HtmlEditor, SMS: 본문 Textarea + ByteCounter, PUSH: 제목(50자) + 본문(200자) + 글자 수 표시.

## Props

```typescript
interface TemplateContentEditorProps {
  type: "EMAIL" | "SMS" | "PUSH";
  subject: string;
  content: string;
  onSubjectChange: (value: string) => void;
  onContentChange: (value: string) => void;
  errors?: { subject?: string; content?: string };
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Input | 제목 입력 (EMAIL, PUSH) |
| HeroUI Textarea | 본문 입력 (SMS, PUSH) |
| HtmlEditor | HTML 편집기 (EMAIL) |
| ByteCounter | SMS 바이트 수 표시 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
