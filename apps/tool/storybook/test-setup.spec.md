# test-setup util 기획서

> 생성일: 2026-03-26
> 타입: util
> 위치: apps/tool/storybook/test-setup.js

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `createMemoryStorage` | Vitest jsdom 환경에서 `localStorage`/`sessionStorage` API가 비정상일 때 메모리 기반 storage polyfill을 제공합니다. |
| `ensureStorage` | `.clear()` 등 필수 메서드가 없는 전역 storage 객체를 테스트 친화적인 구현으로 교체합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-27 | jsdom/Vitest 환경에서 `localStorage.clear()`가 없는 경우를 대비한 메모리 storage polyfill 계약 추가 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
