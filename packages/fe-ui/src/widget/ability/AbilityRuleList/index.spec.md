# AbilityRuleList Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/ability/AbilityRuleList/

## 역할

Ability 규칙 목록을 테이블 형태로 표시합니다. 우선순위, 이름, Subject, Action(필드 포함), 조건, 활성화 상태, 작업(수정/삭제) 컬럼을 제공합니다. 거부(inverted) 규칙은 배경색을 danger로 구분합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
                                          [+ 규칙 추가]
┌────┬──────────────┬────────────┬───────────────────┬──────────┬────────┬──────┐
│ 순위│ 이름         │ Subject    │ Action             │ 조건     │ 활성   │ 작업 │
├────┼──────────────┼────────────┼───────────────────┼──────────┼────────┼──────┤
│  1 │ 게시물 조회  │ Post       │ read              │   -      │  ●     │ ✎ 🗑 │
├────┼──────────────┼────────────┼───────────────────┼──────────┼────────┼──────┤
│  2 │ 내 게시물만  │ Post       │ update            │ {조건}   │  ●     │ ✎ 🗑 │
│    │              │            │ fields: title,    │          │        │      │
│    │              │            │ content           │          │        │      │
├────┼──────────────┼────────────┼───────────────────┼──────────┼────────┼──────┤
│  3 │ [거부]삭제금지│ Post      │ delete            │   -      │  ○     │ ✎ 🗑 │
│    │ (배경 danger) │            │                   │          │        │      │
└────┴──────────────┴────────────┴───────────────────┴──────────┴────────┴──────┘

  [로딩 중: 스피너 표시]
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 허용 규칙 (inverted=false) | 일반 행 배경 |
| 거부 규칙 (inverted=true) | danger 색상 배경, [거부] 배지 표시 |
| 조건 있음 | 조건 셀에 Chip 표시, Tooltip으로 JSON 미리보기 |
| 비활성 | Switch 꺼진 상태 (○) |
| 로딩 중 | 테이블 대신 스피너 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
