# PageHeader Widget 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/PageHeader/

## 역할

페이지 상단의 제목/설명/액션 영역을 표준화하는 헤더 컴포넌트입니다.
`_client.tsx`에서 반복되는 페이지 헤더 마크업을 대체합니다.

## Props

```typescript
interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}
```

## 동작

- 좌측에 `title(h1)`와 `description`을 배치합니다.
- 우측에 `actions` 슬롯을 배치합니다.
- 레이아웃 클래스는 `flex items-start justify-between gap-4`를 기본 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | `_client.tsx` 반복 헤더 패턴 제거를 위해 신규 생성 | codex |
