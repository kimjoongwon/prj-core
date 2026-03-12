# next.config.ts 기획서

> 생성일: 2026-03-12
> 타입: config
> 위치: apps/introduction/next.config.ts

## 역할

`introduction` 앱의 Next.js 빌드/런타임 계약을 정의합니다.
정적 홍보 앱이 모노레포 워크스페이스 패키지를 안정적으로 해석하도록 고정합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `output` | Docker 및 배포 런타임용 `standalone` 출력 사용 |
| `turbopack.root` | 모노레포 루트(`../..`) 기준으로 workspace 해석 |
| `transpilePackages` | `@cocrepo/ui`, `@cocrepo/toolkit`, `@cocrepo/type`를 소스 기준으로 트랜스파일 |

## 구현 체크리스트

- [x] `standalone` 출력 유지
- [x] 모노레포 Turbopack 루트 유지
- [x] introduction 앱이 쓰는 공용 패키지 트랜스파일 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | introduction 정적 홍보 앱의 빌드 계약 신규 생성 | codex |
