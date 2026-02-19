# AbilityFormModal Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ability/AbilityFormModal/

## 역할

Ability 규칙을 추가/수정하는 모달 폼입니다. Subject 선택(그룹별 분류), Action 선택(그룹별 분류), 허용/거부 설정, 대상 필드 체크박스, 조건 편집기(ConditionEditor), 우선순위, 활성화 상태를 포함합니다. create/edit 모드를 지원합니다.

## Props

```typescript
interface AbilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AbilityFormData) => void;
  initialData?: Partial<AbilityFormData>;
  subjects: Subject[];
  actions: Action[];
  subjectFields?: string[];
  loading?: boolean;
  mode: "create" | "edit";
}

interface AbilityFormData {
  name?: string;
  subjectId?: string;
  subjectName?: string;
  actionId?: string;
  actionName?: string;
  fields: string[];
  conditions?: Record<string, unknown> | null;
  inverted: boolean;
  reason?: string;
  isActive: boolean;
  priority: number;
}

interface Subject {
  id: string;
  name: string;
  displayName?: string;
  group?: string;
}

interface Action {
  id: string;
  name: string;
  displayName?: string;
  group?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Modal | 모달 컨테이너 (size="2xl", scrollBehavior="inside") |
| HeroUI Select + SelectSection | Subject/Action 그룹별 선택 |
| Input (커스텀) | 규칙 이름, 거부 사유, 우선순위 입력 |
| RadioGroup (커스텀) | 허용(can)/거부(cannot) 선택 |
| HeroUI CheckboxGroup | 대상 필드 다중 선택 |
| Checkbox (커스텀) | 활성화 상태 토글 |
| ConditionEditor | CASL 조건 JSON 편집 |
| HeroUI Button | 취소/저장 버튼 |
| VStack, HStack | 레이아웃 |

## 상태 관리

로컬: formData (useState), errors (useState). 모달 open 시 initialData로 초기화.

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
