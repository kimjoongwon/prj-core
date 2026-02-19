# HStack UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/HStack/

## 역할

자식 요소들을 가로(수평) 방향으로 배치하는 Flex 컨테이너. cva 기반으로 정렬, 간격 등을 props로 제어한다.

## Props

```typescript
interface HStackProps {
  /** 자식 요소들 */
  children?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 세로 정렬 (align-items) */
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  /** 가로 정렬 (justify-content) */
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 요소 간 간격 (px 단위) @default 4 */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
}
```

## 기본 스타일

`flex` + gap/alignItems/justifyContent/fullWidth에 따른 Tailwind 클래스

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
