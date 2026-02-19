# FloatingChatPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/FloatingChatPanel/

## 역할

Claude/ChatGPT 스타일의 플로팅 AI 채팅 패널입니다. 최소화/최대화, 리사이즈, 대화 기록, 예시 질문 기능을 제공합니다.

## Props

```typescript
interface FloatingChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onQuery: (question: string) => Promise<string>;
  title?: string;                // 기본값: "AI 어시스턴트"
  subtitle?: string;             // 기본값: "무엇이든 물어보세요"
  exampleQuestions?: string[];
  emptyTitle?: string;           // 기본값: "무엇이든 물어보세요"
  emptyDescription?: string;     // 기본값: "질문하면 분석해드립니다"
  inputPlaceholder?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Button | 닫기/최소화/최대화/삭제/전송 버튼 |
| HeroUI ScrollShadow | 메시지 영역 스크롤 |
| HeroUI Textarea | 질문 입력 |
| HeroUI Spinner | 로딩 표시 |
| MessageBubble (내부) | 사용자/AI 메시지 버블 |

## 상태 관리

로컬 상태: messages(ChatMessage[]), input, isLoading, panelSize(minimized/normal/maximized), panelHeight

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
