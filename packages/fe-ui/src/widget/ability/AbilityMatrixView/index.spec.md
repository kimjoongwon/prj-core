# AbilityMatrixView Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/ability/AbilityMatrixView/

## 역할

Subject-Action 권한 매트릭스를 테이블로 표시합니다. 행은 필드 목록, 열은 역할 목록이며 각 셀은 가시성 상태(full/masked/hidden)를 VisibilityCell로 표시합니다. 편집 모드에서 셀 상태 변경이 가능합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  Post (게시물)
  ● 전체공개  ◑ 마스킹  ○ 숨김

  ┌──────────────┬──────────────┬──────────────┬──────────────┐
  │  필드         │  FULL_ACCESS │  MANAGE      │  VIEW        │
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  │  id          │  ● 전체공개  │  ● 전체공개  │  ● 전체공개  │
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  │  title       │  ● 전체공개  │  ● 전체공개  │  ◑ 마스킹    │
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  │  content     │  ● 전체공개  │  ◑ 마스킹    │  ○ 숨김      │
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  │  authorId    │  ● 전체공개  │  ○ 숨김      │  ○ 숨김      │
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  │  createdAt   │  ● 전체공개  │  ● 전체공개  │  ● 전체공개  │
  └──────────────┴──────────────┴──────────────┴──────────────┘

  [로딩 중]
  ┌──────────────┬──────────────┬──────────────┐
  │  필드         │  역할1       │  역할2       │
  ├──────────────┼──────────────┼──────────────┤
  │              │   [스피너]   │              │
  └──────────────┴──────────────┴──────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 읽기 전용 (기본) | 셀 클릭 불가, 상태 아이콘만 표시 |
| 편집 모드 (editable=true) | 셀 클릭 시 full → masked → hidden 순환 변경 |
| 로딩 중 (loading=true) | 테이블 위에 스피너 오버레이 |

## Props

```typescript
interface AbilityMatrixViewProps {
  subjectName: string;
  subjectDisplayName?: string;
  fields: MatrixField[];
  roles: MatrixRole[];
  matrix: MatrixCell[];
  editable?: boolean;       // 기본값: false
  onCellChange?: (fieldName: string, roleName: string, status: VisibilityStatus) => void;
  loading?: boolean;         // 기본값: false
}

interface MatrixField {
  name: string;
  displayName?: string;
}

interface MatrixRole {
  id: string;
  name: string;
  displayName?: string;
}

interface MatrixCell {
  fieldName: string;
  roleName: string;
  status: VisibilityStatus;  // "full" | "masked" | "hidden"
  abilityId?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Table | 매트릭스 테이블 (isStriped) |
| HeroUI Chip | 범례 아이템 (success/warning/danger) |
| HeroUI Spinner | 로딩 표시 |
| VisibilityCell | 각 셀의 가시성 상태 표시/편집 |
| lucide-react 아이콘 | CheckCircle, AlertTriangle, XCircle |
| VStack, HStack | 레이아웃 |

## 상태 관리

**없음** (순수 UI, 셀 상태는 matrix prop과 onCellChange 콜백으로 관리)

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
