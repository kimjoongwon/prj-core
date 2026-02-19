# TemplateContentViewer Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/TemplateContentViewer/

## 역할

상세 화면에서 템플릿 유형별 콘텐츠를 읽기 전용으로 표시합니다. EMAIL: 제목 + HtmlContentRenderer, SMS: 텍스트 + ByteCounter, PUSH: 제목/본문 + 글자 수 표시.

## Props

```typescript
interface TemplateContentViewerProps {
  type: "EMAIL" | "SMS" | "PUSH";
  subject: string | null;
  content: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HtmlContentRenderer | EMAIL HTML 렌더링 |
| ByteCounter | SMS 바이트 수 표시 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
