# DetailPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/DetailPanel/

## 역할

선택된 아이템의 상세 정보(메타데이터, 들어오는/나가는 연결 관계)를 시각화하는 패널입니다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
