# StatusBanner Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/StatusBanner/

## 역할

서비스 연결 상태(connected/disconnected/checking)와 제어 액션을 표시하는 배너입니다. 새로고침, 커스텀 액션 버튼, 추가 상태 정보를 지원합니다.

## Props

```typescript
interface StatusBannerProps {
  status: ConnectionStatus;
  serviceName: string;
  serviceUrl?: string;
  connectedLabel?: string;
  disconnectedLabel?: string;
  checkingLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastChecked?: Date;
  statusInfos?: StatusInfo[];
  actions?: StatusAction[];
  message?: string;
  isProcessing?: boolean;
  className?: string;
}

type ConnectionStatus = "connected" | "disconnected" | "checking";
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Chip | 상태/추가 정보 배지 |
| HeroUI Button | 새로고침/커스텀 액션 |
| HeroUI Tooltip | 추가 정보 툴팁 |
| HeroUI Spinner | 확인 중 로딩 |
| Wifi/WifiOff (Lucide) | 연결 상태 아이콘 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
