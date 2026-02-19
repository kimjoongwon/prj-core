# AbilityRuleList Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ability/AbilityRuleList/

## 역할

Ability 규칙 목록을 테이블 형태로 표시합니다. 우선순위, 이름, Subject, Action(필드 포함), 조건, 활성화 상태, 작업(수정/삭제) 컬럼을 제공합니다. 거부(inverted) 규칙은 배경색을 danger로 구분합니다.

## Props

```typescript
interface AbilityRuleListProps {
  rules: AbilityRule[];
  loading?: boolean;                                    // 기본값: false
  onAddRule?: () => void;
  onEditRule?: (rule: AbilityRule) => void;
  onDeleteRule?: (ruleId: string) => void;
  onToggleActive?: (ruleId: string, isActive: boolean) => void;
}

interface AbilityRule {
  id: string;
  name?: string;
  subjectName: string;
  subjectDisplayName?: string;
  actionName: string;
  actionDisplayName?: string;
  inverted: boolean;
  fields: string[];
  conditions?: Record<string, unknown>;
  isActive: boolean;
  priority: number;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Table | 규칙 테이블 |
| HeroUI Chip | 거부 배지, 조건 있음 표시 |
| HeroUI Tooltip | Subject/Action 전체명, 조건 JSON 미리보기 |
| HeroUI Button | 규칙 추가, 수정(Edit2), 삭제(Trash2) 아이콘 버튼 |
| HeroUI Spinner | 로딩 표시 |
| Switch (커스텀) | 활성화 상태 토글 |
| lucide-react 아이콘 | Plus, Edit2, Trash2 |
| VStack, HStack | 레이아웃 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
