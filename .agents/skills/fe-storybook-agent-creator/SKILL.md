---
name: "fe-storybook-agent-creator"
description: "이 skill은 `fe-storybook-agent` 역할로 일할 때 사용합니다. 웹/모바일 UI 컴포넌트의 Storybook 스토리를 만드는 방법을 쉽게 안내합니다."
---

# fe-storybook-agent-creator

`fe-storybook-agent`로 Storybook 스토리를 만들거나 정리할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/42-fe-storybook-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 변경된 UI 소스와 기존 story를 먼저 읽고, 스토리가 보여야 하는 상태를 spec에서 확인합니다.
4. `*.stories.tsx`, Storybook fixture/mock/helper, Storybook 런타임/config 안에서만 작업합니다.
5. UI 소스 계약 문제가 보이면 직접 고치지 말고 소스 담당자에게 넘길 내용을 최종 보고에 적습니다.
6. 가능한 경우 Storybook 관련 type-check 또는 생성 명령을 실행하고 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 기본 원칙

- Storybook 스토리는 독립 실행 가능한 UI 예시입니다. API, router, browser storage, 실제 store에 직접 의존하지 않습니다.
- 스토리는 컴포넌트 계약을 바꾸지 않습니다. 스토리 작성 중 props/type/소스 문제가 발견되면 소스 담당자에게 넘깁니다.
- 소스 component를 새로 만들거나 수정한 하위 에이전트는 Storybook 파일을 직접 작성하지 않고, route/page 스펙의 Storybook 행 또는 최종 보고로 `fe-storybook-agent`에 인계합니다.
- Storybook 전용 spec 파일은 만들지 않습니다. 필요한 story 계약은 service/route/page 스펙 또는 Screen/Feature 기획 스펙의 Storybook 행에 기록합니다.
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

위 목록 밖 파일이 필요하면 직접 수정하지 말고 인계로 보고합니다.

## 스토리 작성 기준

- 기존 스토리가 있으면 파일 구조, 네이밍, fixture helper를 우선 따릅니다.
- 신규 스토리는 component와 같은 폴더에 둡니다.
- 기본 스토리 하나로 끝내지 말고 spec에 적힌 주요 상태를 분리합니다.
- 기본 상태 후보: `default`, `loading`, `empty`, `error`, `disabled`, `selected`, `longText`, `narrow`, 주요 variant/상태 분기.
- menu/navigation 스토리는 nested, selected, disabled, permission-hidden 또는 long label 상태를 포함합니다.
- form 스토리는 create/update, disabled/readOnly/hidden, validation error, AI fillable 상태 중 spec에 있는 상태를 포함합니다.
- DataGrid/Table/Cell 스토리는 기본값, empty/null, 긴 문장, status/variant, selection/sort/filter/pagination 중 해당 컴포넌트가 지원하는 상태를 포함합니다.
- screen 스토리는 ready, loading, empty, error, 긴 문장, narrow/모바일 상태 중 spec에 적힌 상태를 포함합니다.
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
- 검증을 실행하지 못하면 이유와 미검증 위험을 최종 보고에 남깁니다.

## 완료 보고

루트 `AGENTS.md`의 하위 에이전트 공통 계약을 따르고, Storybook 작업에서는 추가로 아래를 적습니다.

- 작성/수정한 story 경로
- 참조한 소스 component 경로
- 포함한 주요 상태
- 실행한 Storybook 검증 명령과 결과
- 소스 또는 테스트 owner에게 넘길 이슈
