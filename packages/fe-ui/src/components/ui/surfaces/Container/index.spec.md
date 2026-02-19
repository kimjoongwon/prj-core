# Container UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/Container/

## 역할

기본적인 flex-col 레이아웃을 제공하는 컨테이너. cva 기반의 간단한 래퍼이다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 구조 - flex-col 레이아웃]
┌──────────────────────────────────┐
│  [자식 요소 A]                   │  ↑
│  [자식 요소 B]                   │  │ flex-col (세로 방향)
│  [자식 요소 C]                   │  ↓
└──────────────────────────────────┘

[className 추가 예시 - w-full h-full]
┌──────────────────────────────────────────────────┐
│  [자식 요소 A]                                   │
│  [자식 요소 B]                                   │
└──────────────────────────────────────────────────┘
  너비/높이는 className으로 제어 (기본값 없음)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | flex flex-col 래퍼 (배경/테두리 없음) |
| className 추가 | 전달한 Tailwind 클래스 추가 적용 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
