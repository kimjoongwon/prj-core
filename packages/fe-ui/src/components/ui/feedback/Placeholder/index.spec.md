# Placeholder UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/Placeholder/

## 역할

데이터가 없을 때 "데이터가 존재하지 않습니다." 메시지를 중앙에 표시하는 간단한 컴포넌트.

## Props

```typescript
// Props 없음
```

## 고정 출력

"데이터가 존재하지 않습니다." (text-gray-500)

## 내부 의존성

- `Text` (data-display/Text)
- `VStack` (surfaces/VStack)

## 관련 컴포넌트

더 풍부한 빈 상태 UI가 필요하면 `EmptyState` 사용.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
