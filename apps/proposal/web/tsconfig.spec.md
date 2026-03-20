# tsconfig.json 기획서

> 생성일: 2026-03-12
> 타입: config
> 위치: apps/proposal/web/tsconfig.json

## 역할

`proposal-web` 앱의 TypeScript 입력 범위와 Next.js 타입체크 규칙을 정의합니다.
정적 소개 페이지와 sidecar spec을 제외하지 않고, E2E sidecar만 제외합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `include` | Next 앱 소스(`*.ts`, `*.tsx`, `.next/types`)를 타입체크 대상에 포함 |
| `exclude` | `node_modules`, `**/*.e2e.ts`, `**/*.e2e.tsx`를 제외 |
| `moduleResolution` | `bundler` 사용 |
| `jsx` | `react-jsx` 사용 |

## 구현 체크리스트

- [x] Next 기본 TS 플러그인 유지
- [x] 앱 소스 전체 포함 유지
- [x] Playwright sidecar 테스트 파일 제외 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | proposal-web 앱의 TypeScript 계약 신규 생성 | codex |
