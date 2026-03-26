# BottomNav widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/widget/BottomNav/BottomNav.tsx

## 역할

모바일 하단 탭을 표시하는 layout shell widget입니다.
경로 판단과 store 연결은 외부 feature에서 수행하고, 이 파일은 props 기반 렌더링만 담당합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| BottomNav | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| ../../design-system/icon/AppIcon | 하단 탭 아이콘 정적 registry |
| ../../display/layout/type | 공용 layout shell props 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout`에서 `widget/BottomNav`로 재배치하고 layout shell widget으로 재분류 | codex |
| 2026-03-11 | 하단 탭 아이콘 렌더링을 `AppIcon` registry로 교체해 네임스페이스 import를 제거 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | Lucide 아이콘 렌더링을 파일 내부 helper로 내장하고 utils 의존을 제거 | codex |
| 2026-03-06 | src 레이어 상향에 맞춰 util/hook 상대 import 깊이를 보정 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | AdminBottomTab에서 BottomNav로 명칭 추상화 | codex |
