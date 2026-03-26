# HStack rhythm 기획서

> 생성일: 2026-03-03
> 타입: rhythm
> 위치: packages/fe-ui/src/rhythm/HStack/HStack.tsx

## 역할

이 파일은 수평 흐름과 간격을 소유하는 rhythm primitive를 정의합니다.

## 간격 규칙

- 신규 호출은 `gap="inline"` 같은 semantic preset을 우선 사용합니다.
- numeric `gap`은 기존 px 의미를 유지하는 legacy 호환입니다.
- prop 미지정 시 기본 gap은 legacy `4px`입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| HStackProps | 공개 계약 요소 |
| HStack | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | `layout`에서 `rhythm` 레이어로 이동하고 역할 문구를 정리 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
