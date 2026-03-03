# PageTitleBar Widget 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/PageTitleBar/

## 역할

페이지/섹션 상단의 제목/설명/액션 영역을 표준화하는 타이틀 바 컴포넌트입니다.
`_client.tsx`에서 반복되는 헤더 마크업을 대체합니다.

## Props

```typescript
interface PageTitleBarProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  level?: 1 | 2; // default: 1
  className?: string;
}
```

## 동작

- 좌측에 `title`과 `description`을 배치합니다.
- 우측에 `actions` 슬롯을 배치합니다.
- `level=1`이면 `h1`, `level=2`이면 `h2`로 렌더링합니다.
- 레이아웃 클래스는 `flex items-start justify-between gap-4`를 기본 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | `_client.tsx` 반복 헤더 패턴 제거를 위해 신규 생성 | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
