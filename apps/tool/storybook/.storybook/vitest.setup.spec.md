# vitest.setup util 기획서

> 생성일: 2026-03-26
> 타입: util
> 위치: apps/tool/storybook/.storybook/vitest.setup.js

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `setProjectAnnotations` | `@storybook/nextjs-vite` preview annotations와 a11y annotations를 Vitest에 주입 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-27 | Storybook framework 전환에 맞춰 annotation source를 `@storybook/nextjs-vite`로 동기화 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
