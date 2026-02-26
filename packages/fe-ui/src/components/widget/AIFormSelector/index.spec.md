# AIFormSelector Widget

## 개요

도메인별 AI 폼 템플릿을 선택할 수 있는 드롭다운 위젯 컴포넌트입니다.

## 역할

- **계층**: Widget (Pure UI 조합)
- **용도**: AI 폼 템플릿 선택 UI 제공

## UI 구성

```
┌─────────────────────────────────────────────────────────────────┐
│ [✨ AI 폼 선택 ▼]                                               │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [🔍 템플릿 검색...]                                         │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ ✨ 문의 자동 분류                                           │ │
│ │    고객 문의를 자동으로 분류합니다                          │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ ✨ 감정 분석                                                │ │
│ │    고객 감정을 분석합니다                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Props

| Prop | Type | Required | Default | 설명 |
|------|------|:--------:|---------|------|
| `domain` | `string` | ✅ | - | 대상 도메인 (예: "Inquiry", "Member") |
| `templates` | `AIFormTemplate[]` | ✅ | - | 선택 가능한 템플릿 목록 |
| `onSelect` | `(template: AIFormTemplate) => void` | ✅ | - | 템플릿 선택 시 호출되는 콜백 |
| `selectedTemplateId` | `string` | ❌ | - | 현재 선택된 템플릿 ID |
| `disabled` | `boolean` | ❌ | `false` | 비활성화 여부 |
| `placeholder` | `string` | ❌ | `"AI 폼 선택"` | 플레이스홀더 텍스트 |

## 타입 정의

### AIFormSelectorProps

```typescript
interface AIFormSelectorProps extends Omit<SelectProps, "children" | "selectedKeys" | "onSelectionChange"> {
  domain: string;
  templates: AIFormTemplate[];
  onSelect: (template: AIFormTemplate) => void;
  selectedTemplateId?: string;
  disabled?: boolean;
  placeholder?: string;
}
```

### AIFormTemplate (from @cocrepo/type)

```typescript
interface AIFormTemplate {
  id: string;
  spaceId: string;
  name: string;
  description?: string;
  targetDomain: string;
  targetEntity?: string;
  aiProvider: AIProvider;
  model?: string;
  systemPrompt?: string;
  status: AITemplateStatus;
  priority: number;
  allowUserPrompt: boolean;
  // ... 기타 필드
}
```

## 기능

### 1. 도메인 필터링
- `domain` prop과 일치하는 `targetDomain`을 가진 템플릿만 표시
- 활성 상태(`status === "ACTIVE"`)인 템플릿만 표시

### 2. 검색 기능
- 템플릿 이름과 설명에서 검색어 필터링
- 실시간 검색 (debounce 없음)

### 3. 선택 표시
- 선택된 템플릿의 이름과 아이콘 표시
- Sparkles 아이콘으로 AI 기능 식별

## 사용 예시

### 기본 사용법

```tsx
import { AIFormSelector } from "@cocrepo/ui";
import type { AIFormTemplate } from "@cocrepo/type";

function InquiryForm() {
  const [selectedTemplate, setSelectedTemplate] = useState<AIFormTemplate | null>(null);

  return (
    <AIFormSelector
      domain="Inquiry"
      templates={templates}
      selectedTemplateId={selectedTemplate?.id}
      onSelect={setSelectedTemplate}
    />
  );
}
```

### 비활성화 상태

```tsx
<AIFormSelector
  domain="Inquiry"
  templates={templates}
  onSelect={handleSelect}
  disabled={true}
  placeholder="AI 폼을 사용할 수 없습니다"
/>
```

### 커스텀 스타일

```tsx
<AIFormSelector
  domain="Member"
  templates={templates}
  onSelect={handleSelect}
  classNames={{
    base: "w-full",
    trigger: "bg-primary/10",
  }}
/>
```

## 의존성

### 외부 패키지
- `@cocrepo/type`: `AIFormTemplate` 타입
- `@heroui/react`: `Select`, `SelectItem`, `Input` 컴포넌트
- `lucide-react`: `Search`, `Sparkles` 아이콘
- `mobx-react-lite`: `observer`

## 접근성

- `aria-label` 속성으로 검색 입력 필드 식별
- 키보드 네비게이션 지원 (HeroUI Select 기본 기능)
- 선택된 항목의 텍스트 값 제공

## 주의사항

1. **템플릿 데이터**: Feature 레이어에서 API를 통해 템플릿 목록을 조회하여 전달해야 합니다.
2. **도메인 일치**: `domain` prop과 `targetDomain`이 정확히 일치해야 필터링됩니다.
3. **상태 필터링**: `ACTIVE` 상태인 템플릿만 표시됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | fe-widget-builder |
