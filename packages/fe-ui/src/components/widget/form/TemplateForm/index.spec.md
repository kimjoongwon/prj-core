# TemplateForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/form/TemplateForm/

## 역할

메시지 템플릿 등록/수정 공용 폼입니다. 4개 섹션으로 구성됩니다: 기본 정보(유형, 코드, 이름, 설명), 콘텐츠(TemplateContentEditor), 변수 관리(VariableEditTable), 버튼 영역. 수정 모드에서 유형과 코드는 읽기 전용입니다.

## Props

```typescript
interface TemplateFormProps {
  mode: "create" | "edit";
  formData: TemplateFormData;
  variables: VariableEditItem[];
  onFormDataChange: (data: Partial<TemplateFormData>) => void;
  onVariablesChange: (variables: VariableEditItem[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  errors?: Record<string, string>;
  variableErrors?: Record<number, Record<string, string>>;
}

interface TemplateFormData {
  type: "EMAIL" | "SMS" | "PUSH";
  code: string;
  name: string;
  description: string;
  subject: string;
  content: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| SectionSurface | 3개 섹션 컨테이너 (기본 정보, 콘텐츠, 변수 관리) |
| TemplateTypeBadge | 수정 모드 유형 배지 |
| TemplateContentEditor | 유형별 콘텐츠 편집기 |
| VariableEditTable | 변수 인라인 편집 테이블 |
| HeroUI Input | 코드, 이름 입력 |
| HeroUI Textarea | 설명 입력 |
| HeroUI RadioGroup + Radio | 유형 선택 (EMAIL/SMS/PUSH) |
| HeroUI Button | 취소, 등록/저장 |
| VStack | 레이아웃 |

## 상태 관리

**없음** (외부에서 formData, variables 상태를 관리)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
