# Logo UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/Logo/

## 역할

앱 로고를 표시하는 버튼 컴포넌트. 클릭 시 홈으로 이동하는 용도로 사용한다.

## Props

```typescript
interface LogoProps {
  /** 클릭 핸들러 (보통 홈으로 이동) */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 커스텀 로고 콘텐츠 (미사용) */
  children?: React.ReactNode;
}
```

## 표시 내용

고정 텍스트 "플레이트"를 `font-bold text-2xl` 스타일로 표시.

## 내부 의존성

- `Button` (inputs/Button)
- `HStack` (surfaces/HStack)

## HeroUI 매핑

유틸만 사용: `import { cn } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
