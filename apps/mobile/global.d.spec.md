# mobile global.d.ts 기획서

> 생성일: 2026-04-08
> 타입: type-declaration
> 위치: apps/mobile/global.d.ts

## 역할

Expo 모바일 앱에서 CSS와 CSS Module import를 TypeScript가 인식하도록 선언합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `declare module "*.css"` | Uniwind용 global.css import 허용 |
| `declare module "*.module.css"` | CSS Module import 허용 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | HeroUI Native 설정을 위해 global css import 타입 선언 추가 | codex |
