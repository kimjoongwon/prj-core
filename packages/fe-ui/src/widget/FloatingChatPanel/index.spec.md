# FloatingChatPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/FloatingChatPanel/

## 역할

Claude/ChatGPT 스타일의 플로팅 AI 채팅 패널입니다. 최소화/최대화, 리사이즈, 대화 기록, 예시 질문 기능을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
normal 상태 (기본)
┌──────────────────────────────────┐
│ ✦ AI 어시스턴트  [─][□][✕]      │  ← 헤더: title + 최소화/최대화/닫기
│   무엇이든 물어보세요             │  ← subtitle
├──────────────────────────────────┤
│                                  │  ← 메시지 영역 (ScrollShadow)
│   빈 상태:                       │
│        ✦                        │
│    무엇이든 물어보세요            │  ← emptyTitle
│    질문하면 분석해드립니다        │  ← emptyDescription
│                                  │
│  [예시 질문1]  [예시 질문2]      │  ← exampleQuestions chips
├──────────────────────────────────┤
│  질문을 입력하세요...    [전송▶]  │  ← Textarea + 전송 버튼
└──────────────────────────────────┘

대화 중 (메시지 있는 상태)
┌──────────────────────────────────┐
│ ✦ AI 어시스턴트  [─][□][✕]      │
├──────────────────────────────────┤
│                                  │
│         ╔════════════════╗       │  ← 사용자 메시지 (우측 정렬)
│         ║ 사용자 질문 내용 ║       │
│         ╚════════════════╝       │
│  ┌────────────────────────┐      │  ← AI 응답 (좌측 정렬)
│  │ ✦  AI 응답 내용...     │      │
│  └────────────────────────┘      │
│                                  │
│  [⠿] 응답 생성 중...             │  ← isLoading: Spinner
├──────────────────────────────────┤
│  질문을 입력하세요...    [전송▶]  │
└──────────────────────────────────┘

minimized 상태
┌──────────────────────────────────┐
│ ✦ AI 어시스턴트  [─][□][✕]      │
└──────────────────────────────────┘

maximized 상태 (전체화면)
╔══════════════════════════════════════════════╗
║ ✦ AI 어시스턴트              [─][◻][✕]      ║
╠══════════════════════════════════════════════╣
║                                              ║
║  [메시지 영역 - 전체 높이]                    ║
║                                              ║
╠══════════════════════════════════════════════╣
║  질문을 입력하세요...              [전송▶]   ║
╚══════════════════════════════════════════════╝
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| normal (기본) | 고정 높이 패널, 메시지 영역 + 입력창 |
| minimized | 헤더만 표시 (접힌 상태) |
| maximized | 화면 전체 크기로 확장 |
| 로딩 중 | 메시지 영역에 Spinner 표시 |
| 빈 상태 | 안내 메시지 + 예시 질문 버튼 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
