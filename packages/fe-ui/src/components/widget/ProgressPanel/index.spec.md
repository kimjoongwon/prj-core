# ProgressPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ProgressPanel/

## 역할

작업 진행 상황을 프로그레스바와 함께 시각적으로 표시합니다. 대기/처리중/완료/에러 4가지 상태를 지원합니다.

## Props

```typescript
interface ProgressPanelProps {
  state: ProgressState | null;
  statusLabels?: Record<ProgressStatus, string>;
  loadingIcon?: ReactNode;
  hideOnComplete?: boolean;     // 기본값: true
  className?: string;
}

type ProgressStatus = "queued" | "processing" | "completed" | "error";

interface ProgressState {
  status: ProgressStatus;
  progress?: number;
  error?: string;
  currentStep?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Progress | 진행률 바 |
| Loader2 (Lucide) | 기본 로딩 아이콘 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
