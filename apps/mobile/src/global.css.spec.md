# mobile global.css 기획서

> 생성일: 2026-04-08
> 타입: style
> 위치: apps/mobile/src/global.css

## 역할

Uniwind와 HeroUI Native 스타일 엔트리를 로드합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `@import "tailwindcss"` | Tailwind v4 엔트리 |
| `@import "uniwind"` | React Native용 Uniwind 엔트리 |
| `@import "heroui-native/styles"` | HeroUI Native 기본 스타일 |
| `@source` | `heroui-native/lib` 스캔 경로 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | HeroUI Native quick start에 맞춘 글로벌 스타일 엔트리로 교체 | codex |
