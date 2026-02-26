# AIFormPreviewModal UI 컴포넌트 기획서

## 개요

AI가 생성한 폼 필드 값을 미리보기하고 필요시 수정한 후 적용할 수 있는 모달 컴포넌트입니다.

## 컴포넌트 정보

| 항목        | 값                                                            |
| ----------- | ------------------------------------------------------------- |
| 이름        | AIFormPreviewModal                                            |
| 위치        | packages/fe-ui/src/components/ui/feedback/AIFormPreviewModal/ |
| 타입        | UI 컴포넌트 (Pure Component)                                  |
| HeroUI 기반 | Modal, Select, Textarea, Chip, Spinner                        |

## Props

| 이름           | 타입                              | 필수 | 설명                                 |
| -------------- | --------------------------------- | ---- | ------------------------------------ |
| isOpen         | boolean                           | O    | 모달 열림 여부                       |
| onClose        | () => void                        | O    | 모달 닫기 핸들러                     |
| onConfirm      | (editedValues: Record<string, unknown>) => void | O    | 적용 핸들러 (수정된 값 전달)         |
| originalValues | Record<string, unknown>           | O    | 기존 값들                            |
| aiValues       | Record<string, unknown>           | O    | AI가 제안한 값들                     |
| appliedFields  | string[]                          | O    | AI가 채운 필드 목록                  |
| confidence     | Record<string, number>            | O    | 필드별 신뢰도 (0-100)                |
| fieldLabels    | Record<string, string>            | O    | 필드 라벨 매핑                       |
| isLoading      | boolean                           | X    | 로딩 상태 (기본값: false)            |

## 상태

| 상태         | 타입                      | 설명                               |
| ------------ | ------------------------- | ---------------------------------- |
| editedValues | Record<string, unknown>   | 사용자가 수정한 값들 (초기값: aiValues) |

## UI 구성

```
┌─────────────────────────────────────────────────────────────────┐
│  AI 생성 결과 미리보기                                     [X]  │
├─────────────────────────────────────────────────────────────────┤
│  AI가 채운 필드만 표시됩니다. 필요시 수정 후 적용하세요.         │
│                                                                  │
│  ┌──────────┬────────────┬────────────────────┬────────┐        │
│  │ 필드     │ 기존 값    │ AI 제안 값         │ 신뢰도 │        │
│  ├──────────┼────────────┼────────────────────┼────────┤        │
│  │ 답변 내용│ (비어있음) │ [수정 가능____]    │ 95% 🟢 │        │
│  │ 우선순위 │ 보통       │ [높음 ▼]          │ 88% 🟢 │        │
│  └──────────┴────────────┴────────────────────┴────────┘        │
│                                                                  │
│                              [취소]  [적용]                      │
└─────────────────────────────────────────────────────────────────┘
```

## 변형 (Variants)

### 로딩 상태

- 중앙에 Spinner 표시
- "AI가 결과를 생성 중입니다..." 메시지 표시

### 빈 상태

- AI가 채운 필드가 없을 때 "AI가 채운 필드가 없습니다." 메시지 표시

### 입력 필드 타입별 렌더링

| 값 타입        | 렌더링 컴포넌트 | 설명                     |
| -------------- | --------------- | ------------------------ |
| 긴 문자열 (>50)| Textarea        | 여러 줄 입력 가능        |
| 불리언         | Select          | 예/아니오 선택           |
| 기타           | input (text)    | 기본 텍스트 입력         |

### 신뢰도 표시

| 신뢰도 범위 | 색상    | 아이콘 |
| ----------- | ------- | ------ |
| 80-100%     | success | 🟢     |
| 50-79%      | warning | 🟡     |
| 0-49%       | danger  | 🔴     |

## 이벤트

| 이벤트          | 핸들러       | 설명                           |
| --------------- | ------------ | ------------------------------ |
| 취소 버튼 클릭  | onClose      | 모달 닫기                      |
| 적용 버튼 클릭  | onConfirm    | 수정된 값 전달 후 모달 닫기    |
| 값 변경         | 내부 상태    | editedValues 업데이트          |

## 접근성

- 테이블 헤더와 본문 구분
- 키보드로 입력 필드 접근 가능
- 모달 포커스 트랩 적용 (HeroUI Modal 기본 기능)

## 의존성

### HeroUI 컴포넌트

- Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
- Select, SelectItem
- Textarea
- Chip
- Spinner

### 내부 컴포넌트

- HStack
- VStack
- Text
- Button

## 사용 예시

```tsx
import { AIFormPreviewModal } from "@cocrepo/ui";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AIFormPreviewModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={(values) => {
        console.log("적용된 값:", values);
        setIsOpen(false);
      }}
      originalValues={{ title: "", priority: "medium" }}
      aiValues={{ title: "AI 제안 제목", priority: "high" }}
      appliedFields={["title", "priority"]}
      confidence={{ title: 95, priority: 88 }}
      fieldLabels={{ title: "제목", priority: "우선순위" }}
    />
  );
}
```

## 변경 이력

| 일자       | 내용         | 작성자             |
| ---------- | ------------ | ------------------ |
| 2025-02-26 | 초기 생성    | fe-ui-component-builder |
