# Chip UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/primitive/data-display/Chip/

## 역할

HeroUI Chip의 래퍼 컴포넌트. HeroUI ChipProps를 그대로 전달하는 패스스루 래퍼이다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ solid (기본 - 채워진) ]

  ╔══════════════╗
  ║  • 라벨 텍스트  ║
  ╚══════════════╝

[ flat ]

  ┌──────────────┐
  │  • 라벨 텍스트  │  (반투명 배경)
  └──────────────┘

[ bordered ]

  ╔══════════════╗
  ║  • 라벨 텍스트  ║  (테두리만, 배경 없음)
  ╚══════════════╝

[ dot ]

  ● 라벨 텍스트       (점만 표시)

[ shadow ]

  ╔══════════════╗
  ║  • 라벨 텍스트  ║  (그림자 포함)
  ╚══════════════╝
    ░░░░░░░░░░░░░░
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| solid | 채워진 배경 + 텍스트 |
| flat | 반투명 배경 + 텍스트 |
| bordered | 테두리만 + 텍스트 |
| light | 라이트 배경 + 텍스트 |
| faded | 흐린 배경 + 텍스트 |
| shadow | 채워진 배경 + 그림자 |
| dot | 좌측 점 + 텍스트 |

## 변형 (Variants)

HeroUI Chip의 기본 변형을 그대로 지원:

| 변형 | 설명 |
|------|------|
| solid | 기본 (채워진) |
| flat | 플랫 스타일 |
| bordered | 테두리 스타일 |
| light | 라이트 스타일 |
| faded | 페이드 스타일 |
| shadow | 그림자 스타일 |
| dot | 점 스타일 |

## HeroUI 매핑

기반: `import { Chip as NextUIChip } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
