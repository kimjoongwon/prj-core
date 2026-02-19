# TemplateTypeBadge Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/TemplateTypeBadge/

## 역할

메시지 템플릿 유형(EMAIL/SMS/PUSH)을 컬러 코딩된 Badge로 표시합니다. EMAIL=primary, SMS=secondary, PUSH=warning.

## Props

```typescript
interface TemplateTypeBadgeProps {
  type: "EMAIL" | "SMS" | "PUSH";
  size?: "sm" | "md" | "lg";  // 기본값: "md"
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Chip | 컬러 배지 렌더링 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
