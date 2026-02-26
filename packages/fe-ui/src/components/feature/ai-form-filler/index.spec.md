# AIFormFiller Feature 기획서

## 개요

AI 폼 채우기 기능을 제공하는 Feature 컴포넌트입니다.
사용자가 AI 템플릿을 선택하고, 추가 요청사항을 입력한 후
AI가 자동으로 폼 필드를 채우도록 도와줍니다.

## 위치

`packages/fe-ui/src/components/feature/ai-form-filler/`

## Store 연결

- `useAIFormTemplateStore` - AI 폼 템플릿 Store

## Props

| Prop | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `domain` | `string` | ✅ | 대상 도메인 (예: "Inquiry") |
| `currentValues` | `Record<string, unknown>` | ✅ | 현재 폼 값 |
| `onApply` | `(values: Record<string, unknown>) => void` | ✅ | 적용 콜백 |
| `fieldLabels` | `Record<string, string>` | ⚪ | 필드명 → 레이블 매핑 |
| `disabled` | `boolean` | ⚪ | 비활성화 여부 |
| `onPreviewAI` | `(templateId, context, userPrompt?) => Promise<AIFormPreviewResponse>` | ✅ | AI 미리보기 실행 함수 |

## UI 구성

```
┌───────────────────────────────────────────────────────────────────────────┐
│ [AI 폼 선택 ▼] [친절한 어조로 답변해주세요 ______] [✨ AI 채우기]          │
└───────────────────────────────────────────────────────────────────────────┘
```

### 구성 요소

1. **AIFormSelector (Widget)**
   - 도메인별 AI 템플릿 선택
   - 검색 기능 지원

2. **Input (프롬프트 입력)**
   - 사용자 추가 요청사항 입력
   - 선택적 입력

3. **Button (AI 채우기)**
   - AI 실행 트리거
   - 로딩 상태 표시

4. **Modal (미리보기)**
   - AI 실행 결과 표시
   - 필드별 값 확인
   - 신뢰도 표시
   - 제안 사항 표시

## 이벤트

| 이벤트 | 시점 | 동작 |
|--------|------|------|
| 템플릿 선택 | 드롭다운에서 선택 | `store.setCurrentTemplate()` 호출 |
| AI 채우기 클릭 | 버튼 클릭 | 미리보기 API 호출 → 모달 표시 |
| 적용 클릭 | 모달 내 버튼 | `onApply(values)` 호출 |
| 취소 클릭 | 모달 내 버튼 | 모달 닫기 |

## 상태 관리

### 로컬 상태

- `selectedTemplate` - 선택된 템플릿
- `userPrompt` - 사용자 프롬프트 입력값
- `isLoading` - 로딩 상태
- `isModalOpen` - 모달 열림 상태
- `previewResult` - 미리보기 결과
- `errorMessage` - 에러 메시지

### Store 상태

- `store.templates` - 전체 템플릿 목록
- `store.currentTemplate` - 현재 선택된 템플릿
- `store.previewResult` - 미리보기 결과

## 사용 예시

```tsx
import { AIFormFiller } from "@cocrepo/ui";

function InquiryForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      priority: "NORMAL",
    },
  });

  const handlePreviewAI = async (templateId, context, userPrompt) => {
    // API 호출
    const response = await fetch("/api/ai-form/preview", {
      method: "POST",
      body: JSON.stringify({ templateId, context, userPrompt }),
    });
    return response.json();
  };

  const handleApplyAI = (values) => {
    form.setValues(values);
  };

  return (
    <VStack gap={4}>
      <AIFormFiller
        domain="Inquiry"
        currentValues={form.values}
        onApply={handleApplyAI}
        fieldLabels={{
          title: "제목",
          content: "내용",
          priority: "우선순위",
        }}
        onPreviewAI={handlePreviewAI}
      />

      {/* 폼 필드들 */}
      <Input {...form.register("title")} label="제목" />
      <Textarea {...form.register("content")} label="내용" />
    </VStack>
  );
}
```

## 접근성

- 모든 입력 필드에 적절한 label 연결
- 로딩 상태 시 스피너와 텍스트로 상태 표시
- 에러 메시지는 명확하게 표시
- 키보드 네비게이션 지원

## 에러 처리

| 상황 | 처리 |
|------|------|
| 템플릿 미선택 | "템플릿을 선택해주세요." 메시지 표시 |
| API 호출 실패 | 에러 메시지 모달에 표시 |
| 네트워크 오류 | "AI 실행 중 오류가 발생했습니다." 표시 |

## 의존성

### Widget

- `AIFormSelector` - 템플릿 선택 위젯

### UI

- `HStack`, `VStack` - 레이아웃
- `Button`, `Input`, `Chip` - HeroUI 컴포넌트
- `Modal` - 모달 다이얼로그
- `Spinner` - 로딩 표시

### Store

- `AIFormTemplateStore` - 템플릿 상태 관리

### Type

- `AIFormTemplate` - 템플릿 타입
- `AIFormPreviewResponse` - 미리보기 응답 타입

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | fe-feature-builder |
