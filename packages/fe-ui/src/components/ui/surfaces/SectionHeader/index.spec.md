# SectionHeader UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/SectionHeader/

## 역할

섹션의 제목을 대문자 캡션 스타일로 표시하는 컴포넌트.

## Props

```typescript
interface SectionHeaderProps {
  /** 헤더 텍스트 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 기본 스타일

Text variant="caption" + `uppercase mb-2`

## 내부 의존성

- `Text` (data-display/Text)

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
