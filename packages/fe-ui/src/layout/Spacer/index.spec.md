# Spacer Layout 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: layout
> 위치: packages/fe-ui/src/layout/Spacer/

## 역할

요소 사이에 빈 공간을 생성하는 유틸리티 컴포넌트. 세로/가로 방향 지정 가능.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[vertical - 세로 공간 (기본, size=16px)]
[요소 A]
         ↕  h-[16px] 빈 공간 (aria-hidden)
[요소 B]

[vertical - size=32px]
[요소 A]

         ↕  h-[32px]

[요소 B]

[horizontal - 가로 공간 (size=8px)]
[요소 A]  ↔  [요소 B]
           w-[8px]

[실사용 예시]
<VStack>
  <제목>
  ━━━━━━━━   ← Spacer size=16 vertical
  <본문>
  ━━━━━━━━   ← Spacer size=32 vertical
  <버튼>
</VStack>
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| vertical (기본) | 세로 방향 빈 공간 (h-[size]px) |
| horizontal | 가로 방향 빈 공간 (w-[size]px) |

## Props

```typescript
interface SpacerProps {
  /** 공간 크기 (px 단위) @default 4 */
  size?: number;
  /** 공간 방향 @default "vertical" */
  direction?: "horizontal" | "vertical";
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 동작

| direction | 적용 CSS |
|-----------|----------|
| vertical | `h-[{size}px]` |
| horizontal | `w-[{size}px]` |

`aria-hidden="true"` 접근성 속성 포함.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | `layouts` 디렉터리 이동에 맞춰 위치/타입 문구 정리 | codex |
