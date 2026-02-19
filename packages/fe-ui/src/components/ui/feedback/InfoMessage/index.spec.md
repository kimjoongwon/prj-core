# InfoMessage UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/InfoMessage/

## 역할

다양한 상태(info, warning, error, success)의 알림 메시지를 표시하는 컴포넌트. cva 기반으로 variant별 배경/아이콘/텍스트 색상이 자동 적용된다.

## Props

```typescript
interface InfoMessageProps {
  /** 메시지 본문 */
  message: string;
  /** 메시지 유형 @default "info" */
  variant?: "info" | "warning" | "error" | "success";
  /** 커스텀 아이콘 */
  icon?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 변형 (Variants)

| 변형 | 배경 | 아이콘 | 기본 이모지 |
|------|------|--------|-------------|
| info | bg-blue-50 / bg-blue-950 | text-blue-600 | 정보(i) |
| warning | bg-yellow-50 / bg-yellow-950 | text-yellow-600 | 경고 |
| error | bg-red-50 / bg-red-950 | text-red-600 | X |
| success | bg-green-50 / bg-green-950 | text-green-600 | 체크 |

## 내부 의존성

- `Text` (data-display/Text)
- `HStack` (surfaces/HStack)

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
