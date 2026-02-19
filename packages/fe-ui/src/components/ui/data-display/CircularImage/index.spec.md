# CircularImage UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/CircularImage/

## 역할

원형으로 잘린 이미지를 표시하는 컴포넌트. 프로필 사진, 아바타 등에 사용한다.

## Props

```typescript
interface CircularImageProps {
  /** 이미지 소스 URL */
  src: string;
  /** 대체 텍스트 */
  alt: string;
  /** 이미지 크기 @default "md" */
  size?: "sm" | "md" | "lg";
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 크기 (Sizes)

| 크기 | CSS 클래스 |
|------|-----------|
| sm | w-10 h-10 |
| md | w-14 h-14 |
| lg | w-20 h-20 |

## HeroUI 매핑

유틸만 사용: `import { cn } from '@heroui/react'`

순수 `<img>` 태그 기반 구현.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
