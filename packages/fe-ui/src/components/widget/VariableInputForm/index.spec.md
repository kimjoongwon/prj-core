# VariableInputForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/VariableInputForm/

## 역할

미리보기/발송테스트 모달에서 공통으로 사용하는 변수 입력 폼입니다. 템플릿 변수 목록을 받아 각 변수에 대한 Input을 렌더링합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────┐
│  변수 입력                                               │
│                                                         │
│  수신자 이름 *                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 홍길동                                          │    │
│  └─────────────────────────────────────────────────┘    │
│  이름을 입력하세요                                       │
│                                                         │
│  주문 번호                                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│  주문 ID를 입력하세요                                    │
│                                                         │
│  만료일 *                                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘

[범례]
 *  = isRequired: true 표시
 회색 플레이스홀더 = defaultValue 또는 description 표시
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 라벨 + Input 목록 수직 나열 |
| 필수 필드 있음 | 라벨 우측에 `*` 표시, 빈 값 시 경고 처리 |
| 기본값 있음 | Input placeholder에 defaultValue 표시 |
| 변수 없음 | 빈 상태 (아무것도 렌더링하지 않음) |

## Props

```typescript
interface VariableInputFormProps {
  variables: TemplateVariable[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

interface TemplateVariable {
  id: string;
  name: string;
  description: string | null;
  defaultValue: string | null;
  isRequired: boolean;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| Input (커스텀) | 각 변수 입력 필드 |

## 상태 관리

**없음** (외부에서 values 상태를 관리)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
