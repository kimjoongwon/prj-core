# HeaderBar widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/widget/HeaderBar/HeaderBar.tsx

## 역할

상단 헤더를 렌더링하는 layout shell widget입니다.
사용자 정보와 액션 슬롯은 props로 주입받고, 인증/스토어 연동은 외부 feature에서 담당합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| HeaderBar | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| ../../primitive/layout/type | 공용 layout shell props 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout`에서 `widget/HeaderBar`로 재배치하고 layout shell widget으로 재분류 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | ChevronDown, User, Settings, LogOut 아이콘을 파일 내부에서 직접 import 하도록 정리 | codex |
| 2026-03-06 | src 레이어 상향에 맞춰 util/hook 상대 import 깊이를 보정 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | AdminHeader에서 HeaderBar로 명칭 추상화 | codex |
