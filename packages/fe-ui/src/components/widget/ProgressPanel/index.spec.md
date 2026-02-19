# ProgressPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ProgressPanel/

## 역할

작업 진행 상황을 프로그레스바와 함께 시각적으로 표시합니다. 대기/처리중/완료/에러 4가지 상태를 지원합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
queued 상태 (대기 중)
┌────────────────────────────────────────┐
│  [⏸]  대기 중                          │  ← 상태 아이콘 + 라벨
│  ████░░░░░░░░░░░░░░░░░░░  0%           │  ← Progress 바
└────────────────────────────────────────┘

processing 상태 (처리 중)
┌────────────────────────────────────────┐
│  [⟳]  처리 중...          현재 단계명  │  ← loadingIcon + currentStep
│  ████████████░░░░░░░░░░░  60%          │  ← 진행률 표시
└────────────────────────────────────────┘

completed 상태 (완료)
┌────────────────────────────────────────┐
│  [✓]  완료                             │  ← 완료 아이콘
│  ████████████████████████  100%        │  ← 꽉 찬 프로그레스 바
└────────────────────────────────────────┘
(hideOnComplete: true 이면 자동 숨김)

error 상태 (에러)
┌────────────────────────────────────────┐
│  [✕]  오류 발생                        │  ← 에러 아이콘
│  ████████░░░░░░░░░░░░░░░               │  ← 에러 시 멈춘 진행률
│  오류 메시지 내용이 여기에 표시됩니다   │  ← state.error 텍스트
└────────────────────────────────────────┘

state: null (미표시)
(컴포넌트 숨김)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| queued | 대기 아이콘 + 0% 프로그레스 바 |
| processing | 로딩 아이콘(회전) + 진행률 % + 현재 단계명 |
| completed | 완료 아이콘 + 100% 바 (hideOnComplete 시 숨김) |
| error | 에러 아이콘 + 멈춘 바 + 오류 메시지 |
| state: null | 렌더링 없음 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
