# 인증 route layout 기획서

> 생성일: 2026-03-21
> 수정일: 2026-03-23
> 타입: layout
> 위치: apps/idp/web/src/app/(auth)/layout.tsx

## 재사용 우선 점검

| 후보 | 판단 | 이유 |
|------|------|------|
| `apps/idp/web/src/app/(auth)/layout.tsx` | 재사용 | 인증 플로우를 묶는 route group 자체는 적절하며 `children` 단일 slot 구조도 유지 가치가 높다. |
| `packages/fe-ui/src/widget/AuthCard` | 책임 축소 후 재사용 | 현재는 full-screen 배경, 카드, footer를 모두 소유해 route layout과 책임이 겹친다. Stage 5에서는 panel surface 전용으로 축소한다. |
| `packages/fe-ui/src/surface/PageSurface`, `SectionSurface` | 부분 재사용 | 인증 화면도 surface 토큰은 재사용하되, `Page`/`Section` 구조까지 child page가 다시 조립하지 않도록 route layout에서 shell만 소유한다. |

## Server Skeleton

- 상위 shell은 `apps/idp/web/src/app/layout.spec.md`가 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 동작하며 인증 전용 shell을 소유합니다.
- shell의 책임은 다음으로 제한합니다.
  - 전체 viewport 배경과 명도 대비
  - 인증 콘텐츠를 배치하는 중앙 grid
  - 데스크톱 보조 카피 영역과 모바일 축약 안내
  - child page가 mount될 primary panel 영역
- route-level 데이터 fetch나 페이지 이벤트 바인딩은 `layout.tsx`가 직접 수행하지 않습니다.

## Responsive Composition

| 구간 | 배치 | 의도 |
|------|------|------|
| Desktop (`>=1280px`) | `support aside + primary auth panel` 2열 | 브랜드/신뢰 카피와 실제 입력 영역을 분리해 인지 부하를 낮춘다. |
| Tablet (`768-1279px`) | primary panel 중심, support 카피는 상단 축약 | 로그인 목적과 폼의 우선순위를 유지한다. |
| Mobile (`<768px`) | 단일 column, panel full width | 장식보다 가독성과 터치 여유를 우선한다. |

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| route layout | `apps/idp/web/src/app/(auth)/layout.tsx` | auth shell, support copy, primary panel frame | route skeleton 조립, viewport 배치, 배경/보조 정보 소유 |
| child content | child `page.tsx` / slot page | page content only | shell 내부에서 헤더, 안내, 폼, CTA, 상태 전환 구현 |

- layout이 제공하는 primary panel 안에는 로그인, 동의, 비밀번호 찾기/재설정, 에러 화면이 동일한 rhythm으로 mount됩니다.
- `Powered by OIDC Identity Provider`와 같은 공통 footer 문구가 필요하다면 widget이 아니라 route layout 소유로 이동합니다.

## Surface Ownership

| 레벨 | Owner | 구성 | 역할 |
|------|-------|------|------|
| route shell | `apps/idp/web/src/app/(auth)/layout.tsx` | viewport background, content grid, support aside, primary panel container | 인증 플로우의 일관된 shell과 대비를 제공 |
| child content | child `page.tsx` | 제목, 상태 배너, 폼, 보조 액션 | 실제 사용자 상호작용과 분기 상태를 처리 |
| shared widget | `packages/fe-ui/src/widget/AuthCard` 또는 후속 panel wrapper | panel body surface only | route shell 내부의 단일 카드 표면과 spacing 제공 |

- child page와 widget은 full-screen wrapper, 배경 orb, fixed footer를 다시 소유하지 않습니다.
- panel 내부 시각 강조는 색상, border, alert tone 중심으로 제한하고 과도한 장식성 그래픽은 사용하지 않습니다.

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | child route `page.tsx` | `(auth)` route group 하위 인증 플로우 콘텐츠 mount |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/auth/login`, `/interaction/[uid]`, `/forgot-password`, `/reset-password/[token]`, `/error` |

## Slot Fallbacks

- named slot이 없어 `default.tsx` fallback은 필요하지 않습니다.

## Independent Navigation Policy

- `children` 단일 slot 구조이며 independent navigation이 필요한 병렬 영역은 없습니다.
- soft/hard navigation 모두 동일한 auth shell을 유지하고 콘텐츠만 교체합니다.

## Child Content Contract

- child `page.tsx`와 `@slot/**/page.tsx`는 자신이 채우는 panel body 콘텐츠만 구현합니다.
- child 페이지는 full-screen 배경, viewport 중앙 정렬 wrapper, 글로벌 footer를 다시 정의하지 않습니다.
- child 페이지는 입력/상태/에러/보조 액션의 우선순위만 결정하며, 바깥 여백과 최대 폭은 layout contract를 따릅니다.
- child 페이지 계약은 각 `page.spec.md`의 `Consumed Layout Contract`와 `Rendering Decision`을 따릅니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | 로그인 UX 재기획에 맞춰 auth shell 책임을 route layout으로 재정의하고 `AuthCard`의 full-screen 책임 축소 방향을 명시 | codex |
| 2026-03-21 | pathless auth route group의 `children` mount 설명과 URL 매핑을 실제 구조에 맞게 보정 | codex |
| 2026-03-21 | fe-route-layout-builder 계약에 맞춰 layout skeleton/slot 계약을 재정의 | codex |
