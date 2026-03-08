# tsconfig.json 기획서

> 생성일: 2026-03-09
> 타입: config
> 위치: apps/idp/web/tsconfig.json

## 역할

`idp-web`의 TypeScript 컴파일 입력 범위와 Next.js 타입체크 규칙을 정의합니다.
앱 빌드 대상과 테스트 전용 sidecar 파일을 구분합니다.

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
- [x] Playwright sidecar 테스트 파일 제외 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | Dockerfile에서 테스트 파일을 삭제하지 않도록 `*.e2e.ts(x)`를 TypeScript 제외 대상으로 이동 | codex |
