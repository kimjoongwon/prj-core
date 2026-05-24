# DESIGN.md

## Overview

이 프로젝트는 **따뜻한 예약 운영 플랫폼**처럼 보여야 합니다.

Admin web은 운영자가 예약, 결제, 공간, 사용자, 권한, 템플릿을 빠르게 확인하고 처리하는 업무 화면입니다. Mobile은 사용자가 예약 상태를 확인하고 다음 행동을 편안하게 이어가는 서비스 화면입니다. 두 플랫폼은 같은 디자인 원칙을 공유하지만, 밀도와 네비게이션은 각 플랫폼에 맞게 달라져야 합니다.

이 문서는 외부 브랜드의 색상이나 특정 스타일을 복제하지 않습니다. 프로젝트의 기존 색상 체계, HeroUI theme, mobile CSS 변수는 그대로 유지합니다. 대신 화면이 어떻게 읽히고, 어떤 요소가 먼저 보여야 하며, 어떤 UI가 프로젝트답지 않은지를 정의합니다.

핵심 인상은 **따뜻함, 명료함, 상태 중심, 다음 행동 중심**입니다.

## Design Principles

### 1. 상태가 먼저 보인다

사용자는 화면에 들어오면 지금 상태를 먼저 이해해야 합니다.

- 예약 상태, 결제 상태, 승인 상태, 권한 상태를 가장 잘 보이게 합니다.
- 상태는 색상만으로 표현하지 않고 label, badge, icon, 설명 문구를 함께 사용합니다.
- 상태 다음에는 사용자가 할 수 있는 다음 행동을 가까이에 둡니다.

### 2. 따뜻하지만 느슨하지 않다

서비스는 친근해야 하지만, 운영 도구는 정확해야 합니다.

- Mobile은 여백과 문구를 조금 더 넉넉하게 둡니다.
- Admin은 테이블, 필터, 상태 요약을 빠르게 스캔할 수 있어야 합니다.
- 장식보다 정보 구조와 다음 행동이 우선입니다.

### 3. 색상은 역할로만 말한다

색상값을 새로 정의하거나 외부 브랜드 색을 가져오지 않습니다.

- 기존 theme token을 사용합니다.
- 색상은 `canvas`, `surface`, `primary`, `muted`, `success`, `warning`, `danger`, `border` 같은 역할로 설명합니다.
- 임의 hex, 임의 gradient, 장식용 색 남용을 피합니다.

### 4. 컴포넌트보다 위계를 먼저 정한다

화면을 만들 때는 어떤 컴포넌트를 쓸지보다, 어떤 정보가 주연인지 먼저 정합니다.

- Page 또는 Screen의 첫 영역은 현재 상태와 주요 행동을 설명합니다.
- 반복 정보는 table, list, card 중 가장 스캔하기 좋은 형태를 선택합니다.
- feature, widget, input, action, data display의 책임을 섞지 않습니다.

## Colors

색상은 기존 프로젝트 theme에서 가져오며, 이 문서는 색상값 대신 역할을 정의합니다.

| 역할 | 의미 | 주 사용처 | 금지 |
|------|------|-----------|------|
| `canvas` | 앱의 기본 바탕 | page/screen background | 장식용 색면으로 남용하지 않음 |
| `surface` | 정보가 올라가는 부드러운 면 | card, section, form group | 같은 elevation surface 중첩 |
| `surface-muted` | 덜 중요한 정보 묶음 | secondary panel, empty background | 본문 대비를 낮춰 읽기 어렵게 만들지 않음 |
| `primary` | 가장 중요한 행동 | create, confirm, continue, save | 한 화면에 primary CTA를 과도하게 반복하지 않음 |
| `secondary` | 보조 행동 | cancel, back, secondary navigation | primary와 같은 시각 무게로 만들지 않음 |
| `success` | 완료, 정상, 가능 | confirmed, paid, active | 장식용 강조색으로 사용하지 않음 |
| `warning` | 주의, 대기, 확인 필요 | pending, waitlist, review needed | danger와 혼동되게 사용하지 않음 |
| `danger` | 삭제, 실패, 취소, 위험 | delete, cancel reservation, failed | 일반 강조색으로 사용하지 않음 |
| `muted` | 보조 설명 | metadata, hint, timestamp | 핵심 정보에 사용하지 않음 |
| `border` | 낮은 구분 | table row, card edge, input | section을 과하게 조각내지 않음 |

### Color Rules

- 새 색상 token을 만들기 전에 기존 theme 역할로 표현 가능한지 먼저 확인합니다.
- 상태 UI는 색상, 아이콘, 텍스트를 함께 사용합니다.
- gradient, blur background, decorative orb는 기본 디자인 언어가 아닙니다.
- dark theme에서도 역할은 동일해야 합니다. 단, 대비와 surface 단계는 theme token이 담당합니다.

## Typography

기본 서체는 **Pretendard**를 유지합니다.

타이포그래피의 목표는 포스터처럼 강하게 보이는 것이 아니라, 사용자가 상태와 다음 행동을 빠르게 이해하도록 돕는 것입니다. 화면별 별도 `ScreenTitle` 같은 alias를 만들기보다 `Text` primitive의 역할형 variant를 사용합니다.

| 역할 | 느낌 | 사용처 | 주의 |
|------|------|--------|------|
| `display` | 큰 첫 인상 | auth, dashboard intro, mobile home hero | Admin CRUD 목록에는 남용하지 않음 |
| `headline` | 화면 제목 | page/screen title, major section | 한 화면에 1개 중심 권장 |
| `title` | 영역 제목 | card title, section title, dialog title | body보다 명확히 높게 |
| `body` | 기본 읽기 | 설명, 목록 본문, form helper | 과하게 작게 만들지 않음 |
| `label` | 짧은 이름표 | field label, table header, status label | 긴 문장에 사용하지 않음 |
| `caption` | 보조 정보 | timestamp, metadata, legal copy | 핵심 안내를 caption으로 숨기지 않음 |
| `button` | 행동 문구 | CTA, toolbar action | 동사 중심으로 짧게 |

### Typography Rules

- 화면 내부 텍스트는 가능한 `Text` 컴포넌트를 통과합니다.
- 제목은 정보 구조를 설명해야 하며, 장식용 큰 글자는 피합니다.
- 본문은 간결한 존댓말을 사용합니다.
- 버튼 문구는 사용자가 하는 행동을 말합니다. 예: `저장`, `예약하기`, `다시 시도`.
- 상태 문구는 이유와 다음 행동을 함께 제공합니다. 예: `예약을 불러오지 못했습니다. 다시 시도해 주세요.`

## Layout & Density

기본 간격은 8px 단위 리듬을 따릅니다.

### Admin Web

Admin은 스캔성과 반복 작업 효율이 중요합니다.

- 기본 구조는 `상태 요약 -> 필터/액션 -> 목록/테이블 -> 보조 정보` 순서를 우선합니다.
- 테이블 중심 화면은 카드 여러 개보다 table, filter, summary 조합을 우선합니다.
- create/update 화면은 form group을 명확히 나누고, primary action은 하단 또는 상단 action area에 일관되게 둡니다.
- PageSurface와 SectionSurface는 필요한 곳에만 사용합니다. 모든 작은 요소를 카드로 감싸지 않습니다.

### Mobile

Mobile은 편안한 확인과 다음 행동 안내가 중요합니다.

- 첫 화면에는 현재 상태, 핵심 요약, 다음 행동을 가까이 둡니다.
- touch target은 최소 44px 이상을 유지합니다.
- 목록은 한 손으로 스캔하기 쉬운 card/list row를 사용합니다.
- bottom sheet, toast, dialog는 사용자의 현재 행동을 막지 않는 선에서 사용합니다.

### Rhythm Primitives

리듬은 단순 CSS gap이 아니라 화면 구조를 설명하는 컴포넌트 계약입니다.

| 리듬 | 기본 사용처 | 권장 primitive |
|------|-------------|----------------|
| `page` | 페이지 주요 블록 사이 | `VStack gap="page"` |
| `section` | 섹션 내부 기본 수직 흐름 | `VStack gap="section"` |
| `block` | 제목-본문, 카드 내부 짧은 묶음 | `VStack gap="block"` |
| `inline` | 버튼 행, badge/chip, 짧은 수평 액션 | `HStack gap="inline"` |
| `dense` | metadata, 보조 label, 작은 상태 묶음 | `VStack`/`HStack gap="dense"` |
| `roomy` | empty, auth, loading, intro 영역 | `VStack gap="roomy"` |
| `flush` | 붙어야 하는 composite | `VStack`/`HStack gap="flush"` |

- Web/PC 조합은 `@cocrepo/ui`의 `VStack`, `HStack`, `Spacer`를 우선 사용합니다.
- Mobile 조합은 `@cocrepo/mo-ui`의 `VStack`, `HStack`을 우선 사용합니다.
- raw `gap-*`, `space-y-*`, `space-x-*`는 CSS grid, third-party layout, legacy 유지 같은 예외에서만 사용합니다.
- Mobile에서 third-party native bridge나 primitive로 표현하기 어려운 저수준 layout만 `View`와 `tailwind-variants` slot을 예외적으로 사용합니다.
- spec에는 어떤 UI component를 쓰는지만이 아니라 어떤 rhythm primitive가 감싸는지도 적습니다.

### Large Section Usage

큰 섹션 또는 큰 면 분리는 핵심 화면에만 사용합니다.

- 사용 권장: auth, dashboard intro, mobile home, profile summary, empty state, onboarding.
- 사용 주의: dense table page, permission matrix, bulk operation screen.
- 큰 섹션은 브랜드 장식이 아니라 상태와 다음 행동을 강조하는 장치입니다.

## Surface & Depth

surface는 화면의 정보 계층을 만드는 도구입니다. shadow를 많이 쓰기보다 부드러운 면, 낮은 border, 충분한 여백으로 계층을 만듭니다.

| 계층 | 역할 | 사용처 | 표현 |
|------|------|--------|------|
| Page background | 전체 바탕 | app page, screen | `canvas` |
| PageSurface | 화면의 주 내용 묶음 | Admin page body | 부드러운 surface, 낮은 shadow |
| SectionSurface | 독립 섹션 | table wrapper, form section | border 또는 약한 elevation |
| Card | 반복 정보 단위 | mobile reservation card, summary card | 12~16px radius |
| Floating | 임시 조작 | popover, dropdown, bottom sheet | 더 높은 surface와 명확한 z-index |
| Overlay | 집중 작업 | dialog, modal | scrim과 focus management |

### Surface Rules

- 같은 elevation의 surface를 중첩하지 않습니다.
- PageSurface는 Page가 소유하고, Layout에서 남용하지 않습니다.
- 테이블은 surface 안에 넣되, 각 row를 카드처럼 과하게 분리하지 않습니다.
- Mobile card는 정보가 한 덩어리로 읽힐 때만 사용합니다.
- shadow는 낮고 조용해야 합니다. 깊이를 만들기 위해 강한 그림자를 반복하지 않습니다.

## Shapes

형태는 따뜻함과 업무 효율 사이의 균형을 잡습니다.

| 요소 | 기본 형태 | 이유 |
|------|-----------|------|
| Primary CTA | pill 또는 충분히 둥근 버튼 | 서비스의 부드러운 행동 신호 |
| Table toolbar action | compact rounded button | Admin 밀도 유지 |
| Card | 12~16px radius | 따뜻하지만 과하지 않음 |
| Input | 8~12px radius | form 안정감 |
| Badge/Chip | pill | 상태 label 가독성 |
| Icon button | circle 또는 compact rounded | 터치/클릭 target 명확화 |
| Modal/BottomSheet | 16px 이상 radius | overlay의 분리감 |

### Shape Rules

- 주요 CTA는 부드럽게, 보조 조작은 컴팩트하게 둡니다.
- 모든 버튼을 pill로 만들지 않습니다. 테이블 row action, toolbar, dense filter는 작고 명확해야 합니다.
- radius scale을 임의로 계속 늘리지 않습니다.
- 형태 차이는 정보 위계를 설명해야 합니다.

## Components

### Text

- 모든 사용자-facing 텍스트는 가능한 `Text` primitive를 사용합니다.
- 화면별 title component를 새로 만들기보다 `Text` variant와 layout owner를 조합합니다.
- 긴 문구는 줄바꿈과 좁은 화면을 고려합니다.

### Button

- primary action은 한 화면에서 가장 중요한 다음 행동 하나를 가리킵니다.
- secondary action은 primary와 같은 무게를 가지면 안 됩니다.
- destructive action은 색상, 문구, 위치를 모두 사용해 위험성을 드러냅니다.
- loading, disabled, pressed 상태를 반드시 고려합니다.

### Status

- status는 badge, icon, label, helper text의 조합으로 표현합니다.
- 상태 색상만 보고 의미를 알아야 하는 UI를 만들지 않습니다.
- `success`, `warning`, `danger`, `muted`의 의미를 임의로 바꾸지 않습니다.

### Empty / Error / Loading

| 상태 | 구성 | 원칙 |
|------|------|------|
| Loading | 짧은 label 또는 skeleton | 기다리는 이유를 과하게 설명하지 않음 |
| Empty | 빈 이유 + 다음 행동 | 사용자가 무엇을 할 수 있는지 보여줌 |
| Error | 실패 이유 + 복구 행동 | `다시 시도`, `목록으로 이동` 같은 action 제공 |
| Success | 완료 상태 + 다음 이동 | toast만으로 중요한 완료를 숨기지 않음 |

### Table / DataGrid

- Admin 목록의 기본 표현은 table 또는 DataGrid입니다.
- 상단에는 상태 요약, 검색, 필터, primary action을 배치합니다.
- row action은 작고 반복 가능해야 합니다.
- 중요한 상태는 별도 cell/badge로 드러냅니다.

### Form

- form은 그룹 단위로 읽혀야 합니다.
- label, helper, error message는 같은 field 근처에 둡니다.
- create/update flow에서는 primary action과 cancel/back action의 위치를 일관되게 유지합니다.
- AI form 또는 자동 채우기 기능은 일반 form action과 시각적으로 구분합니다.

### Navigation

- Admin navigation은 현재 위치와 권한 범위를 명확히 보여줍니다.
- Mobile navigation은 현재 tab과 다음 주요 행동을 방해하지 않아야 합니다.
- route title과 page title이 중복되지 않게 owner를 분명히 합니다.

### Storybook / Test

- 신규 또는 수정 UI component는 story와 unit test를 함께 고려합니다.
- story는 ready, loading, empty, error, disabled, long text, narrow viewport 중 해당 상태를 포함합니다.
- test는 렌더링, 접근성, 이벤트, disabled guard, formatting branch를 검증합니다.

## Responsive Behavior

### Shared Rules

- 작은 화면에서 텍스트가 버튼이나 카드 밖으로 넘치지 않아야 합니다.
- touch target은 mobile 기준 최소 44px 이상을 유지합니다.
- 상태와 primary action은 좁은 화면에서도 가까이 있어야 합니다.
- 중요한 데이터 table은 mobile에서 card/list 또는 horizontal strategy를 명확히 정합니다.

### Admin Web

- desktop에서는 table density와 filter ergonomics를 우선합니다.
- tablet 이하에서는 필터와 bulk action이 세로로 정리되어도 기능 접근성이 유지되어야 합니다.
- modal은 작은 화면에서 full-width 또는 bottom sheet 형태를 검토합니다.

### Mobile

- ScreenFrame과 safe area를 기준으로 content가 가려지지 않아야 합니다.
- bottom tab, toast, floating action, bottom sheet는 서로 겹치지 않도록 배치합니다.
- 좁은 화면에서는 CTA를 full-width로 두되, 반복 action은 compact하게 유지합니다.

## Do's and Don'ts

### Do

- 현재 상태와 다음 행동을 화면 상단 또는 핵심 영역에 둡니다.
- 기존 theme token과 컴포넌트 primitive를 우선 사용합니다.
- Admin은 table, filter, state summary 중심으로 구성합니다.
- Mobile은 card/list, safe area, bottom action을 자연스럽게 사용합니다.
- 상태 UI에는 label, icon, text를 함께 사용합니다.
- 주요 CTA는 짧은 동사 중심 문구를 사용합니다.
- empty/error 화면에는 복구 또는 다음 행동을 제공합니다.
- Storybook에서 긴 텍스트와 좁은 화면을 확인합니다.

### Don't

- 외부 브랜드의 색상, gradient, visual motif를 복제하지 않습니다.
- 장식용 blur, orb, 과한 gradient background를 기본 패턴으로 쓰지 않습니다.
- 모든 정보를 카드로 감싸 화면을 조각내지 않습니다.
- status를 색상 하나에만 의존하지 않습니다.
- Admin table row action을 과하게 큰 pill button으로 만들지 않습니다.
- 화면마다 별도 title/text component를 만들어 typography system을 분산하지 않습니다.
- Layout과 Page가 같은 title 또는 surface 책임을 중복 소유하지 않습니다.
- 모바일에서 safe area, bottom tab, toast, floating action이 겹치게 만들지 않습니다.

## Agent Prompt Guide

`orch-delivery`와 UI builder role은 화면 spec과 구현에서 이 문서를 기준으로 디자인 판단을 합니다.

### Spec 작성 시

- `Screen Rough`에는 상태, 다음 행동, surface 계층, 주요 CTA 위치를 표시합니다.
- `Visual Snapshot`은 장식 설명보다 화면의 밀도와 첫 인상을 보여줍니다.
- `Annotated Wireframe`은 `Text`, `Button`, `Surface`, `Feature`, `Widget`, `Input`, `Action`, `DataDisplay`, `Feedback` 계층을 구분합니다.
- `Rhythm / Layout Contract`에는 web/mobile `VStack`, `HStack`, web `Spacer`, 예외적 `View/tv slots`와 `page`, `section`, `block`, `inline`, `dense`, `roomy` gap preset을 기록합니다.
- 색상은 값이 아니라 역할로 씁니다. 예: `surface`, `primary`, `danger`, `muted`.
- 큰 섹션은 auth, dashboard intro, mobile home, empty state처럼 핵심 인상이 필요한 경우에만 계획합니다.

### Component 작성 시

- 기존 component 재사용을 먼저 검토합니다.
- 새 component는 하나의 파일에 하나의 exported UI component만 둡니다.
- 사용자-facing 텍스트는 가능한 `Text` primitive를 사용합니다.
- Web layout은 가능한 `VStack`, `HStack`, `Spacer`의 semantic rhythm preset으로 조합합니다.
- Mobile layout은 가능한 `VStack`, `HStack`의 semantic rhythm preset으로 조합합니다.
- raw gap class가 필요하면 이유를 spec 또는 최종 보고에 남깁니다.
- 신규/수정 UI component는 story와 unit test 계약을 함께 작성합니다.
- Admin과 Mobile이 같은 원칙을 공유하되, 플랫폼별 밀도와 navigation은 다르게 설계합니다.

### QA 시

- 상태와 다음 행동이 보이는지 확인합니다.
- spec의 rhythm 계약과 실제 web/mobile `VStack`/`HStack`, web `Spacer`, 또는 예외적 mobile layout owner가 일치하는지 확인합니다.
- 과한 장식, 임의 색상, 불필요한 gradient/blur가 없는지 확인합니다.
- 긴 텍스트, 좁은 화면, disabled/loading/error 상태를 확인합니다.
- story/test가 component 상태를 충분히 다루는지 확인합니다.
- spec의 디자인 rough와 실제 구현이 drift 되지 않았는지 확인합니다.

## Review Checklist

- [ ] 이 화면은 현재 상태를 먼저 보여주는가?
- [ ] 사용자의 다음 행동이 가까이에 있는가?
- [ ] 색상은 기존 theme 역할 안에서 사용되었는가?
- [ ] Admin 화면은 스캔성과 반복 작업 효율을 해치지 않는가?
- [ ] Mobile 화면은 safe area와 touch target을 지키는가?
- [ ] surface가 과하게 중첩되지 않았는가?
- [ ] 주요 CTA와 보조 action의 무게가 구분되는가?
- [ ] empty/error/loading 상태에 다음 행동이 있는가?
- [ ] 과한 장식이나 외부 브랜드 스타일 복제가 없는가?
- [ ] story와 test가 필요한 상태를 다루는가?

## Known Gaps

- 이 문서는 디자인 언어 v1입니다. 실제 theme token 값과 component API를 변경하지 않습니다.
- 구체적인 typography size, spacing token, component prop 이름은 현재 구현을 기준으로 별도 작업에서 맞춥니다.
- 개별 화면 리디자인은 sidecar spec 단위로 진행합니다.
- 디자인 원칙을 `AGENTS.md`와 `orch-delivery`에 연결하는 작업은 후속 변경으로 다룹니다.
