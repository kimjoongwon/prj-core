# Surface 컴포넌트 배럴 기획서

> 생성일: 2026-03-15
> 타입: surface
> 위치: packages/fe-ui/src/surface/Surface/index.ts

## 역할

`Surface` 컴포넌트와 공개 타입/기본값을 surface 계층에서 재노출합니다.
master/detail 재사용 wrapper의 기본 표면 primitive로 사용됩니다.

## 공개 항목

| 항목 | 설명 |
|------|------|
| `Surface` | 기본 표면 컴포넌트 |
| `DEFAULT_SURFACE_PADDING` | 기본 패딩 토큰 |
| `SurfaceProps` | 공개 Props 계약 |
| `SurfacePadding` | 패딩 변형 타입 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `DEFAULT_SURFACE_PADDING` 재노출 계약을 문서에 반영 | codex |
| 2026-03-22 | `master/table`, `detail/view` wrapper의 기본 surface primitive 용도를 명시 | codex |
| 2026-03-15 | Surface 배럴 신규 생성 | codex |
