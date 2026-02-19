# Chip UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/Chip/

## 역할

HeroUI Chip의 래퍼 컴포넌트. HeroUI ChipProps를 그대로 전달하는 패스스루 래퍼이다.

## Props

```typescript
// HeroUI ChipProps 전체를 그대로 사용
import { type ChipProps } from "@heroui/react";
```

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
