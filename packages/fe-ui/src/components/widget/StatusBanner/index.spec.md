# StatusBanner Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/StatusBanner/

## 역할

서비스 연결 상태(connected/disconnected/checking)와 제어 액션을 표시하는 배너입니다. 새로고침, 커스텀 액션 버튼, 추가 상태 정보를 지원합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[연결됨 (status=connected)]
┌──────────────────────────────────────────────────────────────┐
│  📶 연결됨   [API 서버]  [버전: 2.1.0]  [응답: 42ms]          │
│                                   마지막 확인: 방금 전  [↻]  │
└──────────────────────────────────────────────────────────────┘

[연결 끊김 (status=disconnected)]
┌──────────────────────────────────────────────────────────────┐
│  📵 연결 안됨  [IDP 서버]  연결을 확인해주세요.                │
│                           [재시도]  마지막 확인: 5분 전  [↻]  │
└──────────────────────────────────────────────────────────────┘

[확인 중 (status=checking)]
┌──────────────────────────────────────────────────────────────┐
│  ⏳ 확인 중...  [API 서버]                                    │
│                                                마지막 확인: - │
└──────────────────────────────────────────────────────────────┘

[커스텀 액션 포함]
┌──────────────────────────────────────────────────────────────┐
│  📶 연결됨  [메시지 서버]  [큐: 0]                            │
│                         [설정]  [재시작]       [↻]           │
└──────────────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| connected | 초록색 Wifi 아이콘 + 연결됨 레이블 + 상태 정보 Chip |
| disconnected | 빨간색 WifiOff 아이콘 + 연결 안됨 레이블 + 오류 메시지 |
| checking | 회전 Spinner + 확인 중 레이블 |
| 커스텀 액션 | 우측에 추가 버튼 렌더링 |
| 새로고침 중 (isRefreshing=true) | 새로고침 버튼 로딩 표시 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
