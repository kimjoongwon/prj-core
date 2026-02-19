# Text UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/Text/

## 역할

다양한 텍스트 스타일 프리셋을 제공하는 타이포그래피 컴포넌트. class-variance-authority(cva) 기반으로 variant에 따라 시맨틱 HTML 태그를 자동 선택한다.

## Props

```typescript
interface TextProps extends HTMLAttributes<HTMLElement> {
  /** 텍스트 변형 (스타일 프리셋) @default "body1" */
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    | "caption" | "subtitle1" | "subtitle2"
    | "body1" | "body2" | "title" | "label" | "text" | "error";
  /** 렌더링할 HTML 태그 @default 시맨틱 태그 자동 선택 */
  as?: ElementType;
  /** 텍스트 콘텐츠 */
  children?: ReactNode;
  /** 텍스트 말줄임 처리 @default false */
  truncate?: boolean;
  /** 줄 수 제한 (line-clamp) @default "none" */
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | "none";
}
```

## 변형 (Variants)

| 변형 | 크기 | 두께 | 색상 | 시맨틱 태그 |
|------|------|------|------|-------------|
| h1 | text-4xl | font-bold | text-foreground | h1 |
| h2 | text-3xl | font-bold | text-foreground | h2 |
| h3 | text-2xl | font-bold | text-foreground | h3 |
| h4 | text-xl | font-bold | text-foreground | h4 |
| h5 | text-lg | font-bold | text-foreground | h5 |
| h6 | text-base | font-bold | text-foreground | h6 |
| caption | text-sm | font-normal | text-default-500 | span |
| subtitle1 | text-base | font-normal | text-default-600 | p |
| subtitle2 | text-sm | font-normal | text-default-600 | p |
| body1 | text-base | font-normal | text-foreground | p |
| body2 | text-sm | font-normal | text-foreground | p |
| title | text-xl | font-normal | text-foreground | p |
| label | text-sm | font-semibold | text-default-700 | span |
| text | text-base | font-normal | text-foreground | p |
| error | text-sm | font-medium | text-danger | p |

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
