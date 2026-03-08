# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/fe-store/src/providers/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | `createAppStoreProvider`, `consoleAppStoreProvider` 배럴 export |

## 의존성 메모

- provider/store 계층이 런타임에 참조하는 workspace 패키지는 `@cocrepo/store`의 `dependencies`에 선언합니다.
- 로컬 hoisting에 기대지 않고 prune된 Docker workspace에서도 동일한 import 해석을 보장합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | Docker prune 빌드에서 provider/store 런타임 import가 깨지지 않도록 workspace 의존성 선언 원칙을 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | 공통 console preset provider export 추가 | codex |
