# index 배럴 기획서

> 생성일: 2026-03-06
> 타입: index
> 위치: packages/fe-ui/index.ts

## 역할

`@cocrepo/ui` 루트 공개 계약을 구성하며 UI 컴포넌트와 디자인 시스템만 외부로 노출합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | `src`, `src/design-system` 공개 |

## 의존성 메모

- `@cocrepo/ui`가 런타임에 참조하는 workspace 패키지는 `package.json`의 `dependencies`에 선언합니다.
- Docker prune/clean install 환경에서도 `@cocrepo/constant`, `@cocrepo/toolkit` import가 동일하게 해석되어야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | Docker prune 빌드에서 `@cocrepo/constant`, `@cocrepo/toolkit` 런타임 해석이 가능하도록 패키지 의존성 원칙을 명시 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | 내부 utils 공개 export를 제거하고 UI 계층 계약만 유지 | codex |
