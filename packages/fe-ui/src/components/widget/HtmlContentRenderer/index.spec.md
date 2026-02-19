# HtmlContentRenderer Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/HtmlContentRenderer/

## 역할

EMAIL 유형의 HTML 본문을 안전하게 렌더링합니다. iframe sandbox로 격리하고, script 태그를 사전 제거하여 XSS를 방지합니다.

## Props

```typescript
interface HtmlContentRendererProps {
  html: string;
  maxHeight?: number;  // 기본값: 400
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| iframe | sandbox 환경에서 HTML 렌더링 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
