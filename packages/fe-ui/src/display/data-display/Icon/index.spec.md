# Icon UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/data-display/Icon/

## 역할

커스텀 SVG 아이콘 모음. 각 아이콘은 독립된 컴포넌트로 제공된다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ DogPawIcon ]

    ● ●
   ●   ●
  (  ♥  )    ← 강아지 발바닥 형상 (size=20 기본)
   ─────

[ InfoIcon ]

   ╭───╮
   │ i │    ← 원형 테두리 안에 'i'
   ╰───╯

[ StarIcon (filled=false) ]

      ★
    ╱   ╲    ← 별 윤곽선만 (outlined)
   ╱─────╲

[ StarIcon (filled=true) ]

      ★
    ╱▓▓▓╲    ← 채워진 별 (filled)
   ╱▓▓▓▓▓╲

[ WarningIcon ]

     /\
    /  \
   / !! \    ← 경고 삼각형 (느낌표)
  /──────\

[ 크기별 비교 (size prop) ]

  size=16   size=20   size=24   size=32
   [★]      [ ★ ]    [  ★  ]  [   ★   ]
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| DogPawIcon | 강아지 발바닥 SVG 아이콘 |
| InfoIcon | 원형 정보(i) 아이콘 |
| StarIcon (filled=false) | 별 윤곽선 |
| StarIcon (filled=true) | 채워진 별 |
| WarningIcon | 경고 삼각형 아이콘 |

## 아이콘 목록

| 아이콘 | 설명 |
|--------|------|
| DogPawIcon | 강아지 발바닥 아이콘 |
| InfoIcon | 정보(i) 원형 아이콘 |
| StarIcon | 별 아이콘 (filled 옵션) |
| WarningIcon | 경고 삼각형 아이콘 |

## 공통 Props

```typescript
// DogPawIcon, InfoIcon, WarningIcon
interface IconProps {
  size?: number;       // @default 20
  color?: string;      // @default "currentColor"
  className?: string;
}

// StarIcon (추가 prop)
interface StarIconProps extends IconProps {
  filled?: boolean;    // @default false
}
```

## HeroUI 매핑

순수 SVG 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
