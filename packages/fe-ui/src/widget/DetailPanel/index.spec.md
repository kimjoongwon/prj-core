# DetailPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/DetailPanel/

## 역할

선택된 아이템의 상세 정보(메타데이터, 들어오는/나가는 연결 관계)를 시각화하는 패널입니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
아이템 선택 시 (기본 상태)
┌─────────────────────────────────┐
│ ╔═══════════════════════════╗   │
│ ║  [아이콘]  아이템 이름     ║   │  ← headerBgColor 배경
│ ║  [타입] [레벨] [경로]      ║   │  ← Chip 라벨들
│ ╚═══════════════════════════╝   │
│  설명 텍스트...                  │
│ ─────────────────────────────── │
│  메타데이터                      │
│  · 필드명1   값1                  │
│  · 필드명2   값2                  │
│ ─────────────────────────────── │
│  들어오는 연결 (2)                │
│  [아이콘] 연결 아이템A  [타입]    │
│  [아이콘] 연결 아이템B  [타입]    │
│ ─────────────────────────────── │
│  나가는 연결 (1)                  │
│  [아이콘] 연결 아이템C  [타입]    │
│                  [actionButton]  │
└─────────────────────────────────┘

아이템 미선택 시 (빈 상태)
┌─────────────────────────────────┐
│                                 │
│       아이템을 선택하면          │
│      상세 정보가 표시됩니다      │
│                                 │
└─────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 아이템 선택 | 헤더(색상 배경) + 메타데이터 + 연결 관계 목록 |
| 빈 상태 | 안내 메시지 중앙 표시 |
| 연결 없음 | 메타데이터만 표시, 연결 섹션 숨김 |

## Props

```typescript
interface DetailPanelProps {
  item: DetailItem | null;
  onConnectionClick?: (itemId: string) => void;
  actionButton?: ReactNode;
  emptyMessage?: string;      // 기본값: "아이템을 선택하면"
  emptyDescription?: string;  // 기본값: "상세 정보가 표시됩니다"
  className?: string;
}

interface DetailItem {
  id: string;
  name: string;
  description?: string;
  typeLabel?: string;
  levelLabel?: string;
  pathLabel?: string;
  icon?: ReactNode;
  headerBgColor?: string;
  iconBgColor?: string;
  metadata?: Record<string, string | number | boolean>;
  incomingConnections?: DetailConnection[];
  outgoingConnections?: DetailConnection[];
}

interface DetailConnection {
  id: string;
  itemId: string;
  itemName: string;
  typeLabel: string;
  typeColor?: string;
  icon?: ReactNode;
  iconBgColor?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Chip | 레벨/타입/경로 라벨 표시 |
| HeroUI Divider | 섹션 구분 |
| ConnectionButton (내부) | 연결 관계 클릭 버튼 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| actionButton | 상단에 표시되는 액션 버튼 (ReactNode) |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
