# DiagramViewer Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/DiagramViewer/

## 역할

Mermaid 기반 다이어그램(flowchart, sequence diagram 등)을 시각화하는 뷰어입니다.

## Props

```typescript
interface DiagramViewerProps {
  diagram: string;
  theme?: "dark" | "default" | "forest" | "neutral";  // 기본값: "dark"
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| mermaid (라이브러리) | 다이어그램 SVG 렌더링 |

## 상태 관리

로컬: containerRef로 DOM 직접 조작, Mermaid 초기화 플래그(모듈 레벨)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
