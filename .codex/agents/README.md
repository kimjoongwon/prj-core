# Codex 하위 에이전트 색인

이 문서는 `.codex/agents/**/*.toml`의 활성 subagent 인덱스입니다.

참조 우선순위:

1. 각 `NN-*.toml`
2. 루트 `AGENTS.md`
3. 각 agent가 요구하는 `.agents/skills/*-creator/SKILL.md`
4. 이 인덱스

`*.toml.guide.md` 보조 문서는 생성하지 않습니다.
subagent TOML은 얇은 실행 계약만 소유합니다. 상세 작업 지시는 repo 범위 skill인 `.agents/skills/*-creator/SKILL.md`와 해당 skill의 `references/agent-instructions.md`에 둡니다.
[.codex/config.toml](../config.toml)은 subagent 등록표를 소유하지 않고, 문서화된 전역 subagent 설정만 둡니다.

## 번호 규칙

- subagent TOML 파일명은 `NN-agent-type.toml` 형식으로 정렬 순서를 드러냅니다.
- Codex가 사용하는 agent 식별자는 각 TOML의 `name` 값입니다.
- `name`과 spec의 `agent_type` 값은 번호를 붙이지 않고 기존 계약명을 유지합니다.
- 번호는 색인과 파일 정렬을 위한 값이며 실행 중 보고할 `next subagent` 값이 아닙니다.

## Skill 이름 규칙

- 각 subagent의 필수 skill 이름과 디렉터리는 `<subagent-name>-creator` 형식을 사용합니다.
- 예: `fe-screen-agent`의 skill은 `fe-screen-agent-creator`, `be-controller-builder`의 skill은 `be-controller-builder-creator`입니다.
- subagent 이름 앞부분을 바꾸거나 줄인 별칭 skill을 만들지 않습니다.

## 테스트 소유권 규칙

- 공통 테스트 소유권 규칙은 루트 [AGENTS.md](../../AGENTS.md)가 소유합니다.
- 이 README는 active subagent 색인만 소유하며 테스트 정책을 복제하지 않습니다.

## 모델 티어 운영

현재 로컬 Codex 사용 가능 모델 기준으로 `gpt-5.5`, `gpt-5.4`, `gpt-5.3-codex-spark`를 함께 사용합니다. 되돌림 비용이 큰 판단은 `gpt-5.5`, 복합 구현은 `gpt-5.4`, leaf 구현과 반복 생성은 `gpt-5.3-codex-spark`가 담당합니다.

| 모델 | 추론 강도 | Subagent | 기준 |
|-------|--------|------|------|
| `gpt-5.5` | `xhigh` | `orch-delivery`, `be-prisma-builder`, `be-database-expert`, `be-usecase-builder`, `common-schema-builder` | 서비스 설계, 데이터 모델, workflow 조율, 공통 검증 계약 |
| `gpt-5.4` | `high` | `be-aggregate-builder`, `be-bootstrap-integrator`, `be-client-builder`, `be-controller-builder`, `be-module-builder`, `be-repository-builder`, `be-service-builder`, `common-toolkit-builder`, `common-type-builder`, `fe-data-grid-agent`, `fe-feature-agent`, `fe-form-agent`, `fe-menu-agent`, `fe-route-layout-agent`, `fe-screen-agent`, `fe-store-agent` | 교차 레이어 구현, 상태/화면 설계, 되돌림 비용이 있는 작업 |
| `gpt-5.3-codex-spark` | `medium` | `be-command-builder`, `be-dmmf-parser-builder`, `be-dto-builder`, `be-entity-builder`, `be-event-builder`, `be-query-dto-builder`, `be-vo-builder`, `etc-jenkinsfile-builder`, `fe-data-display-agent`, `fe-feedback-agent`, `fe-hook-agent`, `fe-input-agent`, `fe-layout-agent`, `fe-overlay-agent`, `fe-route-agent`, `fe-storybook-agent`, `fe-widget-agent` | 계약/컴포넌트/Storybook처럼 범위가 비교적 명확한 일반 구현 |
| `gpt-5.3-codex-spark` | `low` | `be-prisma-annotator`, `be-seed-maker`, `dev-service-starter` | 주석, 시드, 서비스 시작 같은 기계적이고 반복적인 작업 |

## 계약 담당

- 공통 subagent 실행, 보고, 차단 계약은 루트 `AGENTS.md`가 소유합니다.
- 각 subagent TOML은 정체성, 필수 skill, 기준 문서, 소유 범위, 플랫폼/도메인 라우팅만 소유합니다.
- 상세 구현 절차와 기술별 규칙은 각 `.agents/skills/*-creator/SKILL.md`와 해당 `references/agent-instructions.md`가 소유합니다.
- 서비스 딜리버리 spec, route/page spec, Screen/Feature 기획 스펙의 생성/실행 규칙은 `01-orch-delivery.toml`과 `orch-delivery-creator` skill이 소유합니다.
- 이 README는 active subagent 색인과 모델 티어 기준만 소유하며 실행 규칙을 복제하지 않습니다.

## 기획 / 오케스트레이션

- [01-orch-delivery.toml](./01-orch-delivery.toml): 서비스 아이디어를 질문으로 정리하고 spec, 작업 순서, 검증 기준까지 계획합니다.

## 백엔드 / Prisma

- [02-be-database-expert.toml](./02-be-database-expert.toml): PostgreSQL/Prisma 데이터 구조를 설계하고 성능과 제약 조건을 점검합니다.
- [03-be-prisma-builder.toml](./03-be-prisma-builder.toml): Prisma schema를 만들거나 고치고 모델 관계를 정리합니다.
- [04-be-prisma-annotator.toml](./04-be-prisma-annotator.toml): Prisma schema에 한글 표시 이름 주석을 붙입니다.
- [05-be-dmmf-parser-builder.toml](./05-be-dmmf-parser-builder.toml): Prisma DMMF를 읽어 `/// @displayName` 문서 정보를 꺼내는 유틸을 만듭니다.
- [06-common-schema-builder.toml](./06-common-schema-builder.toml): 프론트엔드와 백엔드가 함께 쓰는 검증 스키마를 만듭니다.
- [07-common-type-builder.toml](./07-common-type-builder.toml): 여러 패키지에서 함께 쓰는 TypeScript 타입을 만듭니다.
- [08-common-toolkit-builder.toml](./08-common-toolkit-builder.toml): 여러 패키지에서 함께 쓰는 toolkit 유틸을 만듭니다.
- [09-be-entity-builder.toml](./09-be-entity-builder.toml): 도메인 규칙을 담는 Entity 클래스를 만듭니다.
- [10-be-vo-builder.toml](./10-be-vo-builder.toml): 작은 도메인 값을 안전하게 다루는 Value Object를 만듭니다.
- [11-be-dto-builder.toml](./11-be-dto-builder.toml): API 요청과 응답에 쓰는 DTO 클래스를 만듭니다.
- [12-be-query-dto-builder.toml](./12-be-query-dto-builder.toml): 목록 조회의 검색, 정렬, 페이지네이션 Query DTO를 만듭니다.
- [13-be-command-builder.toml](./13-be-command-builder.toml): CQRS Command와 Query 메시지 클래스를 만듭니다.
- [14-be-event-builder.toml](./14-be-event-builder.toml): CQRS Event 메시지 클래스를 만듭니다.
- [15-be-repository-builder.toml](./15-be-repository-builder.toml): Prisma로 데이터를 읽고 쓰는 Repository를 만듭니다.
- [16-be-aggregate-builder.toml](./16-be-aggregate-builder.toml): 도메인별 Aggregate Root 서비스를 만듭니다.
- [17-be-service-builder.toml](./17-be-service-builder.toml): NestJS에서 재사용하는 Service 로직을 만듭니다.
- [18-be-client-builder.toml](./18-be-client-builder.toml): 외부 시스템과 통신하는 Client를 만듭니다.
- [19-be-usecase-builder.toml](./19-be-usecase-builder.toml): Command/Query를 실제로 처리하는 UseCase handler를 만듭니다.
- [20-be-controller-builder.toml](./20-be-controller-builder.toml): NestJS REST API Controller를 만듭니다.
- [21-be-module-builder.toml](./21-be-module-builder.toml): NestJS Module과 provider 연결을 정리합니다.
- [22-be-bootstrap-integrator.toml](./22-be-bootstrap-integrator.toml): 새 module/service가 앱에서 동작하도록 AppModule에 연결합니다.
- [23-be-seed-maker.toml](./23-be-seed-maker.toml): 개발과 테스트에 쓸 현실적인 seed 데이터를 만듭니다.

## 프론트엔드

- [24-fe-hook-agent.toml](./24-fe-hook-agent.toml): web/mobile에서 함께 쓰는 React hook을 만듭니다.
- [25-fe-store-agent.toml](./25-fe-store-agent.toml): 여러 화면에서 함께 쓰는 MobX store를 만듭니다.
- [26-fe-data-display-agent.toml](./26-fe-data-display-agent.toml): 텍스트, 값, 상태처럼 데이터를 보여주는 UI primitive를 만듭니다.
- [27-fe-feedback-agent.toml](./27-fe-feedback-agent.toml): 알림, 에러, 빈 상태처럼 사용자 피드백 UI를 만듭니다.
- [28-fe-overlay-agent.toml](./28-fe-overlay-agent.toml): 모달, 팝오버, 툴팁 같은 떠 있는 UI를 만듭니다.
- [30-fe-input-agent.toml](./30-fe-input-agent.toml): 입력 필드, 버튼/액션, 체크박스, 라디오, 선택 목록, 탭, 링크, 페이지네이션 같은 leaf UI를 만듭니다.
- [34-fe-columns-agent.toml](./34-fe-columns-agent.toml): 기존 Column 라우팅 호환용입니다. 신규 Column 작업은 `fe-data-grid-agent`가 맡습니다.
- [35-fe-layout-agent.toml](./35-fe-layout-agent.toml): 화면 배치를 돕는 재사용 layout primitive를 만듭니다.
- [36-fe-widget-agent.toml](./36-fe-widget-agent.toml): 비즈니스 로직 없이 재사용 가능한 UI 조합인 Widget을 만듭니다.
- [37-fe-feature-agent.toml](./37-fe-feature-agent.toml): Widget에 store나 API를 연결한 Feature를 만듭니다.
- [38-fe-data-grid-agent.toml](./38-fe-data-grid-agent.toml): DataGrid 렌더링, 입력 상태, Column/Cell 컴포넌트 계약을 정리합니다.
- [39-fe-form-agent.toml](./39-fe-form-agent.toml): 생성/수정 화면에서 쓰는 form 조합을 만듭니다.
- [40-fe-menu-agent.toml](./40-fe-menu-agent.toml): 메뉴, 탭, navigation 조합을 실제 서비스 흐름에 맞게 만듭니다.
- [41-fe-screen-agent.toml](./41-fe-screen-agent.toml): page가 보여줄 실제 화면 Screen을 만듭니다.
- [42-fe-storybook-agent.toml](./42-fe-storybook-agent.toml): 웹/모바일 UI 컴포넌트의 Storybook 스토리를 만들고 정리합니다.
- [43-fe-route-layout-agent.toml](./43-fe-route-layout-agent.toml): Next.js layout과 Expo _layout의 공통 틀을 만듭니다.
- [44-fe-route-agent.toml](./44-fe-route-agent.toml): route 파일에서 API, 상태, navigation을 Screen에 연결합니다.

## 공용 / 운영 보조

- [45-dev-service-starter.toml](./45-dev-service-starter.toml): 개발 서버와 필요한 로컬 서비스를 시작합니다.
- [46-etc-jenkinsfile-builder.toml](./46-etc-jenkinsfile-builder.toml): Jenkins CI/CD 파이프라인 파일을 만듭니다.
