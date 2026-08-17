---
name: "fe-storybook-builder"
description: "이 skill은 `fe-storybook-agent` 역할로 일할 때 사용합니다. 웹/모바일 UI 컴포넌트의 Storybook 스토리를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# fe-storybook-builder

## 기본 원칙

- Storybook 스토리는 독립 실행 가능한 UI 예시입니다. API, router, browser storage, 실제 store에 직접 의존하지 않습니다.
- 스토리는 컴포넌트 계약을 바꾸지 않습니다. 스토리 작성 중 props/type/소스 문제가 발견되면 소스 담당자에게 넘깁니다.
- thin barrel/export-only, 백엔드-only, store-only, hook-only, route-only 변경은 Storybook 대상이 아닙니다. 이 경우 `none-storybook`과 사유를 남깁니다.

## 소유 파일

| 대상 | 허용 파일 |
|------|-----------|
| 웹 스토리 | `packages/fe-ui/src/**/*.stories.ts`, `packages/fe-ui/src/**/*.stories.tsx` |
| 웹 스토리 helper | `packages/fe-ui/src/**/storybook*.ts`, `packages/fe-ui/src/**/storybook*.tsx` |
| 웹 tool | `apps/tool/storybook/**` |
| 모바일 스토리 | `packages/fe-mo-ui/src/**/*.stories.ts`, `packages/fe-mo-ui/src/**/*.stories.tsx` |
| 모바일 스토리 helper | `packages/fe-mo-ui/src/**/storybook*.ts`, `packages/fe-mo-ui/src/**/storybook*.tsx` |
| 모바일 tool | `apps/tool/mobile-storybook/**` |

## 스토리 작성 기준

- 기존 스토리가 있으면 파일 구조, 네이밍, fixture helper를 우선 따릅니다.
- 신규 스토리는 component와 같은 폴더에 둡니다.
- 기본 스토리 하나로 끝내지 말고 spec에 적힌 주요 상태를 분리합니다.
- 기본 상태 후보: `default`, `loading`, `empty`, `error`, `disabled`, `selected`, `longText`, `narrow`, 주요 variant/상태 분기.
- menu/navigation 스토리는 nested, selected, disabled, permission-hidden 또는 long label 상태를 포함합니다.
- form 스토리는 create/update, disabled/readOnly/hidden, validation error, AI fillable 상태 중 spec에 있는 상태를 포함합니다.
- DataGrid/Table/Cell 스토리는 기본값, empty/null, 긴 문장, status/variant, selection/sort/filter/pagination 중 해당 컴포넌트가 지원하는 상태를 포함합니다.
- screen 스토리는 ready, loading, empty, error, 긴 문장, narrow/모바일 상태 중 spec에 적힌 상태를 포함합니다.
- Story의 `render` 내부에서 고정 폭, 임의의 `max-width`, 중앙 정렬, 여백용 container를 새로 만들지 않습니다. Storybook 전역 frame과 컴포넌트 자체 layout이 제공하는 영역을 그대로 사용합니다.
- web layout/surface 스토리는 현재 surface ownership을 그대로 보여야 합니다. page/screen outer 표면은 `PageSurface` 또는 public export boundary의 `ScreenSurface`, 주요 구획은 `SectionSurface`가 감싼 `Section` compound, widget/local panel은 `Surface`로 구성합니다.
- `SectionSurface` 스토리에서 예전 `top`/`bottom`/`left`/`right` 슬롯 API를 다시 만들지 않습니다. 제목/본문/푸터/좌우 보조영역은 `Section.Header`/`Section.Body`/`Section.Footer`/`Section.LeftAside`/`Section.RightAside`로 보여줍니다.
- 모바일 스토리는 `packages/fe-mo-ui`의 Text/Provider/Portal 규칙을 따르고, raw string children이 HeroUI Native에 직접 새지 않게 fixture를 구성합니다.

## Fixture / Mock 기준

- fixture는 실제 DTO 또는 props 계약과 맞는 최소 객체로 둡니다.
- 아직 정밀 fixture를 만들 수 없는 복합 prop은 기존 Storybook mock helper가 있을 때만 재사용합니다.
- handler prop은 Storybook action 또는 안전한 no-op으로 둡니다.
- 스토리 안에서 Orval hook, React Query, MobX store, router, 실제 network를 직접 호출하지 않습니다.
- 날짜, ID, enum, status 값은 재현 가능한 고정값을 사용합니다.

## 검증

- 웹 변경 시 가능한 검증:
  - `pnpm --filter=tool-storybook type-check`
  - 관련 패키지 type-check
- 모바일 변경 시 가능한 검증:
  - `pnpm --filter=tool-mobile-storybook type-check`
  - 관련 패키지 type-check

## Storybook 보고 항목

- 작성/수정한 story 경로
- 참조한 소스 component 경로
- 포함한 주요 상태
- 실행한 Storybook 검증 명령과 결과
- 소스 또는 테스트 owner에게 넘길 이슈

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
