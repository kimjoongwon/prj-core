# TemplateForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/form/TemplateForm/

## 역할

메시지 템플릿 등록/수정 공용 폼입니다. 4개 섹션으로 구성됩니다: 기본 정보(유형, 코드, 이름, 설명), 콘텐츠(TemplateContentEditor), 변수 관리(VariableEditTable), 버튼 영역. 수정 모드에서 유형과 코드는 읽기 전용입니다.
이 widget은 입력 블록만 렌더링하며 `PageSurface`, `SectionSurface` 같은 Surface는 소유하지 않습니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  --- create 모드 ---

  ┌─────────────────────────────────────────────────────┐
  │ [섹션 1] 기본 정보                                   │
  │                                                     │
  │  유형                                               │
  │  ◉ EMAIL   ○ SMS   ○ PUSH                          │
  │                                                     │
  │  코드 *                                              │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ WELCOME_EMAIL                                 │  │
  │  └───────────────────────────────────────────────┘  │
  │                                                     │
  │  이름 *                                              │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ 회원 가입 환영 이메일                          │  │
  │  └───────────────────────────────────────────────┘  │
  │                                                     │
  │  설명                                               │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ 신규 가입 시 발송되는 환영 이메일              │  │
  │  └───────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────┐
  │ [섹션 2] 콘텐츠 (EMAIL 유형)                         │
  │                                                     │
  │  제목                                               │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ [이름]님, 환영합니다!                         │  │
  │  └───────────────────────────────────────────────┘  │
  │                                                     │
  │  본문 (HTML 편집기)                                  │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ <html>...                                     │  │
  │  │                                               │  │
  │  └───────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────┐
  │ [섹션 3] 변수 관리                                   │
  │                                                     │
  │  ┌──────────────┬──────────────┬──────────────────┐ │
  │  │ 변수명       │ 설명         │ 기본값            │ │
  │  ├──────────────┼──────────────┼──────────────────┤ │
  │  │ name         │ 사용자 이름  │ 홍길동            │ │
  │  │ email        │ 이메일 주소  │                  │ │
  │  └──────────────┴──────────────┴──────────────────┘ │
  │  [+ 변수 추가]                                       │
  └─────────────────────────────────────────────────────┘

  [취소]                                    [💾 등록]

  --- edit 모드 차이점 ---

  유형: [EMAIL] (배지, 읽기 전용)
  코드: WELCOME_EMAIL  (읽기 전용 Input)
  버튼: [취소] [💾 저장]
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| create 모드 (EMAIL) | 유형 라디오 선택 + 제목/HTML 편집기 |
| create 모드 (SMS) | 유형 라디오 선택 + 문자 내용 편집기 |
| create 모드 (PUSH) | 유형 라디오 선택 + 푸시 제목/내용 편집기 |
| edit 모드 | 유형 배지(읽기전용) + 코드 읽기전용, 버튼 "저장" |
| 제출 중 | 저장/등록 버튼 비활성화 + 스피너 |
| 유효성 에러 | 각 필드 하단에 에러 메시지 표시 |

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
| 섹션 영역 | 3개 섹션 컨테이너 (기본 정보, 콘텐츠, 변수 관리) |
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

## Surface ownership

- Surface owner는 항상 호출 페이지입니다.
- `TemplateForm`은 내부 섹션 제목과 입력 컴포넌트만 렌더링하고 background/elevation은 만들지 않습니다.

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `TemplateForm`이 Surface를 소유하지 않고 페이지가 외부에서 표면을 제공한다는 규칙을 추가 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
