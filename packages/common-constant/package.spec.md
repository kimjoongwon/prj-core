# @cocrepo/constant 패키지 기획서

> 생성일: 2026-04-07
> 타입: package
> 위치: packages/common-constant/package.json

## 역할

공용 상수 패키지의 빌드/배포 스크립트와 패키지 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| build | 패키지 빌드 실행 |
| start:dev | watch 빌드 |
| format | 패키지 포맷팅 |
| generate:admin-route-catalog | admin route meta generated catalog 생성 |

## 규칙

- 빌드 전에 generated routing catalog를 먼저 갱신해 source와 dist가 같은 카탈로그를 보도록 유지합니다.
- `build`는 `tsc --build --force`로 fresh emit을 강제해 브랜치 이동이나 stale `.tsbuildinfo` 때문에 dist declaration이 source export와 어긋나지 않게 유지합니다.
- `start:dev` 는 generated catalog 초기 생성 + route meta polling watch + `tsc --build --watch` 를 함께 실행합니다.
- package script 변경 시 실제 빌드 경로와 generated source 경로를 함께 검토합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | stale `.tsbuildinfo`로 dist declaration export가 누락되지 않도록 `build`를 `tsc --build --force` 기준으로 정리 | codex |
| 2026-04-07 | `start:dev` 를 route meta auto-regenerate + tsc watch 오케스트레이션으로 확장 | codex |
| 2026-04-07 | admin route meta generated catalog 빌드 단계를 문서화하기 위해 신규 생성 | codex |
