# PromptForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/PromptForm/

## 역할

메인 프롬프트와 선택적 네거티브 프롬프트를 입력받아 제출하는 폼입니다. AI 이미지 생성 등에 사용됩니다. Cmd+Enter 단축키를 지원합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────┐
│ 프롬프트 레이블                                   │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ │  프롬프트를 입력하세요...                    │ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│ 힌트 텍스트                                       │
│                                                   │
│ 네거티브 프롬프트 레이블                           │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ │  제외할 요소를 입력하세요...                 │ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│ 힌트 텍스트                                       │
│                                                   │
│                  Cmd+Enter로 제출                  │
│                ┌──────────────────┐               │
│                │  🎨  생성         │               │
│                └──────────────────┘               │
└─────────────────────────────────────────────────┘

[처리 중 상태]
│                ┌──────────────────┐               │
│                │  ⏳  처리 중...   │               │
│                └──────────────────┘               │
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (showNegativePrompt=true) | 프롬프트 + 네거티브 프롬프트 + 생성 버튼 |
| 네거티브 숨김 (showNegativePrompt=false) | 프롬프트 + 생성 버튼 |
| 처리 중 (isProcessing=true) | 버튼 비활성화 + "처리 중..." 레이블 |

## Props

```typescript
interface PromptFormProps {
  prompt: string;
  negativePrompt?: string;
  isProcessing: boolean;
  onPromptChange: (value: string) => void;
  onNegativePromptChange?: (value: string) => void;
  onSubmit: () => void;
  promptLabel?: string;
  promptPlaceholder?: string;
  promptHint?: string;
  negativePromptLabel?: string;
  negativePromptPlaceholder?: string;
  negativePromptHint?: string;
  submitLabel?: string;           // 기본값: "생성"
  processingLabel?: string;       // 기본값: "처리 중..."
  submitIcon?: ReactNode;
  shortcutHint?: string;
  showNegativePrompt?: boolean;   // 기본값: true
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Textarea | 프롬프트/네거티브 프롬프트 입력 |
| HeroUI Button | 제출 버튼 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
