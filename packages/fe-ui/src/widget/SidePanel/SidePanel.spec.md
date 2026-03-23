# SidePanel widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/widget/SidePanel/SidePanel.tsx

## 역할

데스크톱 좌측 네비게이션 패널을 렌더링하는 layout shell widget입니다.
메뉴 데이터와 선택 상태는 props로 주입받고, store 연결은 feature 계층에서 담당합니다.
선택된 1depth/2depth 상태를 기준으로 현재 섹션의 하위 메뉴를 시각적으로 유지해 콘솔형 네비게이션을 공용으로 지원합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SidePanel | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| ../../design-system/icon/AppIcon | 사이드 패널 아이콘 정적 registry |
| ../../primitive/layout/type | 공용 layout shell props 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | 공용 콘솔 사이드 패널 카드 디자인과 header/footer/icon/description 확장 포인트를 추가 | codex |
| 2026-03-22 | `primitive/layout`에서 `widget/SidePanel`로 재배치하고 layout shell widget으로 재분류 | codex |
| 2026-03-11 | 사이드 패널 아이콘 렌더링을 `AppIcon` registry로 교체해 네임스페이스 import를 제거 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | Lucide 아이콘 렌더링을 파일 내부 helper로 내장하고 utils 의존을 제거 | codex |
| 2026-03-06 | src 레이어 상향에 맞춰 util/hook 상대 import 깊이를 보정 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | AdminSidebar에서 SidePanel로 명칭 추상화 | codex |
