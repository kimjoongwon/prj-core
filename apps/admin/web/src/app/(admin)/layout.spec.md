# layout layout 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: apps/admin/web/src/app/(admin)/layout.tsx

## 역할

이 파일은 layout 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/idp/auth | 기능 구현 의존성 |
| @cocrepo/hook | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |
| @/hooks | 기능 구현 의존성 |
| @/stores/AppStoreProvider | 기능 구현 의존성 |

## 동작 흐름

1. `useLayout`에 앱 Store selector hooks를 주입해 네비게이션/FAB/BottomTab 상태와 핸들러를 조회합니다.
2. `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`를 구성합니다.
3. `Layout` 슬롯(`header`, `sidebar`, `mobileBottomNav`, `mobileFab`, `mobileOverlayMenu`)에 주입합니다.
4. `children`을 Layout 메인 영역에 렌더링합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | `@cocrepo/api` root import를 split subpath import로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | AdminLayout 직접 사용을 Layout 슬롯 조합 구조로 마이그레이션 | codex |
| 2026-03-04 | useAdminLayout 제거 후 @cocrepo/hook의 useLayout 직접 사용으로 전환 | codex |
| 2026-03-06 | IDP 관리 버튼 아이콘을 @cocrepo/ui util export 대신 lucide-react 직접 사용으로 전환 | codex |
