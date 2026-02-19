# Message UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/Message/

## 역할

정보성 알림 메시지를 간단히 표시하는 컴포넌트. 왼쪽 파란색 테두리 스타일의 알림 영역이다.

## Props

```typescript
interface MessageProps {
  /** 메시지 제목 */
  title: string;
  /** 메시지 본문 */
  message: string;
}
```

## 스타일

- 왼쪽 4px 파란색 보더 (`border-blue-500 border-l-4`)
- 파란색 배경 (`bg-blue-100`)
- 파란색 텍스트 (`text-blue-700`)
- `role="alert"` 접근성 속성 포함

## 내부 의존성

- `Text` (data-display/Text)

## 관련 컴포넌트

다양한 상태(info, warning, error, success)가 필요하면 `InfoMessage`를 사용.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
