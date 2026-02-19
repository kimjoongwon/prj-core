# Section UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/Section/

## 역할

테두리와 패딩이 적용된 기본 섹션 영역 컴포넌트.

## Props

```typescript
interface SectionProps {
  /** 섹션 내부 콘텐츠 */
  children: ReactNode;
}
```

## 기본 스타일

`flex w-full flex-1 flex-col space-y-4 rounded-xl border-1 p-4`

## 관련 컴포넌트

엘리베이션 시스템을 사용하려면 `SectionSurface`를 권장.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
