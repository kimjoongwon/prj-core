# Text UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/data-display/Text/

## 역할

다양한 텍스트 스타일 프리셋을 제공하는 타이포그래피 컴포넌트. class-variance-authority(cva) 기반으로 variant에 따라 시맨틱 HTML 태그를 자동 선택한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ 헤딩 계층 ]

  h1  ████████████████ 제목 (text-4xl, bold)
  h2  ████████████ 제목 (text-3xl, bold)
  h3  █████████ 제목 (text-2xl, bold)
  h4  ███████ 제목 (text-xl, bold)
  h5  █████ 제목 (text-lg, bold)
  h6  ████ 제목 (text-base, bold)

[ 본문 / 설명 텍스트 ]

  body1     일반 본문 텍스트입니다. (text-base, normal, foreground)
  body2     작은 본문 텍스트입니다. (text-sm, normal, foreground)
  subtitle1  부제목 텍스트입니다. (text-base, normal, default-600)
  subtitle2  작은 부제목입니다. (text-sm, normal, default-600)
  title      타이틀 텍스트입니다. (text-xl, normal, foreground)

[ 레이블 / 특수 스타일 ]

  label    레이블 텍스트  (text-sm, semibold, default-700)
  caption  캡션 텍스트    (text-sm, normal, default-500)
  text     일반 텍스트    (text-base, normal, foreground)
  error    오류 메시지    (text-sm, medium, danger 색상)

[ truncate / lineClamp 옵션 ]

  truncate=true:
  매우 긴 텍스트가 있을 때 한 줄로 잘...  →  (말줄임)

  lineClamp=2:
  첫 번째 줄 텍스트
  두 번째 줄 텍스트                        →  (2줄까지)
  ...
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| h1~h6 | 크기 순서대로 감소하는 굵은 헤딩 |
| body1/body2 | 일반/작은 본문 (foreground 색상) |
| subtitle1/subtitle2 | 설명용 중간 톤 텍스트 |
| caption | 작고 연한 보조 텍스트 |
| label | 작고 굵은 레이블 |
| error | danger 색상의 오류 메시지 |
| truncate | 한 줄 말줄임 처리 |
| lineClamp=N | N줄 이후 말줄임 처리 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
