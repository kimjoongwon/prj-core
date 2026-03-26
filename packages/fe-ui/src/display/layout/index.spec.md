# layout primitive 배럴 기획서

> 생성일: 2026-03-03
> 타입: primitive
> 위치: packages/fe-ui/src/display/layout/index.ts

## 역할

`Layout` primitive와 layout shell widget이 함께 사용하는 공개 타입 계약의 진입점을 제공합니다.

## 표준 위계 연결

```text
App (서비스별 단일) > Layout > Page > Section
```

- 이 배럴은 표준 위계의 `Layout` 계층 primitive(`./Layout.tsx`)를 노출합니다.
- `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 widget로 이동했고, 해당 props 타입만 이 배럴에서 공유합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| Layout | 슬롯 배치만 담당하는 구조 primitive |
| layout types | shell widget이 공용으로 사용하는 props/type 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout/Layout` 중첩 폴더를 제거하고 `Layout.tsx`/`type.ts`만 직접 노출하도록 평탄화 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | Admin 배럴 제거 후 Layout 배럴로 교체 | codex |
| 2026-03-04 | `App > Layout > Page > Section` 위계 기준으로 Layout 계층 연결 설명 추가 | codex |
