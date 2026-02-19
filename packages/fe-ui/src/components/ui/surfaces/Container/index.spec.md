# Container UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/Container/

## 역할

기본적인 flex-col 레이아웃을 제공하는 컨테이너. cva 기반의 간단한 래퍼이다.

## Props

```typescript
interface ContainerProps {
  /** 컨테이너 내부 콘텐츠 */
  children: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 기본 스타일

`flex flex-col` + className

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
